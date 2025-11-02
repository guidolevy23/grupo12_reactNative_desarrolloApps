import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const Themes = {
    light: {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            primary: '#1b2132',
            secondary: '#e8ff00',
            tertiary: '#3B4CCA', 
            background: '#FFFFFF',
            surface: '#F5F5F5',
        },
    },
    dark: {
        ...MD3DarkTheme,
        colors: {
            ...MD3DarkTheme.colors,
            primary: '#E63F34',
            secondary: '#FFCB05',
            tertiary: '#3B4CCA',
            background: '#121212',
            surface: '#1E1E1E',
        },
    }
}