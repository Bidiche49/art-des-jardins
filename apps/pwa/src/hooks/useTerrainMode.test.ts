import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTerrainMode } from './useTerrainMode';
import { useUIStore } from '@/stores/ui';

// Mock navigator.vibrate
const mockVibrate = vi.fn();
Object.defineProperty(navigator, 'vibrate', {
  value: mockVibrate,
  writable: true,
});

describe('useTerrainMode', () => {
  beforeEach(() => {
    // Reset store state
    useUIStore.setState({
      terrainMode: {
        enabled: false,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },
    });
    mockVibrate.mockClear();
    document.documentElement.removeAttribute('data-terrain');
    document.documentElement.removeAttribute('data-high-contrast');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-terrain');
    document.documentElement.removeAttribute('data-high-contrast');
  });

  it('should return terrain mode state', () => {
    const { result } = renderHook(() => useTerrainMode());

    expect(result.current.isEnabled).toBe(false);
    expect(result.current.settings).toEqual({
      enabled: false,
      autoDetect: false,
      hapticFeedback: true,
      highContrast: false,
    });
  });

  it('should toggle terrain mode', () => {
    const { result } = renderHook(() => useTerrainMode());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isEnabled).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isEnabled).toBe(false);
  });

  it('should update individual settings', () => {
    const { result } = renderHook(() => useTerrainMode());

    act(() => {
      result.current.setSettings({ enabled: true, highContrast: true });
    });

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.settings.highContrast).toBe(true);
    expect(result.current.settings.hapticFeedback).toBe(true); // unchanged
  });

  it('should apply data-terrain attribute when enabled', () => {
    const { result } = renderHook(() => useTerrainMode());

    expect(document.documentElement.getAttribute('data-terrain')).toBeNull();

    act(() => {
      result.current.setSettings({ enabled: true });
    });

    expect(document.documentElement.getAttribute('data-terrain')).toBe('true');
  });

  it('should remove data-terrain attribute when disabled', () => {
    useUIStore.setState({
      terrainMode: {
        enabled: true,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },
    });

    const { result } = renderHook(() => useTerrainMode());

    expect(document.documentElement.getAttribute('data-terrain')).toBe('true');

    act(() => {
      result.current.setSettings({ enabled: false });
    });

    expect(document.documentElement.getAttribute('data-terrain')).toBeNull();
  });

  it('should apply data-high-contrast attribute when highContrast is enabled', () => {
    const { result } = renderHook(() => useTerrainMode());

    expect(document.documentElement.getAttribute('data-high-contrast')).toBeNull();

    act(() => {
      result.current.setSettings({ highContrast: true });
    });

    expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
  });

  it('should trigger haptic feedback when enabled', () => {
    useUIStore.setState({
      terrainMode: {
        enabled: true,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },
    });

    const { result } = renderHook(() => useTerrainMode());

    act(() => {
      result.current.triggerHaptic();
    });

    expect(mockVibrate).toHaveBeenCalledWith(10);
  });

  it('should not trigger haptic feedback when disabled', () => {
    useUIStore.setState({
      terrainMode: {
        enabled: true,
        autoDetect: false,
        hapticFeedback: false,
        highContrast: false,
      },
    });

    const { result } = renderHook(() => useTerrainMode());

    act(() => {
      result.current.triggerHaptic();
    });

    expect(mockVibrate).not.toHaveBeenCalled();
  });

  it('should not trigger haptic feedback when terrain mode is off', () => {
    useUIStore.setState({
      terrainMode: {
        enabled: false,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },
    });

    const { result } = renderHook(() => useTerrainMode());

    act(() => {
      result.current.triggerHaptic();
    });

    expect(mockVibrate).not.toHaveBeenCalled();
  });
});

describe('useUIStore terrain mode', () => {
  beforeEach(() => {
    useUIStore.setState({
      terrainMode: {
        enabled: false,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },
    });
  });

  it('should persist terrain mode settings', () => {
    const store = useUIStore.getState();

    store.setTerrainMode({ enabled: true, highContrast: true });

    const newState = useUIStore.getState();
    expect(newState.terrainMode.enabled).toBe(true);
    expect(newState.terrainMode.highContrast).toBe(true);
  });

  it('should toggle terrain mode', () => {
    const store = useUIStore.getState();

    store.toggleTerrainMode();
    expect(useUIStore.getState().terrainMode.enabled).toBe(true);

    store.toggleTerrainMode();
    expect(useUIStore.getState().terrainMode.enabled).toBe(false);
  });
});
