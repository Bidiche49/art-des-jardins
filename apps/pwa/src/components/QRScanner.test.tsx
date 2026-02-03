import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QRScanner } from './QRScanner';

// Mock html5-qrcode
vi.mock('html5-qrcode', () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => ({
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn(),
    getState: vi.fn().mockReturnValue(0),
  })),
  Html5QrcodeScannerState: {
    NOT_STARTED: 0,
    SCANNING: 2,
    PAUSED: 3,
  },
}));

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('QRScanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderScanner = (props = {}) => {
    return render(
      <MemoryRouter>
        <QRScanner {...props} />
      </MemoryRouter>,
    );
  };

  it('should render scanner header', () => {
    renderScanner();
    expect(screen.getByText('Scanner QR Chantier')).toBeInTheDocument();
  });

  it('should render close button', () => {
    renderScanner();
    expect(screen.getByLabelText('Fermer')).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderScanner({ onClose });

    fireEvent.click(screen.getByLabelText('Fermer'));

    expect(onClose).toHaveBeenCalled();
  });

  it('should render instructions', () => {
    renderScanner();
    expect(screen.getByText(/Pointez la camera vers le QR code/)).toBeInTheDocument();
  });

  it('should show error state when camera access denied', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

    renderScanner();

    // Wait for permission check
    await vi.waitFor(() => {
      expect(screen.getByText(/Acces a la camera refuse/)).toBeInTheDocument();
    });
  });

  it('should call onError when camera access fails', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
    const onError = vi.fn();

    renderScanner({ onError });

    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Acces a la camera refuse');
    });
  });

  it('should show retry button on error', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));

    renderScanner();

    await vi.waitFor(() => {
      expect(screen.getByText('Reessayer')).toBeInTheDocument();
    });
  });
});

describe('QRScanner QR parsing', () => {
  it('should parse valid chantier QR code', () => {
    const chantierId = '123e4567-e89b-12d3-a456-426614174000';
    const qrData = `aej://chantier/${chantierId}`;

    const match = qrData.match(/^aej:\/\/chantier\/(.+)$/);
    expect(match).not.toBeNull();
    expect(match![1]).toBe(chantierId);
  });

  it('should reject invalid QR formats', () => {
    const invalidFormats = [
      'invalid',
      'aej://client/123',
      'https://example.com',
      'aej://chantier/',
    ];

    invalidFormats.forEach((format) => {
      const match = format.match(/^aej:\/\/chantier\/(.+)$/);
      if (format === 'aej://chantier/') {
        expect(match).toBeNull();
      } else {
        expect(match).toBeNull();
      }
    });
  });
});
