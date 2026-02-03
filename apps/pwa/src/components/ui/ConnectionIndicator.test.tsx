import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ConnectionState } from '../../services/websocket.types';

// Mock websocket service with inline mock
vi.mock('../../services/websocket.service', () => ({
  websocketService: {
    onStateChange: vi.fn((cb: (state: ConnectionState) => void) => {
      cb('disconnected');
      return () => {};
    }),
    getState: vi.fn(() => 'disconnected'),
  },
}));

// Import after mock
import { ConnectionIndicator } from './ConnectionIndicator';
import { websocketService } from '../../services/websocket.service';

describe('ConnectionIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset to default behavior
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('disconnected');
        return () => {};
      }
    );
  });

  it('should render with disconnected state by default', () => {
    render(<ConnectionIndicator />);

    expect(screen.getByText('Déconnecté')).toBeInTheDocument();
    expect(screen.getByTitle('Connexion temps réel perdue')).toBeInTheDocument();
  });

  it('should show connected state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('connected');
        return () => {};
      }
    );

    render(<ConnectionIndicator />);

    expect(screen.getByText('Temps réel')).toBeInTheDocument();
    expect(screen.getByTitle('Connexion temps réel active')).toBeInTheDocument();
  });

  it('should show reconnecting state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('reconnecting');
        return () => {};
      }
    );

    render(<ConnectionIndicator />);

    expect(screen.getByText('Reconnexion...')).toBeInTheDocument();
    expect(screen.getByTitle('Tentative de reconnexion en cours')).toBeInTheDocument();
  });

  it('should show fallback state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('fallback');
        return () => {};
      }
    );

    render(<ConnectionIndicator />);

    expect(screen.getByText('Mode dégradé')).toBeInTheDocument();
    expect(
      screen.getByTitle('WebSocket indisponible, actualisation automatique activée')
    ).toBeInTheDocument();
  });

  it('should hide label when showLabel is false', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('connected');
        return () => {};
      }
    );

    render(<ConnectionIndicator showLabel={false} />);

    expect(screen.queryByText('Temps réel')).not.toBeInTheDocument();
    expect(screen.getByTitle('Connexion temps réel active')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<ConnectionIndicator className="custom-class" />);

    const container = screen.getByTitle('Connexion temps réel perdue');
    expect(container).toHaveClass('custom-class');
  });

  it('should have correct color for connected state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('connected');
        return () => {};
      }
    );

    const { container } = render(<ConnectionIndicator />);

    const dot = container.querySelector('.bg-green-500');
    expect(dot).toBeInTheDocument();
  });

  it('should have correct color for disconnected state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('disconnected');
        return () => {};
      }
    );

    const { container } = render(<ConnectionIndicator />);

    const dot = container.querySelector('.bg-red-500');
    expect(dot).toBeInTheDocument();
  });

  it('should have correct color for reconnecting state with animation', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('reconnecting');
        return () => {};
      }
    );

    const { container } = render(<ConnectionIndicator />);

    const dot = container.querySelector('.bg-yellow-500');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('animate-pulse');
  });

  it('should have correct color for fallback state', () => {
    vi.mocked(websocketService.onStateChange).mockImplementation(
      (cb: (state: ConnectionState) => void) => {
        cb('fallback');
        return () => {};
      }
    );

    const { container } = render(<ConnectionIndicator />);

    const dot = container.querySelector('.bg-orange-500');
    expect(dot).toBeInTheDocument();
  });

  it('should unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    vi.mocked(websocketService.onStateChange).mockImplementation(() => unsubscribe);

    const { unmount } = render(<ConnectionIndicator />);

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
