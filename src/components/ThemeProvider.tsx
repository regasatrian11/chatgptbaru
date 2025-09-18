import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme, Theme, FontSize } from '../hooks/useTheme';

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  isInitialized: boolean;
  changeTheme: (theme: Theme) => void;
  changeFontSize: (fontSize: FontSize) => void;
  getCurrentTheme: () => 'light' | 'dark';
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeData = useTheme();

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}