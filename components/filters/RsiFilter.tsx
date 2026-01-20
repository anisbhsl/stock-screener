'use client';

interface RsiFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RsiFilter({ value, onChange }: RsiFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">
        RSI Below
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="10"
          max="90"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="w-12 text-center font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Shows stocks with RSI below this value (oversold territory is typically &lt;30)
      </p>
    </div>
  );
}
