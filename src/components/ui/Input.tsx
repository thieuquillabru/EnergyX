'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    const { currentTheme } = useApp();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: currentTheme.text }}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: currentTheme.textSecondary }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-red-500' : ''} ${className}`}
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: error ? currentTheme.error : currentTheme.border,
              color: currentTheme.text,
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm" style={{ color: currentTheme.error }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
