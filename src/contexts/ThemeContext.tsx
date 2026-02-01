import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ru';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored === 'dark' || stored === 'light') ? stored : 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'en' || stored === 'ru') ? stored : 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    console.log('Theme changed to:', theme);
    console.log('HTML element before:', root.classList.toString());
    console.log('Attempting to modify classList...');
    
    // Force remove all classes first
    root.className = '';
    
    if (theme === 'dark') {
      root.className = 'dark';
      console.log('Set className to "dark"');
    } else {
      root.className = '';
      console.log('Set className to empty');
    }
    
    console.log('HTML element after:', root.classList.toString());
    console.log('Verification - contains dark?', root.classList.contains('dark'));
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, language, setTheme, setLanguage, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
