'use client';

import { useState, useCallback, useRef } from 'react';
import type { ThemeId } from '@/types';
import { useApp } from '@/context/AppContext';
import { THEMES } from '@/lib/constants';
import { applyTheme } from '@/lib/theme';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download, Upload, RotateCcw, ArrowRight } from 'lucide-react';

export function SettingsPage() {
  const { profile, exportData, importData, resetAll, setProfile } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [importResult, setImportResult] = useState<'success' | 'error' | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customThemeVars, setCustomThemeVars] = useState<Record<string, string>>({});

  const handleExport = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energyx-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const success = importData(reader.result);
      setImportResult(success ? 'success' : 'error');
      setTimeout(() => setImportResult(null), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [importData]);

  const handleReset = useCallback(() => {
    resetAll();
    setConfirmReset(false);
  }, [resetAll]);

  const handleRestartOnboarding = useCallback(() => {
    setProfile({ ...profile!, isOnboarded: false });
    setConfirmRestart(false);
  }, [profile, setProfile]);

  const handleThemeChange = useCallback((t: ThemeId) => {
    if (t === 'custom') return;
    applyTheme(t);
    if (profile) setProfile({ ...profile, theme: t });
  }, [profile, setProfile]);

  const handleApplyCustomTheme = useCallback(() => {
    const root = document.documentElement;
    Object.entries(customThemeVars).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
    if (profile) setProfile({ ...profile, theme: 'custom' });
  }, [customThemeVars, profile, setProfile]);

  return (
    <div className="space-y-6">
      <PageHeader title="Paramètres" description="Personnalisez votre expérience EnergyX." />

      {/* Themes */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Thème</h2>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(THEMES).map(([id, t]) => (
            <button
              key={id}
              type="button"
              onClick={() => id !== 'custom' && handleThemeChange(id as ThemeId)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors text-xs',
                profile?.theme === id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              )}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Custom theme creator */}
        <div className="space-y-2 mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium">Créateur de thème personnalisé</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: '--background', label: 'Arrière-plan' },
              { key: '--foreground', label: 'Texte' },
              { key: '--primary', label: 'Primaire' },
              { key: '--card', label: 'Carte' },
              { key: '--border', label: 'Bordure' },
              { key: '--muted', label: 'Gris clair' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs">{label}</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customThemeVars[key] || '#0f172a'}
                    onChange={(e) => setCustomThemeVars((p) => ({ ...p, [key]: e.target.value }))}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <Input
                    value={customThemeVars[key] || ''}
                    onChange={(e) => setCustomThemeVars((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={key}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" onClick={handleApplyCustomTheme}>
            Appliquer le thème personnalisé
          </Button>
        </div>
      </div>

      {/* Export / Import */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Données</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} /> Exporter (JSON)
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Importer
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          {importResult === 'success' && <span className="text-sm text-primary self-center">Import réussi !</span>}
          {importResult === 'error' && <span className="text-sm text-destructive self-center">Erreur lors de l&apos;import.</span>}
        </div>
      </div>

      {/* Reset */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-semibold">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setConfirmRestart(true)}>
            <ArrowRight size={16} /> Relancer l&apos;onboarding
          </Button>
          <Button variant="destructive" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={16} /> Réinitialiser tout
          </Button>
        </div>
      </div>

      {/* Confirm dialogs */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl border border-border bg-card p-6 max-w-sm mx-4 space-y-4">
            <h3 className="font-semibold">Réinitialiser tout ?</h3>
            <p className="text-sm text-muted-foreground">
              Toutes vos données seront supprimées définitivement. Cette action est irréversible.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleReset}>Réinitialiser</Button>
            </div>
          </div>
        </div>
      )}

      {confirmRestart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl border border-border bg-card p-6 max-w-sm mx-4 space-y-4">
            <h3 className="font-semibold">Relancer l&apos;onboarding ?</h3>
            <p className="text-sm text-muted-foreground">
              Vous passerez par l&apos;assistant de configuration. Vos données existantes seront conservées.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setConfirmRestart(false)}>Annuler</Button>
              <Button onClick={handleRestartOnboarding}>Continuer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
