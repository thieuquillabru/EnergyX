'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

const STANDALONE_QUERY = '(display-mode: standalone)';

/* -------------------------------------------------------------------------
 * External stores
 * useSyncExternalStore keeps the React state in sync with the browser APIs
 * without calling setState from inside an effect, and returns a stable
 * server snapshot so hydration never mismatches.
 * ---------------------------------------------------------------------- */

function subscribeOnline(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function subscribeStandalone(onChange: () => void) {
  const mediaQuery = window.matchMedia(STANDALONE_QUERY);
  mediaQuery.addEventListener('change', onChange);
  window.addEventListener('appinstalled', onChange);
  return () => {
    mediaQuery.removeEventListener('change', onChange);
    window.removeEventListener('appinstalled', onChange);
  };
}

export function usePWA() {
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true // assume online while server-rendering
  );

  const isDisplayStandalone = useSyncExternalStore(
    subscribeStandalone,
    () =>
      window.matchMedia(STANDALONE_QUERY).matches ||
      (window.navigator as NavigatorWithStandalone).standalone === true,
    () => false
  );

  const [installAccepted, setInstallAccepted] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isPWAInstalled = isDisplayStandalone || installAccepted;

  // Register the service worker once. The base path keeps this working both
  // locally and on a GitHub Pages project site (/EnergyX/).
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    navigator.serviceWorker
      .register(`${basePath}/sw.js`, { scope: `${basePath}/` })
      .catch((error) => console.warn('SW registration failed:', error));
  }, []);

  // Capture the install prompt so we can trigger it from our own UI.
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => setInstallPrompt(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!installPrompt) return false;
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (outcome === 'accepted') {
        setInstallAccepted(true);
        return true;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
    return false;
  }, [installPrompt]);

  return {
    isOnline,
    isPWAInstalled,
    canInstall: installPrompt !== null && !isPWAInstalled,
    installApp,
  };
}

// Hook for notification permission
export function useNotifications() {
  const permission = useSyncExternalStore(
    // Permission changes are rare and have no reliable event; a no-op
    // subscribe is fine because requestPermission forces a re-read.
    () => () => {},
    () => (typeof Notification !== 'undefined' ? Notification.permission : 'default'),
    () => 'default' as NotificationPermission
  );
  const [, forceUpdate] = useState(0);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('This browser does not support notifications');
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      forceUpdate((n) => n + 1);
      return result === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }, []);

  return { permission, requestPermission };
}
