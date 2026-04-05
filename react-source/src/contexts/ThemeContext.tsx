import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  mode: string;
  toggleTheme: () => void;
  colorTheme: string;
  setColorTheme: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const getTimeBasedTheme = () => {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
};

const COLOR_THEMES = ['blue', 'red', 'green', 'purple', 'orange'];

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;path=/;max-age=0`;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(() => {
    const saved = getCookie('themeMode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    return 'auto';
  });

  const [theme, setTheme] = useState(() => {
    return mode === 'auto' ? getTimeBasedTheme() : mode;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = getCookie('colorTheme');
    return COLOR_THEMES.includes(saved!) ? saved! : 'blue';
  });

  useEffect(() => {
    if (mode !== 'auto') {
      setTheme(mode);
      return;
    }
    setTheme(getTimeBasedTheme());
    const interval = setInterval(() => {
      setTheme(getTimeBasedTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    setCookie('colorTheme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    setCookie('themeMode', mode);
    removeCookie('theme');
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
