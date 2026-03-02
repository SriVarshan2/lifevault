'use client';
import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Play, Square, Headphones } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';

interface VoiceResponderProps {
    profile: LifeSignalProfile;
    triageSummary?: string;
}

export default function VoiceResponder({ profile, triageSummary }: VoiceResponderProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        setSupported('speechSynthesis' in window);
    }, []);

    const stop = () => {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speak = () => {
        if (!supported) return;

        // Stop any existing speech
        window.speechSynthesis.cancel();

        const text = `
      Emergency Medical Summary for ${profile.fullName}. 
      Blood Group is ${profile.bloodGroup}. 
      Allergies: ${profile.allergies || 'None documented'}. 
      Current Medications: ${profile.medications || 'None documented'}. 
      ${triageSummary ? `AI Triage Intelligence: ${triageSummary}` : ''}
      Repeat: Blood Group ${profile.bloodGroup}.
    `;

        const utterance = new SpeechSynthesisUtterance(text);

        // Select a clear, high-quality voice if available
        const voices = window.speechSynthesis.getVoices();
        const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || voices[0];
        if (premiumVoice) utterance.voice = premiumVoice;

        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    if (!supported) return null;

    return (
        <div className={`glass-card !p-5 transition-all duration-300 ${isSpeaking ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20 bg-emerald-500/5' : ''}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                        {isSpeaking ? <Volume2 className="animate-pulse" size={20} /> : <Headphones size={20} />}
                    </div>
                    <div>
                        <p className="h-header text-sm text-white tracking-wide uppercase">Voice Responder</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Hands-free medical briefing</p>
                    </div>
                </div>

                {isSpeaking ? (
                    <button
                        onClick={stop}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 text-white h-header text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20"
                    >
                        <Square size={14} fill="currentColor" /> Stop
                    </button>
                ) : (
                    <button
                        onClick={speak}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white h-header text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                    >
                        <Play size={14} fill="currentColor" /> Listen
                    </button>
                )}
            </div>

            {isSpeaking && (
                <div className="mt-4 flex gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-emerald-500 rounded-full animate-wave"
                            style={{
                                height: `${Math.random() * 20 + 5}px`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
