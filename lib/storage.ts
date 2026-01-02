import type { AppSettings } from './types';

const STORAGE_KEY = 'ue-po-translator-settings';

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    return JSON.parse(stored) as AppSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Clear settings from localStorage
 */
export function clearSettings(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}

/**
 * Get default settings
 */
export function getDefaultSettings(): AppSettings {
  return {
    mode: 'server',
    gameCode: 'linw',
    sourceLang: 'en',
    targetLang: 'ko',
  };
}
