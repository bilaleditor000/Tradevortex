import React, { useState, useEffect } from 'react';
import { formatCurrencyAmount } from '../../data/currencies';

export interface CalculatorCurrencyProps {
  displayCurrency?: string;
  fxRate?: number;
}

export function formatDualCurrency(
  usdAmount: number,
  displayCurrency = 'USD',
  fxRate = 1
): string | null {
  if (!displayCurrency || displayCurrency === 'USD' || !fxRate || fxRate <= 0) {
    return null;
  }
  return formatCurrencyAmount(usdAmount * fxRate, displayCurrency);
}

interface NumericFieldProps {
  value: number;
  onChangeValue: (val: number) => void;
  min?: number;
  max?: number;
  step?: string | number;
  placeholder?: string;
  className?: string;
  fallbackOnEmpty?: number;
  integer?: boolean;
}

/**
 * String-backed numeric input that allows backspacing every digit cleanly
 * (including clearing the final '0' to an empty field without snapping back to '0').
 */
export const NumericField: React.FC<NumericFieldProps> = ({
  value,
  onChangeValue,
  min,
  max,
  step = 'any',
  placeholder = '0',
  className = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none font-mono',
  fallbackOnEmpty = 0,
  integer = false
}) => {
  const [text, setText] = useState<string>(() => (Number.isFinite(value) ? String(value) : ''));

  useEffect(() => {
    const parsed = text === '' || text === '-' || text === '.' ? fallbackOnEmpty : parseFloat(text);
    if (Number.isFinite(value) && value !== parsed) {
      setText(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty string cleanly so user can delete all digits including '0'
    if (raw === '') {
      setText('');
      onChangeValue(fallbackOnEmpty);
      return;
    }

    // Permit intermediate typing states like "-", ".", "0."
    const validPattern = integer ? /^-?\d*$/ : /^-?\d*\.?\d*$/;
    if (!validPattern.test(raw)) return;

    // Strip leading zero when typing a non-decimal digit (e.g. "05" -> "5")
    const cleaned =
      raw.length > 1 && raw.startsWith('0') && raw[1] !== '.' ? raw.replace(/^0+/, '') || '0' : raw;

    setText(cleaned);

    const parsed = integer ? parseInt(cleaned, 10) : parseFloat(cleaned);
    if (!Number.isNaN(parsed)) {
      let next = parsed;
      if (typeof max === 'number' && next > max) next = max;
      if (typeof min === 'number' && cleaned !== '-' && next < min && cleaned.length >= String(min).length) {
        // Don't clamp mid-typing unless clear; pass raw value when valid
      }
      onChangeValue(next);
    }
  };

  return (
    <input
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      step={step}
      value={text}
      placeholder={placeholder}
      onChange={handleChange}
      className={className}
    />
  );
};
