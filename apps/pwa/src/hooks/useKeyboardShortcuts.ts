import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
  /** If true, shortcut works even in input fields */
  allowInInput?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

const isInputElement = (element: EventTarget | null): boolean => {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tagName = element.tagName.toLowerCase();
  const isEditable = element.isContentEditable;
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || isEditable;
};

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const isInInput = isInputElement(event.target);

      for (const shortcut of shortcutsRef.current) {
        // Skip if in input and shortcut doesn't allow it
        if (isInInput && !shortcut.allowInInput) continue;

        const ctrlOrMeta = shortcut.ctrl || shortcut.meta;
        const hasCtrlOrMeta = event.ctrlKey || event.metaKey;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = ctrlOrMeta ? hasCtrlOrMeta : !hasCtrlOrMeta;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          return;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown, enabled]);
}

// Predefined shortcut descriptions for the help modal
export const SHORTCUT_DESCRIPTIONS = {
  SEARCH: { key: 'K', modifier: 'Ctrl/Cmd', description: 'Ouvrir la recherche globale' },
  NEW: { key: 'N', modifier: 'Ctrl/Cmd', description: 'Nouveau (selon contexte)' },
  SAVE: { key: 'S', modifier: 'Ctrl/Cmd', description: 'Sauvegarder le formulaire' },
  ESCAPE: { key: 'Escape', modifier: '', description: 'Fermer modal/drawer' },
  HELP: { key: '?', modifier: '', description: 'Afficher cette aide' },
} as const;
