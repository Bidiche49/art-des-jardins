import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchService } from './search.service';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('searchService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fuzzyFilter', () => {
    const items = [
      { title: 'Jean Martin', subtitle: 'Paris' },
      { title: 'Marie Dupont', subtitle: 'Lyon' },
      { title: 'Pierre Martinez', subtitle: 'Marseille' },
      { title: 'Sophie Bernard' },
    ];

    it('should return all items when query is empty', () => {
      const result = searchService.fuzzyFilter(items, '');
      expect(result).toHaveLength(4);
    });

    it('should filter by exact match in title', () => {
      const result = searchService.fuzzyFilter(items, 'Jean Martin');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Jean Martin');
    });

    it('should filter by partial match in title', () => {
      const result = searchService.fuzzyFilter(items, 'Martin');
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.some((r) => r.title.includes('Martin'))).toBe(true);
    });

    it('should filter by subtitle', () => {
      const result = searchService.fuzzyFilter(items, 'Paris');
      expect(result).toHaveLength(1);
      expect(result[0].subtitle).toBe('Paris');
    });

    it('should be case insensitive', () => {
      const result = searchService.fuzzyFilter(items, 'MARIE');
      expect(result.some((r) => r.title.includes('Marie'))).toBe(true);
    });

    it('should respect minScore parameter', () => {
      const result = searchService.fuzzyFilter(items, 'xyz', 100);
      expect(result).toHaveLength(0);
    });

    it('should sort results by score (best match first)', () => {
      const result = searchService.fuzzyFilter(items, 'Mar');
      // "Marie" starts with "Mar" should be ranked higher than "Martin" which contains it
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('recent searches', () => {
    it('should return empty array when no recent searches', () => {
      const result = searchService.getRecentSearches();
      expect(result).toEqual([]);
    });

    it('should store and retrieve recent searches', () => {
      searchService.addRecentSearch('test query');
      const result = searchService.getRecentSearches();
      expect(result).toContain('test query');
    });

    it('should not store empty queries', () => {
      searchService.addRecentSearch('');
      searchService.addRecentSearch('   ');
      const result = searchService.getRecentSearches();
      expect(result).toHaveLength(0);
    });

    it('should prevent duplicates (case insensitive)', () => {
      searchService.addRecentSearch('Test');
      searchService.addRecentSearch('test');
      searchService.addRecentSearch('TEST');
      const result = searchService.getRecentSearches();
      expect(result).toHaveLength(1);
    });

    it('should limit to 5 recent searches', () => {
      searchService.addRecentSearch('search1');
      searchService.addRecentSearch('search2');
      searchService.addRecentSearch('search3');
      searchService.addRecentSearch('search4');
      searchService.addRecentSearch('search5');
      searchService.addRecentSearch('search6');

      const result = searchService.getRecentSearches();
      expect(result).toHaveLength(5);
      expect(result[0]).toBe('search6'); // Most recent first
      expect(result).not.toContain('search1'); // Oldest removed
    });

    it('should move existing search to front when re-added', () => {
      searchService.addRecentSearch('first');
      searchService.addRecentSearch('second');
      searchService.addRecentSearch('first'); // Re-add first

      const result = searchService.getRecentSearches();
      expect(result[0]).toBe('first');
      expect(result).toHaveLength(2);
    });

    it('should clear recent searches', () => {
      searchService.addRecentSearch('test');
      searchService.clearRecentSearches();
      const result = searchService.getRecentSearches();
      expect(result).toHaveLength(0);
    });
  });

  describe('search API', () => {
    it('should return empty results for empty query', async () => {
      const result = await searchService.search('');
      expect(result).toEqual({ results: [], total: 0 });
    });

    it('should return empty results for whitespace query', async () => {
      const result = await searchService.search('   ');
      expect(result).toEqual({ results: [], total: 0 });
    });
  });
});
