'use client';

import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    const { currentTheme } = useApp();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: currentTheme.text }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${error ? 'border-red-500' : ''} ${className}`}
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: error ? currentTheme.error : currentTheme.border,
            color: currentTheme.text,
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm" style={{ color: currentTheme.error }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
