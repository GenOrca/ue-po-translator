// PO File Entry Structure
export interface POEntry {
  msgid: string;           // Original text
  msgstr: string;          // Translated text
  msgctxt?: string;        // Context (e.g., ",F104DF424959AA30FB62D98DDA7E93A1")
  comments?: {
    reference?: string;    // Source location
    extracted?: string;    // Key
    translator?: string;   // Translator comments
  };
}

// Translation Status
export type TranslationStatus = 'untranslated' | 'translated' | 'translating' | 'error';

// Entry with UI state
export interface POEntryWithStatus extends POEntry {
  id: string;
  status: TranslationStatus;
  error?: string;
}

// Translation Mode
export type TranslationMode = 'server' | 'personal';

// VARCO API Types
export interface VarcoTranslateRequest {
  TID: string;
  game_code: string;
  provider: string;
  source_lang: string;
  source_text: string;
  target_lang: string;
}

export interface VarcoTranslateResponse {
  TID: string;
  target_lang: string;
  source_lang: string;
  game_code: string;
  provider: string;
  source_text: string;
  target_text: string;  // 번역 결과
  glossary?: Array<{
    ko?: string;
    en?: string[];
    apply?: string;
  }>;
}

export interface VarcoErrorResponse {
  message: string;
  request_id: string;
}

// Language codes (VARCO API supported languages)
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ko: '한국어 (Korean)',
  ja: '日本語 (Japanese)',
  cn: '简体中文 (Chinese Simplified)',
  tw: '繁體中文 (Chinese Traditional)',
  vi: 'Tiếng Việt (Vietnamese)',
  id: 'Bahasa Indonesia (Indonesian)',
  th: 'ไทย (Thai)',
  ru: 'Русский (Russian)',
  ar: 'العربية (Arabic)',
  tr: 'Türkçe (Turkish)',
  it: 'Italiano (Italian)',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// App Settings
export interface AppSettings {
  mode: TranslationMode;
  apiKey?: string;          // User's API key (Personal mode)
  gameCode: string;         // VARCO game_code
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
}
