'use client';

import { useState } from 'react';
import type { POEntryWithStatus } from '@/lib/types';
import { Check, X, Loader2, Edit2 } from 'lucide-react';

interface TranslationTableProps {
  entries: POEntryWithStatus[];
  onEntryEdit?: (id: string, newTranslation: string) => void;
}

export default function TranslationTable({ entries, onEntryEdit }: TranslationTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (entry: POEntryWithStatus) => {
    setEditingId(entry.id);
    setEditValue(entry.msgstr);
  };

  const handleSave = (id: string) => {
    if (onEntryEdit) {
      onEntryEdit(id, editValue);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getStatusIcon = (status: POEntryWithStatus['status']) => {
    switch (status) {
      case 'translated':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'translating':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-10">
              Status
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
              Original Text
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
              Translation
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-24">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                {getStatusIcon(entry.status)}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                <div className="font-mono text-sm">{entry.msgid}</div>
                {entry.comments?.reference && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {entry.comments.reference}
                  </div>
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {editingId === entry.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(entry.id);
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                ) : (
                  <div className="font-mono text-sm">
                    {entry.msgstr || (
                      <span className="text-gray-400 dark:text-gray-500 italic">
                        (untranslated)
                      </span>
                    )}
                  </div>
                )}
                {entry.error && (
                  <div className="text-xs text-red-500 mt-1">{entry.error}</div>
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {editingId === entry.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(entry.id)}
                      className="text-green-600 hover:text-green-700 dark:text-green-400"
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-700 dark:text-gray-400"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    title="Edit"
                    disabled={entry.status === 'translating'}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
