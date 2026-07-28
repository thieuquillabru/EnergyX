'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { PomodoroPhase } from '@/types';
import { useApp } from '@/context/AppContext';
import { useToday } from '@/hooks/useToday';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

export function TimerPage() {
  const { pomodoroSessions, timerSettings, addPomodoroSession, setTimerSettings, addXP } = useApp();
  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const today = useToday();
  const sessionsDone = pomodoroSessions.filter(s => s.date === (today || format(new Date(), 'yyyy-MM-dd')) && s.phase === 'focus').length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<() => void>(() => {});
  const taskRef = useRef(task);
  const phaseRef = useRef(phase);
  const startedAtRef = useRef<number>(0);

  useEffect(() => { taskRef.current = task; }, [task]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 300);
    } catch { /* audio not available */ }
  }, []);

  const onComplete = useCallback(() => {
    playBeep();
    setIsRunning(false);

    const elapsed = startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0;
    addPomodoroSession({
      id: uuid(),
      date: today || format(new Date(), 'yyyy-MM-dd'),
      phase: phaseRef.current,
      duration: elapsed,
      task: taskRef.current,
      startedAt: new Date().toISOString(),
    });

    if (phaseRef.current === 'focus') {
      addXP(today || format(new Date(), 'yyyy-MM-dd'), 10);
    }
  }, [addPomodoroSession, addXP, playBeep, today]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = phase === 'focus'
    ? timerSettings.focusDuration * 60
    : phase === 'shortBreak'
      ? timerSettings.shortBreakDuration * 60
      : timerSettings.longBreakDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const handleStart = useCallback(() => {
    if (timeLeft > 0 && timeLeft === (phase === 'focus'
      ? timerSettings.focusDuration * 60
      : phase === 'shortBreak'
        ? timerSettings.shortBreakDuration * 60
        : timerSettings.longBreakDuration * 60)) {
      startedAtRef.current = Date.now();
    }
    setIsRunning(true);
  }, [timeLeft, phase, timerSettings]);
  const handlePause = useCallback(() => setIsRunning(false), []);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    const durations: Record<PomodoroPhase, number> = {
      focus: timerSettings.focusDuration * 60,
      shortBreak: timerSettings.shortBreakDuration * 60,
      longBreak: timerSettings.longBreakDuration * 60,
    };
    setTimeLeft(durations[phase]);
  }, [phase, timerSettings]);

  const switchPhase = useCallback((p: PomodoroPhase) => {
    setIsRunning(false);
    setPhase(p);
    const durations: Record<PomodoroPhase, number> = {
      focus: timerSettings.focusDuration * 60,
      shortBreak: timerSettings.shortBreakDuration * 60,
      longBreak: timerSettings.longBreakDuration * 60,
    };
    setTimeLeft(durations[p]);
  }, [timerSettings]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const todaySessions = pomodoroSessions.filter(
    (s) => s.date === (today || format(new Date(), 'yyyy-MM-dd')) && s.phase === 'focus'
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Minuteur" description="Technique Pomodoro pour une meilleure concentration.">
        <Button variant="ghost" onClick={() => setShowSettings(!showSettings)}>
          <Settings size={16} /> Réglages
        </Button>
      </PageHeader>

      {showSettings && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Focus (min)</Label>
              <Input type="number" value={timerSettings.focusDuration} onChange={(e) => setTimerSettings({ ...timerSettings, focusDuration: Math.max(1, Number(e.target.value)) })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Pause courte (min)</Label>
              <Input type="number" value={timerSettings.shortBreakDuration} onChange={(e) => setTimerSettings({ ...timerSettings, shortBreakDuration: Math.max(1, Number(e.target.value)) })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Pause longue (min)</Label>
              <Input type="number" value={timerSettings.longBreakDuration} onChange={(e) => setTimerSettings({ ...timerSettings, longBreakDuration: Math.max(1, Number(e.target.value)) })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Intervalle longue pause</Label>
              <Input type="number" value={timerSettings.longBreakInterval} onChange={(e) => setTimerSettings({ ...timerSettings, longBreakInterval: Math.max(1, Number(e.target.value)) })} className="mt-1" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {/* Phase tabs */}
        <div className="flex gap-2">
          {([
            { id: 'focus' as PomodoroPhase, label: 'Focus' },
            { id: 'shortBreak' as PomodoroPhase, label: 'Pause courte' },
            { id: 'longBreak' as PomodoroPhase, label: 'Pause longue' },
          ]).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => switchPhase(p.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm border transition-colors',
                phase === p.id ? 'border-primary bg-primary/10' : 'border-border'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative">
          <svg className="w-48 h-48 sm:w-[200px] sm:h-[200px]" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {phase === 'focus' ? 'Focus' : phase === 'shortBreak' ? 'Pause' : 'Longue pause'}
            </span>
          </div>
        </div>

        {/* Task */}
        <div className="w-full max-w-xs">
          <Input
            placeholder="Tâche en cours..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleReset} aria-label="Réinitialiser">
            <RotateCcw size={18} />
          </Button>
          <Button
            size="lg"
            onClick={isRunning ? handlePause : handleStart}
            className="h-14 w-14 rounded-full"
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          <div className="h-10 w-10" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center w-full max-w-xs">
          <div>
            <p className="text-2xl font-bold">{sessionsDone}</p>
            <p className="text-xs text-muted-foreground">Sessions focus</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{todaySessions.length}</p>
            <p className="text-xs text-muted-foreground">Aujourd&apos;hui</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{pomodoroSessions.filter((s) => s.phase === 'focus').length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
