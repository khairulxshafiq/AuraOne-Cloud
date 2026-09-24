import { THEME_STORAGE_KEY } from './types';

/**
 * Blocking inline script to execute synchronously before first render,
 * eliminating Flash Of Unstyled Content (FOUC).
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var resolved = 'dark';
    if (stored === 'light' || stored === 'dark') {
      resolved = stored;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      resolved = 'light';
    } else {
      resolved = 'dark';
    }
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;
