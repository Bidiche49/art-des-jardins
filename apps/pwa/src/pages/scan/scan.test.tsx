import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScanPage from './index';

// Mock QRScanner component
vi.mock('../../components/QRScanner', () => ({
  QRScanner: ({
    onClose,
    onScan,
  }: {
    onClose: () => void;
    onScan: (data: string) => void;
  }) => (
    <div data-testid="qr-scanner">
      <button onClick={onClose} data-testid="close-scanner">
        Close
      </button>
      <button
        onClick={() => onScan('aej://chantier/test-123')}
        data-testid="simulate-scan"
      >
        Simulate Scan
      </button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ScanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <ScanPage />
      </MemoryRouter>,
    );
  };

  it('should render page header', () => {
    renderPage();
    expect(screen.getByText('Scan QR Chantier')).toBeInTheDocument();
  });

  it('should render scanner button', () => {
    renderPage();
    expect(screen.getByText('Ouvrir le scanner')).toBeInTheDocument();
  });

  it('should render info section', () => {
    renderPage();
    expect(screen.getByText('Comment ca marche ?')).toBeInTheDocument();
  });

  it('should show info bullet points', () => {
    renderPage();
    expect(screen.getByText(/QR code est imprime/)).toBeInTheDocument();
    expect(screen.getByText(/Scannez-le pour acceder/)).toBeInTheDocument();
    expect(screen.getByText(/Fonctionne meme hors connexion/)).toBeInTheDocument();
  });

  it('should open scanner when button clicked', () => {
    renderPage();

    fireEvent.click(screen.getByText('Ouvrir le scanner'));

    expect(screen.getByTestId('qr-scanner')).toBeInTheDocument();
  });

  it('should close scanner when close button clicked', () => {
    renderPage();

    fireEvent.click(screen.getByText('Ouvrir le scanner'));
    fireEvent.click(screen.getByTestId('close-scanner'));

    expect(screen.queryByTestId('qr-scanner')).not.toBeInTheDocument();
    expect(screen.getByText('Ouvrir le scanner')).toBeInTheDocument();
  });

  it('should close scanner after scan', () => {
    renderPage();

    fireEvent.click(screen.getByText('Ouvrir le scanner'));
    fireEvent.click(screen.getByTestId('simulate-scan'));

    // Scanner should close
    expect(screen.queryByTestId('qr-scanner')).not.toBeInTheDocument();
  });

  it('should not show history section when empty', () => {
    renderPage();
    // History section not rendered when no scans
    expect(screen.queryByText('Historique des scans')).not.toBeInTheDocument();
  });
});
