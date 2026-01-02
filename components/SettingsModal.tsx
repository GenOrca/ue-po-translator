'use client';

import { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import type { AppSettings, LanguageCode } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Translation Mode */}
          <div>
            <label className="block text-sm font-medium mb-2">API Key Mode</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="mode"
                  value="server"
                  checked={localSettings.mode === 'server'}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, mode: e.target.value as 'server' })
                  }
                />
                <div>
                  <div className="font-medium">Server API Key</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Use API key from environment variable (easier setup)
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="mode"
                  value="personal"
                  checked={localSettings.mode === 'personal'}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, mode: e.target.value as 'personal' })
                  }
                />
                <div>
                  <div className="font-medium">Personal API Key</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Use your own VARCO API key (enter below)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* API Key (Personal mode only) */}
          {localSettings.mode === 'personal' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                VARCO API Key
              </label>
              <input
                type="password"
                value={localSettings.apiKey || ''}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, apiKey: e.target.value })
                }
                placeholder="Enter your VARCO API key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your API key from{' '}
                <a
                  href="https://api.varco.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  api.varco.ai
                </a>
              </p>
            </div>
          )}

          {/* Source Language */}
          <div>
            <label className="block text-sm font-medium mb-2">Source Language</label>
            <select
              value={localSettings.sourceLang}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  sourceLang: e.target.value as LanguageCode,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label className="block text-sm font-medium mb-2">Target Language</label>
            <select
              value={localSettings.targetLang}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  targetLang: e.target.value as LanguageCode,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Game Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Game Code</label>
            <input
              type="text"
              value={localSettings.gameCode}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, gameCode: e.target.value })
              }
              placeholder="linw"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              VARCO API game code parameter
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
