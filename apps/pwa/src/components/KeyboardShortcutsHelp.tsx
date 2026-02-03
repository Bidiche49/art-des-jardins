import { Modal } from './ui/Modal';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

const SHORTCUTS: { category: string; items: ShortcutItem[] }[] = [
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Ouvrir la recherche globale' },
      { keys: ['Esc'], description: 'Fermer modal/drawer' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['Ctrl', 'N'], description: 'Nouveau (selon contexte)' },
      { keys: ['Ctrl', 'S'], description: 'Sauvegarder le formulaire' },
    ],
  },
  {
    category: 'Aide',
    items: [{ keys: ['?'], description: 'Afficher cette aide' }],
  },
];

function KeyboardKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] px-2 py-1 text-xs font-mono font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Raccourcis clavier" size="md">
      <div className="space-y-6">
        {SHORTCUTS.map((section) => (
          <div key={section.category}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {section.category}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-600">{item.description}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((key, keyIndex) => (
                      <span key={keyIndex} className="flex items-center gap-1">
                        <KeyboardKey>
                          {key === 'Ctrl' && navigator.platform.includes('Mac')
                            ? '⌘'
                            : key}
                        </KeyboardKey>
                        {keyIndex < item.keys.length - 1 && (
                          <span className="text-gray-400 text-xs">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Les raccourcis ne fonctionnent pas lorsque vous etes dans un champ de saisie
        </p>
      </div>
    </Modal>
  );
}

export default KeyboardShortcutsHelp;
