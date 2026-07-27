'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Badge({ children, variant = 'default', size = 'md', className = '', onClick }: BadgeProps) {
  const { currentTheme } = useApp();

  const variants = {
    default: { backgroundColor: currentTheme.border, color: currentTheme.text },
    primary: { backgroundColor: currentTheme.primary, color: 'white' },
    secondary: { backgroundColor: currentTheme.secondary, color: 'white' },
    success: { backgroundColor: currentTheme.success, color: 'white' },
    warning: { backgroundColor: currentTheme.warning, color: 'white' },
    error: { backgroundColor: currentTheme.error, color: 'white' },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={variants[variant]}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
