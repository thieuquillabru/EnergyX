'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Skill, SkillResource, ResourceType, PracticeEntry } from '@/types';
import { RESOURCE_TYPE_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { v4 as uuid } from 'uuid';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Award, Check, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function SkillsPage() {
  const { skills, addSkill, updateSkill, deleteSkill } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState(1);
  const [resources, setResources] = useState<SkillResource[]>([]);
  const [practiceLog, setPracticeLog] = useState<PracticeEntry[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const totalHours = useMemo(() => {
    return skills.reduce((sum, s) => sum + s.practiceLog.reduce((p, e) => p + e.duration, 0), 0);
  }, [skills]);

  const openNew = useCallback(() => {
    setEditId(null); setName(''); setLevel(1); setResources([]); setPracticeLog([]); setDialogOpen(true);
  }, []);

  const openEdit = useCallback((s: Skill) => {
    setEditId(s.id); setName(s.name); setLevel(s.level);
    setResources([...s.resources]); setPracticeLog([...s.practiceLog]); setDialogOpen(true);
  }, []);

  const addResource = useCallback(() => {
    setResources((p) => [...p, { id: uuid(), type: 'course' as ResourceType, title: '', url: '', done: false }]);
  }, []);

  const updateResource = useCallback((id: string, field: keyof SkillResource, value: string | boolean) => {
    setResources((p) => p.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const removeResource = useCallback((id: string) => {
    setResources((p) => p.filter((r) => r.id !== id));
  }, []);

  const addPractice = useCallback(() => {
    setPracticeLog((p) => [...p, { id: uuid(), date: format(new Date(), 'yyyy-MM-dd'), duration: 30, note: '' }]);
  }, []);

  const updatePractice = useCallback((id: string, field: keyof PracticeEntry, value: string | number) => {
    setPracticeLog((p) => p.map((e) => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  const removePractice = useCallback((id: string) => {
    setPracticeLog((p) => p.filter((e) => e.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    if (editId) {
      const existing = skills.find((s) => s.id === editId);
      if (existing) updateSkill({ ...existing, name: name.trim(), level, resources, practiceLog });
    } else {
      addSkill({ id: uuid(), name: name.trim(), level, resources, practiceLog });
    }
    setDialogOpen(false);
  }, [name, level, resources, practiceLog, editId, skills, updateSkill, addSkill]);

  const handleDelete = useCallback((id: string) => { deleteSkill(id); setConfirmDeleteId(null); }, [deleteSkill]);

  return (
    <div className="space-y-6">
      <PageHeader title="Compétences" description={`Total : ${totalHours} minutes de pratique.`}>
        <Button onClick={openNew}><Plus size={16} /> Nouvelle compétence</Button>
      </PageHeader>

      {skills.length === 0 ? (
        <EmptyState icon={<Award size={48} />} title="Aucune compétence" description="Ajoutez une compétence à développer." action={<Button onClick={openNew}><Plus size={16} /> Ajouter</Button>} />
      ) : (
        <div className="space-y-3">
          {skills.map((s) => {
            const totalMin = s.practiceLog.reduce((sum, e) => sum + e.duration, 0);
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{s.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Niveau {s.level}/10</span>
                      <span className="text-xs text-muted-foreground">{totalMin} min de pratique</span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={cn('h-1.5 flex-1 rounded-full', i < s.level ? 'bg-primary' : 'bg-secondary')} />
                      ))}
                    </div>
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
                {s.resources.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-medium text-muted-foreground">Ressources</p>
                    {s.resources.map((r) => (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        <Check size={12} className={r.done ? 'text-primary' : 'text-muted-foreground'} />
                        <span className={cn(r.done && 'line-through text-muted-foreground')}>
                          {RESOURCE_TYPE_LABELS[r.type]} : {r.title}
                        </span>
                        {r.url && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Modifier la compétence' : 'Nouvelle compétence'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
            <div>
              <Label>Niveau : {level}/10</Label>
              <input type="range" min="1" max="10" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full mt-1" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Ressources</Label>
                <Button variant="ghost" size="sm" onClick={addResource}><Plus size={14} /></Button>
              </div>
              <div className="space-y-2 mt-2">
                {resources.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 p-2 rounded border border-border">
                    <button type="button" onClick={() => updateResource(r.id, 'done', !r.done)}>
                      <Check size={14} className={r.done ? 'text-primary' : 'text-muted-foreground'} />
                    </button>
                    <select
                      value={r.type}
                      onChange={(e) => updateResource(r.id, 'type', e.target.value)}
                      className="text-xs border border-border rounded px-1 bg-background"
                    >
                      {(Object.entries(RESOURCE_TYPE_LABELS) as [ResourceType, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Titre"
                      value={r.title}
                      onChange={(e) => updateResource(r.id, 'title', e.target.value)}
                      className="h-7 text-xs flex-1"
                    />
                    <button type="button" onClick={() => removeResource(r.id)} className="text-destructive"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Journal de pratique</Label>
                <Button variant="ghost" size="sm" onClick={addPractice}><Plus size={14} /></Button>
              </div>
              <div className="space-y-2 mt-2">
                {practiceLog.map((e) => (
                  <div key={e.id} className="flex items-center gap-2 p-2 rounded border border-border">
                    <Input type="date" value={e.date} onChange={(ev) => updatePractice(e.id, 'date', ev.target.value)} className="h-7 text-xs w-32" />
                    <Input type="number" value={e.duration} onChange={(ev) => updatePractice(e.id, 'duration', Number(ev.target.value))} className="h-7 text-xs w-16" placeholder="min" />
                    <Input value={e.note} onChange={(ev) => updatePractice(e.id, 'note', ev.target.value)} placeholder="Note..." className="h-7 text-xs flex-1" />
                    <button type="button" onClick={() => removePractice(e.id)} className="text-destructive"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>{editId ? 'Enregistrer' : 'Ajouter'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
