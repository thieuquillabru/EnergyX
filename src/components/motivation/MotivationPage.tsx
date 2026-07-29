'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Challenge } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { QUOTES } from '@/lib/constants';
import { useToday } from '@/hooks/useToday';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Heart, Sparkles } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';

export function MotivationPage() {
  const { favoriteQuotes, toggleFavoriteQuote, challenges, addChallenge, updateChallenge, deleteChallenge } = useApp();
  const today = useToday();

  // Quote of the day
  const quoteOfDay = useMemo(() => {
    if (!today) return QUOTES[0];
    const dayOfYear = Math.floor(
      (new Date(today + 'T12:00:00').getTime() - new Date(new Date(today + 'T12:00:00').getFullYear(), 0, 1).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, [today]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeDuration, setChallengeDuration] = useState(30);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAddChallenge = useCallback(() => {
    if (!challengeTitle.trim()) return;
    addChallenge({
      id: uuid(),
      title: challengeTitle.trim(),
      description: challengeDesc.trim(),
      duration: challengeDuration,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      completed: false,
    });
    setChallengeTitle(''); setChallengeDesc(''); setChallengeDuration(30); setDialogOpen(false);
  }, [challengeTitle, challengeDesc, challengeDuration, addChallenge]);

  const toggleChallengeDone = useCallback((c: Challenge) => {
    updateChallenge({ ...c, completed: !c.completed });
  }, [updateChallenge]);

  return (
    <div className="space-y-6">
      <PageHeader title="Motivation" description="Citations inspirantes et défis personnels.">
        <Button onClick={() => setDialogOpen(true)}><Plus size={16} /> Nouveau défi</Button>
      </PageHeader>

      {/* Quote of the day */}
      <div className="rounded-xl border border-primary/30 bg-card p-6 text-center space-y-2">
        <Sparkles className="mx-auto text-primary" size={24} />
        <p className="text-lg italic">&ldquo;{quoteOfDay.text}&rdquo;</p>
        <p className="text-sm text-muted-foreground">— {quoteOfDay.author}</p>
      </div>

      {/* All quotes */}
      <div className="space-y-3">
        <h2 className="font-semibold">Citations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUOTES.map((q) => {
            const isFav = favoriteQuotes.includes(q.id);
            return (
              <div key={q.id} className={cn('rounded-xl border bg-card p-4 space-y-1', isFav ? 'border-primary/30' : 'border-border')}>
                <p className="text-sm italic">&ldquo;{q.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">— {q.author}</span>
                  <button type="button" onClick={() => toggleFavoriteQuote(q.id)} className={cn('p-1 rounded', isFav ? 'text-primary' : 'text-muted-foreground hover:text-primary')} aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                    <Heart size={14} className={isFav ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-3">
        <h2 className="font-semibold">Défis</h2>
        {challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun défi en cours. Lancez-vous !</p>
        ) : (
          <div className="space-y-2">
            {challenges.map((c) => (
              <div key={c.id} className={cn('rounded-xl border border-border bg-card p-4 flex items-center gap-3', c.completed && 'border-primary/30')}>
                <button type="button" onClick={() => toggleChallengeDone(c)} className="shrink-0">
                  <div className={cn('h-5 w-5 rounded border-2 flex items-center justify-center', c.completed ? 'bg-primary border-primary' : 'border-border')}>
                    {c.completed && <span className="text-primary-foreground text-xs">✓</span>}
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={cn('text-sm font-medium', c.completed && 'line-through text-muted-foreground')}>{c.title}</h3>
                  {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{c.duration} jours {c.startDate && `(commencé le ${c.startDate})`}</p>
                </div>
                <button type="button" onClick={() => setConfirmDeleteId(c.id)} className="text-destructive shrink-0" aria-label="Supprimer"><Trash2 size={14} /></button>
                {confirmDeleteId === c.id && (
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => { deleteChallenge(c.id); setConfirmDeleteId(null); }} className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-2 py-1 text-xs border border-border rounded">Non</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau défi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Titre</Label><Input value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} className="mt-1" /></div>
            <div><Label>Description</Label><Input value={challengeDesc} onChange={(e) => setChallengeDesc(e.target.value)} className="mt-1" /></div>
            <div><Label>Durée (jours)</Label><Input type="number" value={challengeDuration} onChange={(e) => setChallengeDuration(Number(e.target.value))} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddChallenge} disabled={!challengeTitle.trim()}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
