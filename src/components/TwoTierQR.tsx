'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Lock, Unlock, Download, ShieldCheck, ShieldAlert, Fingerprint } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';
import { encodeProfileForQR } from '@/lib/qr-logic';
import PinModal from './PinModal';
import { getVaultMeta } from '@/lib/storage';

interface TwoTierQRProps {
    profile: LifeSignalProfile;
    emergencyUrl: string;
}

export default function TwoTierQR({ profile, emergencyUrl }: TwoTierQRProps) {
    const [tier, setTier] = useState<'public' | 'private'>('public');
    const [showPinModal, setShowPinModal] = useState(false);
    const hasPIN = !!getVaultMeta()?.pinHash;

    const publicData = emergencyUrl;
    const privateData = encodeProfileForQR(profile);

    const currentData = tier === 'public' ? publicData : privateData;
    const currentLabel = tier === 'public'
        ? 'Responder Mode — URL Identification'
        : 'Clinical Mode — Offline Medical Payload';

    const handlePrivateClick = () => {
        if (tier === 'private') { setTier('public'); return; }
        if (hasPIN) setShowPinModal(true);
        else setTier('private');
    };

    const downloadQR = () => {
        const svg = document.querySelector('#two-tier-qr svg') as SVGElement;
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 1000; canvas.height = 1000;
        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 1000, 1000);
            ctx.drawImage(img, 100, 100, 800, 800);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `LifeVault-${tier}-Verification.png`;
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="glass-card !p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Fingerprint size={16} className="text-blue-400" />
                </div>
                <div>
                    <p className="h-header text-sm text-white tracking-wide uppercase">Verification QR Tier</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select scanning environment</p>
                </div>
            </div>

            {/* Switcher */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                <button
                    onClick={() => setTier('public')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tier === 'public' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <ShieldAlert size={14} className={tier === 'public' ? 'text-emergency' : ''} /> Responder
                </button>
                <button
                    onClick={handlePrivateClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tier === 'private' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <ShieldCheck size={14} /> Clinical {hasPIN && <Lock size={10} className="ml-1 opacity-50" />}
                </button>
            </div>

            {/* Status Alert */}
            <div className={`p-4 rounded-xl border flex gap-3 ${tier === 'public'
                    ? 'bg-rose-500/5 border-rose-500/10 text-rose-300/80'
                    : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-300/80'
                }`}>
                <div className="mt-0.5">
                    {tier === 'public' ? <Unlock size={14} /> : <Lock size={14} />}
                </div>
                <p className="text-[11px] leading-relaxed font-medium italic">
                    {tier === 'public'
                        ? 'Open access identifier. Safe for phone lock screens. Scanning routes directly to your LifeVault emergency display.'
                        : 'Encrypted medical payload. Contains full history. For hospital-grade clinical scanners in offline environments.'}
                </p>
            </div>

            {/* QR Render */}
            <div className="flex flex-col items-center gap-6 py-4">
                <div id="two-tier-qr" className={`p-6 rounded-[2rem] bg-white shadow-2xl transition-all duration-700 ${tier === 'public' ? 'shadow-rose-500/20' : 'shadow-indigo-500/20'
                    }`}>
                    <QRCodeSVG
                        value={currentData}
                        size={200}
                        level="H"
                        bgColor="#ffffff"
                        fgColor={tier === 'public' ? '#0a0a0a' : '#2e1065'}
                    />
                </div>

                <div className="text-center">
                    <p className="h-header text-sm text-white uppercase tracking-widest">{currentLabel}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Verifiable System ID: {profile.id.slice(0, 8)}</p>
                </div>
            </div>

            <button onClick={downloadQR}
                className="btn-secondary flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest group">
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                Download Identification Certificate
            </button>

            {showPinModal && (
                <PinModal
                    title="Security PIN Verification Required"
                    onSuccess={() => { setShowPinModal(false); setTier('private'); }}
                    onCancel={() => setShowPinModal(false)}
                />
            )}
        </div>
    );
}
