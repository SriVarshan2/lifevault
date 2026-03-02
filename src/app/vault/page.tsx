'use client';

import { useState, useEffect } from 'react';
import {
    Activity, ShieldAlert, Smartphone, Share2, Plus,
    ChevronRight, Heart, User, ClipboardList, Info,
    CheckCircle2, AlertCircle, X, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { getProfile } from '@/lib/storage';
import { LifeSignalProfile } from '@/lib/types';

export default function VaultDashboard() {
    const [profile, setProfile] = useState<LifeSignalProfile | null>(null);
    const [showPanic, setShowPanic] = useState(false);

    useEffect(() => {
        setProfile(getProfile());
    }, []);

    if (!profile) return null;

    // READINESS SCORE LOGIC
    const checkItems = [
        { label: 'Profile Complete', done: !!(profile.fullName && profile.bloodGroup) },
        { label: 'Allergies Listed', done: profile.allergies.length > 0 },
        { label: 'Medications Added', done: profile.medications.length > 0 },
        { label: 'Contact Verified', done: !!profile.emergencyContact.phone },
        { label: 'Diabetes Profile', done: profile.diabetesProfile?.hasDiabetes ? !!profile.diabetesProfile.lastSugarReading : true },
    ];

    const score = Math.round((checkItems.filter(i => i.done).length / checkItems.length) * 100);
    const strokeDash = 251.2 - (251.2 * score) / 100;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-32">
            {/* PANIC OVERLAY */}
            {showPanic && (
                <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300">
                    <iframe src="/medical-id" className="w-full h-full border-none" />
                    <button
                        onClick={() => setShowPanic(false)}
                        className="absolute top-6 right-6 h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>
            )}

            {/* HEADER */}
            <header className="max-w-xl mx-auto px-6 pt-12 pb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#dc2626] rounded-xl flex items-center justify-center text-white font-black text-xl">
                        ✚
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter">LIFE VAULT</h1>
                        <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">Premium Medical ID</p>
                    </div>
                </div>
                <Link href="/form" className="h-10 w-10 bg-[#111111] border border-[#1f1f1f] rounded-full flex items-center justify-center text-[#6b7280] hover:text-white transition-all">
                    <User size={18} />
                </Link>
            </header>

            <div className="max-w-xl mx-auto px-4 space-y-6">

                {/* READINESS SCORE */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 flex items-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#dc2626]/5 transition-all duration-700"></div>

                    <div className="relative h-24 w-24 shrink-0">
                        <svg className="h-full w-full -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#1f1f1f]" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray="251.2" strokeDashoffset={strokeDash}
                                className={`transition-all duration-1000 ease-out ${score > 70 ? 'text-[#16a34a]' : score > 40 ? 'text-[#d97706]' : 'text-[#dc2626]'}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black font-mono">{score}</span>
                            <span className="text-[8px] font-black uppercase text-[#6b7280]">Vault %</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-lg font-black tracking-tight">{score === 100 ? 'Vault Ready.' : 'Incomplete Vault.'}</h2>
                        <p className="text-xs text-[#6b7280] leading-relaxed">
                            {score === 100
                                ? 'Your medical identity is solid. Ensure your home screen shortcut is active.'
                                : 'Parameidcs need complete data. Add missing info for maximum safety.'}
                        </p>
                    </div>
                </div>

                {/* QUICK ACTIONS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/medical-id" className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-[#dc2626]/30 transition-all hover:bg-[#151515] group">
                        <div className="h-10 w-10 bg-[#dc2626]/10 rounded-xl flex items-center justify-center text-[#dc2626] mb-4 group-hover:scale-110 transition-transform">
                            <ShieldAlert size={20} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-1">My Medical ID</h3>
                        <p className="text-[10px] text-[#6b7280]">View emergency card</p>
                    </Link>
                    <Link href="/vault/sugar-log" className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-blue-500/30 transition-all hover:bg-[#151515] group">
                        <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-1">Sugar Log</h3>
                        <p className="text-[10px] text-[#6b7280]">Track daily glucose</p>
                    </Link>
                </div>

                {/* SETUP BANNER */}
                <Link href="/setup" className="block bg-[#16a34a] rounded-2xl p-6 relative overflow-hidden group active:scale-[0.98] transition-all">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-3xl -mr-24 -mt-24 group-hover:bg-white/30 transition-all"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm uppercase tracking-tight leading-none mb-1">One-Tap Access</h3>
                                <p className="text-[11px] text-white/80">Add Life Vault to your Home Screen</p>
                            </div>
                        </div>
                        <ChevronRight className="text-white/40 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                {/* DEMO BUTTON */}
                <button
                    onClick={() => setShowPanic(true)}
                    className="w-full bg-[#dc2626] text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-2xl shadow-[#dc2626]/30 hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                >
                    <ShieldAlert size={20} fill="currentColor" /> Show My Emergency ID
                </button>

                {/* WHY THIS MATTERS */}
                <div className="pt-8 text-center space-y-4">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">Privacy & Integrity</p>
                    <div className="flex items-center justify-center gap-2 text-[#16a34a]">
                        <ShieldCheck size={14} />
                        <p className="text-[10px] font-black uppercase">Zero-Knowledge Architecture</p>
                    </div>
                    <p className="text-[9px] text-[#6b7280] max-w-[240px] mx-auto italic">
                        No data is ever stored on a server. Your medical identity exists only on this device.
                    </p>
                    <Link href="/why" className="inline-block text-[10px] font-black uppercase tracking-widest underline underline-offset-4 text-white mt-4">The Life Vault Story</Link>
                </div>

            </div>
        </div>
    );
}
