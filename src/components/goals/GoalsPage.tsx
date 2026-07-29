'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import type { Goal, GoalMilestone, HabitCategory } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Check, Target } from 'lucide-react';

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('personnel');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(2);
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [manualProgress, setManualProgress] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const goalsRef = useRef(goals);
  goalsRef.current = goals;

  const getProgress = useCallback((g: Goal) => {
    if (g.milestones.length > 0) {
      return Math.round((g.milestones.filter((m) => m.done).length / g.milestones.length) * 100);
    }
    return g.manualProgress;
  }, []);

  const sorted = useMemo(() => {
    return [...goals].sort((a, b) => {
      const pa = getProgress(a);
      const pb = getProgress(b);
      return pa - pb; // incomplete first
    });
  }, [goals, getProgress]);

  const openNew = useCallback(() => {
    setEditId(null);
    setName('');
    setCategory('personnel');
    setPriority(2);
    setDeadline('');
    setMilestones([]);
    setNewMilestoneTitle('');
    setManualProgress(0);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((g: Goal) => {
    setEditId(g.id);
    setName(g.name);
    setCategory(g.category);
    setPriority(g.priority);
    setDeadline(g.deadline || '');
    setMilestones([...g.milestones]);
    setNewMilestoneTitle('');
    setManualProgress(g.manualProgress);
    setDialogOpen(true);
  }, []);

  const addMilestone = useCallback(() => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: uuid(), title: newMilestoneTitle.trim(), done: false },
    ]);
    setNewMilestoneTitle('');
  }, [newMilestoneTitle]);

  const removeMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleMilestone = useCallback((id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  }, []);

  const handleToggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    const goal = goalsRef.current.find(g => g.id === goalId);
    if (!goal) return;
    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    updateGoal({ ...goal, milestones: updatedMilestones });
  }, [updateGoal]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    if (editId) {
      const existing = goals.find((g) => g.id === editId);
      if (existing) {
        updateGoal({
          ...existing,
          name: name.trim(),
          category,
          priority,
          deadline: deadline || null,
          milestones,
          manualProgress: milestones.length > 0 ? existing.manualProgress : manualProgress,
        });
      }
    } else {
      const goal: Goal = {
        id: uuid(),
        name: name.trim(),
        category,
        priority,
        deadline: deadline || null,
        milestones,
        manualProgress: milestones.length > 0 ? 0 : manualProgress,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addGoal(goal);
    }
    setDialogOpen(false);
  }, [name, category, priority, deadline, milestones, manualProgress, editId, goals, updateGoal, addGoal]);

  const handleDelete = useCallback((id: string) => {
    deleteGoal(id);
    setConfirmDeleteId(null);
  }, [deleteGoal]);

  const priorityLabels: Record<number, string> = { 1: 'Haute', 2: 'Moyenne', 3: 'Basse', 4: 'Minimale' };

  return (
    <div className="space-y-6">
      <PageHeader title="Objectifs" description="Définissez et suivez vos objectifs.">
        <Button onClick={openNew}>
          <Plus size={16} /> Nouvel objectif
        </Button>
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Target size={48} />}
          title="Aucun objectif"
          description="Créez votre premier objectif avec des jalons."
          action={<Button onClick={openNew}><Plus size={16} /> Créer</Button>}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((g) => {
            const progress = getProgress(g);
            const isDone = progress >= 100;
            return (
              <div
                key={g.id}
                className={cn(
                  'rounded-xl border border-border bg-card p-4 space-y-2',
                  isDone && 'border-primary/30'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={cn('font-medium', isDone && 'line-through text-muted-foreground')}>
                        {g.name}
                      </h3>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        P{g.priority}
                      </span>
                    </div>
                    {g.deadline && (
                      <p className="text-xs text-muted-foreground">
                        Échéance : {g.deadline}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm font-medium">{progress}%</span>
                    <button type="button" onClick={() => openEdit(g)} className="p-1 rounded hover:bg-accent" aria-label="Modifier">
                      <Edit2 size={14} />
                    </button>
                    {confirmDeleteId === g.id ? (
                      <>
                        <button type="button" onClick={() => handleDelete(g.id)} className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                        <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 text-xs border rounded">Non</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setConfirmDeleteId(g.id)} className="p-1 rounded hover:bg-destructive/20" aria-label="Supprimer">
                        <Trash2 size={14} className="text-destructive" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>

                {g.milestones.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {g.milestones.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleToggleMilestone(g.id, m.id)}
                        className="flex w-full items-center gap-2 text-sm text-left p-1 rounded hover:bg-accent/50"
                      >
                        <Check size={14} className={m.done ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={m.done ? 'line-through text-muted-foreground' : ''}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier l\'objectif' : 'Nouvel objectif'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priorité</Label>
                <div className="flex gap-1 mt-1">
                  {([1, 2, 3, 4] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        'flex-1 px-2 py-1 text-xs rounded border',
                        priority === p ? 'border-primary bg-primary/10' : 'border-border'
                      )}
                    >
                      {priorityLabels[p]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="goal-deadline">Échéance</Label>
                <Input id="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1" />
              </div>
            </div>

            <div>
              <Label>Jalons</Label>
              <div className="space-y-2 mt-1">
                {milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <button type="button" onClick={() => toggleMilestone(m.id)}>
                      <Check size={14} className={m.done ? 'text-primary' : 'text-muted-foreground'} />
                    </button>
                    <span className={cn('flex-1 text-sm', m.done && 'line-through text-muted-foreground')}>{m.title}</span>
                    <button type="button" onClick={() => removeMilestone(m.id)} className="text-destructive">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nouveau jalon..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                  />
                  <Button variant="outline" size="sm" onClick={addMilestone}><Plus size={14} /></Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {milestones.length > 0
                  ? 'La progression se calcule automatiquement à partir des jalons cochés.'
                  : 'Ajoutez des jalons ou utilisez la barre de progression manuelle.'}
              </p>
            </div>

            {milestones.length === 0 && (
              <div>
                <Label htmlFor="goal-progress">Progression manuelle : {manualProgress}%</Label>
                <input
                  id="goal-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={manualProgress}
                  onChange={(e) => setManualProgress(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            )}
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
