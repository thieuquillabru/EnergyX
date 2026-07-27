'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Game, GameStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

export default function GamingPage() {
  const { currentTheme, games, addGame, updateGame, deleteGame } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    status: 'backlog' as GameStatus,
    hoursPlayed: 0,
    rating: 0,
  });

  const statuses = [
    { value: 'all', label: 'Tous' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'playing', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'on_hold', label: 'En pause' },
    { value: 'dropped', label: 'Abandonné' },
  ];

  const platforms = [
    { value: 'PC', label: 'PC' },
    { value: 'PlayStation 5', label: 'PlayStation 5' },
    { value: 'PlayStation 4', label: 'PlayStation 4' },
    { value: 'Xbox Series X', label: 'Xbox Series X' },
    { value: 'Xbox One', label: 'Xbox One' },
    { value: 'Nintendo Switch', label: 'Nintendo Switch' },
    { value: 'Mobile', label: 'Mobile' },
    { value: 'Autre', label: 'Autre' },
  ];

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (filterStatus !== 'all' && g.status !== filterStatus) return false;
      if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [games, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = games.length;
    const completed = games.filter(g => g.status === 'completed').length;
    const playing = games.filter(g => g.status === 'playing').length;
    const totalHours = games.reduce((acc, g) => acc + g.hoursPlayed, 0);
    return { total, completed, playing, totalHours };
  }, [games]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingGame) {
      updateGame(editingGame.id, formData);
    } else {
      const newGame: Game = {
        id: Date.now().toString(),
        ...formData,
        isFavorite: false,
        achievements: [],
      };
      addGame(newGame);
    }

    setIsModalOpen(false);
    setEditingGame(null);
    setFormData({ title: '', platform: '', genre: '', status: 'backlog', hoursPlayed: 0, rating: 0 });
  };

  const getStatusBadge = (status: GameStatus) => {
    const badges: Record<GameStatus, { label: string; variant: any }> = {
      backlog: { label: 'Backlog', variant: 'default' },
      playing: { label: 'En cours', variant: 'primary' },
      completed: { label: 'Terminé', variant: 'success' },
      on_hold: { label: 'En pause', variant: 'warning' },
      dropped: { label: 'Abandonné', variant: 'error' },
    };
    return badges[status];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>🎮 Collection de Jeux</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Suivez votre collection de jeux vidéo
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>
          Ajouter un jeu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Total jeux</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.text }}>{stats.total}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Terminés</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{stats.completed}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>En cours</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{stats.playing}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Heures jouées</p>
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{stats.totalHours}h</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: filterStatus === s.value ? currentTheme.primary : currentTheme.background,
                color: filterStatus === s.value ? 'white' : currentTheme.text,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.text }}>
            {games.length === 0 ? 'Pas de jeux dans votre collection' : 'Aucun jeu trouvé'}
          </h3>
          <p style={{ color: currentTheme.textSecondary }}>
            {games.length === 0 ? 'Ajoutez vos premiers jeux!' : 'Essayez une autre recherche.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game) => {
            const badge = getStatusBadge(game.status);
            return (
              <Card key={game.id} className="relative">
                <div className="h-32 rounded-xl mb-3 flex items-center justify-center text-4xl" style={{ backgroundColor: '#8b5cf620' }}>
                  🎮
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold line-clamp-1" style={{ color: currentTheme.text }}>{game.title}</h3>
                    <p className="text-sm" style={{ color: currentTheme.textSecondary }}>{game.platform}</p>
                  </div>
                  {game.isFavorite && <span>⭐</span>}
                </div>
                <Badge variant={badge.variant} size="sm" className="mb-3">{badge.label}</Badge>
                <div className="flex items-center justify-between text-sm mb-3" style={{ color: currentTheme.textSecondary }}>
                  <span>⏱️ {game.hoursPlayed}h</span>
                  <span>{game.genre}</span>
                </div>
                {(game.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < (game.rating ?? 0) ? currentTheme.warning : currentTheme.border }}>★</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setEditingGame(game); setFormData({ title: game.title, platform: game.platform, genre: game.genre, status: game.status, hoursPlayed: game.hoursPlayed, rating: game.rating || 0 }); setIsModalOpen(true); }}>
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteGame(game.id)}>🗑️</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingGame(null); }} title={editingGame ? 'Modifier' : 'Ajouter un jeu'} size="md">
        <div className="space-y-4">
          <Input label="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nom du jeu" />
          <Select label="Plateforme" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} options={platforms} />
          <Input label="Genre" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} placeholder="Ex: RPG, Action..." />
          <Select label="Statut" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as GameStatus })} options={statuses.slice(1)} />
          <Input label="Heures jouées" type="number" value={formData.hoursPlayed} onChange={(e) => setFormData({ ...formData, hoursPlayed: parseInt(e.target.value) || 0 })} />
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>Note</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setFormData({ ...formData, rating: i + 1 })} className="text-3xl transition-transform hover:scale-110" style={{ color: i < formData.rating ? currentTheme.warning : currentTheme.border }}>★</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setEditingGame(null); }} className="flex-1">Annuler</Button>
            <Button onClick={handleSubmit} className="flex-1">{editingGame ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlusIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
