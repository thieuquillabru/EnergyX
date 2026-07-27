'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { MeditationSession, MeditationType } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function MeditationPage() {
  const { currentTheme, meditationSessions, addMeditationSession } = useApp();
  const [isMeditating, setIsMeditating] = useState(false);
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [selectedType, setSelectedType] = useState<MeditationType>('mindfulness');
  const [sessionComplete, setSessionComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const types: { value: MeditationType; label: string; emoji: string; description: string }[] = [
    { value: 'mindfulness', label: 'Pleine conscience', emoji: '🧘', description: 'Soyez présent à l\'instant' },
    { value: 'breathing', label: 'Respiration', emoji: '🌬️', description: 'Respirez profondément' },
    { value: 'visualization', label: 'Visualisation', emoji: '✨', description: 'Imaginez votre lieu de paix' },
    { value: 'body_scan', label: 'Scan corporel', emoji: '🔍', description: 'Écoutez votre corps' },
    { value: 'loving_kindness', label: 'Amour bienveillant', emoji: '❤️', description: 'Cultivez la compassion' },
    { value: 'sleep', label: 'Sommeil', emoji: '😴', description: 'Préparez-vous à dormir' },
    { value: 'focus', label: 'Concentration', emoji: '🎯', description: 'Améliorez votre focus' },
  ];

  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return meditationSessions.filter(s => s.date.startsWith(today));
  }, [meditationSessions]);

  const todayMinutes = useMemo(() => todaySessions.reduce((acc, s) => acc + s.duration, 0), [todaySessions]);

  const weekMinutes = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return meditationSessions.filter(s => s.date >= weekAgo.toISOString().split('T')[0]).reduce((acc, s) => acc + s.duration, 0);
  }, [meditationSessions]);

  useEffect(() => {
    if (isMeditating && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMeditating]);

  const startMeditation = () => {
    setIsMeditating(true);
    setTimeLeft(duration * 60);
    setSessionComplete(false);
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(duration * 60);
  };

  const handleComplete = () => {
    setIsMeditating(false);
    setSessionComplete(true);
    addMeditationSession({
      id: Date.now().toString(),
      title: types.find(t => t.value === selectedType)?.label || 'Méditation',
      type: selectedType,
      duration: duration,
      date: new Date().toISOString(),
      completed: true,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>🧘 Méditation</h1>
        <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Prenez du temps pour vous et votre esprit</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{todayMinutes}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Minutes aujourd'hui</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{weekMinutes}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Minutes cette semaine</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{todaySessions.length}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Sessions aujourd'hui</p>
        </Card>
      </div>

      {/* Meditation Player */}
      <Card className="text-center">
        {!isMeditating && !sessionComplete ? (
          <>
            <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.text }}>Commencer une méditation</h3>
            <div className="flex justify-center gap-3 mb-6">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: selectedType === type.value ? `${currentTheme.primary}20` : currentTheme.background,
                    border: selectedType === type.value ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                  }}
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <p className="text-sm mt-1" style={{ color: currentTheme.text }}>{type.label}</p>
                </button>
              ))}
            </div>
            <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
              {types.find(t => t.value === selectedType)?.description}
            </p>
            <div className="flex justify-center gap-4 mb-6">
              {[5, 10, 15, 20, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => { setDuration(d); setTimeLeft(d * 60); }}
                  className="px-4 py-2 rounded-full font-medium transition-all"
                  style={{
                    backgroundColor: duration === d ? currentTheme.primary : currentTheme.background,
                    color: duration === d ? 'white' : currentTheme.text,
                  }}
                >
                  {d} min
                </button>
              ))}
            </div>
            <Button onClick={startMeditation} className="px-12" size="lg">
              ▶️ Commencer
            </Button>
          </>
        ) : isMeditating ? (
          <>
            <p className="text-4xl mb-4">{types.find(t => t.value === selectedType)?.emoji}</p>
            <h3 className="text-xl font-bold mb-6" style={{ color: currentTheme.text }}>
              {types.find(t => t.value === selectedType)?.label}
            </h3>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" strokeWidth="6" fill="none" style={{ stroke: currentTheme.border }} />
                <circle cx="96" cy="96" r="88" strokeWidth="6" fill="none" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - (1 - timeLeft / (duration * 60)))} style={{ stroke: currentTheme.primary, transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold" style={{ color: currentTheme.text }}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Button variant="outline" onClick={stopMeditation} className="px-8">Arrêter</Button>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: currentTheme.success }}>Méditation terminée!</h3>
            <p className="mb-6" style={{ color: currentTheme.textSecondary }}>Bien joué! Vous avez médité pendant {duration} minutes.</p>
            <Button onClick={() => setSessionComplete(false)}>Nouvelle méditation</Button>
          </>
        )}
      </Card>

      {/* Recent Sessions */}
      {todaySessions.length > 0 && (
        <Card>
          <h3 className="font-bold mb-4" style={{ color: currentTheme.text }}>Sessions récentes</h3>
          <div className="space-y-3">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: currentTheme.background }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{types.find(t => t.value === session.type)?.emoji}</span>
                  <div>
                    <p className="font-medium" style={{ color: currentTheme.text }}>{session.title}</p>
                    <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                      {new Date(session.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <Badge variant="success">{session.duration} min</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <h3 className="font-bold mb-3" style={{ color: currentTheme.text }}>💡 Conseils de méditation</h3>
        <ul className="space-y-2 text-sm" style={{ color: currentTheme.textSecondary }}>
          <li>• Trouvez un endroit calme et confortable</li>
          <li>• Asseyez-vous ou allongez-vous dans une position détendue</li>
          <li>• Fermez les yeux et concentrez-vous sur votre respiration</li>
          <li>• Si des pensées surgissent, acknowledgez-les et ramenez votre attention</li>
          <li>• Méditez de préférence le matin ou avant de dormir</li>
        </ul>
      </Card>
    </div>
  );
}
