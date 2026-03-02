'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, History, Activity, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getProfile, saveProfile } from '@/lib/storage';
import { LifeSignalProfile } from '@/lib/types';

export default function SugarLogPage() {
    const [profile, setProfile] = useState<LifeSignalProfile | null>(null);
    const [reading, setReading] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        setProfile(getProfile());
    }, []);

    const getStatus = (value: number) => {
        if (value < 70) return { label: 'Low', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/40', icon: AlertCircle };
        if (value <= 140) return { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/40', icon: CheckCircle2 };
        if (value <= 199) return { label: 'High', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/40', icon: AlertCircle };
        return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/40', icon: AlertCircle };
    };

    const addReading = () => {
        if (!profile || !reading) return;
        const val = parseInt(reading);
        if (isNaN(val)) return;

        const now = new Date().toISOString();
        const newLog = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'blood_sugar' as const,
            value: reading,
            unit: 'mg/dL',
            recordedAt: now,
            note: note
        };

        const updatedProfile: LifeSignalProfile = {
            ...profile,
            vitalHistory: [newLog, ...(profile.vitalHistory || [])].slice(0, 20),
            diabetesProfile: {
                ...(profile.diabetesProfile || {
                    hasDiabetes: true,
                    type: 'Type 2',
                    insulinDependent: false,
                    targetRange: { min: 80, max: 140 },
                    carriesGlucoseKit: false
                }),
                lastSugarReading: {
                    value: val,
                    unit: 'mg/dL',
                    recordedAt: now
                }
            },
            updatedAt: now
        };

        setProfile(updatedProfile);
        saveProfile(updatedProfile);
        setReading('');
        setNote('');
    };

    const deleteReading = (id: string) => {
        if (!profile) return;
        const updated = {
            ...profile,
            vitalHistory: profile.vitalHistory?.filter(h => h.id !== id) || []
        };
        setProfile(updated);
        saveProfile(updated);
    };

    if (!profile) return <div className="p-8 text-center bg-[#0a0a0a] min-h-screen text-white">Loading vault...</div>;

    const history = profile.vitalHistory?.filter(h => h.type === 'blood_sugar') || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-20">
            {/* HEADER */}
            <div className="border-b border-[#1f1f1f] bg-[#111111]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/vault" className="flex items-center gap-2 text-sm font-bold text-[#6b7280] hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Vault
                    </Link>
                    <h1 className="text-sm font-black uppercase tracking-widest text-[#dc2626]">Sugar Level Tracker</h1>
                    <div className="w-16"></div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 mt-8 space-y-8">

                {/* INPUT SECTION */}
                <section className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dc2626]/5 blur-3xl -mr-16 -mt-16"></div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-[#dc2626]/10 rounded-lg">
                            <Activity size={18} className="text-[#dc2626]" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">Log Current Reading</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest block mb-2">Blood Glucose (mg/dL)</label>
                                <input
                                    type="number"
                                    value={reading}
                                    onChange={(e) => setReading(e.target.value)}
                                    placeholder="e.g. 110"
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-4 text-2xl font-black focus:outline-none focus:border-[#dc2626] transition-colors"
                                />
                            </div>
                            <div className="hidden sm:block w-32 pt-8">
                                <p className="text-xs text-[#6b7280]">Target: 80–140</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest block mb-2">Notes (Optional)</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Fasting, After lunch"
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dc2626] transition-colors"
                            />
                        </div>

                        <button
                            onClick={addReading}
                            disabled={!reading}
                            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Log Reading
                        </button>
                    </div>
                </section>

                {/* HISTORY SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <History size={16} className="text-[#6b7280]" />
                        <h2 className="text-xs font-black text-[#6b7280] uppercase tracking-widest">Recent History</h2>
                    </div>

                    {history.length === 0 ? (
                        <div className="bg-[#111111] border border-[#1f1f1f] border-dashed rounded-2xl p-12 text-center space-y-2">
                            <p className="text-[#6b7280] font-bold text-sm">No readings yet.</p>
                            <p className="text-[10px] text-[#6b7280]/60">Your latest logs will appear here and on your Medical ID.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((h) => {
                                const val = parseInt(h.value);
                                const status = getStatus(val);
                                const StatusIcon = status.icon;

                                return (
                                    <div key={h.id} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-4 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${status.bg} ${status.color}`}>
                                                <StatusIcon size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xl font-black tracking-tight">{h.value} <span className="text-[10px] font-mono text-[#6b7280]">mg/dL</span></p>
                                                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${status.bg} ${status.border} ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-[#6b7280] font-mono mt-0.5">
                                                    {new Date(h.recordedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    {h.note && ` · ${h.note}`}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteReading(h.id)}
                                            className="p-2 text-[#6b7280] hover:text-[#dc2626] opacity-0 group-hover:opacity-100 transition-all transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
