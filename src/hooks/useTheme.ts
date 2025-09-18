import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'medium' | 'large';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('mikasa_theme') as Theme || 'light';
    const savedFontSize = localStorage.getItem('mikasa_fontSize') as FontSize || 'medium';
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
    
    setIsInitialized(true);
  }, []);

  // Listen for system theme changes when auto mode is enabled
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('dark');
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark');
      }
    }
    
    // Force re-render by updating CSS custom properties
    html.style.setProperty('--theme-transition', 'all 0.3s ease');
  };

  const applyFontSize = (newFontSize: FontSize) => {
    const html = document.documentElement;
    
    // Remove existing font size classes
    html.classList.remove('font-small', 'font-medium', 'font-large');
    
    // Apply new font size class
    html.classList.add(`font-${newFontSize}`);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('mikasa_theme', newTheme);
    applyTheme(newTheme);
  };

  const changeFontSize = (newFontSize: FontSize) => {
    setFontSize(newFontSize);
    localStorage.setItem('mikasa_fontSize', newFontSize);
    applyFontSize(newFontSize);
  };

  const getCurrentTheme = (): 'light' | 'dark' => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  };

  return {
    theme,
    fontSize,
    isInitialized,
    changeTheme,
    changeFontSize,
    getCurrentTheme,
    isDark: getCurrentTheme() === 'dark'
  };
}