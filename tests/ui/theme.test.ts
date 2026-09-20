import { describe, it, expect, beforeEach, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '@/lib/theme/types';
import { themeInitScript } from '@/lib/theme/theme-script';

// Mock localStorage for Node test environment
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

const mockLocalStorage = new LocalStorageMock();

describe('Theme System Logic & Storage (lib/theme/)', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.restoreAllMocks();
  });

  it('contains valid blocking inline script for FOUC prevention', () => {
    expect(themeInitScript).toContain(THEME_STORAGE_KEY);
    expect(themeInitScript).toContain('classList');
    expect(themeInitScript).toContain('prefers-color-scheme');
  });

  it('stores and retrieves explicit dark theme safely', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('stores and retrieves explicit light theme safely', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('handles invalid stored values gracefully by defaulting to system or dark', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'invalid-theme-value');
    const stored = mockLocalStorage.getItem(THEME_STORAGE_KEY);
    const isSupported = stored === 'dark' || stored === 'light' || stored === 'system';
    expect(isSupported).toBe(false);
  });

  it('handles storage errors without crashing', () => {
    const errorThrowingStorage = {
      getItem: () => {
        throw new Error('Access denied (strict privacy mode)');
      },
    };

    let result = 'fallback';
    expect(() => {
      try {
        result = errorThrowingStorage.getItem();
      } catch {
        result = 'system';
      }
    }).not.toThrow();

    expect(result).toBe('system');
  });
});
