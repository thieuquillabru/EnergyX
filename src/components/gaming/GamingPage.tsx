'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Game, GameStatus } from '@/types';
import { GAME_STATUS_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Gamepad2, Star } from 'lucide-react';

export function GamingPage() {
  const { games, addGame, updateGame, deleteGame } = useApp();
  const [filter, setFilter] = useState<GameStatus | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hoursPlayed, setHoursPlayed] = useState(0);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return games;
    return games.filter((g) => g.status === filter);
  }, [games, filter]);

  const openNew = useCallback(() => {
    setEditId(null); setTitle(''); setPlatform(''); setStatus('playing');
    setHoursPlayed(0); setRating(0); setNotes(''); setDialogOpen(true);
  }, []);

  const openEdit = useCallback((g: Game) => {
    setEditId(g.id); setTitle(g.title); setPlatform(g.platform); setStatus(g.status);
    setHoursPlayed(g.hoursPlayed); setRating(g.rating); setNotes(g.notes); setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    if (editId) {
      const existing = games.find((g) => g.id === editId);
      if (existing) updateGame({ ...existing, title: title.trim(), platform, status, hoursPlayed, rating, notes });
    } else {
      addGame({ id: uuid(), title: title.trim(), platform, status, hoursPlayed, rating, notes });
    }
    setDialogOpen(false);
  }, [title, platform, status, hoursPlayed, rating, notes, editId, games, updateGame, addGame]);

  const handleDelete = useCallback((id: string) => { deleteGame(id); setConfirmDeleteId(null); }, [deleteGame]);

  return (
    <div className="space-y-6">
      <PageHeader title="Jeux" description="Suivez votre ludothèque et temps de jeu.">
        <Button onClick={openNew}><Plus size={16} /> Nouveau jeu</Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter('all')} className={cn('px-3 py-1 rounded-lg text-sm border', filter === 'all' ? 'border-primary bg-primary/10' : 'border-border')}>Tous</button>
        {(Object.entries(GAME_STATUS_LABELS) as [GameStatus, string][]).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} className={cn('px-3 py-1 rounded-lg text-sm border', filter === k ? 'border-primary bg-primary/10' : 'border-border')}>{v}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Gamepad2 size={48} />} title="Aucun jeu" description="Ajoutez un jeu à votre ludothèque." action={<Button onClick={openNew}><Plus size={16} /> Ajouter</Button>} />
      ) : (
        <div className="space-y-2">
          {filtered.map((g) => (
            <div key={g.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{g.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {g.platform && <span>{g.platform}</span>}
                  <span className="px-1.5 py-0.5 rounded bg-secondary">{GAME_STATUS_LABELS[g.status]}</span>
                  <span>{g.hoursPlayed}h</span>
                </div>
                {g.rating > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < g.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(g)} className="p-1 rounded hover:bg-accent" aria-label="Modifier"><Edit2 size={14} /></button>
                {confirmDeleteId === g.id ? (
                  <>
                    <button type="button" onClick={() => handleDelete(g.id)} className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-1.5 py-0.5 text-xs border rounded">Non</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(g.id)} className="p-1 rounded hover:bg-destructive/20" aria-label="Supprimer"><Trash2 size={14} className="text-destructive" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier le jeu' : 'Nouveau jeu'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" /></div>
            <div><Label>Plateforme</Label><Input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="PC, PS5, Switch..." className="mt-1" /></div>
            <div>
              <Label>Statut</Label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(Object.entries(GAME_STATUS_LABELS) as [GameStatus, string][]).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => setStatus(k)} className={cn('px-2 py-1 text-xs rounded border', status === k ? 'border-primary' : 'border-border')}>{v}</button>
                ))}
              </div>
            </div>
            <div><Label>Heures jouées</Label><Input type="number" value={hoursPlayed} onChange={(e) => setHoursPlayed(Number(e.target.value))} className="mt-1" /></div>
            <div>
              <Label>Note : {rating}/5</Label>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setRating(i + 1)}><Star size={20} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} /></button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!title.trim()}>{editId ? 'Enregistrer' : 'Ajouter'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
