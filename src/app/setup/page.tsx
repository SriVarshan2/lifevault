'use client';

import { useState } from 'react';
import { Share, PlusSquare, MoreVertical, Monitor, Smartphone, Check, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
    const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-20">
            {/* HEADER */}
            <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 border border-[#dc2626]/20 px-3 py-1 rounded-full text-[#dc2626] text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={12} /> Privacy First Setup
                </div>
                <h1 className="text-4xl font-black tracking-tight leading-none">Access in 1-Tap.</h1>
                <p className="text-sm text-[#6b7280] max-w-xs mx-auto">First responders need your data in seconds. Adding Life Vault to your home screen ensures it's always ready, even offline.</p>
            </div>

            <div className="max-w-xl mx-auto px-4 space-y-8">

                {/* PLATFORM SWITCHER */}
                <div className="bg-[#111111] p-1 rounded-xl flex border border-[#1f1f1f]">
                    <button
                        onClick={() => setPlatform('ios')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${platform === 'ios' ? 'bg-[#1f1f1f] text-white shadow-xl' : 'text-[#6b7280]'}`}
                    >
                        <Smartphone size={16} /> iPhone
                    </button>
                    <button
                        onClick={() => setPlatform('android')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${platform === 'android' ? 'bg-[#1f1f1f] text-white shadow-xl' : 'text-[#6b7280]'}`}
                    >
                        <Smartphone size={16} /> Android
                    </button>
                </div>

                {/* GUIDES */}
                <div className="space-y-6">
                    {platform === 'ios' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Step number={1} icon={<Share size={18} />} title="Tap the Share Button" desc="In Safari, tap the Share icon at the bottom of your screen." />
                            <Step number={2} icon={<PlusSquare size={18} />} title="Add to Home Screen" desc="Scroll down and select 'Add to Home Screen' from the list." />
                            <Step number={3} icon={<Monitor size={18} />} title="Name it 'Medical ID'" desc="This makes it instantly recognizable as an emergency tool." />
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4 mt-8">
                                <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                    <Check className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm">PRO TIP: LOCK SCREEN SHORTCUT</p>
                                    <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">Go to Settings → Lock Screen → Customize. Add the Life Vault URL to your shortcuts for access without even unlocking.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Step number={1} icon={<MoreVertical size={18} />} title="Open Browser Menu" desc="Tap the three dots in the top right corner of Chrome." />
                            <Step number={2} icon={<Smartphone size={18} />} title="Install App / Add" desc="Select 'Add to Home screen' or 'Install app'." />
                            <Step number={3} icon={<Check size={18} />} title="Confirm Shortcut" desc="Tap 'Add' to place the Medical ID on your home screen." />
                        </div>
                    )}
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-8 space-y-6">
                    <Link href="/medical-id"
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-[0.98]"
                    >
                        Open My Medical ID <ArrowRight size={18} />
                    </Link>

                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">
                        <Link href="/vault" className="hover:text-white">Dashboard</Link>
                        <span>•</span>
                        <Link href="/why" className="hover:text-white">Why This Matters</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Step({ number, icon, title, desc }: { number: number, icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 flex items-start gap-5 group hover:border-[#dc2626]/30 transition-all duration-300">
            <div className="h-8 w-8 rounded-full bg-[#1f1f1f] border border-[#262626] flex items-center justify-center text-[#6b7280] font-black text-[10px] shrink-0 group-hover:bg-[#dc2626] group-hover:text-white group-hover:border-[#dc2626] transition-all">
                {number}
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-white">
                    {icon}
                    <h3 className="font-black text-sm uppercase tracking-tight">{title}</h3>
                </div>
                <p className="text-xs text-[#6b7280] leading-relaxed">{desc}</p>
            </div>
            <div className="ml-auto">
                <ChevronRight size={14} className="text-[#1f1f1f] group-hover:text-[#dc2626] transition-all" />
            </div>
        </div>
    );
}
