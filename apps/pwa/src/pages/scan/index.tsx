import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, History, ArrowLeft } from 'lucide-react';
import { QRScanner } from '../../components/QRScanner';

interface ScanHistoryEntry {
  id: string;
  chantierId: string;
  scannedAt: string;
}

const SCAN_HISTORY_KEY = 'qr_scan_history';
const MAX_HISTORY = 10;

function loadScanHistory(): ScanHistoryEntry[] {
  try {
    const data = localStorage.getItem(SCAN_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveScanHistory(entry: Omit<ScanHistoryEntry, 'id'>) {
  const history = loadScanHistory();
  const newEntry: ScanHistoryEntry = {
    id: crypto.randomUUID(),
    ...entry,
  };
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export default function ScanPage() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>(loadScanHistory);

  const handleScan = (data: string) => {
    const match = data.match(/^aej:\/\/chantier\/(.+)$/);
    if (match) {
      const chantierId = match[1];
      const updated = saveScanHistory({
        chantierId,
        scannedAt: new Date().toISOString(),
      });
      setScanHistory(updated);
    }
    setShowScanner(false);
  };

  const handleClose = () => {
    setShowScanner(false);
  };

  const handleHistoryClick = (chantierId: string) => {
    navigate(`/chantiers/${chantierId}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={handleClose}
        autoNavigate={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Scan QR Chantier</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Scanner button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full flex flex-col items-center gap-4 py-8 border-2 border-dashed border-emerald-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition group"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition">
              <QrCode className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Ouvrir le scanner</p>
              <p className="text-sm text-gray-500 mt-1">
                Scannez le QR code du chantier pour acceder aux informations
              </p>
            </div>
          </button>
        </div>

        {/* Scan history */}
        {scanHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              <h2 className="font-medium text-gray-900">Historique des scans</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {scanHistory.map((entry) => (
                <li key={entry.id}>
                  <button
                    onClick={() => handleHistoryClick(entry.chantierId)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Chantier #{entry.chantierId.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(entry.scannedAt)}
                      </p>
                    </div>
                    <QrCode className="w-4 h-4 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">Comment ca marche ?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Le QR code est imprime sur le devis ou la fiche chantier</li>
            <li>• Scannez-le pour acceder directement aux informations</li>
            <li>• Fonctionne meme hors connexion si le chantier est en cache</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
