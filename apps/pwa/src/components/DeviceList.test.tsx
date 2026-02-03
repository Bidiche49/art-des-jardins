import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeviceList } from './DeviceList';

// Mock API client
const mockGet = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/api/client', () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

// Mock useWebAuthn hook
const mockRegister = vi.fn();
const mockClearRegisterError = vi.fn();
let mockIsSupported = true;
let mockHasCredential = true;
let mockIsLoading = false;
let mockError: string | null = null;

vi.mock('@/hooks', () => ({
  useWebAuthn: () => ({
    isSupported: mockIsSupported,
    hasCredential: mockHasCredential,
    biometricLabel: 'Touch ID',
    register: mockRegister,
    defaultDeviceName: 'Mon iPhone',
    isLoading: mockIsLoading,
    error: mockError,
    clearError: mockClearRegisterError,
  }),
}));

const mockCredentials = [
  {
    id: 'cred-1',
    credentialId: 'webauthn-cred-1',
    deviceName: 'iPhone de Jean',
    deviceType: 'singleDevice',
    lastUsedAt: '2026-02-01T10:00:00Z',
    createdAt: '2026-01-15T14:30:00Z',
  },
  {
    id: 'cred-2',
    credentialId: 'webauthn-cred-2',
    deviceName: 'MacBook Pro',
    deviceType: 'multiDevice',
    lastUsedAt: null,
    createdAt: '2026-01-20T09:00:00Z',
  },
];

describe('DeviceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsSupported = true;
    mockHasCredential = true;
    mockIsLoading = false;
    mockError = null;
    mockGet.mockResolvedValue({ data: mockCredentials });
    mockDelete.mockResolvedValue({ data: { success: true } });
  });

  it('should show loading spinner while fetching', async () => {
    mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { container } = render(<DeviceList />);

    // Spinner is an SVG with animate-spin class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display list of credentials', async () => {
    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone de Jean')).toBeInTheDocument();
    });

    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
  });

  it('should display creation date for each device', async () => {
    render(<DeviceList />);

    await waitFor(() => {
      // Look for text that contains "Ajoute" followed by date info
      const addedText = screen.getAllByText(/Ajoute/);
      expect(addedText.length).toBeGreaterThan(0);
    });
  });

  it('should display last used date when available', async () => {
    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText(/Derniere utilisation/)).toBeInTheDocument();
    });
  });

  it('should show empty state when no credentials', async () => {
    mockGet.mockResolvedValue({ data: [] });

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('Aucun appareil biometrique enregistre')).toBeInTheDocument();
    });
  });

  it('should show add device button when WebAuthn is supported and empty list', async () => {
    mockGet.mockResolvedValue({ data: [] });
    mockIsSupported = true;

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter cet appareil/i })).toBeInTheDocument();
    });
  });

  it('should open delete confirmation modal when delete button clicked', async () => {
    const user = userEvent.setup();

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone de Jean')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Supprimer l\'appareil')).toBeInTheDocument();
    expect(screen.getByText(/Etes-vous sur de vouloir supprimer/)).toBeInTheDocument();
  });

  it('should delete credential when confirmed', async () => {
    const user = userEvent.setup();

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone de Jean')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
    await user.click(deleteButtons[0]);

    // After clicking, the modal opens with a danger button for confirmation
    // Find the button with variant="danger" (bg-red-600 class)
    const allDeleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
    // The confirm button in modal is the one with red background
    const confirmButton = allDeleteButtons.find(btn => btn.className.includes('bg-red'));
    expect(confirmButton).toBeTruthy();
    await user.click(confirmButton!);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/auth/webauthn/credentials/cred-1');
    });
  });

  it('should close modal when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('iPhone de Jean')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
    await user.click(deleteButtons[0]);

    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Supprimer l\'appareil')).not.toBeInTheDocument();
    });
  });

  it('should show error when fetch fails', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des appareils')).toBeInTheDocument();
    });
  });

  it('should have retry button when fetch fails', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reessayer/i })).toBeInTheDocument();
    });
  });

  it('should retry fetch when retry button clicked', async () => {
    const user = userEvent.setup();
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reessayer/i })).toBeInTheDocument();
    });

    mockGet.mockResolvedValueOnce({ data: mockCredentials });
    await user.click(screen.getByRole('button', { name: /Reessayer/i }));

    await waitFor(() => {
      expect(screen.getByText('iPhone de Jean')).toBeInTheDocument();
    });
  });

  it('should show add device modal when button clicked', async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValue({ data: [] });

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter cet appareil/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Ajouter cet appareil/i }));

    // Modal title is rendered, there are multiple instances of "Ajouter cet appareil" text
    expect(screen.getByRole('button', { name: /Activer Touch ID/i })).toBeInTheDocument();
    expect(screen.getByText(/Utilisez Touch ID pour vous connecter/)).toBeInTheDocument();
  });

  it('should call register when activating in add device modal', async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValue({ data: [] });
    mockRegister.mockResolvedValue(true);

    render(<DeviceList />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter cet appareil/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Ajouter cet appareil/i }));
    await user.click(screen.getByRole('button', { name: /Activer Touch ID/i }));

    expect(mockRegister).toHaveBeenCalledWith('Mon iPhone');
  });
});
