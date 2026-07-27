'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Workout, WorkoutType } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function FitnessPage() {
  const { currentTheme, workouts, addWorkout, deleteWorkout, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'strength' as WorkoutType,
    duration: 30,
    calories: 0,
    notes: '',
    exercises: [{ id: '1', name: '', reps: 0, sets: [] }],
  });

  const types = [
    { value: 'strength', label: '💪 Musculation' },
    { value: 'cardio', label: '🏃 Cardio' },
    { value: 'flexibility', label: '🧘 Flexibilité' },
    { value: 'hiit', label: '⚡ HIIT' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'custom', label: '🎯 Personnalisé' },
  ];

  const todayWorkouts = useMemo(() => workouts.filter(w => w.date === selectedDate), [workouts, selectedDate]);
  const weekWorkouts = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter(w => w.date >= weekAgo.toISOString().split('T')[0]);
  }, [workouts]);

  const stats = useMemo(() => ({
    total: weekWorkouts.length,
    totalMinutes: weekWorkouts.reduce((acc, w) => acc + w.duration, 0),
    totalCalories: weekWorkouts.reduce((acc, w) => acc + (w.calories || 0), 0),
    avgDuration: weekWorkouts.length > 0 ? Math.round(weekWorkouts.reduce((acc, w) => acc + w.duration, 0) / weekWorkouts.length) : 0,
  }), [weekWorkouts]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    const newWorkout: Workout = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      exercises: formData.exercises.filter(e => e.name.trim()),
      duration: formData.duration,
      calories: formData.calories,
      date: selectedDate,
      notes: formData.notes,
    };
    addWorkout(newWorkout);
    setIsModalOpen(false);
    setFormData({ title: '', type: 'strength', duration: 30, calories: 0, notes: '', exercises: [{ id: '1', name: '', reps: 0, sets: [] }] });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>💪 Fitness</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Suivez vos entraînements et votre progression</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>Nouvel entraînement</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{stats.total}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Entraînements (7j)</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{stats.totalMinutes}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Minutes totaux</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.warning }}>{stats.totalCalories}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Calories brûlées</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{stats.avgDuration}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Durée moyenne</p>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <span style={{ color: currentTheme.textSecondary }}>
          {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      {todayWorkouts.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>Aucun entraînement ce jour</h3>
          <p style={{ color: currentTheme.textSecondary }}>Commencez votre séance!</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>Ajouter un entraînement</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {todayWorkouts.map((workout) => (
            <Card key={workout.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: currentTheme.text }}>{workout.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge size="sm" variant="primary">{types.find(t => t.value === workout.type)?.label.split(' ')[1]}</Badge>
                    <span style={{ color: currentTheme.textSecondary }}>⏱️ {workout.duration} min</span>
                    {workout.calories && <span style={{ color: currentTheme.textSecondary }}>🔥 {workout.calories} kcal</span>}
                  </div>
                </div>
                <button onClick={() => deleteWorkout(workout.id)} className="p-2" style={{ color: currentTheme.error }}>🗑️</button>
              </div>
              {workout.exercises.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2" style={{ color: currentTheme.textSecondary }}>Exercices</p>
                  <div className="flex flex-wrap gap-2">
                    {workout.exercises.map((ex) => (
                      <Badge key={ex.id} size="sm">{ex.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {workout.notes && <p className="mt-3 text-sm" style={{ color: currentTheme.textSecondary }}>{workout.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvel entraînement" size="md">
        <div className="space-y-4">
          <Input label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Entraînement haut du corps" />
          <Select label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as WorkoutType })} options={types} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Durée (min)" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
            <Input label="Calories" type="number" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Exercices</label>
            {formData.exercises.map((ex, i) => (
              <div key={ex.id} className="flex gap-2 mb-2">
                <Input placeholder="Nom de l'exercice" value={ex.name} onChange={(e) => { const newEx = [...formData.exercises]; newEx[i].name = e.target.value; setFormData({ ...formData, exercises: newEx }); }} />
                <Input placeholder="Réps" type="number" value={ex.reps} onChange={(e) => { const newEx = [...formData.exercises]; newEx[i].reps = parseInt(e.target.value) || 0; setFormData({ ...formData, exercises: newEx }); }} className="w-24" />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, exercises: [...formData.exercises, { id: Date.now().toString(), name: '', reps: 0, sets: [] }] })}>+ Ajouter un exercice</Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 rounded-xl border resize-none" rows={3} style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
            <Button onClick={handleSubmit} className="flex-1">Ajouter</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlusIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
