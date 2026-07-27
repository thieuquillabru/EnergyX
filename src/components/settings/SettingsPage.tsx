'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function SettingsPage() {
  const { currentTheme, themes, setCurrentTheme, addCustomTheme, user, updateUser, exportData, importData, resetData } = useApp();
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [themeForm, setThemeForm] = useState({
    name: '',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  });

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energyx-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (importData(content)) {
            alert('Données importées avec succès!');
          } else {
            alert('Erreur lors de l\'importation des données.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCreateTheme = () => {
    if (!themeForm.name.trim()) return;
    addCustomTheme({
      id: Date.now().toString(),
      ...themeForm,
    });
    setShowThemeCustomizer(false);
    setThemeForm({ name: '', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#22d3ee', background: '#f0f9ff', surface: '#ffffff', text: '#0f172a', textSecondary: '#64748b', border: '#e2e8f0', success: '#10b981', warning: '#f59e0b', error: '#ef4444' });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>⚙️ Paramètres</h1>
        <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Personnalisez votre expérience</p>
      </div>

      {/* Themes */}
      <Card>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.text }}>🎨 Thèmes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setCurrentTheme(theme.id)}
              className="p-4 rounded-xl text-left transition-all hover:scale-105"
              style={{
                backgroundColor: currentTheme.id === theme.id ? `${theme.primary}20` : theme.surface,
                border: currentTheme.id === theme.id ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
              }}
            >
              <div className="flex gap-1 mb-3">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }} />
              </div>
              <p className="font-medium" style={{ color: theme.text }}>{theme.name}</p>
              {currentTheme.id === theme.id && <Badge size="sm" variant="primary" className="mt-2">Actif</Badge>}
            </button>
          ))}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => setShowThemeCustomizer(true)}>
          + Créer un thème personnalisé
        </Button>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.text }}>🔔 Notifications</h3>
        <div className="space-y-4">
          {Object.entries(user.preferences.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span style={{ color: currentTheme.text }}>
                {key === 'habits' ? 'Rappels d\'habitudes' :
                 key === 'goals' ? 'Notifications d\'objectifs' :
                 key === 'pomodoro' ? 'Minuteur Pomodoro' :
                 key === 'journal' ? 'Rappels de journal' :
                 key === 'motivation' ? 'Citations motivantes' :
                 key === 'water' ? "Rappels d'hydratation" :
                 key === 'exercise' ? "Rappels d'exercice" : key}
              </span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateUser({
                  preferences: {
                    ...user.preferences,
                    notifications: { ...user.preferences.notifications, [key]: e.target.checked }
                  }
                })}
                className="w-5 h-5 rounded"
                style={{ accentColor: currentTheme.primary }}
              />
            </label>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.text }}>💾 Gestion des données</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: currentTheme.text }}>Exporter les données</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Téléchargez une sauvegarde de toutes vos données</p>
            </div>
            <Button variant="outline" onClick={handleExport}>Exporter</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: currentTheme.text }}>Importer des données</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Restorez vos données depuis un fichier</p>
            </div>
            <Button variant="outline" onClick={handleImport}>Importer</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: currentTheme.error }}>Réinitialiser toutes les données</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Supprimez définitivement toutes vos données</p>
            </div>
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>Réinitialiser</Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.text }}>ℹ️ À propos</h3>
        <div className="space-y-2" style={{ color: currentTheme.textSecondary }}>
          <p><strong>EnergyX</strong> - Application de Développement Personnel</p>
          <p>Version 1.0.0</p>
          <p>Une application complète pour votre croissance personnelle, mentale et physique.</p>
        </div>
      </Card>

      {/* Theme Customizer Modal */}
      <Modal isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} title="Créer un thème" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Nom du thème</label>
              <input value={themeForm.name} onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Primaire</label>
              <input type="color" value={themeForm.primary} onChange={(e) => setThemeForm({ ...themeForm, primary: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Secondaire</label>
              <input type="color" value={themeForm.secondary} onChange={(e) => setThemeForm({ ...themeForm, secondary: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Accent</label>
              <input type="color" value={themeForm.accent} onChange={(e) => setThemeForm({ ...themeForm, accent: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Succès</label>
              <input type="color" value={themeForm.success} onChange={(e) => setThemeForm({ ...themeForm, success: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Avertissement</label>
              <input type="color" value={themeForm.warning} onChange={(e) => setThemeForm({ ...themeForm, warning: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: themeForm.background }}>
            <p style={{ color: themeForm.text }} className="font-bold">Aperçu</p>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: themeForm.primary }}>Primaire</button>
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: themeForm.secondary }}>Secondaire</button>
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: themeForm.success }}>Succès</button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowThemeCustomizer(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleCreateTheme} className="flex-1">Créer</Button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="⚠️ Confirmer la réinitialisation" size="sm">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="mb-4" style={{ color: currentTheme.text }}>
            Êtes-vous sûr de vouloir supprimer toutes vos données? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowResetConfirm(false)} className="flex-1">Annuler</Button>
            <Button variant="danger" onClick={() => { resetData(); setShowResetConfirm(false); }} className="flex-1">Réinitialiser</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
