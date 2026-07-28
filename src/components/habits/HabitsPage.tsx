'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Habit, HabitCategory } from '@/types';
import { DOMAIN_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToday } from '@/hooks/useToday';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { HABIT_COLORS, HABIT_ICONS } from '@/lib/constants';
import { computeStreak } from '@/lib/achievements';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle, Plus, Trash2, Flame, Edit2 } from 'lucide-react';

export function HabitsPage() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } = useApp();
  const today = useToday();
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏃');
  const [color, setColor] = useState('#818cf8');
  const [category, setCategory] = useState<string>('personnel');
  const [reminderTime, setReminderTime] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return habits;
    return habits.filter((h) => h.category === filter);
  }, [habits, filter]);

  const openNew = useCallback(() => {
    setEditId(null);
    setName('');
    setIcon('🏃');
    setColor('#818cf8');
    setCategory('personnel');
    setReminderTime('');
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((h: Habit) => {
    setEditId(h.id);
    setName(h.name);
    setIcon(h.icon);
    setColor(h.color);
    setCategory(h.category);
    setReminderTime(h.reminderTime || '');
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    if (editId) {
      const existing = habits.find((h) => h.id === editId);
      if (existing) {
        updateHabit({
          ...existing,
          name: name.trim(),
          icon,
          color,
          category: category as HabitCategory,
          reminderTime: reminderTime || null,
        });
      }
    } else {
      const habit: Habit = {
        id: uuid(),
        name: name.trim(),
        icon,
        color,
        category: category as HabitCategory,
        reminderTime: reminderTime || null,
        completions: [],
      };
      addHabit(habit);
    }
    setDialogOpen(false);
  }, [name, icon, color, category, reminderTime, editId, habits, updateHabit, addHabit]);

  const handleDelete = useCallback((id: string) => {
    deleteHabit(id);
    setConfirmDeleteId(null);
  }, [deleteHabit]);

  if (!today) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Habitudes" description="Suivez vos habitudes quotidiennes.">
        <Button onClick={openNew}>
          <Plus size={16} /> Nouvelle habitude
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'personnel', 'sante', 'forme', 'mental', 'apprentissage', 'productivite', 'creativite', 'relations', 'finances'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1 rounded-lg text-sm border transition-colors',
              filter === f ? 'border-primary bg-primary/10' : 'border-border'
            )}
          >
            {f === 'all' ? 'Toutes' : (DOMAIN_LABELS[f as keyof typeof DOMAIN_LABELS] || f.charAt(0).toUpperCase() + f.slice(1))}
          </button>
        ))}
      </div>

      {/* Habit list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={48} />}
          title="Aucune habitude"
          description="Commencez par créer votre première habitude."
          action={<Button onClick={openNew}><Plus size={16} /> Créer</Button>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((h) => {
            const done = h.completions.includes(today);
            const streak = computeStreak(h.completions);
            return (
              <div
                key={h.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => toggleHabitCompletion(h.id, today)}
                  className="shrink-0"
                  aria-label={done ? 'Décocher' : 'Cocher'}
                >
                  <CheckCircle
                    size={24}
                    className={done ? 'text-primary' : 'text-muted-foreground'}
                    style={done ? { color: h.color } : undefined}
                  />
                </button>
                <span className="text-xl shrink-0">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', done && 'line-through text-muted-foreground')}>
                    {h.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Flame size={12} className="text-orange-400" /> {streak} jour{streak > 1 ? 's' : ''}
                      </span>
                    )}
                    {h.reminderTime && (
                      <span className="ml-2">🔔 {h.reminderTime}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(h)}
                    className="p-1.5 rounded-lg hover:bg-accent"
                    aria-label="Modifier"
                  >
                    <Edit2 size={14} />
                  </button>
                  {confirmDeleteId === h.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(h.id)}
                        className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded"
                      >
                        Confirmer
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-xs border border-border rounded"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(h.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/20"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier l\'habitude' : 'Nouvelle habitude'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Icône</Label>
              <div className="flex flex-wrap gap-1.5 mt-1 max-h-32 overflow-y-auto">
                {HABIT_ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={cn(
                      'h-9 w-9 rounded-lg flex items-center justify-center text-lg border',
                      icon === i ? 'border-primary' : 'border-border'
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'h-7 w-7 rounded-full border-2',
                      color === c ? 'border-foreground' : 'border-transparent'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="habit-time">Rappel (optionnel)</Label>
              <Input
                id="habit-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {editId ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
