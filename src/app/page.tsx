'use client';

import {
  Heart, ShieldAlert, ArrowRight, Smartphone,
  Activity, CheckCircle2, ShieldCheck, Zap,
  ChevronRight, Play, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/storage';

export default function LandingPage() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(!!getProfile()?.fullName);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans overflow-x-hidden selection:bg-[#dc2626] selection:text-white">

      {/* DOT BACKGROUND PATTERN (CSS ONLY) */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(#1f1f1f 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* TOP NAV */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[#dc2626] rounded-lg flex items-center justify-center text-white font-black text-sm">✚</div>
          <span className="font-black text-lg tracking-tighter">LIFE VAULT</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">
          <Link href="/why" className="hover:text-white transition-colors">Why It Matters</Link>
          <Link href="/medical-id/demo" className="hover:text-white transition-colors">See Demo</Link>
          {hasProfile ? (
            <Link href="/vault" className="text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5">Go to Vault</Link>
          ) : (
            <Link href="/form" className="text-white bg-[#dc2626] px-4 py-2 rounded-lg hover:bg-[#b91c1c]">Get Started</Link>
          )}
        </div>
        <div className="md:hidden">
          <Link href={hasProfile ? "/vault" : "/form"} className="h-10 w-10 bg-[#111111] border border-[#1f1f1f] rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-[#dc2626]" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 border border-[#dc2626]/20 px-3 py-1 rounded-full text-[#dc2626] text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} /> Privacy First Identity
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
            Your Medical Identity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Always Ready.</span>
          </h1>

          <p className="text-lg text-[#6b7280] max-w-md leading-relaxed">
            Smartphone medical IDs are too basic. Life Vault provides the high-density clinical data paramedics actually need in under 10 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/form" className="bg-[#dc2626] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Create Your Vault <ArrowRight size={18} />
            </Link>
            <Link href="/medical-id/demo" className="bg-[#111111] border border-[#1f1f1f] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#151515] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Play size={16} fill="currentColor" /> Medical ID Demo
            </Link>
          </div>

          <div className="pt-4 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#16a34a]" /> Offline Ready</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#16a34a]" /> Zero Cloud Storage</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#16a34a]" /> Free Forever</div>
          </div>
        </div>

        {/* APP MOCKUP PREVIEW */}
        <div className="relative group flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-300 min-h-[640px] overflow-visible" style={{ background: 'transparent' }}>
          {/* Background Glow - centered fixed size */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dc2626]/20 blur-[120px] rounded-full scale-75 group-hover:bg-[#dc2626]/30 transition-all duration-700 pointer-events-none"></div>

          <div className="relative mx-auto" style={{ width: '320px', height: '640px', background: 'transparent' }}>

            {/* Phone outer frame */}
            <div className="absolute inset-0 rounded-[48px] bg-[#1a1a1a] border-[6px] border-[#333333] z-10"
              style={{ boxShadow: '0 0 0 2px #111, inset 0 0 0 2px #222' }} />

            {/* Top notch/island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 
                  w-24 h-6 bg-[#0a0a0a] rounded-full z-30" />

            {/* Side buttons left */}
            <div className="absolute left-[-8px] top-24 w-[4px] h-8 
                  bg-[#333] rounded-l-sm z-0" />
            <div className="absolute left-[-8px] top-36 w-[4px] h-12 
                  bg-[#333] rounded-l-sm z-0" />
            <div className="absolute left-[-8px] top-52 w-[4px] h-12 
                  bg-[#333] rounded-l-sm z-0" />

            {/* Side button right (power) */}
            <div className="absolute right-[-8px] top-36 w-[4px] h-14 
                  bg-[#333] rounded-r-sm z-0" />

            {/* Screen area — content goes inside here */}
            <div className="absolute inset-[6px] rounded-[42px] overflow-hidden bg-[#0a0a0a] z-20">

              {/* Scrollable medical card content */}
              <div className="h-full overflow-y-auto scrollbar-none pt-8">
                <iframe src="/medical-id/demo" className="w-full h-[800px] pointer-events-none border-none bg-transparent" />

                {/* FIX 2: SUGAR LEVEL BOX POSITION */}
                <div className="px-4 pb-12 -mt-12 relative z-10">
                  <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#16a34a]/20 rounded-xl flex items-center justify-center text-[#16a34a]">
                        <Activity size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Blood Sugar</p>
                        <p className="text-lg font-black text-white">187 mg/dL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 
                  w-24 h-1 bg-[#444] rounded-full z-30" />

          </div>
        </div>

      </main>

      {/* STATS STRIP */}
      <section className="border-y border-[#1f1f1f] bg-[#111111]/50 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <StatItem
            val="250,000+"
            label="Medical errors annually"
            desc="A significant portion from missing history."
          />
          <StatItem
            val="8 SECONDS"
            label="Critical Assessment Window"
            desc="The time a responder has to save a life."
          />
          <StatItem
            val="100% OFFLINE"
            label="Identity Always Ready"
            desc="No internet required for scanning or access."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#1f1f1f] flex flex-col md:row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7280]">Built with intention. Local only. Private.</p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-white transition-colors">Safety Policy</Link>
          <Link href="/setup" className="hover:text-white transition-colors">Installation</Link>
        </div>
      </footer>

    </div>
  );
}

function StatItem({ val, label, desc }: { val: string, label: string, desc: string }) {
  return (
    <div className="space-y-1">
      <p className="text-3xl font-black text-white tracking-tighter">{val}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dc2626]">{label}</p>
      <p className="text-xs text-[#6b7280] leading-relaxed max-w-[200px] mx-auto md:mx-0">{desc}</p>
    </div>
  );
}
