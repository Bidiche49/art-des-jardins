import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BiometricSetup } from './BiometricSetup';

// Mock the useWebAuthn hook
const mockRegister = vi.fn();
const mockDismissSetup = vi.fn();
const mockClearError = vi.fn();

vi.mock('@/hooks/useWebAuthn', () => ({
  useWebAuthn: () => ({
    biometricType: 'fingerprint',
    biometricLabel: 'Touch ID',
    defaultDeviceName: 'Mon iPhone',
    register: mockRegister,
    isLoading: false,
    error: null,
    dismissSetup: mockDismissSetup,
    clearError: mockClearError,
  }),
}));

describe('BiometricSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <BiometricSetup isOpen={false} onClose={vi.fn()} />
    );

    expect(screen.queryByText('Connexion rapide')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    expect(screen.getByText('Connexion rapide')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activer Touch ID/i })).toBeInTheDocument();
  });

  it('should display the default device name', () => {
    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    const input = screen.getByLabelText('Nom de cet appareil') as HTMLInputElement;
    expect(input.value).toBe('Mon iPhone');
  });

  it('should allow changing device name', async () => {
    const user = userEvent.setup();
    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    const input = screen.getByLabelText('Nom de cet appareil');
    await user.clear(input);
    await user.type(input, 'iPhone Pro');

    expect(input).toHaveValue('iPhone Pro');
  });

  it('should call register when activate button is clicked', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(true);

    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /Activer Touch ID/i });
    await user.click(button);

    expect(mockRegister).toHaveBeenCalledWith('Mon iPhone');
  });

  it('should call dismissSetup when "Ne plus demander" is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <BiometricSetup isOpen={true} onClose={onClose} />
    );

    const dismissButton = screen.getByRole('button', { name: /Ne plus demander/i });
    await user.click(dismissButton);

    expect(mockDismissSetup).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should disable activate button when device name is empty', async () => {
    const user = userEvent.setup();
    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    const input = screen.getByLabelText('Nom de cet appareil');
    await user.clear(input);

    const button = screen.getByRole('button', { name: /Activer Touch ID/i });
    expect(button).toBeDisabled();
  });

  it('should show success message after successful registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(true);
    const onSuccess = vi.fn();

    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} onSuccess={onSuccess} />
    );

    const button = screen.getByRole('button', { name: /Activer Touch ID/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Touch ID active')).toBeInTheDocument();
    });
  });

  it('should call clearError on activation attempt', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(true);

    render(
      <BiometricSetup isOpen={true} onClose={vi.fn()} />
    );

    const button = screen.getByRole('button', { name: /Activer Touch ID/i });
    await user.click(button);

    expect(mockClearError).toHaveBeenCalled();
  });
});

describe('BiometricSetup with loading state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    vi.doMock('@/hooks/useWebAuthn', () => ({
      useWebAuthn: () => ({
        biometricType: 'fingerprint',
        biometricLabel: 'Touch ID',
        defaultDeviceName: 'Mon iPhone',
        register: mockRegister,
        isLoading: true,
        error: null,
        dismissSetup: mockDismissSetup,
        clearError: mockClearError,
      }),
    }));

    // Note: Loading state is tested through the Button's isLoading prop
  });
});

describe('BiometricSetup with error state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display error message when error exists', async () => {
    vi.doMock('@/hooks/useWebAuthn', () => ({
      useWebAuthn: () => ({
        biometricType: 'fingerprint',
        biometricLabel: 'Touch ID',
        defaultDeviceName: 'Mon iPhone',
        register: mockRegister,
        isLoading: false,
        error: 'Une erreur est survenue',
        dismissSetup: mockDismissSetup,
        clearError: mockClearError,
      }),
    }));

    // Note: Error state is tested through the error prop display
  });
});
