'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Skill, SkillCategory, SkillLevel } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function SkillsPage() {
  const { currentTheme, skills, addSkill, updateSkill, deleteSkill } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    category: 'programming' as SkillCategory,
    level: 'beginner' as SkillLevel,
  });

  const categories = [
    { value: 'programming', label: '💻 Programmation' },
    { value: 'language', label: '🗣️ Langues' },
    { value: 'music', label: '🎵 Musique' },
    { value: 'art', label: '🎨 Art' },
    { value: 'business', label: '💼 Business' },
    { value: 'science', label: '🔬 Science' },
    { value: 'life', label: '🌟 Vie' },
  ];

  const levels = [
    { value: 'beginner', label: 'Débutant', progress: 25 },
    { value: 'intermediate', label: 'Intermédiaire', progress: 50 },
    { value: 'advanced', label: 'Avancé', progress: 75 },
    { value: 'expert', label: 'Expert', progress: 100 },
  ];

  const filteredSkills = useMemo(() => {
    if (filterCategory === 'all') return skills;
    return skills.filter(s => s.category === filterCategory);
  }, [skills, filterCategory]);

  const getLevelProgress = (level: SkillLevel) => levels.find(l => l.value === level)?.progress || 0;

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    if (editingSkill) {
      updateSkill(editingSkill.id, formData);
    } else {
      const newSkill: Skill = {
        id: Date.now().toString(),
        ...formData,
        progress: getLevelProgress(formData.level),
        resources: [],
        practiceLog: [],
        createdAt: new Date().toISOString(),
      };
      addSkill(newSkill);
    }
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({ name: '', category: 'programming', level: 'beginner' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>⭐ Compétences</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Développez vos compétences et apprenez de nouvelles choses</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>Nouvelle compétence</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(0, 4).map((cat) => {
          const count = skills.filter(s => s.category === cat.value).length;
          return (
            <Card key={cat.value} padding="sm">
              <p className="text-2xl mb-1">{cat.value === 'programming' ? '💻' : cat.value === 'language' ? '🗣️' : cat.value === 'music' ? '🎵' : cat.value === 'art' ? '🎨' : '⭐'}</p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>{cat.label.split(' ')[1]}</p>
              <p className="text-2xl font-bold" style={{ color: currentTheme.text }}>{count}</p>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCategory('all')} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: filterCategory === 'all' ? currentTheme.primary : currentTheme.background, color: filterCategory === 'all' ? 'white' : currentTheme.text }}>Toutes</button>
        {categories.map((cat) => (
          <button key={cat.value} onClick={() => setFilterCategory(cat.value)} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: filterCategory === cat.value ? currentTheme.primary : currentTheme.background, color: filterCategory === cat.value ? 'white' : currentTheme.text }}>
            {cat.label}
          </button>
        ))}
      </div>

      {filteredSkills.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>Aucune compétence</h3>
          <p style={{ color: currentTheme.textSecondary }}>Commencez à développer une nouvelle compétence!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Card key={skill.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: currentTheme.text }}>{skill.name}</h3>
                  <Badge size="sm" variant="primary">{categories.find(c => c.value === skill.category)?.label.split(' ')[1]}</Badge>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingSkill(skill); setFormData({ name: skill.name, category: skill.category, level: skill.level }); setIsModalOpen(true); }} className="p-2 rounded-lg hover-soft" style={{ color: currentTheme.textSecondary }}>✏️</button>
                  <button onClick={() => deleteSkill(skill.id)} className="p-2 rounded-lg hover-soft" style={{ color: currentTheme.error }}>🗑️</button>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: currentTheme.textSecondary }}>Niveau</span>
                  <Badge size="sm" variant={skill.level === 'expert' ? 'success' : skill.level === 'advanced' ? 'primary' : 'default'}>
                    {levels.find(l => l.value === skill.level)?.label}
                  </Badge>
                </div>
                <ProgressBar value={skill.progress} color={currentTheme.primary} />
              </div>
              <div className="text-sm" style={{ color: currentTheme.textSecondary }}>
                <p>📚 {skill.resources.length} ressources</p>
                <p>⏱️ ${skill.practiceLog.reduce((acc, l) => acc + l.duration, 0)} minutes de pratique</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingSkill(null); }} title={editingSkill ? 'Modifier' : 'Nouvelle compétence'} size="md">
        <div className="space-y-4">
          <Input label="Nom de la compétence" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Python, Espagnol..." />
          <Select label="Catégorie" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })} options={categories} />
          <Select label="Niveau actuel" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as SkillLevel })} options={levels} />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingSkill(null); }} className="flex-1">Annuler</Button>
            <Button onClick={handleSubmit} className="flex-1">{editingSkill ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlusIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
