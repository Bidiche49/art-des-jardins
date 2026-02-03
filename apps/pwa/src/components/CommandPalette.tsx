import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { searchService, type SearchResult, type SearchResultType } from '@/services/search.service';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_CONFIG: Record<SearchResultType, { label: string; icon: string; color: string }> = {
  client: { label: 'Clients', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-blue-600 bg-blue-100' },
  chantier: { label: 'Chantiers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-green-600 bg-green-100' },
  devis: { label: 'Devis', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-purple-600 bg-purple-100' },
  facture: { label: 'Factures', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z', color: 'text-orange-600 bg-orange-100' },
};

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches on open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(searchService.getRecentSearches());
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await searchService.search(query, { limit: 10 });
        setResults(response.results);
        setSelectedIndex(0);
      } catch {
        // If API fails, show empty results
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      searchService.addRecentSearch(query);
      onClose();
      navigate(result.url);
    },
    [navigate, onClose, query]
  );

  const handleRecentSearch = useCallback((search: string) => {
    setQuery(search);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, handleSelect, onClose]
  );

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResultType, SearchResult[]>
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b">
          <svg
            className="w-5 h-5 text-gray-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher clients, chantiers, devis, factures..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
          />
          {isLoading && (
            <svg
              className="w-5 h-5 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          <kbd className="ml-3 px-2 py-1 text-xs font-mono text-gray-500 bg-gray-100 rounded">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query && recentSearches.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Recherches recentes
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearch(search)}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <p>Aucun resultat pour "{query}"</p>
            </div>
          )}

          {Object.entries(groupedResults).map(([type, items]) => {
            const config = TYPE_CONFIG[type as SearchResultType];
            return (
              <div key={type} className="py-2">
                <p className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {config.label}
                </p>
                {items.map((result) => {
                  const index = results.indexOf(result);
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                        isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 p-2 rounded-lg ${config.color}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={config.icon}
                          />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <kbd className="px-2 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 rounded">
                          Entree
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border rounded shadow-sm">
                ↑↓
              </kbd>
              naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border rounded shadow-sm">
                ↵
              </kbd>
              ouvrir
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 font-mono bg-white border rounded shadow-sm">
              ?
            </kbd>
            raccourcis
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CommandPalette;
