import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, X, AlertCircle } from 'lucide-react';

export interface QRScannerProps {
  onScan?: (data: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  autoNavigate?: boolean;
}

export function QRScanner({
  onScan,
  onError,
  onClose,
  autoNavigate = true,
}: QRScannerProps) {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const parseQRData = useCallback(
    (data: string): boolean => {
      // Format attendu: aej://chantier/{uuid}
      const match = data.match(/^aej:\/\/chantier\/(.+)$/);
      if (match) {
        const chantierId = match[1];
        onScan?.(data);
        if (autoNavigate) {
          navigate(`/chantiers/${chantierId}`);
        }
        return true;
      }
      return false;
    },
    [navigate, onScan, autoNavigate],
  );

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          await scannerRef.current.stop();
        }
      } catch {
        // Ignore stop errors
      }
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;

    setError(null);
    setIsScanning(false);

    try {
      // Verifier les permissions camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
    } catch {
      setHasPermission(false);
      setError("Acces a la camera refuse. Verifiez les permissions de l'app.");
      onError?.("Acces a la camera refuse");
      return;
    }

    try {
      const scannerId = 'qr-scanner-container';

      // S'assurer qu'il n'y a pas d'instance existante
      await stopScanner();

      scannerRef.current = new Html5Qrcode(scannerId);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (parseQRData(decodedText)) {
            stopScanner();
          }
        },
        () => {
          // Ignore scan failures (normal when no QR in view)
        },
      );

      setIsScanning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur camera';
      setError(message);
      onError?.(message);
    }
  }, [parseQRData, stopScanner, onError]);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const handleClose = () => {
    stopScanner();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80">
        <h2 className="text-white font-medium flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Scanner QR Chantier
        </h2>
        <button
          onClick={handleClose}
          className="p-2 text-white hover:bg-white/10 rounded-full transition"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-center text-white">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={startScanner}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Reessayer
            </button>
          </div>
        ) : hasPermission === false ? (
          <div className="text-center text-white">
            <CameraOff className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-2">Camera non disponible</p>
            <p className="text-sm text-gray-500">
              Autorisez l'acces a la camera dans les parametres
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-sm aspect-square">
            <div
              id="qr-scanner-container"
              ref={containerRef}
              className="w-full h-full"
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
              </div>
            )}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-emerald-500 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 text-center text-white/70 text-sm">
        Pointez la camera vers le QR code du chantier
      </div>
    </div>
  );
}
