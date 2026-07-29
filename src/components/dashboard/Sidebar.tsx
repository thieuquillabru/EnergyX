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

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-60 bg-card border-r border-border flex flex-col',
          'md:sticky md:z-0 md:top-0 md:h-auto',
          'transition-transform duration-300 ease-out will-change-transform',
          !open && '-translate-x-full'
        )}
        style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
      >
        {/* Header with safe-area top */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img src={`${BASE}/icon-192.png`} alt="" width={24} height={24} className="rounded shrink-0" />
            <span className="text-lg font-bold truncate">EnergyX</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent active:bg-accent/80 transition-colors shrink-0"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation — 48px touch targets for mobile accessibility */}
        <nav className="flex-1 overflow-y-auto py-2 overscroll-y-contain">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-3 px-4 text-sm transition-colors',
                /* 48px min-height for mobile touch targets (Apple HIG: 44px, Material: 48dp) */
                'min-h-12 py-3',
                currentPage === item.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground active:bg-accent/80'
              )}
            >
              {item.icon}
              <span className="truncate min-w-0">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info with safe-area bottom */}
        {profile && (
          <div className="flex items-center gap-3 p-4 border-t border-border shrink-0">
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
