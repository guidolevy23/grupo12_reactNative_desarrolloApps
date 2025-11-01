import React, { createContext, useState, useContext } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E63F34', // Rojo Pokémon
    secondary: '#FFCB05', // Amarillo Pokémon
    tertiary: '#3B4CCA', // Azul Pokémon
    background: '#FFFFFF',
    surface: '#F5F5F5',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E63F34', // Rojo Pokémon
    secondary: '#FFCB05', // Amarillo Pokémon
    tertiary: '#3B4CCA', // Azul Pokémon
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
