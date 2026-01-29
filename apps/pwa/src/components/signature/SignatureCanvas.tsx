import { useRef, useEffect, useCallback } from 'react';
import SignaturePad from 'signature_pad';

interface SignatureCanvasProps {
  onSignatureChange: (isEmpty: boolean, dataUrl: string | null) => void;
  disabled?: boolean;
}

export function SignatureCanvas({ onSignatureChange, disabled = false }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    signaturePadRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)',
      minWidth: 1,
      maxWidth: 2.5,
    });

    resizeCanvas();

    const handleEndStroke = () => {
      if (signaturePadRef.current) {
        const isEmpty = signaturePadRef.current.isEmpty();
        const dataUrl = isEmpty ? null : signaturePadRef.current.toDataURL('image/png');
        onSignatureChange(isEmpty, dataUrl);
      }
    };

    signaturePadRef.current.addEventListener('endStroke', handleEndStroke);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.removeEventListener('endStroke', handleEndStroke);
        signaturePadRef.current.off();
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onSignatureChange, resizeCanvas]);

  useEffect(() => {
    if (signaturePadRef.current) {
      if (disabled) {
        signaturePadRef.current.off();
      } else {
        signaturePadRef.current.on();
      }
    }
  }, [disabled]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      onSignatureChange(true, null);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Votre signature
      </label>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`w-full h-48 border-2 rounded-lg touch-none ${
            disabled
              ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
              : 'border-gray-300 bg-white cursor-crosshair'
          }`}
          style={{ touchAction: 'none' }}
        />
        {!disabled && (
          <p className="absolute bottom-2 left-2 text-xs text-gray-400">
            Dessinez votre signature ci-dessus
          </p>
        )}
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Effacer
        </button>
      )}
    </div>
  );
}
