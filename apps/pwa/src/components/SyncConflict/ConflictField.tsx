import { useState, type ChangeEvent } from 'react';

interface ConflictFieldProps {
  fieldName: string;
  fieldLabel: string;
  localValue: unknown;
  serverValue: unknown;
  isConflicting: boolean;
  isMergeMode: boolean;
  mergedValue?: unknown;
  onMergeValueChange?: (value: unknown) => void;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

export function ConflictField({
  fieldLabel,
  localValue,
  serverValue,
  isConflicting,
  isMergeMode,
  mergedValue,
  onMergeValueChange,
}: ConflictFieldProps) {
  const [editValue, setEditValue] = useState(
    mergedValue !== undefined ? formatValue(mergedValue) : formatValue(localValue)
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    onMergeValueChange?.(newValue);
  };

  const localDisplay = formatValue(localValue);
  const serverDisplay = formatValue(serverValue);
  const isMultiline = localDisplay.length > 50 || serverDisplay.length > 50;

  return (
    <div className={`grid grid-cols-2 gap-4 py-3 px-4 ${isConflicting ? 'bg-amber-50' : ''}`}>
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">{fieldLabel}</div>
        {isMergeMode ? (
          isMultiline ? (
            <textarea
              value={editValue}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          )
        ) : (
          <div
            className={`text-sm ${
              isConflicting
                ? 'text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded'
                : 'text-gray-900'
            }`}
          >
            {localDisplay}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-500">{fieldLabel}</div>
        <div
          className={`text-sm ${
            isConflicting
              ? 'text-orange-700 font-medium bg-orange-50 px-2 py-1 rounded'
              : 'text-gray-900'
          }`}
        >
          {serverDisplay}
        </div>
      </div>
    </div>
  );
}
