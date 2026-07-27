'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useToday } from '@/hooks/useToday';
import { JournalEntry, Mood } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function JournalPage() {
  const { currentTheme, journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, moodHistory, addMoodEntry } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'calendar' | 'list'>('today');

  // Resolved on the client only, so server and client markup stay identical
  const today = useToday();

  // Form state
  const [formData, setFormData] = useState({
    content: '',
    mood: 'okay' as Mood,
    gratitude: ['', '', ''],
    energy: 5,
    sleep: 7,
    water: 0,
    exercise: 0,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const moods: { value: Mood; label: string; emoji: string; color: string }[] = [
    { value: 'excellent', label: 'Excellent', emoji: '😄', color: currentTheme.success },
    { value: 'good', label: 'Bien', emoji: '🙂', color: currentTheme.primary },
    { value: 'okay', label: 'Correct', emoji: '😐', color: currentTheme.warning },
    { value: 'bad', label: 'Mauvais', emoji: '😔', color: '#f97316' },
    { value: 'terrible', label: 'Terrible', emoji: '😢', color: currentTheme.error },
  ];

  // Get today's entry
  const todayEntry = useMemo(() => {
    return journalEntries.find(e => e.date === today);
  }, [journalEntries, today]);

  // Pre-fill the form from today's saved entry so editing never wipes it.
  // Adjusting state during render (rather than in an effect) is the pattern
  // React recommends for deriving state from props/context changes.
  const [loadedEntryId, setLoadedEntryId] = useState<string | null>(null);
  if (todayEntry && todayEntry.id !== loadedEntryId) {
    setLoadedEntryId(todayEntry.id);
    setFormData({
      content: todayEntry.content ?? '',
      mood: todayEntry.mood ?? 'okay',
      gratitude: [
        todayEntry.gratitude?.[0] ?? '',
        todayEntry.gratitude?.[1] ?? '',
        todayEntry.gratitude?.[2] ?? '',
      ],
      energy: todayEntry.energy ?? 5,
      sleep: todayEntry.sleep ?? 7,
      water: todayEntry.water ?? 0,
      exercise: todayEntry.exercise ?? 0,
      tags: todayEntry.tags ?? [],
    });
  }

  const handleSubmit = () => {
    if (!today) return;
    const entry: JournalEntry = {
      id: todayEntry?.id || Date.now().toString(),
      date: today,
      content: formData.content,
      mood: formData.mood,
      tags: formData.tags.filter(t => t.trim()),
      gratitude: formData.gratitude.filter(g => g.trim()),
      energy: formData.energy,
      sleep: formData.sleep,
      water: formData.water,
      exercise: formData.exercise,
    };

    if (todayEntry) {
      updateJournalEntry(todayEntry.id, entry);
    } else {
      addJournalEntry(entry);
    }

    // Also add mood entry
    addMoodEntry({
      date: today,
      mood: formData.mood,
    });

    setIsModalOpen(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Recent entries
  const recentEntries = useMemo(() => {
    return journalEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [journalEntries]);

  // Mood chart data
  const moodChartData = useMemo(() => {
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const mood = moodHistory.find(m => m.date === dateStr);
      last30Days.push({
        date: dateStr,
        mood: mood?.mood || null,
        day: date.getDate(),
      });
    }
    return last30Days;
  }, [moodHistory]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>Journal 📔</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Reflectez sur votre journée et suivez votre bien-être
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PenIcon />}>
          {todayEntry ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        {[
          { id: 'today', label: 'Aujourd\'hui' },
          { id: 'calendar', label: 'Calendrier' },
          { id: 'list', label: 'Liste' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setViewMode(view.id as 'today' | 'calendar' | 'list')}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: viewMode === view.id ? currentTheme.primary : currentTheme.background,
              color: viewMode === view.id ? 'white' : currentTheme.text,
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Today's View */}
      {viewMode === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Selector */}
          <Card>
            <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Humeur du jour</h3>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setFormData({ ...formData, mood: m.value })}
                  className="p-3 rounded-xl text-center transition-all hover:scale-105"
                  style={{
                    backgroundColor: formData.mood === m.value ? `${m.color}20` : currentTheme.background,
                    border: formData.mood === m.value ? `2px solid ${m.color}` : '2px solid transparent',
                  }}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <p className="text-xs mt-1" style={{ color: currentTheme.textSecondary }}>{m.label}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Indicateurs</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: currentTheme.textSecondary }}>Énergie</span>
                  <span style={{ color: currentTheme.text }}>{formData.energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: currentTheme.primary }}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: currentTheme.textSecondary }}>Sommeil</span>
                  <span style={{ color: currentTheme.text }}>{formData.sleep}h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={formData.sleep}
                  onChange={(e) => setFormData({ ...formData, sleep: parseFloat(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: currentTheme.secondary }}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Eau (verres)</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => setFormData({ ...formData, water: Math.max(0, formData.water - 1) })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.background }}
                    >
                      -
                    </button>
                    <span className="font-bold text-lg w-8 text-center" style={{ color: currentTheme.primary }}>
                      {formData.water}
                    </span>
                    <button
                      onClick={() => setFormData({ ...formData, water: formData.water + 1 })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.background }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Exercice (min)</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => setFormData({ ...formData, exercise: Math.max(0, formData.exercise - 10) })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.background }}
                    >
                      -
                    </button>
                    <span className="font-bold text-lg w-8 text-center" style={{ color: currentTheme.success }}>
                      {formData.exercise}
                    </span>
                    <button
                      onClick={() => setFormData({ ...formData, exercise: formData.exercise + 10 })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.background }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Gratitude */}
          <Card>
            <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Gratitude 🙏</h3>
            <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
              Pour quoi êtes-vous reconnaissant aujourd&apos;hui&nbsp;?
            </p>
            <div className="space-y-3">
              {formData.gratitude.map((g, i) => (
                <input
                  key={i}
                  type="text"
                  value={g}
                  onChange={(e) => {
                    const newGratitude = [...formData.gratitude];
                    newGratitude[i] = e.target.value;
                    setFormData({ ...formData, gratitude: newGratitude });
                  }}
                  placeholder={`Gratitude ${i + 1}...`}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.text,
                  }}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Today's Journal Content */}
      <Card>
        <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Écriture du jour ✍️</h3>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Comment s'est passée votre journée? Qu'avez-vous appris? Qu'est-ce qui vous a rendu heureux?"
          className="w-full h-64 px-4 py-3 rounded-xl border resize-none"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border,
            color: currentTheme.text,
          }}
        />
        <div className="mt-4">
          <p className="text-sm mb-2" style={{ color: currentTheme.textSecondary }}>Tags</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="primary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                {tag} ×
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Ajouter un tag..."
              className="flex-1 px-4 py-2 rounded-xl border text-sm"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
            <Button size="sm" onClick={addTag}>Ajouter</Button>
          </div>
        </div>
        <Button className="w-full mt-4" onClick={handleSubmit}>
          {todayEntry ? 'Mettre à jour' : 'Sauvegarder'}
        </Button>
      </Card>

      {/* Mood Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>30 derniers jours</h3>
          <div className="grid grid-cols-10 gap-2">
            {moodChartData.map((day, i) => {
              const mood = moods.find(m => m.value === day.mood);
              return (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: mood ? `${mood.color}20` : currentTheme.background,
                    color: mood ? mood.color : currentTheme.textSecondary,
                  }}
                  title={`${day.date}: ${mood?.label || 'Non enregistré'}`}
                >
                  {mood?.emoji || day.day}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Entries List */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <h3 className="font-bold" style={{ color: currentTheme.text }}>Entrées récentes</h3>
          {recentEntries.length === 0 ? (
            <Card className="text-center py-8">
              <p style={{ color: currentTheme.textSecondary }}>Aucune entrée pour le moment</p>
            </Card>
          ) : (
            recentEntries.map((entry) => {
              const mood = moods.find(m => m.value === entry.mood);
              return (
                <Card key={entry.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{mood?.emoji}</span>
                      <div>
                        <p className="font-medium" style={{ color: currentTheme.text }}>
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                        <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                          Énergie: {entry.energy}/10 • Sommeil: {entry.sleep}h
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Supprimer cette entrée de journal ?')) deleteJournalEntry(entry.id);
                      }}
                      aria-label="Supprimer l'entrée"
                      className="p-2 rounded-lg hover-soft"
                      style={{ color: currentTheme.error }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  <p className="text-sm line-clamp-3" style={{ color: currentTheme.textSecondary }}>
                    {entry.content}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} size="sm">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Modal for quick mood entry */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={todayEntry ? "Modifier l'entrée du jour" : 'Nouvelle entrée de journal'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3" style={{ color: currentTheme.text }}>Comment vous sentez-vous?</h4>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setFormData({ ...formData, mood: m.value })}
                  className="p-3 rounded-xl text-center transition-all hover:scale-105"
                  style={{
                    backgroundColor: formData.mood === m.value ? `${m.color}20` : currentTheme.background,
                    border: formData.mood === m.value ? `2px solid ${m.color}` : '2px solid transparent',
                  }}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <p className="text-xs mt-1" style={{ color: currentTheme.textSecondary }}>{m.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2" style={{ color: currentTheme.text }}>
              Votre journal
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Écrivez vos pensées, reflections, ou simplement ce qui vous passe par la tête..."
              className="w-full h-48 px-4 py-3 rounded-xl border resize-none"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Icons
function PenIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
