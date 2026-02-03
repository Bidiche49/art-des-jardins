import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdleTimer, IDLE_TIMEOUTS, getIdleTimeoutForRole } from './useIdleTimer';

describe('useIdleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct remaining time', () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleTimer({ timeout: 60000, onIdle })
    );

    expect(result.current.remaining).toBe(60000);
    expect(result.current.isIdle).toBe(false);
    expect(result.current.isWarning).toBe(false);
  });

  it('should trigger warning before idle', () => {
    const onIdle = vi.fn();
    const onWarning = vi.fn();
    const timeout = 180000; // 3 minutes
    const warningTime = 120000; // 2 minutes warning

    renderHook(() =>
      useIdleTimer({ timeout, onIdle, onWarning, warningTime })
    );

    // Avance de 1 minute (reste 2 min = warning)
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(onWarning).toHaveBeenCalledTimes(1);
    expect(onIdle).not.toHaveBeenCalled();
  });

  it('should trigger idle after timeout', () => {
    const onIdle = vi.fn();
    const timeout = 5000;

    renderHook(() => useIdleTimer({ timeout, onIdle, warningTime: 1000 }));

    // Avance jusqu'au timeout
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on user activity', () => {
    const onIdle = vi.fn();
    const timeout = 5000;

    renderHook(() => useIdleTimer({ timeout, onIdle, warningTime: 1000 }));

    // Avance de 3 secondes
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Simule une activite utilisateur
    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
    });

    // Avance de 3 secondes de plus (total 6s mais timer reset)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Le timer a ete reset donc onIdle ne devrait pas etre appele
    expect(onIdle).not.toHaveBeenCalled();
  });

  it('should not trigger when disabled', () => {
    const onIdle = vi.fn();
    const timeout = 1000;

    renderHook(() => useIdleTimer({ timeout, onIdle, enabled: false }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onIdle).not.toHaveBeenCalled();
  });

  it('should expose resetTimer function', () => {
    const onIdle = vi.fn();
    const timeout = 5000;

    const { result } = renderHook(() =>
      useIdleTimer({ timeout, onIdle, warningTime: 1000 })
    );

    // Avance de 4 secondes (warning actif)
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.isWarning).toBe(true);

    // Reset manuellement
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isWarning).toBe(false);
    expect(result.current.remaining).toBe(5000);
  });

  it('should update remaining time every second', () => {
    const onIdle = vi.fn();
    const timeout = 5000;

    const { result } = renderHook(() =>
      useIdleTimer({ timeout, onIdle, warningTime: 1000 })
    );

    expect(result.current.remaining).toBe(5000);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Le remaining devrait avoir diminue
    expect(result.current.remaining).toBeLessThanOrEqual(4000);
  });
});

describe('IDLE_TIMEOUTS', () => {
  it('should have correct timeout for patron (30 min)', () => {
    expect(IDLE_TIMEOUTS.patron).toBe(30 * 60 * 1000);
  });

  it('should have correct timeout for employe (2h)', () => {
    expect(IDLE_TIMEOUTS.employe).toBe(2 * 60 * 60 * 1000);
  });

  it('should have correct timeout for client (1h)', () => {
    expect(IDLE_TIMEOUTS.client).toBe(60 * 60 * 1000);
  });
});

describe('getIdleTimeoutForRole', () => {
  it('should return correct timeout for patron', () => {
    expect(getIdleTimeoutForRole('patron')).toBe(IDLE_TIMEOUTS.patron);
  });

  it('should return correct timeout for employe', () => {
    expect(getIdleTimeoutForRole('employe')).toBe(IDLE_TIMEOUTS.employe);
  });

  it('should return correct timeout for client', () => {
    expect(getIdleTimeoutForRole('client')).toBe(IDLE_TIMEOUTS.client);
  });
});
