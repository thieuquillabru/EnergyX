'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    const { currentTheme } = useApp();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: currentTheme.text }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: error ? currentTheme.error : currentTheme.border,
            color: currentTheme.text,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(currentTheme.textSecondary)}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm" style={{ color: currentTheme.error }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
