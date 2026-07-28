'use client';

import { useState, useMemo, useCallback } from 'react';
import type { JournalEntry, MoodLevel } from '@/types';
import { MOOD_LABELS, MOOD_EMOJIS } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToday, formatDateFull } from '@/hooks/useToday';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ViewMode = 'today' | 'calendar' | 'list';

export function JournalPage() {
  const { journal, upsertJournalEntry, deleteJournalEntry } = useApp();
  const today = useToday();
  const [view, setView] = useState<ViewMode>('today');

  const currentEntry = useMemo(() => {
    if (!today) return null;
    return journal.find((j) => j.date === today) || null;
  }, [journal, today]);

  const sortedEntries = useMemo(() => {
    return [...journal].sort((a, b) => b.date.localeCompare(a.date));
  }, [journal]);

  const sorted = useMemo(() => {
    const months: Record<string, JournalEntry[]> = {};
    sortedEntries.forEach((e) => {
      const m = e.date.slice(0, 7);
      if (!months[m]) months[m] = [];
      months[m].push(e);
    });
    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
  }, [sortedEntries]);

  if (!today) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Journal" description="Notez vos pensées et votre humeur quotidiennement.">
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {(['today', 'calendar', 'list'] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1 rounded-md text-xs transition-colors',
                view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {v === 'today' ? "Aujourd'hui" : v === 'calendar' ? 'Calendrier' : 'Liste'}
            </button>
          ))}
        </div>
      </PageHeader>

      {view === 'today' && <TodayForm />}
      {view === 'list' && <ListView entries={sortedEntries} />}
      {view === 'calendar' && <CalendarView entries={sortedEntries} />}
    </div>
  );
}

function TodayForm() {
  const { journal, upsertJournalEntry } = useApp();
  const today = useToday();

  const entry = useMemo(() => {
    if (!today) return null;
    return journal.find((j) => j.date === today) || null;
  }, [journal, today]);

  const [mood, setMood] = useState<MoodLevel | null>(entry?.mood ?? null);
  const [gratitudes, setGratitudes] = useState<string[]>(entry?.gratitudes ?? []);
  const [newGratitude, setNewGratitude] = useState('');
  const [energy, setEnergy] = useState(entry?.energy ?? 5);
  const [sleep, setSleep] = useState(entry?.sleep ?? 7);
  const [water, setWater] = useState(entry?.water ?? 0);
  const [exercise, setExercise] = useState(entry?.exercise ?? 0);
  const [note, setNote] = useState(entry?.note ?? '');
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [newTag, setNewTag] = useState('');

  const handleAddGratitude = useCallback(() => {
    if (!newGratitude.trim()) return;
    setGratitudes((p) => [...p, newGratitude.trim()]);
    setNewGratitude('');
  }, [newGratitude]);

  const handleRemoveGratitude = useCallback((i: number) => {
    setGratitudes((p) => p.filter((_, idx) => idx !== i));
  }, []);

  const handleAddTag = useCallback(() => {
    if (!newTag.trim()) return;
    setTags((p) => [...p, newTag.trim()]);
    setNewTag('');
  }, [newTag]);

  const handleRemoveTag = useCallback((t: string) => {
    setTags((p) => p.filter((x) => x !== t));
  }, []);

  const handleSave = useCallback(() => {
    if (!today) return;
    const e: JournalEntry = {
      id: entry?.id || uuid(),
      date: today,
      mood,
      gratitudes,
      energy,
      sleep,
      water,
      exercise,
      note,
      tags,
    };
    upsertJournalEntry(e);
  }, [today, entry, mood, gratitudes, energy, sleep, water, exercise, note, tags, upsertJournalEntry]);

  if (!today) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-6">
      {/* Mood */}
      <div>
        <Label className="text-sm font-medium">Humeur</Label>
        <div className="flex gap-2 mt-2">
          {([1, 2, 3, 4, 5] as MoodLevel[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m === mood ? null : m)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors min-w-[60px]',
                mood === m ? 'border-primary bg-primary/10' : 'border-border'
              )}
            >
              <span className="text-2xl">{MOOD_EMOJIS[m]}</span>
              <span className="text-xs">{MOOD_LABELS[m]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gratitudes */}
      <div>
        <Label className="text-sm font-medium">Gratitudes</Label>
        <div className="space-y-1 mt-2">
          {gratitudes.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex-1 text-sm">{g}</span>
              <button type="button" onClick={() => handleRemoveGratitude(i)} className="text-destructive"><X size={14} /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une gratitude..."
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGratitude()}
            />
            <Button variant="outline" size="sm" onClick={handleAddGratitude}><Plus size={14} /></Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs">Énergie ({energy}/10)</Label>
          <input type="range" min="0" max="10" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <Label className="text-xs">Sommeil ({sleep}h)</Label>
          <input type="range" min="0" max="14" step="0.5" value={sleep} onChange={(e) => setSleep(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <Label className="text-xs">Eau ({water} verres)</Label>
          <input type="range" min="0" max="15" value={water} onChange={(e) => setWater(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <Label className="text-xs">Exercice ({exercise} min)</Label>
          <input type="range" min="0" max="180" step="5" value={exercise} onChange={(e) => setExercise(Number(e.target.value))} className="w-full mt-1" />
        </div>
      </div>

      {/* Note */}
      <div>
        <Label className="text-sm font-medium">Notes</Label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full mt-1 rounded-lg border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Quoi de neuf aujourd'hui..."
        />
      </div>

      {/* Tags */}
      <div>
        <Label className="text-sm font-medium">Tags</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs">
              {t}
              <button type="button" onClick={() => handleRemoveTag(t)}><X size={10} /></button>
            </span>
          ))}
          <div className="flex gap-1">
            <Input
              placeholder="Nouveau tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="w-32"
            />
            <Button variant="outline" size="sm" onClick={handleAddTag}><Plus size={14} /></Button>
          </div>
        </div>
      </div>

      <Button onClick={handleSave}>Enregistrer</Button>
    </div>
  );
}

function ListView({ entries }: { entries: JournalEntry[] }) {
  const { deleteJournalEntry } = useApp();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={48} />}
        title="Aucune entrée"
        description="Commencez à écrire votre journal."
      />
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div key={e.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium">{formatDateFull(e.date)}</p>
              {e.mood && (
                <span className="text-lg ml-1">{MOOD_EMOJIS[e.mood]} {MOOD_LABELS[e.mood]}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => deleteJournalEntry(e.id)}
              className="text-destructive p-1"
              aria-label="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {e.note && <p className="text-sm text-muted-foreground line-clamp-3">{e.note}</p>}
          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
            {e.energy > 0 && <span>⚡ {e.energy}/10</span>}
            {e.sleep > 0 && <span>💤 {e.sleep}h</span>}
            {e.exercise > 0 && <span>🏃 {e.exercise} min</span>}
          </div>
          {e.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {e.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-secondary text-xs">{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CalendarView({ entries }: { entries: JournalEntry[] }) {
  const dates = new Set(entries.map((e) => e.date));

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground mb-3">
        {entries.length} entrée{entries.length > 1 ? 's' : ''} dans le journal
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => (
          <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const base = new Date();
          const startOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
          const offset = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
          const day = i - offset + 1;
          const dateStr = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          if (day < 1 || day > 30) return <div key={i} />;

          const hasEntry = dates.has(dateStr);
          return (
            <div
              key={i}
              className={cn(
                'h-8 w-8 rounded flex items-center justify-center text-xs mx-auto',
                hasEntry ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
