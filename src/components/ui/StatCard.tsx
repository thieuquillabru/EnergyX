'use client';

import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, icon, className, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border bg-card p-4 text-left transition-colors',
        onClick && 'cursor-pointer hover:bg-accent',
        className
      )}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}
