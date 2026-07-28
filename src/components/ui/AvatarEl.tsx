'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  emoji?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-2xl',
};

export function Avatar({ src, emoji, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-secondary text-secondary-foreground',
        sizeMap[size],
        className
      )}
      role="img"
      aria-label={name || 'Avatar'}
    >
      {emoji || (name ? name.charAt(0).toUpperCase() : '?')}
    </div>
  );
}
