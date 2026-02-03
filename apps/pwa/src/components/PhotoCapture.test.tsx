import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhotoCapture, type PhotoType } from './PhotoCapture';

vi.mock('@/api', () => ({
  uploadApi: {
    uploadImage: vi.fn().mockResolvedValue({
      url: 'https://example.com/photo.jpg',
      key: 'photo.jpg',
    }),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('PhotoCapture', () => {
  const mockOnPhotoTaken = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 47.4739884,
          longitude: -0.5541875,
        },
      });
    });
  });

  it('does not render when isOpen is false', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={false}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );
    expect(screen.queryByText('Prendre une photo')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );
    expect(screen.getByRole('heading', { name: 'Prendre une photo' })).toBeInTheDocument();
  });

  it('displays photo type selector with three options', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );
    expect(screen.getByText('Avant')).toBeInTheDocument();
    expect(screen.getByText('Pendant')).toBeInTheDocument();
    expect(screen.getByText('Apres')).toBeInTheDocument();
  });

  it('selects BEFORE type by default', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );
    const avantButton = screen.getByText('Avant');
    expect(avantButton.closest('button')).toHaveClass('border-yellow-400');
  });

  it('allows selecting different photo types', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    const pendantButton = screen.getByText('Pendant');
    fireEvent.click(pendantButton);
    expect(pendantButton.closest('button')).toHaveClass('border-primary-400');

    const apresButton = screen.getByText('Apres');
    fireEvent.click(apresButton);
    expect(apresButton.closest('button')).toHaveClass('border-green-400');
  });

  it('shows GPS status indicator', async () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Position GPS acquise')).toBeInTheDocument();
    });
  });

  it('shows GPS denied message when permission denied', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 });
    });

    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('GPS refuse')).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    const annulerButton = screen.getByText('Annuler');
    fireEvent.click(annulerButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows capture zone with instructions', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    expect(
      screen.getByText("Appuyez pour ouvrir l'appareil photo")
    ).toBeInTheDocument();
  });

  it('displays type label', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    expect(screen.getByText('Type de photo')).toBeInTheDocument();
  });

  it('has hidden file input for camera', () => {
    render(
      <PhotoCapture
        interventionId="test-id"
        isOpen={true}
        onClose={mockOnClose}
        onPhotoTaken={mockOnPhotoTaken}
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', 'image/*');
    expect(fileInput).toHaveAttribute('capture', 'environment');
    expect(fileInput).toHaveClass('hidden');
  });
});
