import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const getTimeBasedTheme = () => {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
};

const COLOR_THEMES = ['blue', 'red', 'green', 'purple', 'orange'];

/** cookie 읽기 */
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

/** cookie 쓰기 (1년 유지) */
const setCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax`;
};

/** cookie 삭제 */
const removeCookie = (name) => {
  document.cookie = `${name}=;path=/;max-age=0`;
};

export const ThemeProvider = ({ children }) => {
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
    return COLOR_THEMES.includes(saved) ? saved : 'blue';
  });

  // Resolve theme from mode (+ time tick for auto)
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

  // Apply dark/light to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Apply color theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-color', colorTheme);
    setCookie('colorTheme', colorTheme);
  }, [colorTheme]);

  // Persist mode
  useEffect(() => {
    setCookie('themeMode', mode);
    removeCookie('theme'); // clean legacy
  }, [mode]);

  // Cycle: auto → light → dark → auto
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
