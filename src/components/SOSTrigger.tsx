'use client';
import { useState } from 'react';
import { AlertOctagon, MapPin, Loader2, CheckCircle, SendHorizonal, X } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';

interface SOSTriggerProps {
    profile: LifeSignalProfile;
}

type SOSState = 'idle' | 'locating' | 'ready' | 'sent';

export default function SOSTrigger({ profile }: SOSTriggerProps) {
    const [state, setState] = useState<SOSState>('idle');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState('');

    const buildMessage = (lat: number, lng: number) => {
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        const parts = [
            `🚨 EMERGENCY — ${profile.fullName} needs help NOW`,
            `📍 Live Location: ${mapsLink}`,
            `🩸 Blood Group: ${profile.bloodGroup}`,
            profile.allergies ? `⚠️ ALLERGIES: ${profile.allergies}` : '',
            `📲 Full Emergency ID: ${typeof window !== 'undefined' ? window.location.href : ''}`,
        ].filter(Boolean).join('\n');
        return encodeURIComponent(parts);
    };

    const getLocation = () => {
        setState('locating');
        setError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setState('ready');
            },
            () => {
                setCoords(null);
                setState('ready');
                setError('Location unavailable — Contacting without GPS');
            },
            { timeout: 8000 }
        );
    };

    const sendSOS = () => {
        const phone = profile.emergencyContact.phone.replace(/[\s\-()]/g, '').replace('+', '');
        const msg = buildMessage(coords?.lat ?? 0, coords?.lng ?? 0);
        const whatsappUrl = `https://wa.me/${phone}?text=${msg}`;
        window.open(whatsappUrl, '_blank');
        setState('sent');
    };

    const reset = () => { setState('idle'); setCoords(null); setError(''); };

    return (
        <div className={`glass-card !p-0 overflow-hidden transition-all duration-500 border-rose-500/20 ${state !== 'idle' ? 'ring-2 ring-rose-500' : ''}`}>
            <div className="p-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/40">
                        <AlertOctagon size={18} className="text-white" fill="currentColor" />
                    </div>
                    <div>
                        <p className="h-header text-sm text-white tracking-wide uppercase">Satellite SOS System</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">One-tap critical response</p>
                    </div>
                </div>
                {state !== 'idle' && (
                    <button onClick={reset} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="p-6">
                {state === 'idle' && (
                    <button
                        onClick={getLocation}
                        className="w-full bg-emergency text-white h-header font-black py-5 rounded-2xl text-xl tracking-widest shadow-xl shadow-emergency/40 hover:scale-[1.02] active:scale-95 transition-all uppercase"
                    >
                        I Need Help Now
                    </button>
                )}

                {state === 'locating' && (
                    <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                            <Loader2 size={40} className="animate-spin text-rose-500 relative" />
                        </div>
                        <p className="h-header text-xs text-white uppercase tracking-widest">Triangulating Position…</p>
                    </div>
                )}

                {state === 'ready' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-emerald-400" />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">GPS Coordinates</p>
                                    <p className="text-white font-mono text-xs">{coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Manual override'}</p>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-center text-xs text-gray-400 px-4 leading-relaxed">
                                Target: <strong className="text-white uppercase tracking-tight">{profile.emergencyContact.name}</strong><br />
                                Message includes location + full medical ID summary.
                            </p>
                            <button
                                onClick={sendSOS}
                                className="w-full bg-emerald-600 text-white h-header font-black py-4 rounded-2xl text-lg tracking-widest shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all uppercase"
                            >
                                Assemble Response <SendHorizonal size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {state === 'sent' && (
                    <div className="flex flex-col items-center gap-4 py-4 animate-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                            <CheckCircle size={32} className="text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <p className="h-header text-lg text-white uppercase tracking-tighter">Signal Sent</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-8 mt-1">
                                Emergency contact {profile.emergencyContact.name} alerted via prioritized satellite-link.
                            </p>
                        </div>
                        <button onClick={reset} className="text-xs text-blue-400 hover:underline mt-4 font-bold tracking-widest uppercase">Start New Alert</button>
                    </div>
                )}

                {error && <p className="text-rose-400 text-[10px] font-black mt-4 text-center uppercase tracking-widest italic">{error}</p>}
            </div>
        </div>
    );
}
