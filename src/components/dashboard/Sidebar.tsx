'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'home', category: 'main' },
  { id: 'habits', label: 'Habitudes', icon: 'check-circle', category: 'main' },
  { id: 'goals', label: 'Objectifs', icon: 'target', category: 'main' },
  { id: 'journal', label: 'Journal', icon: 'book', category: 'main' },
  { id: 'timer', label: 'Minuteur', icon: 'clock', category: 'productivity' },
  { id: 'library', label: 'Bibliothèque', icon: 'book-open', category: 'passions' },
  { id: 'gaming', label: 'Jeux', icon: 'gamepad', category: 'passions' },
  { id: 'skills', label: 'Compétences', icon: 'star', category: 'learning' },
  { id: 'fitness', label: 'Fitness', icon: 'dumbbell', category: 'health' },
  { id: 'meditation', label: 'Méditation', icon: 'heart', category: 'health' },
  { id: 'motivation', label: 'Motivation', icon: 'fire', category: 'motivation' },
  { id: 'profile', label: 'Profil', icon: 'user', category: 'settings' },
  { id: 'settings', label: 'Paramètres', icon: 'settings', category: 'settings' },
];

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  'check-circle': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'book-open': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  gamepad: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  star: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  dumbbell: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h2m12 0h2M4 17h2m12 0h2M7 7v10m4-10v10m4-10v10" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  fire: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentTheme, user } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close the mobile drawer with the Escape key
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileOpen]);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileOpen(false);
  };

  const xpNeeded = Math.max(user.stats.level, 1) * 100;
  const xpPercent = Math.min(100, Math.max(0, (user.stats.xp / xpNeeded) * 100));

  const categories = [
    { id: 'main', label: 'Principal' },
    { id: 'passions', label: 'Passions' },
    { id: 'learning', label: 'Apprentissage' },
    { id: 'health', label: 'Santé' },
    { id: 'motivation', label: 'Motivation' },
    { id: 'settings', label: 'Paramètres' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        aria-label="Ouvrir le menu"
        className="md:hidden fixed top-4 left-4 z-40 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: currentTheme.primary, color: 'white' }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`h-screen flex flex-col transition-transform duration-300 z-50 fixed inset-y-0 left-0 w-64 md:sticky md:top-0 md:z-auto md:translate-x-0 md:transition-all ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
        style={{ backgroundColor: currentTheme.surface, borderRight: `1px solid ${currentTheme.border}` }}
      >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: currentTheme.primary }}
        >
          E
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <div>
            <h1 className="font-bold text-lg" style={{ color: currentTheme.text }}>EnergyX</h1>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>Développement Personnel</p>
          </div>
        )}
      </div>

      {/* User Info */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="mx-4 p-3 rounded-xl mb-4" style={{ backgroundColor: currentTheme.background }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.primary }}>
              <span className="text-white font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: currentTheme.text }}>{user.name}</p>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>Niveau {user.stats.level}</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.border }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%`, backgroundColor: currentTheme.primary }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: currentTheme.textSecondary }}>
              {user.stats.xp} / {xpNeeded} XP
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2">
        {categories.map((category) => {
          const items = navItems.filter(item => item.category === category.id);
          if (items.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-4">
              {(!isCollapsed || isMobileOpen) && (
                <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: currentTheme.textSecondary }}>
                  {category.label}
                </p>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
                    currentPage === item.id ? 'shadow-md' : 'hover:scale-102'
                  } ${isCollapsed && !isMobileOpen ? 'md:justify-center' : ''}`}
                  style={{
                    backgroundColor: currentPage === item.id ? currentTheme.primary : 'transparent',
                    color: currentPage === item.id ? 'white' : currentTheme.text,
                  }}
                >
                  {icons[item.icon]}
                  {(!isCollapsed || isMobileOpen) && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Close button (mobile) */}
      <button
        onClick={() => setIsMobileOpen(false)}
        aria-label="Fermer le menu"
        className="md:hidden p-4 flex items-center justify-center gap-2 border-t transition-colors"
        style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="font-medium">Fermer</span>
      </button>

      {/* Toggle Button (desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
        className="hidden md:flex p-4 items-center justify-center border-t transition-colors"
        style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      </aside>
    </>
  );
}
