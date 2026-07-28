'use client';

import { useSyncExternalStore } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd', { locale: fr });
}

function subscribe() {
  // No-op: time changes are not subscribable.
  // Re-renders happen on mount and hydration.
  return () => {};
}

export function useToday(): string {
  return useSyncExternalStore(
    subscribe,
    getToday,
    () => '' // SSR returns empty string
  );
}

export function useTodayFormatted(): string {
  const today = useToday();
  if (!today) return '';
  try {
    return format(new Date(today + 'T12:00:00'), 'EEEE d MMMM yyyy', { locale: fr });
  } catch {
    return today;
  }
}

export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr + 'T12:00:00'), 'd MMM yyyy', { locale: fr });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(new Date(dateStr + 'T12:00:00'), 'dd/MM', { locale: fr });
  } catch {
    return dateStr;
  }
}

export function formatDateFull(dateStr: string): string {
  try {
    return format(new Date(dateStr + 'T12:00:00'), 'EEEE d MMMM yyyy', { locale: fr });
  } catch {
    return dateStr;
  }
}
