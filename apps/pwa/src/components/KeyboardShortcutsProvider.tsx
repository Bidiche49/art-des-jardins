import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from './CommandPalette';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

interface KeyboardShortcutsContextValue {
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openShortcutsHelp: () => void;
  closeShortcutsHelp: () => void;
  isCommandPaletteOpen: boolean;
  isShortcutsHelpOpen: boolean;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null);

export function useKeyboardShortcutsContext() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcutsContext must be used within KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    setIsShortcutsHelpOpen(false);
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  const openShortcutsHelp = useCallback(() => {
    setIsCommandPaletteOpen(false);
    setIsShortcutsHelpOpen(true);
  }, []);

  const closeShortcutsHelp = useCallback(() => {
    setIsShortcutsHelpOpen(false);
  }, []);

  // Define global shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      action: openCommandPalette,
      description: 'Ouvrir la recherche globale',
    },
    {
      key: '?',
      action: openShortcutsHelp,
      description: 'Afficher aide raccourcis',
    },
    {
      key: 'Escape',
      action: () => {
        if (isCommandPaletteOpen) closeCommandPalette();
        else if (isShortcutsHelpOpen) closeShortcutsHelp();
      },
      description: 'Fermer modal',
      allowInInput: true,
    },
  ];

  useKeyboardShortcuts(shortcuts);

  const value: KeyboardShortcutsContextValue = {
    openCommandPalette,
    closeCommandPalette,
    openShortcutsHelp,
    closeShortcutsHelp,
    isCommandPaletteOpen,
    isShortcutsHelpOpen,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={closeCommandPalette} />
      <KeyboardShortcutsHelp isOpen={isShortcutsHelpOpen} onClose={closeShortcutsHelp} />
    </KeyboardShortcutsContext.Provider>
  );
}

export default KeyboardShortcutsProvider;
