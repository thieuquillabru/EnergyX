import type { ThemeId } from '@/types';
import { THEMES } from './constants';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  emoji: string;
  vars: Record<string, string>;
}

export function getTheme(id: ThemeId): ThemeDefinition {
  const t = THEMES[id];
  if (!t) return { id, name: 'Default', emoji: '🎨', vars: {} };
  return { id, name: t.name, emoji: t.emoji, vars: { ...t.vars } };
}

export function applyTheme(id: ThemeId): void {
  removeTheme();
  const theme = getTheme(id);
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function removeTheme(): void {
  // Remove custom theme vars (except Tailwind-defined ones)
  const root = document.documentElement;
  root.style.removeProperty('--background');
  root.style.removeProperty('--foreground');
  root.style.removeProperty('--card');
  root.style.removeProperty('--card-foreground');
  root.style.removeProperty('--popover');
  root.style.removeProperty('--popover-foreground');
  root.style.removeProperty('--primary');
  root.style.removeProperty('--primary-foreground');
  root.style.removeProperty('--secondary');
  root.style.removeProperty('--secondary-foreground');
  root.style.removeProperty('--muted');
  root.style.removeProperty('--muted-foreground');
  root.style.removeProperty('--accent');
  root.style.removeProperty('--accent-foreground');
  root.style.removeProperty('--destructive');
  root.style.removeProperty('--border');
  root.style.removeProperty('--input');
  root.style.removeProperty('--ring');
  root.style.removeProperty('--chart-1');
  root.style.removeProperty('--chart-2');
  root.style.removeProperty('--chart-3');
  root.style.removeProperty('--chart-4');
  root.style.removeProperty('--chart-5');
}
