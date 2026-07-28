'use client';

import { useState } from 'react';
import type { PageId } from '@/types';
import { useIsHydrated } from '@/hooks/useIsHydrated';
import { useApp } from '@/context/AppContext';
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

export function App() {
  const hydrated = useIsHydrated();
  const { profile } = useApp();
  const [page, setPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!profile?.isOnboarded) {
    return <OnboardingFlow />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
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
      default: return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={page} onNavigate={(p) => { setPage(p); setSidebarOpen(false); }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-card border border-border"
          aria-label="Ouvrir le menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div className="md:ml-60">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
