import type {
  VarcoTranslateRequest,
  VarcoTranslateResponse,
  VarcoErrorResponse,
  LanguageCode,
  TranslationMode,
} from './types';

const VARCO_API_URL = 'https://openapi.ai.nc.com/mt/chat-content/v1/translate';

/**
 * Translate text using VARCO API (client-side for Personal mode)
 */
export async function translateWithVarcoClient(
  apiKey: string,
  sourceText: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  gameCode: string = 'linw'
): Promise<string> {
  const request: VarcoTranslateRequest = {
    TID: crypto.randomUUID(),
    game_code: gameCode,
    provider: 'chat',
    source_lang: sourceLang,
    source_text: sourceText,
    target_lang: targetLang,
  };

  const response = await fetch(VARCO_API_URL, {
    method: 'POST',
    headers: {
      'openapi_key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('VARCO API error:', response.status, errorText);

    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText };
    }

    throw new Error(error.message || `Translation failed (${response.status})`);
  }

  const data: VarcoTranslateResponse = await response.json();
  return data.target_text;
}

/**
 * Translate text using Next.js API route (Server mode)
 */
export async function translateWithVarcoServer(
  sourceText: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  gameCode: string = 'linw'
): Promise<string> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_text: sourceText,
      source_lang: sourceLang,
      target_lang: targetLang,
      game_code: gameCode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Translation failed');
  }

  const data = await response.json();
  return data.target_text;
}

/**
 * Unified translate function that chooses the right method based on mode
 */
export async function translateText(
  mode: TranslationMode,
  sourceText: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  options: {
    apiKey?: string;
    gameCode?: string;
  } = {}
): Promise<string> {
  const gameCode = options.gameCode || 'linw';

  if (mode === 'personal') {
    if (!options.apiKey) {
      throw new Error('API key is required for Personal mode');
    }
    return translateWithVarcoClient(
      options.apiKey,
      sourceText,
      sourceLang,
      targetLang,
      gameCode
    );
  } else {
    // Server mode uses server-side API
    return translateWithVarcoServer(sourceText, sourceLang, targetLang, gameCode);
  }
}

/**
 * Translate multiple texts in batch with progress callback
 */
export async function translateBatch(
  mode: TranslationMode,
  texts: string[],
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  options: {
    apiKey?: string;
    gameCode?: string;
    onProgress?: (current: number, total: number) => void;
    delayMs?: number; // Rate limiting delay
  } = {}
): Promise<string[]> {
  const results: string[] = [];
  const delayMs = options.delayMs || 200; // Default 200ms delay between requests

  for (let i = 0; i < texts.length; i++) {
    try {
      const translated = await translateText(
        mode,
        texts[i],
        sourceLang,
        targetLang,
        options
      );
      results.push(translated);
    } catch (error) {
      console.error(`Translation failed for text ${i}:`, error);
      results.push(texts[i]); // Keep original on error
    }

    options.onProgress?.(i + 1, texts.length);

    // Rate limiting delay (except for last item)
    if (i < texts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
