'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Challenge } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function MotivationPage() {
  const { currentTheme, quotes, toggleQuoteFavorite, challenges, updateChallenge } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = [...new Set(quotes.map(q => q.category))];

  const filteredQuotes = useMemo(() => {
    let result = quotes;
    if (showFavorites) result = result.filter(q => q.isFavorite);
    if (filterCategory !== 'all') result = result.filter(q => q.category === filterCategory);
    return result;
  }, [quotes, filterCategory, showFavorites]);

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const handleJoinChallenge = (challengeId: string) => {
    updateChallenge(challengeId, { progress: 0 });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>🔥 Motivation</h1>
        <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Citations inspirantes et défis pour vous motiver</p>
      </div>

      {/* Random Quote */}
      <Card style={{ backgroundColor: currentTheme.primary }} className="text-center">
        <p className="text-4xl mb-4">"{quotes[Math.floor(Math.random() * quotes.length)]?.text}"</p>
        <p className="text-white/80">— {quotes[Math.floor(Math.random() * quotes.length)]?.author}</p>
      </Card>

      {/* Challenges */}
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: currentTheme.text }}>⚔️ Défis actifs</h2>
        {activeChallenges.length === 0 ? (
          <Card className="text-center py-8">
            <p style={{ color: currentTheme.textSecondary }}>Aucun défi actif. Créez-en un nouveau!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: currentTheme.text }}>{challenge.title}</h3>
                    <Badge size="sm" variant="primary">{challenge.type}</Badge>
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>{challenge.description}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: currentTheme.textSecondary }}>Progression</span>
                    <span style={{ color: currentTheme.text }}>{challenge.progress}%</span>
                  </div>
                  <ProgressBar value={challenge.progress} />
                </div>
                <div className="flex items-center justify-between text-sm" style={{ color: currentTheme.textSecondary }}>
                  <span>⏱️ {challenge.duration} jours</span>
                  {challenge.reward && <span>🎁 {challenge.reward}</span>}
                </div>
                {challenge.progress > 0 && (
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => updateChallenge(challenge.id, { progress: Math.min(100, challenge.progress + 10) })}>
                    +10% Progression
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: currentTheme.text }}>✅ Défis complétés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="opacity-75">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎉</span>
                  <h3 className="font-bold" style={{ color: currentTheme.text }}>{challenge.title}</h3>
                </div>
                <p className="text-sm" style={{ color: currentTheme.textSecondary }}>{challenge.description}</p>
                <Badge variant="success" className="mt-2">Complété</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quotes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: currentTheme.text }}>💬 Citations inspirantes</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showFavorites} onChange={(e) => setShowFavorites(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: currentTheme.primary }} />
            <span style={{ color: currentTheme.text }}>Favoris uniquement</span>
          </label>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={() => setFilterCategory('all')} className="px-4 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: filterCategory === 'all' ? currentTheme.primary : currentTheme.background, color: filterCategory === 'all' ? 'white' : currentTheme.text }}>Toutes</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize" style={{ backgroundColor: filterCategory === cat ? currentTheme.primary : currentTheme.background, color: filterCategory === cat ? 'white' : currentTheme.text }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="relative">
              <button onClick={() => toggleQuoteFavorite(quote.id)} className="absolute top-4 right-4 text-2xl">
                {quote.isFavorite ? '⭐' : '☆'}
              </button>
              <blockquote className="pr-8">
                <p className="text-lg italic mb-2" style={{ color: currentTheme.text }}>"{quote.text}"</p>
                <footer style={{ color: currentTheme.textSecondary }}>— {quote.author}</footer>
              </blockquote>
              <Badge size="sm" className="mt-3 capitalize">{quote.category}</Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Tips */}
      <Card>
        <h3 className="font-bold mb-3" style={{ color: currentTheme.text }}>🌟 Conseil du jour</h3>
        <div className="space-y-2 text-sm" style={{ color: currentTheme.textSecondary }}>
          <p>1. Commencez votre journée par une tâche difficile - votre énergie est à son maximum le matin.</p>
          <p>2. Décomposez vos grands objectifs en petites étapes réalisables.</p>
          <p>3. Célébrez vos petites victoires - chaque progrès compte!</p>
          <p>4. Entourez-vous de personnes positives qui vous inspirent.</p>
          <p>5. N'oubliez pas de prendre des pauses pour maintenir votre motivation.</p>
        </div>
      </Card>
    </div>
  );
}
