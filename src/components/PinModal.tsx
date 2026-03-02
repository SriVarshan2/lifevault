'use client';
import { useState } from 'react';
import { Lock, X, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { getVaultMeta } from '@/lib/storage';
import { verifyPin } from '@/lib/crypto';

interface PinModalProps {
    onSuccess: () => void;
    onCancel: () => void;
    title?: string;
}

export default function PinModal({ onSuccess, onCancel, title = 'Authentication Required' }: PinModalProps) {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (pin.length < 4) { setError('PIN must be at least 4 digits'); return; }
        setLoading(true);
        setError('');
        const meta = getVaultMeta();
        if (!meta) { onSuccess(); return; }
        const ok = await verifyPin(pin, meta.pinHash, meta.pinSalt);
        setLoading(false);
        if (ok) {
            onSuccess();
        } else {
            setError('Invalid security credentials');
            setPin('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-sm space-y-8 relative overflow-hidden">

                {/* Background Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                        <Lock size={28} className="text-white opacity-80" />
                    </div>
                    <h2 className="h-header text-xl text-white uppercase tracking-tight">{title}</h2>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Verify your PIN to unlock protected health data</p>
                </div>

                <div className="space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            inputMode="numeric"
                            autoFocus
                            className="input-field text-center text-3xl tracking-[0.8em] font-black h-20 !p-0 placeholder:tracking-normal placeholder:text-xl placeholder:font-normal placeholder:opacity-20"
                            placeholder="••••"
                            maxLength={8}
                            value={pin}
                            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={e => e.key === 'Enter' && handleVerify()}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-emergency to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    </div>

                    {error && (
                        <div className="flex items-center justify-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-in shake duration-300">
                            <AlertCircle size={12} /> {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="btn-secondary !py-4 flex-1 flex items-center justify-center gap-2"
                        >
                            <X size={18} /> Cancel
                        </button>
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="btn-primary !py-4 flex-[2] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} /> Verify</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
