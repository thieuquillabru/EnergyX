'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export default function ProgressBar({ value, max = 100, size = 'md', showLabel = false, color, className = '' }: ProgressBarProps) {
  const { currentTheme } = useApp();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full ${heights[size]} rounded-full overflow-hidden`}
        style={{ backgroundColor: currentTheme.border }}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${size === 'sm' ? 'text-xs' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color || currentTheme.primary,
          }}
        />
      </div>
      {showLabel && (
        <p className="text-sm mt-1" style={{ color: currentTheme.textSecondary }}>
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
