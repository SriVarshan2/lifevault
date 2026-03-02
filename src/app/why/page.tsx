'use client';

import { ShieldCheck, Heart, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Clock, Activity, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function WhyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-24">
            {/* HEADER */}
            <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 border border-[#dc2626]/20 px-3 py-1 rounded-full text-[#dc2626] text-[10px] font-black uppercase tracking-widest">
                    <AlertTriangle size={12} /> The Problem
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                    Every 4 minutes, someone dies from a preventable error.
                </h1>
                <p className="text-md text-[#6b7280] leading-relaxed max-w-sm mx-auto">
                    First responders often arrive without the most basic info — blood type, allergies, medications.
                    In 2024, this shouldn't happen.
                </p>
            </div>

            <div className="max-w-xl mx-auto px-4 space-y-16">

                {/* THE PITCH */}
                <section className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-2 text-[#6b7280]">
                        <Heart size={16} />
                        <p className="text-[10px] font-black uppercase tracking-widest">The Human Reality</p>
                    </div>
                    <p className="text-sm text-[#f5f5f5] leading-relaxed">
                        A significant number of medical fatalities involve basic missing information that first responders simply did not have in time.
                        This is not a technology problem. Every person already carries the solution in their pocket.
                    </p>
                    <div className="bg-[#dc2626]/10 border-l-2 border-[#dc2626] p-4 italic text-[#dc2626] text-xs">
                        "Life Vault puts critical medical data where it belongs: accessible in under 10 seconds, without an app, without a login, without internet."
                    </div>
                </section>

                {/* COMPARISON TIMELINE */}
                <section className="space-y-8">
                    <h2 className="text-center text-xs font-black uppercase tracking-[0.2em] text-[#6b7280]">The Timeline Paradox</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* WITHOUT LIFE VAULT */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-[#dc2626] uppercase flex items-center gap-2">
                                <X size={14} /> Without Life Vault
                            </h3>
                            <div className="space-y-4 relative pl-6 border-l-2 border-[#dc2626]/20">
                                <TimelinePoint time="0:00" desc="Patient found unconscious" />
                                <TimelinePoint time="0:30" desc="First responder arrives" />
                                <TimelinePoint time="3:00" desc="Hospital tries to reach family" />
                                <TimelinePoint time="8:00" desc="Medical history partially obtained" />
                                <TimelinePoint time="8:30" desc="Wrong medication risk identified" isLast danger />
                            </div>
                        </div>

                        {/* WITH LIFE VAULT */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-[#16a34a] uppercase flex items-center gap-2">
                                <ShieldCheck size={14} /> With Life Vault
                            </h3>
                            <div className="space-y-4 relative pl-6 border-l-2 border-[#16a34a]/20">
                                <TimelinePoint time="0:00" desc="Patient found unconscious" />
                                <TimelinePoint time="0:30" desc="First responder arrives" />
                                <TimelinePoint time="0:38" desc="QR scanned from lock screen" />
                                <TimelinePoint time="0:40" desc="Blood type, allergies visible" />
                                <TimelinePoint time="1:00" desc="Correct medication administered" isLast success />
                            </div>
                        </div>
                    </div>
                </section>

                {/* WHY VS APPLE */}
                <section className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#16a34a]/5 blur-3xl -mr-16 -mt-16"></div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight mb-2">Life Vault vs Smartphone ID</h2>
                        <p className="text-xs text-[#6b7280]">Apple's Medical ID shows your name and one phone number. That is not enough.</p>
                    </div>

                    <div className="space-y-4">
                        <ComparisonRow title="What type of diabetes?" apple={false} vault={true} />
                        <ComparisonRow title="Last recorded sugar level?" apple={false} vault={true} />
                        <ComparisonRow title="Insulin dependency?" apple={false} vault={true} />
                        <ComparisonRow title="Doctor's hospital & number?" apple={false} vault={true} />
                        <ComparisonRow title="Specific allergy reactions?" apple={false} vault={true} />
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center pt-12">
                    <Link href="/" className="bg-[#dc2626] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-3 w-full">
                        Create Your Vault <ArrowRight size={18} />
                    </Link>
                    <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest mt-6">It takes 4 minutes. It lasts a lifetime.</p>
                </div>

            </div>
        </div>
    );
}

function TimelinePoint({ time, desc, isLast, danger, success }: { time: string, desc: string, isLast?: boolean, danger?: boolean, success?: boolean }) {
    return (
        <div className="relative group">
            <div className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-4 border-[#0a0a0a] z-10 
          ${danger ? 'bg-[#dc2626] animate-pulse shadow-lg shadow-[#dc2626]/40' :
                    success ? 'bg-[#16a34a] shadow-lg shadow-[#16a34a]/40' :
                        'bg-[#1f1f1f]'}`}
            />
            <div className="space-y-0.5">
                <p className={`text-[10px] font-black uppercase tracking-widest ${danger ? 'text-[#dc2626]' : success ? 'text-[#16a34a]' : 'text-[#6b7280]'}`}>{time}</p>
                <p className="text-xs font-bold text-[#f5f5f5]">{desc}</p>
            </div>
        </div>
    );
}

function ComparisonRow({ title, apple, vault }: { title: string, apple: boolean, vault: boolean }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-[11px] font-medium text-[#f5f5f5]">{title}</span>
            <div className="flex gap-4">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${apple ? 'bg-[#6b7280]/20 text-[#6b7280]' : 'bg-[#dc2626]/10 text-[#dc2626]'}`}>
                    {apple ? <CheckCircle2 size={12} /> : <X size={12} />}
                </div>
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${vault ? 'bg-[#16a34a]/20 text-[#16a34a]' : 'bg-white/5 text-white/20'}`}>
                    {vault ? <CheckCircle2 size={12} /> : <X size={12} />}
                </div>
            </div>
        </div>
    );
}
