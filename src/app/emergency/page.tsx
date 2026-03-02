'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Edit2, Share2, Phone, ShieldCheck, Activity, Info, FileText, Timer } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';
import { getProfile, getVaultMeta } from '@/lib/storage';
import TwoTierQR from '@/components/TwoTierQR';
import PinModal from '@/components/PinModal';
import SOSTrigger from '@/components/SOSTrigger';
import AiTriage from '@/components/AiTriage';
import SafetyTimer from '@/components/SafetyTimer';
import PdfCertificate from '@/components/PdfCertificate';

function Badge({ text, variant = 'default' }: { text: string; variant?: 'default' | 'danger' | 'info' }) {
    const styles = {
        default: 'bg-white/5 border-white/10 text-gray-300',
        danger: 'bg-red-500/10 border-red-500/20 text-rose-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[variant]} backdrop-blur-md`}>
            {text}
        </span>
    );
}

export default function EmergencyPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<LifeSignalProfile | null>(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [emergencyUrl, setEmergencyUrl] = useState('');
    const [hasPIN, setHasPIN] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const load = useCallback(() => {
        const p = getProfile();
        if (!p?.fullName) { router.replace('/form'); return; }
        setProfile(p);
        setEmergencyUrl(window.location.origin + '/emergency');
        setHasPIN(!!getVaultMeta()?.pinHash);
    }, [router]);

    useEffect(() => { load(); }, [load]);

    const handleEditClick = () => {
        if (hasPIN) setShowPinModal(true);
        else router.push('/form');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: 'LifeVault Emergency ID', url: emergencyUrl }); }
            catch { /* dismissed */ }
        } else {
            navigator.clipboard.writeText(emergencyUrl).then(() => alert('Access link copied to clipboard'));
        }
    };

    const triggerSOS = () => {
        // In a real app, this would trigger the SOSTrigger component's send logic.
        // For the UI demo, we'll alert and open the SOS panel if not present.
        const phone = profile?.emergencyContact?.phone || '';
        if (phone) {
            alert('⚠️ SAFETY TIMER EXPIRED: Distressing ICE contact now...');
            // Triggering the deep link directly since SOSTrigger is on page
            const msg = encodeURIComponent(`🚨 EMERGENCY! Safety check-in for ${profile?.fullName} failed. Last location: (Auto-trigger via Safety Timer)`);
            window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-dvh bg-vault">
                <div className="w-10 h-10 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const allergies = profile.allergies ? profile.allergies.split(',').map(s => s.trim()).filter(Boolean) : [];
    const conditions = profile.conditions ? profile.conditions.split(',').map(s => s.trim()).filter(Boolean) : [];
    const medications = profile.medications ? profile.medications.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="max-w-md mx-auto px-5 py-8 pb-32 space-y-6">

            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emergency to-emergency-deep flex items-center justify-center shadow-lg shadow-emergency/20">
                        <Heart className="text-white" size={20} fill="currentColor" />
                    </div>
                    <span className="h-header text-2xl tracking-tight text-white">LifeVault</span>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleShare}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <Share2 size={18} className="text-gray-300" />
                    </button>
                    <button onClick={handleEditClick}
                        className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-gray-300 hover:text-white transition-all">
                        <Edit2 size={14} /> Edit
                    </button>
                </div>
            </div>

            {/* Critical Status Bar */}
            <div className="glass-card flex items-center gap-4 py-4 px-5 border-l-4 border-l-emergency">
                <div className="soft-pulse">
                    <ShieldCheck className="text-emergency" size={24} />
                </div>
                <div>
                    <p className="h-header text-sm text-white uppercase tracking-wider">Active Emergency Profile</p>
                    <p className="text-xs text-gray-400">Verifiable medical identification active</p>
                </div>
            </div>

            {/* Advanced Tools Row */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShowTimer(!showTimer)}
                    className={`glass-card !p-4 flex flex-col gap-3 transition-all ${showTimer ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : ''}`}>
                    <Timer size={20} className={showTimer ? 'text-indigo-400' : 'text-gray-500'} />
                    <p className="h-header text-[10px] uppercase tracking-widest text-white leading-none">Safety Timer</p>
                </button>
                <button
                    onClick={() => setShowPdf(!showPdf)}
                    className={`glass-card !p-4 flex flex-col gap-3 transition-all ${showPdf ? 'ring-1 ring-emerald-500 bg-emerald-500/5' : ''}`}>
                    <FileText size={20} className={showPdf ? 'text-emerald-400' : 'text-gray-500'} />
                    <p className="h-header text-[10px] uppercase tracking-widest text-white leading-none">ID Certificate</p>
                </button>
            </div>

            {showTimer && <SafetyTimer onTrigger={triggerSOS} />}
            {showPdf && <PdfCertificate profile={profile} emergencyUrl={emergencyUrl} />}

            {/* SOS System */}
            <SOSTrigger profile={profile} />

            {/* AI Intelligence */}
            <AiTriage profile={profile} />

            {/* Primary Identity Card */}
            <div className="glass-card !p-0 overflow-hidden">
                <div className="p-6 pb-0">
                    <p className="label !mb-1">Patient Name</p>
                    <h1 className="h-header text-3xl text-white mb-6 uppercase tracking-tight">{profile.fullName}</h1>
                </div>
                <div className="bg-gradient-to-b from-emergency/20 to-emergency-deep/20 border-t border-white/10 p-8 text-center relative overflow-hidden">
                    <Heart className="absolute -right-8 -bottom-8 text-emergency/5 opacity-20 rotate-12" size={200} fill="currentColor" />

                    <p className="label !text-emergency/70 !mb-2">Verified Blood Group</p>
                    <div className="relative inline-block">
                        <span className="h-header text-9xl text-white leading-none tracking-tighter shimmer-text">{profile.bloodGroup}</span>
                    </div>
                </div>
            </div>

            {/* Medical Intelligence Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Activity size={16} className="text-emergency" />
                    <p className="h-header text-sm text-gray-300 uppercase tracking-widest">Medical intelligence</p>
                </div>

                <div className="glass-card space-y-6">
                    {allergies.length > 0 && (
                        <div>
                            <p className="label">⚠️ Documented Allergies</p>
                            <div className="flex flex-wrap gap-2">{allergies.map(a => <Badge key={a} text={a} variant="danger" />)}</div>
                        </div>
                    )}

                    {conditions.length > 0 && (
                        <div>
                            <p className="label">🏥 Chronic Conditions</p>
                            <div className="flex flex-wrap gap-2">{conditions.map(c => <Badge key={c} text={c} />)}</div>
                        </div>
                    )}

                    {medications.length > 0 && (
                        <div>
                            <p className="label">💊 Current Medications</p>
                            <div className="flex flex-wrap gap-2">{medications.map(m => <Badge key={m} text={m} variant="info" />)}</div>
                        </div>
                    )}

                    {profile.insuranceId && (
                        <div className="pt-2 border-t border-white/5">
                            <p className="label !mb-1">Insurance Policy ID</p>
                            <p className="text-white font-mono font-bold tracking-wider">{profile.insuranceId}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Emergency System */}
            <div className="glass-card">
                <div className="flex items-center gap-3 mb-5">
                    <Phone size={18} className="text-emergency" />
                    <p className="h-header text-sm text-white uppercase tracking-widest">In Case of Emergency (ICE)</p>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div>
                        <p className="h-header text-lg text-white font-bold">{profile.emergencyContact.name}</p>
                        <p className="text-gray-400 font-mono text-sm">{profile.emergencyContact.phone}</p>
                    </div>
                    <a
                        href={`tel:${profile.emergencyContact.phone.replace(/[\s\-\(\)]/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 flex items-center justify-center bg-emergency rounded-full shadow-lg shadow-emergency/20 hover:scale-105 active:scale-95 transition-all text-white"
                    >
                        <Phone size={20} fill="currentColor" />
                    </a>
                </div>
            </div>

            {/* QR Identification Tiers */}
            <div className="space-y-4">
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="glass-card w-full flex items-center justify-between hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                        <Info size={18} className="text-blue-400" />
                        <span className="h-header text-sm uppercase tracking-wider text-white">Access Verification QR</span>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 font-bold tracking-widest leading-normal">MODERNIZED</span>
                </button>

                {showQR && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <TwoTierQR profile={profile} emergencyUrl={emergencyUrl} />
                    </div>
                )}
            </div>

            {/* Footer Branding */}
            <div className="py-8 text-center space-y-3 opacity-30">
                <div className="flex items-center justify-center gap-2">
                    <Heart size={12} fill="currentColor" />
                    <p className="text-[10px] font-bold tracking-widest uppercase">Encrypted LifeVault v2.7 Premium</p>
                </div>
                <p className="text-[9px] max-w-[200px] mx-auto leading-relaxed">
                    Zero-knowledge architecture. All data stays local to this device unless securely shared by the owner.
                </p>
            </div>

            {showPinModal && (
                <PinModal
                    onSuccess={() => { setShowPinModal(false); router.push('/form'); }}
                    onCancel={() => setShowPinModal(false)}
                />
            )}
        </div>
    );
}
