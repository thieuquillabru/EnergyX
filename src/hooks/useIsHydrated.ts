'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Returns `false` during server rendering and the very first client render,
 * then `true` once React has hydrated.
 *
 * This is the hydration-safe way to gate browser-only work (reading
 * `localStorage`, `window`, …) without calling `setState` from an effect.
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
