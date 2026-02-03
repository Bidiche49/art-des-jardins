import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';

// Mock navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn((selector) => {
    const state = { login: vi.fn() };
    return selector(state);
  }),
}));

// Mock auth API
vi.mock('@/api', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

// Mock hooks module with hasCredential = false (default)
vi.mock('@/hooks', () => ({
  usePWAInstall: () => ({ isInstalled: true }),
  useWebAuthn: () => ({
    hasCredential: false,
    authenticate: vi.fn(),
    biometricType: 'fingerprint',
    biometricLabel: 'Touch ID',
    shouldShowSetup: false,
    isLoading: false,
  }),
}));

// Mock BiometricSetup component
vi.mock('@/components/BiometricSetup', () => ({
  BiometricSetup: () => null,
}));

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page title', () => {
    renderLogin();
    expect(screen.getByText('Art & Jardin')).toBeInTheDocument();
  });

  it('should render login subtitle', () => {
    renderLogin();
    expect(screen.getByText('Connectez-vous a votre compte')).toBeInTheDocument();
  });

  it('should render email label', () => {
    renderLogin();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should render password label', () => {
    renderLogin();
    expect(screen.getByText('Mot de passe')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('should not show biometric button when hasCredential is false', () => {
    renderLogin();
    // With hasCredential = false (default mock), biometric button should not appear
    expect(screen.queryByRole('button', { name: /Touch ID/i })).not.toBeInTheDocument();
  });

  it('should not show divider when biometric is not available', () => {
    renderLogin();
    expect(screen.queryByText('ou')).not.toBeInTheDocument();
  });

  it('should render footer text', () => {
    renderLogin();
    expect(screen.getByText('Art & Jardin - Application de gestion')).toBeInTheDocument();
  });
});
