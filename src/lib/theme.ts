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
  const root = document.documentElement;
  const vars = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--border',
    '--input', '--ring', '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
  ];
  vars.forEach(v => root.style.removeProperty(v));
}
