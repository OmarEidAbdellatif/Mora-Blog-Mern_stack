import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue);
      return newValue;
    });
  };

  const theme = {
    darkMode,
    colors: darkMode ? {
      background: '#1a1a1a',
      cardBg: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      border: '#404040',
      error: '#ef4444',
      errorBg: '#7f1d1d',
      success: '#10b981',
      navBg: '#1f2937',
      inputBg: '#374151',
      buttonSecondary: '#4b5563',
    } : {
      background: '#f3f4f6',
      cardBg: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      border: '#e5e7eb',
      error: '#dc2626',
      errorBg: '#fee2e2',
      success: '#10b981',
      navBg: '#2563eb',
      inputBg: '#ffffff',
      buttonSecondary: '#6b7280',
    }
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);