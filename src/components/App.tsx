'use client';

import { useEffect, useState } from 'react';
import { useSyncExternalStore } from 'react';
import type { PageId } from '@/types';
import { useApp } from '@/context/AppContext';
import { applyTheme } from '@/lib/theme';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { HabitsPage } from '@/components/habits/HabitsPage';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { JournalPage } from '@/components/journal/JournalPage';
import { TimerPage } from '@/components/timer/TimerPage';
import { LibraryPage } from '@/components/library/LibraryPage';
import { GamingPage } from '@/components/gaming/GamingPage';
import { SkillsPage } from '@/components/skills/SkillsPage';
import { FitnessPage } from '@/components/fitness/FitnessPage';
import { MeditationPage } from '@/components/meditation/MeditationPage';
import { MotivationPage } from '@/components/motivation/MotivationPage';
import { StatsPage } from '@/components/stats/StatsPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { SettingsPage } from '@/components/settings/SettingsPage';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

function PageContent({ page, onNavigate }: { page: PageId; onNavigate: (p: PageId) => void }) {
  switch (page) {
    case 'dashboard': return <Dashboard onNavigate={onNavigate} />;
    case 'habits': return <HabitsPage />;
    case 'goals': return <GoalsPage />;
    case 'journal': return <JournalPage />;
    case 'timer': return <TimerPage />;
    case 'library': return <LibraryPage />;
    case 'gaming': return <GamingPage />;
    case 'skills': return <SkillsPage />;
    case 'fitness': return <FitnessPage />;
    case 'meditation': return <MeditationPage />;
    case 'motivation': return <MotivationPage />;
    case 'stats': return <StatsPage />;
    case 'profile': return <ProfilePage />;
    case 'settings': return <SettingsPage />;
    default: return <Dashboard onNavigate={onNavigate} />;
  }
}

export function App() {
  const { profile } = useApp();
  const [page, setPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swPath = process.env.NEXT_PUBLIC_BASE_PATH
        ? `${process.env.NEXT_PUBLIC_BASE_PATH}/sw.js`
        : '/sw.js';
      navigator.serviceWorker.register(swPath).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (profile?.theme) applyTheme(profile.theme);
  }, [profile?.theme]);

  if (!mounted) {
    // Inline skeleton that matches the final layout to prevent CLS
    return (
      <div className="flex min-h-dvh bg-background">
        {/* Skeleton mobile top bar */}
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4"
          style={{ height: 'calc(3.5rem + var(--safe-top))', paddingTop: 'var(--safe-top)' }}
        >
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div className="h-5 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="hidden md:block w-60 shrink-0 border-r border-border" />
        <main className="flex-1 p-4 pt-[calc(3.5rem+var(--safe-top))] sm:p-6 md:pt-6">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse hidden md:block" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-card border border-border animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile?.isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar currentPage={page} onNavigate={(p) => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sticky mobile top bar with hamburger + logo */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4"
        style={{ height: 'calc(3.5rem + var(--safe-top))', paddingTop: 'var(--safe-top)' }}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent active:bg-accent/80 transition-colors shrink-0"
          aria-label="Ouvrir le menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <img src={`${BASE}/icon-192.png`} alt="" width={24} height={24} className="rounded shrink-0" />
        <span className="text-base font-bold truncate min-w-0">EnergyX</span>
      </header>

      <main
        className="flex-1 p-4 pt-[calc(3.5rem+var(--safe-top))] sm:p-6 sm:pt-6 overflow-auto md:pt-6"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
      >
        <div className="md:ml-60">
          <PageContent page={page} onNavigate={setPage} />
        </div>
      </main>
    </div>
  );
}
