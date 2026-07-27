'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns today's date as an ISO `YYYY-MM-DD` string.
 *
 * The value is read through `useSyncExternalStore` so that:
 *  - the server snapshot is an empty string (no hydration mismatch: the
 *    server cannot know the visitor's local date),
 *  - the client picks up the real date on the first commit,
 *  - the value refreshes automatically when the day rolls over while the
 *    app stays open (useful for a habit tracker left open overnight).
 *
 * Consumers should treat `''` as "not resolved yet" and skip date-dependent
 * writes until it is set.
 */

function localISODate(date = new Date()) {
  // Use local time rather than UTC so users east/west of UTC don't see
  // yesterday's or tomorrow's date.
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
}

function subscribe(onChange: () => void) {
  // Re-check every minute; cheap and guarantees a rollover at midnight.
  const interval = setInterval(onChange, 60 * 1000);
  const onFocus = () => onChange();
  window.addEventListener('focus', onFocus);
  document.addEventListener('visibilitychange', onFocus);
  return () => {
    clearInterval(interval);
    window.removeEventListener('focus', onFocus);
    document.removeEventListener('visibilitychange', onFocus);
  };
}

let cachedDate = '';

function getSnapshot() {
  const current = localISODate();
  // Return a cached string so the snapshot is referentially stable between
  // reads on the same day (required by useSyncExternalStore).
  if (current !== cachedDate) cachedDate = current;
  return cachedDate;
}

function getServerSnapshot() {
  return '';
}

export function useToday() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Human readable long form date, e.g. "lundi 27 juillet". Empty on the server. */
export function formatLongDate(isoDate: string) {
  if (!isoDate) return '';
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export { localISODate };
