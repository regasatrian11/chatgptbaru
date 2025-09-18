import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('mikasa_theme') as Theme || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      setIsDark(true);
    } else if (newTheme === 'light') {
      html.classList.remove('dark');
      setIsDark(false);
    } else if (newTheme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark');
        setIsDark(true);
      } else {
        html.classList.remove('dark');
        setIsDark(false);
      }
    }
    
    localStorage.setItem('mikasa_theme', newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}