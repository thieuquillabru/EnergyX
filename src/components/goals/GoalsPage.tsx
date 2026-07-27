'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Goal, GoalCategory, Priority } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

export default function GoalsPage() {
  const { currentTheme, goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as GoalCategory,
    priority: 'medium' as Priority,
    targetDate: '',
  });

  const categories: { value: GoalCategory; label: string }[] = [
    { value: 'career', label: 'Carrière' },
    { value: 'health', label: 'Santé' },
    { value: 'finance', label: 'Finance' },
    { value: 'relationships', label: 'Relations' },
    { value: 'education', label: 'Éducation' },
    { value: 'personal', label: 'Personnel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'passion', label: 'Passion' },
  ];

  const priorities = [
    { value: 'low', label: 'Basse' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' },
    { value: 'critical', label: 'Critique' },
  ];

  const statuses = [
    { value: 'all', label: 'Tous' },
    { value: 'active', label: 'Actifs' },
    { value: 'completed', label: 'Complétés' },
    { value: 'paused', label: 'En pause' },
  ];

  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      if (filterStatus !== 'all' && g.status !== filterStatus) return false;
      return true;
    });
  }, [goals, filterStatus]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...formData,
        milestones: [],
        progress: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      addGoal(newGoal);
    }

    setIsModalOpen(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
    });
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate || '',
    });
    setIsModalOpen(true);
  };

  const handleProgressChange = (goalId: string, progress: number) => {
    updateGoal(goalId, { progress, status: progress >= 100 ? 'completed' : 'active' });
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<Priority, string> = {
      low: currentTheme.textSecondary,
      medium: currentTheme.warning,
      high: '#f97316',
      critical: currentTheme.error,
    };
    return colors[priority];
  };

  const getCategoryIcon = (category: GoalCategory) => {
    const icons: Record<GoalCategory, string> = {
      career: '💼',
      health: '🏥',
      finance: '💰',
      relationships: '❤️',
      education: '📚',
      personal: '⭐',
      fitness: '💪',
      passion: '🎯',
    };
    return icons[category];
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'En retard';
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return '1 jour';
    return `${diff} jours`;
  };

  // Stats
  const stats = useMemo(() => {
    const active = goals.filter(g => g.status === 'active').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const total = goals.length;
    const avgProgress = total > 0 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / total) 
      : 0;
    return { active, completed, total, avgProgress };
  }, [goals]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>Objectifs 🎯</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Définissez et atteignez vos objectifs à court et long terme
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>
          Nouvel objectif
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Total</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.text }}>{stats.total}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Actifs</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{stats.active}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Complétés</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{stats.completed}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Progression moy.</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{stats.avgProgress}%</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: filterStatus === status.value ? currentTheme.primary : currentTheme.background,
              color: filterStatus === status.value ? 'white' : currentTheme.text,
            }}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>
            {goals.length === 0 ? 'Aucun objectif défini' : 'Aucun objectif dans cette catégorie'}
          </h3>
          <p style={{ color: currentTheme.textSecondary }}>
            {goals.length === 0 
              ? 'Commencez par définir vos premiers objectifs!'
              : 'Modifiez vos filtres pour voir d\'autres objectifs.'}
          </p>
          {goals.length === 0 && (
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              Créer mon premier objectif
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className="relative">
              {/* Status indicator */}
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ backgroundColor: goal.status === 'completed' ? currentTheme.success : currentTheme.primary }}
              />

              <div className="pl-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: currentTheme.text }}>{goal.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge size="sm" variant="default">
                          {categories.find(c => c.value === goal.category)?.label}
                        </Badge>
                        <Badge size="sm" variant={goal.priority === 'critical' || goal.priority === 'high' ? 'error' : 'default'}>
                          <span style={{ color: getPriorityColor(goal.priority) }}>●</span> {goal.priority}
                        </Badge>
                        <Badge 
                          size="sm" 
                          variant={goal.status === 'completed' ? 'success' : goal.status === 'paused' ? 'warning' : 'default'}
                        >
                          {goal.status === 'active' ? 'En cours' : goal.status === 'completed' ? 'Terminé' : 'En pause'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 rounded-lg transition-colors hover-soft"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer l'objectif « ${goal.title} » ?`)) deleteGoal(goal.id);
                      }}
                      aria-label={`Supprimer ${goal.title}`}
                      className="p-2 rounded-lg transition-colors hover-soft"
                      style={{ color: currentTheme.error }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
                    {goal.description}
                  </p>
                )}

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: currentTheme.text }}>Progression</span>
                    <span className="text-sm font-bold" style={{ color: currentTheme.primary }}>{goal.progress}%</span>
                  </div>
                  <ProgressBar 
                    value={goal.progress} 
                    color={goal.status === 'completed' ? currentTheme.success : currentTheme.primary}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleProgressChange(goal.id, parseInt(e.target.value))}
                    className="w-full mt-2 cursor-pointer"
                    style={{ accentColor: currentTheme.primary }}
                    disabled={goal.status === 'completed'}
                  />
                </div>

                {/* Target Date */}
                {goal.targetDate && (
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: currentTheme.background }}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon color={currentTheme.textSecondary} />
                      <span style={{ color: currentTheme.textSecondary }}>Date limite</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: currentTheme.text }}>
                        {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm" style={{ color: getPriorityColor(goal.priority) }}>
                        {getDaysUntilTarget(goal.targetDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2" style={{ color: currentTheme.textSecondary }}>
                      Jalons ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                    </p>
                    <div className="space-y-2">
                      {goal.milestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: milestone.completed ? currentTheme.success : currentTheme.border,
                            }}
                          >
                            {milestone.completed && <CheckIcon />}
                          </div>
                          <span 
                          className={`text-sm ${milestone.completed ? 'line-through' : ''}`}
                          style={{ color: currentTheme.text }}
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {goal.status === 'active' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => updateGoal(goal.id, { status: 'paused' })}
                    >
                      Pause
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProgressChange(goal.id, 100)}
                    >
                      Marquer terminé
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Titre de l'objectif"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Apprendre une nouvelle langue"
          />

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre objectif en détail..."
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
              options={categories}
            />

            <Select
              label="Priorité"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              options={priorities}
            />
          </div>

          <Input
            label="Date limite (optionnel)"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingGoal ? 'Enregistrer' : 'Créer'}
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

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CalendarIcon({ color }: { color?: string }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color || '#64748b' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
