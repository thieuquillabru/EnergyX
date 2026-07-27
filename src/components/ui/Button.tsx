'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    const { currentTheme } = useApp();

    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: `text-white shadow-lg hover:shadow-xl active:scale-95`,
      secondary: `text-white shadow-md hover:shadow-lg active:scale-95`,
      outline: `border-2 hover:bg-opacity-10 active:scale-95`,
      ghost: `hover:bg-opacity-10 active:scale-95`,
      danger: `text-white shadow-lg hover:shadow-xl active:scale-95`,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return { backgroundColor: currentTheme.primary, color: 'white' };
        case 'secondary':
          return { backgroundColor: currentTheme.secondary, color: 'white' };
        case 'outline':
          return { borderColor: currentTheme.primary, color: currentTheme.primary };
        case 'ghost':
          return { color: currentTheme.text };
        case 'danger':
          return { backgroundColor: currentTheme.error, color: 'white' };
        default:
          return { backgroundColor: currentTheme.primary, color: 'white' };
      }
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        style={getVariantStyles()}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
