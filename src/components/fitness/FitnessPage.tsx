'use client';

import { useState, useMemo, useCallback } from 'react';
import type { FitnessSession, Exercise } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function FitnessPage() {
  const { fitnessSessions, addFitnessSession, updateFitnessSession, deleteFitnessSession } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: 3, reps: 10, weight: 0 }]);
  const [calories, setCalories] = useState(0);
  const [duration, setDuration] = useState(0);
  const [note, setNote] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const weekTotal = useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const ws = format(weekStart, 'yyyy-MM-dd');
    return fitnessSessions
      .filter((s) => s.date >= ws)
      .reduce((sum, s) => sum + s.duration, 0);
  }, [fitnessSessions]);

  const sorted = useMemo(() => [...fitnessSessions].sort((a, b) => b.date.localeCompare(a.date)), [fitnessSessions]);

  const addExercise = useCallback(() => {
    setExercises((p) => [...p, { name: '', sets: 3, reps: 10, weight: 0 }]);
  }, []);

  const updateExercise = useCallback((idx: number, field: keyof Exercise, value: string | number) => {
    setExercises((p) => p.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  }, []);

  const removeExercise = useCallback((idx: number) => {
    setExercises((p) => p.filter((_, i) => i !== idx));
  }, []);

  const openNew = useCallback(() => {
    setEditId(null); setDate(new Date().toISOString().slice(0, 10)); setType('');
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
    setCalories(0); setDuration(0); setNote(''); setDialogOpen(true);
  }, []);

  const openEdit = useCallback((s: FitnessSession) => {
    setEditId(s.id); setDate(s.date); setType(s.type);
    setExercises(s.exercises.length > 0 ? [...s.exercises] : [{ name: '', sets: 3, reps: 10, weight: 0 }]);
    setCalories(s.calories); setDuration(s.duration); setNote(s.note); setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (editId) {
      const existing = fitnessSessions.find((s) => s.id === editId);
      if (existing) updateFitnessSession({ ...existing, date, type, exercises, calories, duration, note });
    } else {
      addFitnessSession({ id: uuid(), date, type, exercises, calories, duration, note });
    }
    setDialogOpen(false);
  }, [date, type, exercises, calories, duration, note, editId, fitnessSessions, updateFitnessSession, addFitnessSession]);

  const handleDelete = useCallback((id: string) => { deleteFitnessSession(id); setConfirmDeleteId(null); }, [deleteFitnessSession]);

  return (
    <div className="space-y-6">
      <PageHeader title="Fitness" description={`${weekTotal} minutes cette semaine.`}>
        <Button onClick={openNew}><Plus size={16} /> Nouvelle séance</Button>
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState icon={<Dumbbell size={48} />} title="Aucune séance" description="Enregistrez votre première séance d'exercice." action={<Button onClick={openNew}><Plus size={16} /> Ajouter</Button>} />
      ) : (
        <div className="space-y-2">
          {sorted.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm">{s.type || 'Séance'}</h3>
                  <p className="text-xs text-muted-foreground">{format(new Date(s.date + 'T12:00:00'), 'd MMM yyyy', { locale: fr })}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(s)} className="p-1 rounded hover:bg-accent" aria-label="Modifier"><Edit2 size={14} /></button>
                  {confirmDeleteId === s.id ? (
                    <>
                      <button type="button" onClick={() => handleDelete(s.id)} className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-1.5 py-0.5 text-xs border rounded">Non</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmDeleteId(s.id)} className="p-1 rounded hover:bg-destructive/20" aria-label="Supprimer"><Trash2 size={14} className="text-destructive" /></button>
                  )}
                </div>
              </div>
              {s.exercises.length > 0 && (
                <div className="space-y-1 mb-2">
                  {s.exercises.filter((e) => e.name).map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      {e.name} — {e.sets} × {e.reps} {e.weight > 0 ? `@ ${e.weight} kg` : ''}
                    </p>
                  ))}
                </div>
              )}
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{s.duration} min</span>
                {s.calories > 0 && <span>{s.calories} kcal</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier la séance' : 'Nouvelle séance'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="fit-date">Date</Label><Input id="fit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" /></div>
              <div><Label>Type</Label><Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Musculation, Cardio..." className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Durée (min)</Label><Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1" /></div>
              <div><Label>Calories</Label><Input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} className="mt-1" /></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Exercices</Label>
                <Button variant="ghost" size="sm" onClick={addExercise}><Plus size={14} /></Button>
              </div>
              <div className="space-y-2 mt-2">
                {exercises.map((e, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={e.name} onChange={(ev) => updateExercise(idx, 'name', ev.target.value)} placeholder="Nom" className="h-7 text-xs flex-1" />
                    <Input type="number" value={e.sets} onChange={(ev) => updateExercise(idx, 'sets', Number(ev.target.value))} className="h-7 text-xs w-12" placeholder="Séries" />
                    <Input type="number" value={e.reps} onChange={(ev) => updateExercise(idx, 'reps', Number(ev.target.value))} className="h-7 text-xs w-12" placeholder="Rép" />
                    <Input type="number" value={e.weight} onChange={(ev) => updateExercise(idx, 'weight', Number(ev.target.value))} className="h-7 text-xs w-14" placeholder="kg" />
                    <button type="button" onClick={() => removeExercise(idx)} className="text-destructive"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>{editId ? 'Enregistrer' : 'Ajouter'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
