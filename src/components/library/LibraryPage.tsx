'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Book, BookStatus } from '@/types';
import { BOOK_STATUS_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Library, Star } from 'lucide-react';

export function LibraryPage() {
  const { books, addBook, updateBook, deleteBook } = useApp();
  const [filter, setFilter] = useState<BookStatus | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('to_read');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return books;
    return books.filter((b) => b.status === filter);
  }, [books, filter]);

  const openNew = useCallback(() => {
    setEditId(null);
    setTitle(''); setAuthor(''); setStatus('to_read');
    setCurrentPage(0); setTotalPages(0); setRating(0); setNotes('');
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((b: Book) => {
    setEditId(b.id);
    setTitle(b.title); setAuthor(b.author); setStatus(b.status);
    setCurrentPage(b.currentPage); setTotalPages(b.totalPages);
    setRating(b.rating); setNotes(b.notes);
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    if (editId) {
      const existing = books.find((b) => b.id === editId);
      if (existing) {
        updateBook({ ...existing, title: title.trim(), author: author.trim(), status, currentPage, totalPages, rating, notes });
      }
    } else {
      addBook({ id: uuid(), title: title.trim(), author: author.trim(), status, currentPage, totalPages, rating, notes });
    }
    setDialogOpen(false);
  }, [title, author, status, currentPage, totalPages, rating, notes, editId, books, updateBook, addBook]);

  const handleDelete = useCallback((id: string) => {
    deleteBook(id);
    setConfirmDeleteId(null);
  }, [deleteBook]);

  return (
    <div className="space-y-6">
      <PageHeader title="Bibliothèque" description="Gérez vos lectures et leur progression.">
        <Button onClick={openNew}><Plus size={16} /> Nouveau livre</Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter('all')} className={cn('px-3 py-1 rounded-lg text-sm border', filter === 'all' ? 'border-primary bg-primary/10' : 'border-border')}>Tous</button>
        {(Object.entries(BOOK_STATUS_LABELS) as [BookStatus, string][]).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} className={cn('px-3 py-1 rounded-lg text-sm border', filter === k ? 'border-primary bg-primary/10' : 'border-border')}>{v}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Library size={48} />} title="Aucun livre" description="Ajoutez un livre à votre bibliothèque." action={<Button onClick={openNew}><Plus size={16} /> Ajouter</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">{b.title}</h3>
                  <p className="text-xs text-muted-foreground">{b.author}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => openEdit(b)} className="p-1 rounded hover:bg-accent" aria-label="Modifier"><Edit2 size={12} /></button>
                  {confirmDeleteId === b.id ? (
                    <>
                      <button type="button" onClick={() => handleDelete(b.id)} className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">Oui</button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-1.5 py-0.5 text-xs border rounded">Non</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmDeleteId(b.id)} className="p-1 rounded hover:bg-destructive/20" aria-label="Supprimer"><Trash2 size={12} className="text-destructive" /></button>
                  )}
                </div>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-secondary">{BOOK_STATUS_LABELS[b.status]}</span>
              {b.totalPages > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{b.currentPage}/{b.totalPages}</span>
                    <span>{Math.round((b.currentPage / b.totalPages) * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((b.currentPage / b.totalPages) * 100, 100)}%` }} />
                  </div>
                </div>
              )}
              {b.rating > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < b.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier le livre' : 'Nouveau livre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" /></div>
            <div><Label>Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1" /></div>
            <div>
              <Label>Statut</Label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(Object.entries(BOOK_STATUS_LABELS) as [BookStatus, string][]).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => setStatus(k)} className={cn('px-2 py-1 text-xs rounded border', status === k ? 'border-primary' : 'border-border')}>{v}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Page actuelle</Label><Input type="number" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="mt-1" /></div>
              <div><Label>Total pages</Label><Input type="number" value={totalPages} onChange={(e) => setTotalPages(Number(e.target.value))} className="mt-1" /></div>
            </div>
            <div>
              <Label>Note : {rating}/5</Label>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setRating(i + 1)}>
                    <Star size={20} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} />
                  </button>
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
