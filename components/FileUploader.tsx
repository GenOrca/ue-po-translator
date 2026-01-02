'use client';

import { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileLoad: (content: string, filename: string) => void;
}

export default function FileUploader({ onFileLoad }: FileUploaderProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoad]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        Drop your .po file here
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        or click to browse
      </p>
      <input
        id="file-upload"
        type="file"
        accept=".po"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Supports Unreal Engine localization PO files
      </p>
    </div>
  );
}
