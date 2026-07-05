import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  { value: 'theme-light', label: 'Light' },
  { value: 'theme-dark', label: 'Dark' },
  { value: 'theme-chilli-red', label: 'Chilli Red' },
  { value: 'theme-ocean', label: 'Ocean' },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('chilli-theme') || 'theme-light'
  );

  useEffect(() => {
    const html = document.documentElement;
    THEMES.forEach(t => html.classList.remove(t.value));
    html.classList.add(theme);
    localStorage.setItem('chilli-theme', theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
