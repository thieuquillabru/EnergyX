'use client';

import { useState, useCallback, useMemo } from 'react';
import type { PassionItem, UserPassion, ThemeId, DomainId, Habit, PassionCategory } from '@/types';
import { DOMAIN_LABELS, PASSION_CATEGORY_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { THEMES, PROPOSED_HABITS } from '@/lib/constants';
import { applyTheme } from '@/lib/theme';
import { searchPassions, getPassionsGrouped } from '@/lib/passionCatalog';
import { v4 as uuid } from 'uuid';
import { PassionPicker } from './PassionPicker';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';

const AVATAR_EMOJIS = ['😀', '🦊', '🐱', '🐶', '🦁', '🐼', '🦄', '🐸', '🦉', '🐙', '🌻', '⭐'];

export function OnboardingFlow() {
  const {
    setProfile,
    addPassion,
    addHabit,
  } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😀');
  const [avatarError, setAvatarError] = useState('');
  const [theme, setTheme] = useState<ThemeId>('midnight');
  const [weekStart, setWeekStart] = useState<'monday' | 'sunday'>('monday');
  const [domains, setDomains] = useState<DomainId[]>([]);
  const [selectedPassions, setSelectedPassions] = useState<UserPassion[]>([]);
  const [selectedHabitIds, setSelectedHabitIds] = useState<Set<string>>(new Set());

  const steps = 5;

  const handleAvatarFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Le fichier doit être une image.');
      return;
    }
    if (file.size > 400 * 1024) {
      setAvatarError('L\'image ne doit pas dépasser 400 Ko.');
      return;
    }

    setAvatarError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleThemeChange = useCallback((t: ThemeId) => {
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggleDomain = useCallback((d: DomainId) => {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }, []);

  const togglePassion = useCallback((p: PassionItem) => {
    setSelectedPassions((prev) => {
      const exists = prev.find((x) => x.id === p.id);
      if (exists) return prev.filter((x) => x.id !== p.id);
      return [...prev, { id: p.id, name: p.name, emoji: p.emoji, category: p.category }];
    });
  }, []);

  const addCustomPassion = useCallback((pName: string) => {
    const trimmed = pName.trim();
    if (!trimmed) return;
    const id = `custom-${Date.now()}`;
    setSelectedPassions((prev) => [...prev, { id, name: trimmed, emoji: '⭐', category: 'other' }]);
  }, []);

  const toggleHabitSelection = useCallback((id: string) => {
    setSelectedHabitIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Filter habits by selected passion categories
  const filteredHabits = useMemo(() => {
    if (selectedPassions.length === 0) return PROPOSED_HABITS;
    const passionCats = new Set(selectedPassions.map((p) => p.category));
    return PROPOSED_HABITS.filter(
      (h) => h.categories.length === 0 || h.categories.some((c) => passionCats.has(c as PassionCategory))
    );
  }, [selectedPassions]);

  const handleFinish = useCallback(() => {
    setProfile({
      name: name.trim() || 'Utilisateur',
      avatar,
      theme,
      weekStart,
      domains,
      isOnboarded: true,
    });

    selectedPassions.forEach((p) => addPassion(p));

    selectedHabitIds.forEach((id) => {
      const tmpl = PROPOSED_HABITS.find((h) => h.name === id);
      if (tmpl) {
        const habit: Habit = {
          id: uuid(),
          name: tmpl.name,
          icon: tmpl.icon,
          color: tmpl.color,
          category: 'personnel',
          reminderTime: null,
          completions: [],
        };
        addHabit(habit);
      }
    });
  }, [name, avatar, theme, weekStart, domains, selectedPassions, selectedHabitIds, setProfile, addPassion, addHabit]);

  const handleSkip = useCallback(() => {
    setProfile({
      name: name.trim() || 'Utilisateur',
      avatar: '😀',
      theme,
      weekStart,
      domains,
      isOnboarded: true,
    });
  }, [name, theme, weekStart, domains, setProfile]);

  const canNext = step === 1 ? name.trim().length > 0 : true;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Étape {step} sur {steps}</span>
            <span>{Math.round((step / steps) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step / steps) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Comment vous appelez-vous ?</h2>
              <p className="text-sm text-muted-foreground">Ce nom sera utilisé pour vous saluer chaque jour.</p>
              <div>
                <Label htmlFor="onb-name">Nom d&apos;utilisateur</Label>
                <Input
                  id="onb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom..."
                  autoFocus
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Avatar */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Choisissez votre avatar</h2>
              <p className="text-sm text-muted-foreground">Importez une photo ou choisissez un emoji.</p>

              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-4xl">
                  {avatar.startsWith('data:') ? (
                    <img src={avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    avatar
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="avatar-file">Importer une photo (max 400 Ko)</Label>
                <Input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="mt-1"
                />
                {avatarError && <p className="text-xs text-destructive mt-1">{avatarError}</p>}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Ou choisissez un emoji :</p>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => { setAvatar(e); setAvatarError(''); }}
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center text-xl transition-colors',
                        avatar === e ? 'bg-primary ring-2 ring-primary' : 'bg-secondary hover:bg-accent'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Préférences</h2>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Thème</p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(THEMES).map(([id, t]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleThemeChange(id as ThemeId)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors text-xs',
                        theme === id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Début de semaine</p>
                <div className="flex gap-2">
                  {(['monday', 'sunday'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setWeekStart(d)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm transition-colors',
                        weekStart === d ? 'border-primary bg-primary/10' : 'border-border'
                      )}
                    >
                      {d === 'monday' ? 'Lundi' : 'Dimanche'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Domaines de progression</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DOMAIN_LABELS).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleDomain(id as DomainId)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                        domains.includes(id as DomainId)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Passions */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Vos passions</h2>
              <p className="text-sm text-muted-foreground">Sélectionnez vos centres d&apos;intérêt.</p>
              <PassionPicker
                selectedPassions={selectedPassions}
                onToggle={togglePassion}
                onAddCustom={addCustomPassion}
              />
            </div>
          )}

          {/* Step 5: Habits */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Premières habitudes</h2>
              <p className="text-sm text-muted-foreground">
                Choisissez les habitudes que vous souhaitez suivre.
                {filteredHabits.length < PROPOSED_HABITS.length && (
                  <span className="block mt-1 text-primary">
                    {filteredHabits.length} habitudes affichées selon vos passions.
                  </span>
                )}
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {filteredHabits.map((h) => {
                  const key = h.name;
                  const isSelected = selectedHabitIds.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleHabitSelection(key)}
                      className={cn(
                        'flex w-full items-center gap-3 p-3 rounded-lg border transition-colors text-left',
                        isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-xl">{h.icon}</span>
                      <span className="flex-1 text-sm">{h.name}</span>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div>
              {step > 1 && (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  Retour
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step < steps ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                  Suivant
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleFinish}>
                  Terminer
                </Button>
              )}
            </div>
          </div>

          {step < steps && (
            <button
              type="button"
              onClick={handleSkip}
              className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Passer la configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
