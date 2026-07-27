'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function ProfilePage() {
  const { currentTheme, user, updateUser, passions, addPassion, deletePassion, habits, goals, journalEntries } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassionModalOpen, setIsPassionModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name });
  const [passionForm, setPassionForm] = useState({ name: '', icon: '⭐', category: 'other' as any, color: currentTheme.primary });

  const xpNeeded = user.stats.level * 100;
  const xpProgress = (user.stats.xp / xpNeeded) * 100;

  const totalCompletions = habits.reduce((acc, h) => acc + h.completions.filter(c => c.completed).length, 0);
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const journalDays = [...new Set(journalEntries.map(e => e.date))].length;

  const handleSaveProfile = () => {
    updateUser({ name: editForm.name });
    setIsEditModalOpen(false);
  };

  const handleAddPassion = () => {
    if (!passionForm.name.trim()) return;
    addPassion({
      id: Date.now().toString(),
      name: passionForm.name,
      icon: passionForm.icon,
      color: passionForm.color,
      category: passionForm.category,
      trackingEnabled: true,
      goals: [],
    });
    setPassionForm({ name: '', icon: '⭐', category: 'other', color: currentTheme.primary });
    setIsPassionModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>👤 Profil</h1>
        <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Votre espace personnel</p>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: currentTheme.primary }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ color: currentTheme.text }}>{user.name}</h2>
            <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
              Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary" size="lg">⭐ Niveau {user.stats.level}</Badge>
              <Badge variant="secondary" size="lg">🔥 {user.stats.currentStreak} jours</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => { setEditForm({ name: user.name }); setIsEditModalOpen(true); }}>
            Modifier
          </Button>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: currentTheme.textSecondary }}>Progression vers le niveau {user.stats.level + 1}</span>
            <span style={{ color: currentTheme.text }}>{user.stats.xp} / {xpNeeded} XP</span>
          </div>
          <ProgressBar value={xpProgress} size="lg" />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{user.stats.level}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Niveau</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{totalCompletions}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Habitudes complétées</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.warning }}>{activeGoals}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Objectifs actifs</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{journalDays}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Jours de journal</p>
        </Card>
      </div>

      {/* Passions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: currentTheme.text }}>🎯 Mes Passions</h3>
          <Button size="sm" onClick={() => setIsPassionModalOpen(true)}>+ Ajouter</Button>
        </div>
        {passions.length === 0 ? (
          <p className="text-center py-4" style={{ color: currentTheme.textSecondary }}>
            Aucune passion définie. Ajoutez vos passions pour les suivre!
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {passions.map((passion) => (
              <div key={passion.id} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${passion.color}20` }}>
                <span className="text-xl">{passion.icon}</span>
                <span style={{ color: currentTheme.text }}>{passion.name}</span>
                <button onClick={() => deletePassion(passion.id)} className="ml-2 opacity-50 hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Achievements Preview */}
      <Card>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.text }}>🏆 Succès</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎯', label: 'Premier pas', desc: 'Compléter 1 habitude' },
            { icon: '🔥', label: 'En feu!', desc: '7 jours consécutifs' },
            { icon: '📚', label: 'Lecteur', desc: 'Lire 30 min/jour' },
            { icon: '🧘', label: 'Zen', desc: 'Médité 10 fois' },
          ].map((achievement, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: currentTheme.background }}>
              <span className="text-4xl">{achievement.icon}</span>
              <p className="font-medium mt-2" style={{ color: currentTheme.text }}>{achievement.label}</p>
              <p className="text-xs" style={{ color: currentTheme.textSecondary }}>{achievement.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le profil" size="sm">
        <div className="space-y-4">
          <Input label="Nom" value={editForm.name} onChange={(e) => setEditForm({ name: e.target.value })} />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleSaveProfile} className="flex-1">Enregistrer</Button>
          </div>
        </div>
      </Modal>

      {/* Passion Modal */}
      <Modal isOpen={isPassionModalOpen} onClose={() => setIsPassionModalOpen(false)} title="Nouvelle passion" size="sm">
        <div className="space-y-4">
          <Input label="Nom de la passion" value={passionForm.name} onChange={(e) => setPassionForm({ ...passionForm, name: e.target.value })} placeholder="Ex: Lecture, Gaming..." />
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Icône</label>
            <div className="flex flex-wrap gap-2">
              {['⭐', '📚', '🎮', '⚽', '🎵', '🎨', '🍳', '💻', '🌍', '📷'].map((emoji) => (
                <button key={emoji} onClick={() => setPassionForm({ ...passionForm, icon: emoji })} className="w-10 h-10 rounded-lg text-xl flex items-center justify-center" style={{ backgroundColor: passionForm.icon === emoji ? currentTheme.primary : currentTheme.background }}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsPassionModalOpen(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleAddPassion} className="flex-1">Ajouter</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
