'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useToday } from '@/hooks/useToday';
import { Habit, HabitCategory, HabitFrequency } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

export default function HabitsPage() {
  const { currentTheme, habits, addHabit, updateHabit, deleteHabit, completeHabit } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const today = useToday();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '✨',
    color: currentTheme.primary,
    category: 'health' as HabitCategory,
    frequency: 'daily' as HabitFrequency,
  });

  const categories: { value: HabitCategory; label: string }[] = [
    { value: 'health', label: 'Santé' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'mental', label: 'Mental' },
    { value: 'learning', label: 'Apprentissage' },
    { value: 'social', label: 'Social' },
    { value: 'productivity', label: 'Productivité' },
    { value: 'creativity', label: 'Créativité' },
    { value: 'finance', label: 'Finance' },
    { value: 'passion', label: 'Passion' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Quotidien' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'custom', label: 'Personnalisé' },
  ];

  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      if (filterCategory !== 'all' && h.category !== filterCategory) return false;
      if (!showCompleted && h.completions.some(c => c.date === today && c.completed)) return false;
      return true;
    });
  }, [habits, filterCategory, showCompleted, today]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        ...formData,
        streaks: { current: 0, longest: 0 },
        completions: [],
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      addHabit(newHabit);
    }

    setIsModalOpen(false);
    setEditingHabit(null);
    setFormData({
      title: '',
      description: '',
      icon: '✨',
      color: currentTheme.primary,
      category: 'health',
      frequency: 'daily',
    });
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      description: habit.description || '',
      icon: habit.icon,
      color: habit.color,
      category: habit.category,
      frequency: habit.frequency,
    });
    setIsModalOpen(true);
  };

  const handleComplete = (habitId: string) => {
    if (!today) return;
    completeHabit(habitId, today);
  };

  const getCategoryStats = (category: HabitCategory) => {
    const categoryHabits = habits.filter(h => h.category === category);
    const completed = categoryHabits.filter(h => h.completions.some(c => c.date === today && c.completed)).length;
    return { total: categoryHabits.length, completed };
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>Habitudes ✨</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Construisez des habitudes positives au quotidien
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>
          Nouvelle habitude
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(0, 4).map((cat) => {
          const stats = getCategoryStats(cat.value);
          return (
            <Card key={cat.value} padding="sm">
              <p className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>{cat.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: currentTheme.text }}>
                {stats.completed}/{stats.total}
              </p>
              <ProgressBar value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} size="sm" className="mt-2" />
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span style={{ color: currentTheme.textSecondary }}>Catégorie:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: filterCategory === 'all' ? currentTheme.primary : currentTheme.background,
                color: filterCategory === 'all' ? 'white' : currentTheme.text,
              }}
            >
              Toutes
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: filterCategory === cat.value ? currentTheme.primary : currentTheme.background,
                  color: filterCategory === cat.value ? 'white' : currentTheme.text,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: currentTheme.primary }}
          />
          <span style={{ color: currentTheme.text }}>Afficher les complétées</span>
        </label>
      </div>

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>
            {habits.length === 0 ? 'Aucune habitude créée' : 'Aucune habitude dans cette catégorie'}
          </h3>
          <p style={{ color: currentTheme.textSecondary }}>
            {habits.length === 0 
              ? 'Commencez à construire vos habitudes positives dès aujourd\'hui!'
              : 'Essayez de modifier vos filtres ou créez une nouvelle habitude.'}
          </p>
          {habits.length === 0 && (
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              Créer ma première habitude
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => {
            const isCompleted = habit.completions.some(c => c.date === today && c.completed);
            
            return (
              <Card key={habit.id} className="relative overflow-hidden">
                {/* Color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: habit.color }}
                />
                
                <div className="pt-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${habit.color}20` }}
                      >
                        {habit.icon}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: currentTheme.text }}>{habit.title}</h3>
                        <Badge size="sm" variant="default">{categories.find(c => c.value === habit.category)?.label}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(habit)}
                        aria-label={`Modifier ${habit.title}`}
                        className="p-2 rounded-lg transition-colors hover-soft"
                        style={{ color: currentTheme.textSecondary }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer l'habitude « ${habit.title} » ? Cette action est irréversible.`)) {
                            deleteHabit(habit.id);
                          }
                        }}
                        aria-label={`Supprimer ${habit.title}`}
                        className="p-2 rounded-lg transition-colors hover-soft"
                        style={{ color: currentTheme.error }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>

                  {habit.description && (
                    <p className="text-sm mb-3" style={{ color: currentTheme.textSecondary }}>
                      {habit.description}
                    </p>
                  )}

                  {/* Streak */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStreakEmoji(habit.streaks.current)}</span>
                      <div>
                        <p className="font-bold" style={{ color: currentTheme.text }}>
                          {habit.streaks.current} jours
                        </p>
                        <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                          Meilleur: {habit.streaks.longest} jours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={() => !isCompleted && handleComplete(habit.id)}
                    disabled={isCompleted}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isCompleted 
                        ? 'cursor-default' 
                        : 'hover:scale-102 active:scale-95'
                    }`}
                    style={{
                      backgroundColor: isCompleted ? currentTheme.success : currentTheme.background,
                      color: isCompleted ? 'white' : currentTheme.text,
                    }}
                  >
                    {isCompleted ? '✓ Complété aujourd\'hui' : 'Marquer comme fait'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        title={editingHabit ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Titre de l'habitude"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Médiquer 10 minutes"
          />

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre habitude..."
              className="w-full px-4 py-2.5 rounded-xl border resize-none"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as HabitCategory })}
              options={categories}
            />

            <Select
              label="Fréquence"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as HabitFrequency })}
              options={frequencies}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Icône
            </label>
            <div className="flex flex-wrap gap-2">
              {['✨', '🏃', '📚', '💪', '🧘', '💧', '🍎', '😴', '📝', '🎯', '🌟', '🔥'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: formData.icon === emoji ? currentTheme.primary : currentTheme.background,
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Couleur
            </label>
            <div className="flex flex-wrap gap-2">
              {['#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#ef4444'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-8 h-8 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: formData.color === color ? `3px solid ${currentTheme.text}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingHabit ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Icons
function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
