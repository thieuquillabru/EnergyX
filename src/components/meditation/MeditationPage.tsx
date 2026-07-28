'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { MeditationType, MeditationSession } from '@/types';
import { MEDITATION_TYPE_LABELS, MEDITATION_TYPE_EMOJIS } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Flower2, Play, Pause, RotateCcw, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TYPES: MeditationType[] = ['zen', 'respiration', 'corps', 'marche', 'mantra', 'visualisation', 'gratitude'];

export function MeditationPage() {
  const { meditationSessions, addMeditationSession, deleteMeditationSession, addXP } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MeditationType>('zen');
  const [duration, setDuration] = useState(10);
  const [note, setNote] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Live timer
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<() => void>(() => {});
  const durationRef = useRef(duration);

  useEffect(() => { durationRef.current = duration; }, [duration]);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 528; osc.type = 'sine'; gain.gain.value = 0.2;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 500);
    } catch { /* */ }
  }, []);

  const onComplete = useCallback(() => {
    playBeep();
    setIsRunning(false);
    addMeditationSession({
      id: uuid(),
      date: new Date().toISOString().slice(0, 10),
      type: selectedType,
      duration: durationRef.current,
      note: '',
    });
    addXP(new Date().toISOString().slice(0, 10), 5);
  }, [addMeditationSession, addXP, playBeep, selectedType]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { onCompleteRef.current(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    if (timeLeft <= 0) setTimeLeft(duration * 60);
    setIsRunning(true);
  }, [timeLeft, duration]);

  const handlePause = useCallback(() => setIsRunning(false), []);

  const handleReset = useCallback(() => { setIsRunning(false); setTimeLeft(duration * 60); }, [duration]);

  const handleAddManual = useCallback(() => {
    addMeditationSession({
      id: uuid(),
      date: new Date().toISOString().slice(0, 10),
      type: selectedType,
      duration,
      note,
    });
    addXP(new Date().toISOString().slice(0, 10), 5);
    setDialogOpen(false);
  }, [selectedType, duration, note, addMeditationSession, addXP]);

  const handleDelete = useCallback((id: string) => { deleteMeditationSession(id); setConfirmDeleteId(null); }, [deleteMeditationSession]);

  const sorted = [...meditationSessions].sort((a, b) => b.date.localeCompare(a.date));
  const totalMin = meditationSessions.reduce((s, e) => s + e.duration, 0);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = duration * 60 > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      <PageHeader title="Méditation" description={`${totalMin} minutes au total.`}>
        <Button onClick={() => setDialogOpen(true)}><Plus size={16} /> Ajouter</Button>
      </PageHeader>

      {/* Type selection */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedType(t)}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors',
              selectedType === t ? 'border-primary bg-primary/10' : 'border-border'
            )}
          >
            <span className="text-2xl">{MEDITATION_TYPE_EMOJIS[t]}</span>
            <span>{MEDITATION_TYPE_LABELS[t]}</span>
          </button>
        ))}
      </div>

      {/* Duration */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-4">
        <div>
          <Label className="text-xs">Durée : {duration} min</Label>
          <input type="range" min="1" max="60" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full mt-1" />
        </div>

        {/* Ring timer */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 80 80)" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleReset} aria-label="Réinitialiser"><RotateCcw size={16} /></Button>
          <Button size="lg" onClick={isRunning ? handlePause : handleStart} className="h-12 w-12 rounded-full">
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <div className="h-10 w-10" />
        </div>
      </div>

      {/* History */}
      {sorted.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Historique</h2>
          {sorted.slice(0, 20).map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <span>{MEDITATION_TYPE_EMOJIS[s.type]}</span>
                <span className="text-sm">{MEDITATION_TYPE_LABELS[s.type]}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(s.date + 'T12:00:00'), 'd MMM', { locale: fr })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{s.duration} min</span>
                {confirmDeleteId === s.id ? (
                  <>
                    <button type="button" onClick={() => handleDelete(s.id)} className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-1.5 py-0.5 text-xs border rounded">Non</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(s.id)} className="text-destructive" aria-label="Supprimer"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <EmptyState icon={<Flower2 size={48} />} title="Aucune session" description="Commencez votre première méditation." />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une session</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setSelectedType(t)} className={cn('px-2 py-1 text-xs rounded border', selectedType === t ? 'border-primary' : 'border-border')}>
                    {MEDITATION_TYPE_EMOJIS[t]} {MEDITATION_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div><Label>Durée (min)</Label><Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddManual}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
