'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, Phone, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getProfile } from '@/lib/storage';
import { LifeSignalProfile } from '@/lib/types';

export default function DynamicMedicalId() {
    const [profile, setProfile] = useState<LifeSignalProfile | null>(null);

    useEffect(() => {
        setProfile(getProfile());
    }, []);

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-[#dc2626]/10 rounded-full flex items-center justify-center animate-pulse">
                    <ShieldAlert className="text-[#dc2626]" size={32} />
                </div>
                <h1 className="text-xl font-black text-white px-2">Medical ID Not Found</h1>
                <p className="text-sm text-[#6b7280] max-w-xs">Your vault is empty. Create your emergency profile in the Life Vault app to enable this feature.</p>
                <Link href="/" className="bg-[#dc2626] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                    Create My Vault
                </Link>
            </div>
        );
    }

    // Pre-processing
    const allergies = profile.allergies.split(',').filter(Boolean).map(a => {
        const isCritical = a.toLowerCase().includes('critical') || a.toLowerCase().includes('severe');
        return { name: a.trim(), severity: isCritical ? 'CRITICAL' : 'Standard' };
    });

    const medications = profile.medications.split(',').filter(Boolean).map(m => m.trim());
    const conditions = profile.conditions.split(',').filter(Boolean).map(c => c.trim());

    const hasDiabetes = profile.diabetesProfile?.hasDiabetes;
    const sugarReading = profile.diabetesProfile?.lastSugarReading;

    const getSugarStatus = (val: number) => {
        if (val < 70) return { label: 'Low', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        if (val <= 140) return { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
        if (val <= 199) return { label: 'High', color: 'text-amber-500', bg: 'bg-amber-500/10' };
        return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-500/10' };
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-12">
            {/* ⚠ URGENT EMERGENCY BANNER */}
            <div className="bg-[#dc2626] py-3 px-4 text-center">
                <p className="text-sm font-black uppercase tracking-tighter flex items-center justify-center gap-2">
                    <ShieldAlert size={18} /> Emergency Medical Information — Life Vault ID: {profile.id.slice(0, 8).toUpperCase()}
                </p>
            </div>

            <div className="max-w-xl mx-auto px-4 mt-6 space-y-4">

                {/* PATIENT PROFILE */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-1">Patient Identity</p>
                    <h1 className="text-3vw md:text-3xl font-black tracking-tight">{profile.fullName}</h1>
                    <div className="flex gap-4 mt-2">
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Blood Type</p>
                            <p className="font-mono text-sm text-[#dc2626] font-bold underline">{profile.bloodGroup}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Last Updated</p>
                            <p className="text-[10px] text-[#6b7280] font-mono">{new Date(profile.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    </div>
                </div>

                {/* CRITICAL ALLERGIES */}
                {allergies.length > 0 && (
                    <div className="bg-[#111111] border-2 border-[#dc2626]/30 rounded-xl overflow-hidden">
                        <div className="bg-[#dc2626]/10 border-b border-[#dc2626]/20 py-2 px-6 flex items-center gap-2">
                            <AlertCircle size={14} className="text-[#dc2626]" />
                            <p className="text-[10px] font-black text-[#dc2626] uppercase tracking-widest">Medical Allergies</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {allergies.map((a, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <p className="font-bold text-lg leading-none">{a.name}</p>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded border ${a.severity === 'CRITICAL'
                                        ? 'bg-[#dc2626]/20 border-[#dc2626] text-[#dc2626] animate-pulse'
                                        : 'bg-white/5 border-white/10 text-[#6b7280]'
                                        }`}>
                                        {a.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DIABETES PROFILE (IF APPLICABLE) */}
                {hasDiabetes && (
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
                        <div className="bg-[#16a34a]/10 border-b border-[#16a34a]/20 py-2 px-6 flex items-center gap-2">
                            <Activity size={14} className="text-[#16a34a]" />
                            <p className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest">Diabetes Profile</p>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            {sugarReading && (
                                <div className="col-span-2 pb-4 border-b border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-[#6b7280] uppercase">Last Sugar Reading</p>
                                        <p className={`text-3xl font-black tracking-tighter ${getSugarStatus(sugarReading.value).color}`}>
                                            {sugarReading.value} <span className="text-sm">mg/dL</span>
                                        </p>
                                        <p className="text-[9px] text-[#6b7280] font-mono">Recorded: {new Date(sugarReading.recordedAt).toLocaleString([], { timeStyle: 'short' })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest ${getSugarStatus(sugarReading.value).bg} ${getSugarStatus(sugarReading.value).color}`}>
                                            {getSugarStatus(sugarReading.value).label}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] font-bold text-[#6b7280] uppercase">Type</p>
                                <p className="text-sm font-bold">{profile.diabetesProfile?.type}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#6b7280] uppercase">Insulin Dependent</p>
                                <p className="text-sm font-mono">{profile.diabetesProfile?.insulinDependent ? "YES" : "NO"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* MEDICATIONS & CONDITIONS */}
                {(medications.length > 0 || conditions.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {medications.length > 0 && (
                            <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Current Medications</p>
                                <div className="space-y-3">
                                    {medications.map((m, i) => (
                                        <div key={i} className="border-l-2 border-[#1f1f1f] pl-3 py-0.5">
                                            <p className="text-[13px] font-bold leading-none">{m}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {conditions.length > 0 && (
                            <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                                <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Chronic Conditions</p>
                                <div className="space-y-3">
                                    {conditions.map((c, i) => (
                                        <div key={i} className="border-l-2 border-[#1f1f1f] pl-3 py-0.5">
                                            <p className="text-[13px] font-bold leading-none">{c}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* DOCTOR INFO (IF APPLICABLE) */}
                {profile.personalDoctor && (
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Personal Physician</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">{profile.personalDoctor.name}</p>
                                <p className="text-[10px] text-[#6b7280]">{profile.personalDoctor.specialty} · {profile.personalDoctor.hospital}</p>
                                <p className="font-mono text-xs mt-1">{profile.personalDoctor.phone}</p>
                            </div>
                            <a
                                href={`tel:${profile.personalDoctor.phone.replace(/[\s\-\(\)]/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-transform active:scale-90"
                            >
                                <Phone size={18} className="text-white" fill="currentColor" />
                            </a>
                        </div>
                    </div>
                )}

                {/* EMERGENCY CONTACT */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">ICE - In Case of Emergency</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold">{profile.emergencyContact.name}</p>
                            <p className="text-xs text-[#6b7280] mb-0.5">Primary Contact</p>
                            <p className="font-mono text-xs">{profile.emergencyContact.phone}</p>
                        </div>
                        <a
                            href={`tel:${profile.emergencyContact.phone.replace(/[\s\-\(\)]/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="h-14 w-14 rounded-full bg-[#16a34a] hover:bg-[#15803d] flex items-center justify-center shadow-lg shadow-[#16a34a]/20 transition-transform active:scale-95 animate-bounce-subtle"
                        >
                            <Phone size={24} className="text-white" fill="currentColor" />
                        </a>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="pt-8 text-center space-y-6 opacity-60">
                    <p className="text-[9px] leading-relaxed max-w-xs mx-auto">
                        Store this profile as a shortcut on your home screen for instant emergency access.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/vault" className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Vault Dashboard</Link>
                        <Link href="/setup" className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">Setup Shortcut</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
