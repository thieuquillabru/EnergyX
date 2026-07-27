'use client';

import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useApp } from '@/context/AppContext';

export default function PWAInstallPrompt() {
  const { canInstall, installApp, isPWAInstalled, isOnline } = usePWA();
  const { currentTheme } = useApp();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = parseInt(dismissed);
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      if (now - dismissedDate < dayInMs) {
        setIsDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (canInstall && !isPWAInstalled && !isDismissed) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isPWAInstalled, isDismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setIsDismissed(true);
  };

  if (!showPrompt || isPWAInstalled) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-2xl shadow-2xl z-50 animate-slide-in"
      style={{ backgroundColor: currentTheme.surface }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: currentTheme.primary }}
          >
            E
          </div>
          <div>
            <h3 className="font-bold" style={{ color: currentTheme.text }}>
              Installer EnergyX
            </h3>
            <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
              Ajouter à l'écran d'accueil
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-opacity-10 transition-colors"
          style={{ color: currentTheme.textSecondary }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
        Installez EnergyX sur votre appareil pour une expérience optimale, 
        même hors ligne. L'app apparaîtra comme une application native.
      </p>

      {/* Features */}
      <ul className="text-sm mb-4 space-y-2" style={{ color: currentTheme.textSecondary }}>
        <li className="flex items-center gap-2">
          <span style={{ color: currentTheme.success }}>✓</span>
          Accès rapide depuis l'écran d'accueil
        </li>
        <li className="flex items-center gap-2">
          <span style={{ color: currentTheme.success }}>✓</span>
          Fonctionne hors ligne
        </li>
        <li className="flex items-center gap-2">
          <span style={{ color: currentTheme.success }}>✓</span>
          Interface plein écran
        </li>
      </ul>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2 px-4 rounded-xl font-medium transition-colors"
          style={{ backgroundColor: currentTheme.background, color: currentTheme.text }}
        >
          Plus tard
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2 px-4 rounded-xl font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: currentTheme.primary }}
        >
          Installer
        </button>
      </div>
    </div>
  );
}

// Component to show online/offline status
export function NetworkStatus() {
  const { isOnline } = usePWA();
  const { currentTheme } = useApp();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 p-2 text-center text-sm z-50"
      style={{ backgroundColor: currentTheme.warning, color: 'white' }}
    >
      📡 Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
    </div>
  );
}
