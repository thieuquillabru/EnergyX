'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import HabitsPage from '@/components/habits/HabitsPage';
import GoalsPage from '@/components/goals/GoalsPage';
import JournalPage from '@/components/journal/JournalPage';
import TimerPage from '@/components/timer/TimerPage';
import LibraryPage from '@/components/library/LibraryPage';
import GamingPage from '@/components/gaming/GamingPage';
import SkillsPage from '@/components/skills/SkillsPage';
import FitnessPage from '@/components/fitness/FitnessPage';
import MeditationPage from '@/components/meditation/MeditationPage';
import MotivationPage from '@/components/motivation/MotivationPage';
import ProfilePage from '@/components/profile/ProfilePage';
import SettingsPage from '@/components/settings/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'habits':
        return <HabitsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'journal':
        return <JournalPage />;
      case 'timer':
        return <TimerPage />;
      case 'library':
        return <LibraryPage />;
      case 'gaming':
        return <GamingPage />;
      case 'skills':
        return <SkillsPage />;
      case 'fitness':
        return <FitnessPage />;
      case 'meditation':
        return <MeditationPage />;
      case 'motivation':
        return <MotivationPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto" style={{ backgroundColor: useApp().currentTheme.background }}>
        {renderPage()}
      </main>
    </div>
  );
}
