'use client';

import { useEffect, useCallback } from 'react';
import type { PageId } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, CheckCircle, Target, BookOpen, Timer,
  Library, Gamepad2, Award, Dumbbell, Flower2, Sparkles,
  BarChart3, User, Settings, X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/AvatarEl';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const NAV_ITEMS: { id: PageId; icon: React.ReactNode; label: string }[] = [
  { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
  { id: 'habits', icon: <CheckCircle size={20} />, label: 'Habitudes' },
  { id: 'goals', icon: <Target size={20} />, label: 'Objectifs' },
  { id: 'journal', icon: <BookOpen size={20} />, label: 'Journal' },
  { id: 'timer', icon: <Timer size={20} />, label: 'Minuteur' },
  { id: 'library', icon: <Library size={20} />, label: 'Bibliothèque' },
  { id: 'gaming', icon: <Gamepad2 size={20} />, label: 'Jeux' },
  { id: 'skills', icon: <Award size={20} />, label: 'Compétences' },
  { id: 'fitness', icon: <Dumbbell size={20} />, label: 'Fitness' },
  { id: 'meditation', icon: <Flower2 size={20} />, label: 'Méditation' },
  { id: 'motivation', icon: <Sparkles size={20} />, label: 'Motivation' },
  { id: 'stats', icon: <BarChart3 size={20} />, label: 'Statistiques' },
  { id: 'profile', icon: <User size={20} />, label: 'Profil' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Paramètres' },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, open, onClose }: SidebarProps) {
  const { profile } = useApp();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) onClose();
  }, [open, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img src={`${BASE}/icon-192.png`} alt="" width={24} height={24} className="rounded" />
            <span className="text-lg font-bold">EnergyX</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 rounded hover:bg-accent"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                currentPage === item.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        {profile && (
          <div className="flex items-center gap-3 p-4 border-t border-border">
            <Avatar
              src={profile.avatar.startsWith('data:') ? profile.avatar : undefined}
              emoji={profile.avatar.startsWith('data:') ? undefined : profile.avatar}
              name={profile.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.name}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
