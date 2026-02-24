'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    RotateCcw,
    Coffee,
    Target,
    Flame,
    CheckCircle,
    Volume2,
    VolumeX,
    Settings,
    Timer,
    Zap
} from 'lucide-react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSettings {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    soundEnabled: boolean;
}

const defaultSettings: TimerSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    soundEnabled: true,
};

export default function PomodoroTimer() {
    const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [totalFocusTime, setTotalFocusTime] = useState(1470);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimerComplete = useCallback(() => {
        setIsRunning(false);

        if (mode === 'focus') {
            setSessions((prev) => prev + 1);
            setTotalFocusTime((prev) => prev + settings.focusDuration);

            const nextSession = sessions + 1;
            if (nextSession % settings.sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(settings.longBreakDuration * 60);
            } else {
                setMode('shortBreak');
                setTimeLeft(settings.shortBreakDuration * 60);
            }

            if (settings.autoStartBreaks) {
                setIsRunning(true);
            }
        } else {
            setMode('focus');
            setTimeLeft(settings.focusDuration * 60);

            if (settings.autoStartFocus) {
                setIsRunning(true);
            }
        }
    }, [mode, sessions, settings]);

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsRunning(false);

        switch (newMode) {
            case 'focus':
                setTimeLeft(settings.focusDuration * 60);
                break;
            case 'shortBreak':
                setTimeLeft(settings.shortBreakDuration * 60);
                break;
            case 'longBreak':
                setTimeLeft(settings.longBreakDuration * 60);
                break;
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        switch (mode) {
            case 'focus':
                setTimeLeft(settings.focusDuration * 60);
                break;
            case 'shortBreak':
                setTimeLeft(settings.shortBreakDuration * 60);
                break;
            case 'longBreak':
                setTimeLeft(settings.longBreakDuration * 60);
                break;
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTotalTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getModeColor = () => {
        switch (mode) {
            case 'focus':
                return 'from-rose-500 to-orange-500';
            case 'shortBreak':
                return 'from-cyan-500 to-emerald-500';
            case 'longBreak':
                return 'from-violet-500 to-purple-500';
        }
    };

    const getModeLabel = () => {
        switch (mode) {
            case 'focus':
                return 'Focus Time';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
        }
    };

    const progress = (() => {
        let totalSeconds: number;
        switch (mode) {
            case 'focus':
                totalSeconds = settings.focusDuration * 60;
                break;
            case 'shortBreak':
                totalSeconds = settings.shortBreakDuration * 60;
                break;
            case 'longBreak':
                totalSeconds = settings.longBreakDuration * 60;
                break;
        }
        return ((totalSeconds - timeLeft) / totalSeconds) * 100;
    })();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white/90">Pomodoro Timer</h2>
                    <p className="text-sm text-white/40">Stay focused with timed work sessions</p>
                </div>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 transition-colors"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className="relative">
                <motion.div
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getModeColor()} p-12 text-center`}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="2"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray={283}
                                strokeDashoffset={283 - (283 * progress) / 100}
                                transform="rotate(-90 50 50)"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <p className="text-white/70 text-sm font-medium mb-2">{getModeLabel()}</p>
                        <motion.p
                            className="text-7xl font-bold text-white mb-8"
                            key={timeLeft}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        >
                            {formatTime(timeLeft)}
                        </motion.p>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={resetTimer}
                                className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                            >
                                <RotateCcw size={24} />
                            </button>

                            <button
                                onClick={toggleTimer}
                                className="p-6 rounded-full bg-white hover:bg-white/90 text-slate-900 transition-colors shadow-xl"
                            >
                                {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                            </button>

                            <button
                                onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                                className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                            >
                                {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex justify-center gap-2">
                <button
                    onClick={() => switchMode('focus')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'focus'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
                        }`}
                >
                    <Timer size={16} className="inline mr-2" />
                    Focus
                </button>
                <button
                    onClick={() => switchMode('shortBreak')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'shortBreak'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
                        }`}
                >
                    <Coffee size={16} className="inline mr-2" />
                    Short Break
                </button>
                <button
                    onClick={() => switchMode('longBreak')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'longBreak'
                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                            : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
                        }`}
                >
                    <Coffee size={16} className="inline mr-2" />
                    Long Break
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                            <Target size={20} className="text-rose-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{sessions}</p>
                            <p className="text-xs text-white/40">Sessions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Flame size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{formatTotalTime(totalFocusTime)}</p>
                            <p className="text-xs text-white/40">Focus Time</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Zap size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white/90">{sessions * 10}</p>
                            <p className="text-xs text-white/40">XP Earned</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white/60 mb-3">Pomodoro Technique Tips</h3>
                <ul className="space-y-2 text-sm text-white/40">
                    <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        Work for 25 minutes, then take a 5-minute break
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        After 4 sessions, take a longer 15-30 minute break
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        During breaks, avoid screen time - stretch or walk around
                    </li>
                </ul>
            </div>

            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowSettings(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white/90 mb-6">Timer Settings</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-white/70">Focus Duration (min)</label>
                                    <input
                                        type="number"
                                        value={settings.focusDuration}
                                        onChange={(e) => setSettings({ ...settings, focusDuration: parseInt(e.target.value) || 25 })}
                                        className="w-20 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 text-center focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-white/70">Short Break (min)</label>
                                    <input
                                        type="number"
                                        value={settings.shortBreakDuration}
                                        onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                                        className="w-20 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 text-center focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-white/70">Long Break (min)</label>
                                    <input
                                        type="number"
                                        value={settings.longBreakDuration}
                                        onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                                        className="w-20 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white/90 text-center focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-white/70">Sound Notifications</label>
                                    <button
                                        onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-cyan-500' : 'bg-white/20'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    switchMode('focus');
                                }}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity mt-6"
                            >
                                Save & Apply
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
