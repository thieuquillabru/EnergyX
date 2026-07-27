'use client';

import React, { HTMLAttributes, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const { currentTheme } = useApp();

    const variants = {
      default: {
        backgroundColor: currentTheme.surface,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      elevated: {
        backgroundColor: currentTheme.surface,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      },
      outlined: {
        backgroundColor: currentTheme.surface,
        border: `1px solid ${currentTheme.border}`,
      },
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={`rounded-2xl ${paddings[padding]} ${hover ? 'transition-transform duration-200 hover:scale-102 cursor-pointer' : ''} ${className}`}
        style={variants[variant]}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
