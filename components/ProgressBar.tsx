'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{label}</span>
          <span>{current} / {total}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
        {percentage}%
      </div>
    </div>
  );
}
