'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useToday } from '@/hooks/useToday';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

type TimerMode = 'focus' | 'short_break' | 'long_break';

export default function TimerPage() {
  const { currentTheme, pomodoroSettings, setPomodoroSettings, pomodoroSessions: sessions, addPomodoroSession } = useApp();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const today = useToday();
  const todayPomodoros = today
    ? sessions.filter(s => s.completedAt.startsWith(today) && s.type === 'focus').length
    : 0;

  const getModeSettings = useCallback(() => {
    switch (mode) {
      case 'focus':
        return { duration: pomodoroSettings.focusDuration, label: 'Focus', color: currentTheme.primary };
      case 'short_break':
        return { duration: pomodoroSettings.shortBreakDuration, label: 'Pause courte', color: currentTheme.success };
      case 'long_break':
        return { duration: pomodoroSettings.longBreakDuration, label: 'Pause longue', color: currentTheme.accent };
    }
  }, [mode, pomodoroSettings, currentTheme]);

  // Keep the completion handler in a ref so the interval effect never
  // depends on a function identity that changes on every render.
  const handleTimerCompleteRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // defer so we never setState of another component while rendering
          queueMicrotask(() => handleTimerCompleteRef.current());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const playNotificationSound = () => {
    // Simple beep sound using Web Audio API
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioContext = new AudioCtx();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      oscillator.onended = () => audioContext.close();
    } catch {
      console.warn('Could not play notification sound');
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Add session
    addPomodoroSession({
      id: Date.now().toString(),
      type: mode,
      duration: getModeSettings().duration,
      completedAt: new Date().toISOString(),
      task: currentTask || undefined,
    });

    if (mode === 'focus') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      // Auto-switch to break
      if (newSessions % pomodoroSettings.sessionsBeforeLongBreak === 0) {
        setMode('long_break');
        setTimeLeft(pomodoroSettings.longBreakDuration * 60);
      } else {
        setMode('short_break');
        setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
      }
    } else {
      // After break, switch back to focus
      setMode('focus');
      setTimeLeft(pomodoroSettings.focusDuration * 60);
    }

    // Play notification sound
    if (pomodoroSettings.soundEnabled) {
      playNotificationSound();
    }
  };

  useEffect(() => {
    handleTimerCompleteRef.current = handleTimerComplete;
  });

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getModeSettings().duration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    switch (newMode) {
      case 'focus':
        setTimeLeft(pomodoroSettings.focusDuration * 60);
        break;
      case 'short_break':
        setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
        break;
      case 'long_break':
        setTimeLeft(pomodoroSettings.longBreakDuration * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = getModeSettings().duration * 60;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, ((total - timeLeft) / total) * 100));
  };

  // Settings form (re-synced each time the modal is opened)
  const [settingsForm, setSettingsForm] = useState(pomodoroSettings);

  const openSettings = () => {
    setSettingsForm(pomodoroSettings);
    setShowSettings(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.text }}>Minuteur Pomodoro 🍅</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>
            Restez concentré et productif
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(true)}>
            📊 Statistiques
          </Button>
          <Button variant="ghost" size="sm" onClick={openSettings}>
            ⚙️ Paramètres
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.primary }}>{todayPomodoros}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Pomodoros aujourd&apos;hui</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.success }}>{sessionsCompleted}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Sessions accomplies</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold" style={{ color: currentTheme.accent }}>{sessionsCompleted * pomodoroSettings.focusDuration}</p>
          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Minutes de focus</p>
        </Card>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'focus', label: 'Focus', emoji: '🎯' },
          { id: 'short_break', label: 'Pause courte', emoji: '☕' },
          { id: 'long_break', label: 'Pause longue', emoji: '🌴' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id as TimerMode)}
            className="px-4 py-2 rounded-full font-medium transition-all"
            style={{
              backgroundColor: mode === m.id ? getModeSettings().color : currentTheme.background,
              color: mode === m.id ? 'white' : currentTheme.text,
            }}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <Card className="w-full max-w-md text-center">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                strokeWidth="8"
                fill="none"
                style={{ stroke: currentTheme.border }}
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                style={{ stroke: getModeSettings().color, transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold" style={{ color: currentTheme.text }}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-lg mt-2" style={{ color: currentTheme.textSecondary }}>
                {getModeSettings().label}
              </span>
            </div>
          </div>

          {/* Task Input */}
          <div className="mb-6">
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Qu'êtes-vous en train de travailler?"
              className="w-full px-4 py-2 rounded-xl border text-center"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button onClick={startTimer} className="px-8">
                ▶️ Commencer
              </Button>
            ) : (
              <Button variant="outline" onClick={pauseTimer} className="px-8">
                ⏸️ Pause
              </Button>
            )}
            <Button variant="ghost" onClick={resetTimer}>
              🔄 Reset
            </Button>
          </div>

          {/* Session Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pomodoroSettings.sessionsBeforeLongBreak }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-colors"
                style={{
                  backgroundColor: i < (sessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak) 
                    ? getModeSettings().color 
                    : currentTheme.border,
                }}
              />
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: currentTheme.textSecondary }}>
            {sessionsCompleted % pomodoroSettings.sessionsBeforeLongBreak} / {pomodoroSettings.sessionsBeforeLongBreak} sessions avant pause longue
          </p>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <h3 className="font-bold mb-3" style={{ color: currentTheme.text }}>💡 Conseils pour rester concentré</h3>
        <ul className="space-y-2 text-sm" style={{ color: currentTheme.textSecondary }}>
          <li>• Éliminez les distractions (téléphone, notifications)</li>
          <li>• Travaillez dans un endroit calme et confortable</li>
          <li>• Prenez des pauses régulières pour vous reposer</li>
          <li>• Restez hydraté tout au long de la session</li>
        </ul>
      </Card>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Paramètres Pomodoro"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Durée de focus (minutes)
            </label>
            <input
              type="number"
              value={settingsForm.focusDuration}
              onChange={(e) => setSettingsForm({ ...settingsForm, focusDuration: parseInt(e.target.value) || 25 })}
              min={1}
              max={120}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Pause courte (minutes)
            </label>
            <input
              type="number"
              value={settingsForm.shortBreakDuration}
              onChange={(e) => setSettingsForm({ ...settingsForm, shortBreakDuration: parseInt(e.target.value) || 5 })}
              min={1}
              max={30}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Pause longue (minutes)
            </label>
            <input
              type="number"
              value={settingsForm.longBreakDuration}
              onChange={(e) => setSettingsForm({ ...settingsForm, longBreakDuration: parseInt(e.target.value) || 15 })}
              min={1}
              max={60}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.text }}>
              Sessions avant pause longue
            </label>
            <input
              type="number"
              value={settingsForm.sessionsBeforeLongBreak}
              onChange={(e) => setSettingsForm({ ...settingsForm, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
              min={1}
              max={10}
              className="w-full px-4 py-2 rounded-xl border"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settingsForm.soundEnabled}
              onChange={(e) => setSettingsForm({ ...settingsForm, soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
              style={{ accentColor: currentTheme.primary }}
            />
            <span style={{ color: currentTheme.text }}>Son de notification</span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={() => {
              setPomodoroSettings(settingsForm);
              setShowSettings(false);
              setIsRunning(false);
              setTimeLeft(
                (mode === 'focus'
                  ? settingsForm.focusDuration
                  : mode === 'short_break'
                    ? settingsForm.shortBreakDuration
                    : settingsForm.longBreakDuration) * 60
              );
            }} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Statistiques Pomodoro"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold" style={{ color: currentTheme.primary }}>
                {sessions.filter(s => s.type === 'focus').length}
              </p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Total des sessions</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold" style={{ color: currentTheme.success }}>
                {sessions.filter(s => s.type === 'focus').reduce((acc, s) => acc + s.duration, 0)}
              </p>
              <p className="text-sm" style={{ color: currentTheme.textSecondary }}>Minutes de focus totaux</p>
            </Card>
          </div>
          
          {sessions.filter(s => s.type === 'focus').length > 0 && (
            <div>
              <h4 className="font-medium mb-3" style={{ color: currentTheme.text }}>Sessions récentes</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions
                  .filter(s => s.type === 'focus')
                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                  .slice(0, 10)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: currentTheme.background }}
                    >
                      <div>
                        <p style={{ color: currentTheme.text }}>
                          {new Date(session.completedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {session.task && (
                          <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                            {session.task}
                          </p>
                        )}
                      </div>
                      <Badge variant="primary">{session.duration} min</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
