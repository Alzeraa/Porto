import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

export interface ThemeColors {
  primary_color: string;
  primary_light: string;
  primary_dark: string;
  accent_color: string;
  background_dark: string;
  text_primary: string;
  logo_url?: string;
}

const defaultTheme: ThemeColors = {
  primary_color: '#1e3a5f',
  primary_light: '#2563eb',
  primary_dark: '#0f172a',
  accent_color: '#0ea5e9',
  background_dark: '#0f172a',
  text_primary: '#ffffff'
};

export const useThemeColors = () => {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.theme);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setTheme(data.data);
            applyThemeToDOM(data.data);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch theme, using defaults:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  return { theme, loading };
};

const applyThemeToDOM = (theme: ThemeColors) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primary_color);
  root.style.setProperty('--primary-light', theme.primary_light);
  root.style.setProperty('--primary-dark', theme.primary_dark);
  root.style.setProperty('--accent-color', theme.accent_color);
  root.style.setProperty('--background-dark', theme.background_dark);
  root.style.setProperty('--text-primary', theme.text_primary);
};
