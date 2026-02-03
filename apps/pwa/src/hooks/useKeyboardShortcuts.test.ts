import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, type KeyboardShortcut } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should register keydown event listener on mount', () => {
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, action: vi.fn() },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
  });

  it('should remove event listener on unmount', () => {
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, action: vi.fn() },
    ];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true);
  });

  it('should call action when matching shortcut is pressed', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'k', ctrl: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should call action for meta key (Mac Cmd)', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'k', meta: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should not call action when shortcut does not match', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'k', ctrl: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Wrong key
    const event1 = new KeyboardEvent('keydown', {
      key: 'j',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event1);

    // Missing ctrl
    const event2 = new KeyboardEvent('keydown', {
      key: 'k',
      bubbles: true,
    });
    window.dispatchEvent(event2);

    expect(action).not.toHaveBeenCalled();
  });

  it('should not trigger when disabled', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'k', ctrl: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts, { enabled: false }));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).not.toHaveBeenCalled();
  });

  it('should support shift modifier', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'k', ctrl: true, shift: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Without shift - should not trigger
    const event1 = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event1);
    expect(action).not.toHaveBeenCalled();

    // With shift - should trigger
    const event2 = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event2);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should support simple key without modifiers', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: '?', action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: '?',
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should handle Escape key', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'Escape', action, allowInInput: true }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should be case insensitive for key matching', () => {
    const action = vi.fn();
    const shortcuts: KeyboardShortcut[] = [{ key: 'K', ctrl: true, action }];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });

    window.dispatchEvent(event);

    expect(action).toHaveBeenCalledTimes(1);
  });
});
