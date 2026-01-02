'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Download, Languages } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import TranslationTable from '@/components/TranslationTable';
import ProgressBar from '@/components/ProgressBar';
import SettingsModal from '@/components/SettingsModal';
import { parsePOFile, getUntranslatedEntries, generatePOFile, addIdsToEntries, getTranslationStats } from '@/lib/poParser';
import { translateText } from '@/lib/varcoApi';
import { loadSettings, saveSettings, getDefaultSettings } from '@/lib/storage';
import type { POEntry, POEntryWithStatus, AppSettings } from '@/lib/types';

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [filename, setFilename] = useState('');
  const [entries, setEntries] = useState<POEntryWithStatus[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      setSettings(saved);
    }
  }, []);

  // Handle file upload
  const handleFileLoad = useCallback((content: string, name: string) => {
    try {
      const parsed = parsePOFile(content);
      const withIds = addIdsToEntries(parsed);
      setEntries(withIds);
      setOriginalContent(content);
      setFilename(name);
    } catch (error) {
      console.error('Failed to parse PO file:', error);
      alert('Failed to parse PO file. Please check if the file is valid.');
    }
  }, []);

  // Handle settings save
  const handleSettingsSave = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Handle entry edit
  const handleEntryEdit = useCallback((id: string, newTranslation: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, msgstr: newTranslation, status: 'translated' as const }
          : entry
      )
    );
  }, []);

  // Translate all untranslated entries
  const handleTranslateAll = async () => {
    const untranslated = entries.filter((e) => !e.msgstr);

    if (untranslated.length === 0) {
      alert('No untranslated entries found!');
      return;
    }

    // Check if API key is required
    if (settings.mode === 'personal' && !settings.apiKey) {
      alert('Please set your VARCO API key in Settings (Personal API Key mode)');
      setShowSettings(true);
      return;
    }

    setIsTranslating(true);
    setProgress({ current: 0, total: untranslated.length });

    const updatedEntries = [...entries];

    for (let i = 0; i < untranslated.length; i++) {
      const entry = untranslated[i];
      const entryIndex = entries.findIndex((e) => e.id === entry.id);

      // Mark as translating
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        status: 'translating',
      };
      setEntries([...updatedEntries]);

      try {
        const translated = await translateText(
          settings.mode,
          entry.msgid,
          settings.sourceLang,
          settings.targetLang,
          {
            apiKey: settings.apiKey,
            gameCode: settings.gameCode,
          }
        );

        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          msgstr: translated,
          status: 'translated',
          error: undefined,
        };
      } catch (error) {
        console.error('Translation failed:', error);
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      setEntries([...updatedEntries]);
      setProgress({ current: i + 1, total: untranslated.length });

      // Rate limiting delay
      if (i < untranslated.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    setIsTranslating(false);
  };

  // Download translated PO file
  const handleDownload = () => {
    if (!originalContent) {
      alert('No file loaded');
      return;
    }

    try {
      const plainEntries: POEntry[] = entries.map(({ id, status, error, ...rest }) => rest);
      const content = generatePOFile(plainEntries, originalContent);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'translated.po';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PO file:', error);
      alert('Failed to generate PO file');
    }
  };

  const stats = getTranslationStats(entries);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">UE PO Translator</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI-powered translation for Unreal Engine localization files
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <FileUploader onFileLoad={handleFileLoad} />
        ) : (
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">{filename}</h2>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total: </span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Translated: </span>
                      <span className="font-medium text-green-600">{stats.translated}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Untranslated: </span>
                      <span className="font-medium text-orange-600">{stats.untranslated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTranslateAll}
                    disabled={isTranslating || stats.untranslated === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isTranslating ? 'Translating...' : `Translate All (${stats.untranslated})`}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setEntries([]);
                      setOriginalContent('');
                      setFilename('');
                    }}
                    disabled={isTranslating}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    New File
                  </button>
                </div>
              </div>

              {isTranslating && (
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                  label="Translation Progress"
                />
              )}
            </div>

            {/* Translation Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
              <TranslationTable entries={entries} onEntryEdit={handleEntryEdit} />
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            Open source translation tool for Unreal Engine localization files
          </p>
          <p>
            <a
              href="https://github.com/genorca/ue-po-translator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
            {' • '}
            <span>Translation API: VARCO</span>
            {' • '}
            <a
              href="https://github.com/genorca/ue-po-translator/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              MIT License
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
