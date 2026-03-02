'use client';
import { useState, useEffect, useCallback } from 'react';
import { Timer, ShieldAlert, X, ChevronRight, Bell, Zap } from 'lucide-react';

export default function SafetyTimer({ onTrigger }: { onTrigger: () => void }) {
    const [active, setActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [initialTime, setInitialTime] = useState(300); // default 5 mins
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (active && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (active && timeLeft === 0) {
            setActive(false);
            onTrigger();
        }
        return () => clearInterval(interval);
    }, [active, timeLeft, onTrigger]);

    const startTimer = (seconds: number) => {
        setTimeLeft(seconds);
        setInitialTime(seconds);
        setActive(true);
        setShowSelector(false);

        // Request notification permission for "Check-in" reminders
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = active ? (timeLeft / initialTime) * 100 : 0;

    return (
        <div className={`glass-card !p-0 overflow-hidden transition-all duration-500 border-indigo-500/20 ${active ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20' : ''}`}>
            <div className="p-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all ${active ? 'bg-indigo-600 shadow-indigo-600/40' : 'bg-white/5 border border-white/10'}`}>
                        <Timer size={18} className={active ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div>
                        <p className="h-header text-sm text-white tracking-wide uppercase">Proactive Safety Timer</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Automatic SOS if you don't check in</p>
                    </div>
                </div>
                {active && (
                    <button onClick={() => setActive(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-rose-400 transition-colors">
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="p-6">
                {!active && !showSelector && (
                    <button
                        onClick={() => setShowSelector(true)}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white h-header font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest"
                    >
                        <Zap size={18} className="text-yellow-500" />
                        Set Safety Timer
                    </button>
                )}

                {showSelector && (
                    <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {[300, 900, 1800].map(s => (
                            <button
                                key={s}
                                onClick={() => startTimer(s)}
                                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                            >
                                <span className="h-header text-lg text-white">{s / 60}m</span>
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Duration</span>
                            </button>
                        ))}
                        <button
                            onClick={() => setShowSelector(false)}
                            className="col-span-3 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {active && (
                    <div className="flex flex-col items-center gap-6 py-2 animate-in zoom-in duration-500">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Progress Ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="64" cy="64" r="60"
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="64" cy="64" r="60"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * progress) / 100}
                                    className="text-indigo-500 transition-all duration-1000 ease-linear"
                                />
                            </svg>
                            <span className="h-header text-4xl text-white tracking-tighter shimmer-text">{formatTime(timeLeft)}</span>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                <Bell size={12} className="text-indigo-400 animate-bounce" />
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Watching for check-in</p>
                            </div>

                            <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed italic">
                                A distress signal will be broadcast to your ICE contact automatically when the timer reaches zero.
                            </p>

                            <button
                                onClick={() => setActive(false)}
                                className="w-full bg-indigo-600 text-white h-header font-black py-4 rounded-2xl text-lg tracking-widest shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all uppercase"
                            >
                                I AM SAFE <ShieldAlert size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
