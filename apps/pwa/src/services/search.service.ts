import apiClient from '@/api/client';

export type SearchResultType = 'client' | 'chantier' | 'devis' | 'facture';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  url: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export interface SearchFilters {
  types?: SearchResultType[];
  limit?: number;
}

const RECENT_SEARCHES_KEY = 'art_jardin_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Simple fuzzy search scoring
function fuzzyScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact match
  if (lowerText === lowerQuery) return 100;

  // Starts with
  if (lowerText.startsWith(lowerQuery)) return 80;

  // Contains
  if (lowerText.includes(lowerQuery)) return 60;

  // Fuzzy matching (characters in order)
  let score = 0;
  let queryIndex = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      score += 10;
      queryIndex++;
    }
  }

  return queryIndex === lowerQuery.length ? score : 0;
}

export const searchService = {
  /**
   * Search across all entities
   */
  search: async (query: string, filters?: SearchFilters): Promise<SearchResponse> => {
    if (!query.trim()) {
      return { results: [], total: 0 };
    }

    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.types?.length) {
      params.append('types', filters.types.join(','));
    }
    if (filters?.limit) {
      params.append('limit', String(filters.limit));
    }

    const response = await apiClient.get<SearchResponse>(`/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Local fuzzy search for offline/quick results
   * This can be used to filter cached data
   */
  fuzzyFilter: <T extends { title: string; subtitle?: string }>(
    items: T[],
    query: string,
    minScore = 40
  ): T[] => {
    if (!query.trim()) return items;

    return items
      .map((item) => ({
        item,
        score: Math.max(
          fuzzyScore(query, item.title),
          item.subtitle ? fuzzyScore(query, item.subtitle) : 0
        ),
      }))
      .filter(({ score }) => score >= minScore)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  },

  /**
   * Get recent searches from localStorage
   */
  getRecentSearches: (): string[] => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Add a search to recent searches
   */
  addRecentSearch: (query: string): void => {
    if (!query.trim()) return;

    const recent = searchService.getRecentSearches();
    const filtered = recent.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  },

  /**
   * Clear recent searches
   */
  clearRecentSearches: (): void => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore localStorage errors
    }
  },
};

export default searchService;
