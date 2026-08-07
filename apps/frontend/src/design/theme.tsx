import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ColorScheme = 'default' | 'high-contrast';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'skillscribe-theme';
const COLOR_SCHEME_KEY = 'skillscribe-color-scheme';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

function applyTheme(theme: 'dark' | 'light', colorScheme: ColorScheme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-color-scheme', colorScheme);
  
  if (colorScheme === 'high-contrast') {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
}

export function ThemeProvider({ 
  children, 
  defaultMode = 'system',
  defaultColorScheme = 'default',
}: { 
  children: ReactNode; 
  defaultMode?: ThemeMode;
  defaultColorScheme?: ColorScheme;
}) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored ?? defaultMode;
  });
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    if (typeof window === 'undefined') return defaultColorScheme;
    const stored = localStorage.getItem(COLOR_SCHEME_KEY) as ColorScheme | null;
    return stored ?? defaultColorScheme;
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialTheme = resolveTheme(mode);
    setResolvedTheme(initialTheme);
    applyTheme(initialTheme, colorScheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const theme = resolveTheme(mode);
    setResolvedTheme(theme);
    applyTheme(theme, colorScheme);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(resolvedTheme, colorScheme);
    localStorage.setItem(COLOR_SCHEME_KEY, colorScheme);
  }, [colorScheme, resolvedTheme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        const theme = getSystemTheme();
        setResolvedTheme(theme);
        applyTheme(theme, colorScheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, colorScheme, mounted]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const setColorScheme = useCallback((newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  }, []);

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        mode: defaultMode,
        resolvedTheme: 'dark',
        colorScheme: defaultColorScheme,
        setMode: () => {},
        setColorScheme: () => {},
        toggleTheme: () => {},
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{
      mode,
      resolvedTheme,
      colorScheme,
      setMode,
      setColorScheme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}