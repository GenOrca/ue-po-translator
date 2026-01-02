import * as gettextParser from 'gettext-parser';
import type { POEntry, POEntryWithStatus } from './types';

/**
 * Parse PO file content into structured entries
 */
export function parsePOFile(content: string): POEntry[] {
  const po = gettextParser.po.parse(content);
  const entries: POEntry[] = [];

  // Iterate through all contexts
  for (const context in po.translations) {
    const contextEntries = po.translations[context];

    for (const msgid in contextEntries) {
      const entry = contextEntries[msgid];

      // Skip header entry (empty msgid)
      if (!msgid) continue;

      entries.push({
        msgid: entry.msgid as string,
        msgstr: (entry.msgstr && entry.msgstr[0]) as string || '',
        msgctxt: entry.msgctxt as string | undefined,
        comments: {
          reference: entry.comments?.reference,
          extracted: entry.comments?.extracted,
          translator: entry.comments?.translator,
        },
      });
    }
  }

  return entries;
}

/**
 * Filter untranslated entries
 */
export function getUntranslatedEntries(entries: POEntry[]): POEntry[] {
  return entries.filter(entry => !entry.msgstr || entry.msgstr.trim() === '');
}

/**
 * Filter translated entries
 */
export function getTranslatedEntries(entries: POEntry[]): POEntry[] {
  return entries.filter(entry => entry.msgstr && entry.msgstr.trim() !== '');
}

/**
 * Generate PO file content from entries
 */
export function generatePOFile(entries: POEntry[], originalContent: string): string {
  // Parse original file to preserve header
  const po = gettextParser.po.parse(originalContent);

  // Clear existing translations (except header)
  for (const context in po.translations) {
    if (context === '') {
      // Keep header
      const header = po.translations[context][''];
      po.translations[context] = { '': header };
    } else {
      po.translations[context] = {};
    }
  }

  // Add all entries
  for (const entry of entries) {
    const context = entry.msgctxt || '';

    if (!po.translations[context]) {
      po.translations[context] = {};
    }

    po.translations[context][entry.msgid] = {
      msgid: entry.msgid,
      msgstr: [entry.msgstr],
      msgctxt: entry.msgctxt,
      comments: {
        reference: entry.comments?.reference,
        extracted: entry.comments?.extracted,
        translator: entry.comments?.translator,
      },
    };
  }

  return gettextParser.po.compile(po).toString();
}

/**
 * Add unique IDs to entries for React keys
 */
export function addIdsToEntries(entries: POEntry[]): POEntryWithStatus[] {
  return entries.map((entry, index) => ({
    ...entry,
    id: `${entry.msgctxt || 'no-context'}-${index}`,
    status: entry.msgstr ? 'translated' : 'untranslated',
  }));
}

/**
 * Get statistics about translation progress
 */
export function getTranslationStats(entries: POEntry[]) {
  const total = entries.length;
  const translated = getTranslatedEntries(entries).length;
  const untranslated = total - translated;
  const progress = total > 0 ? Math.round((translated / total) * 100) : 0;

  return {
    total,
    translated,
    untranslated,
    progress,
  };
}
