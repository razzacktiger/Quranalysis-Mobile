import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme as nativeWindColorScheme } from 'nativewind';

const THEME_STORAGE_KEY = '@theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  /** User's preference: 'light', 'dark', or 'system' */
  preference: ThemePreference;
  /** Resolved color scheme based on preference and system setting */
  colorScheme: ColorScheme;
  /** Set the theme preference */
  setPreference: (preference: ThemePreference) => void;
  /** Toggle between light and dark (ignores system) */
  toggleTheme: () => void;
  /** Whether theme is still loading from storage */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function AppThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Resolve the actual color scheme
  const colorScheme: ColorScheme =
    preference === 'system'
      ? (systemColorScheme ?? 'light')
      : preference;

  // Sync color scheme to NativeWind for dark: classes
  useEffect(() => {
    nativeWindColorScheme.set(colorScheme);
  }, [colorScheme]);

  // Persist preference to AsyncStorage
  const setPreference = useCallback((newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newScheme: ThemePreference = colorScheme === 'light' ? 'dark' : 'light';
    setPreference(newScheme);
  }, [colorScheme, setPreference]);

  const value: ThemeContextValue = {
    preference,
    colorScheme,
    setPreference,
    toggleTheme,
    isLoading,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
