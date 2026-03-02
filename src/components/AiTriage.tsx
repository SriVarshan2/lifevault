'use client';
import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Loader2, RefreshCw, ChevronDown, ChevronUp, Globe, Volume2 } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';
import VoiceResponder from './VoiceResponder';

interface AiTriageProps {
    profile: LifeSignalProfile;
}

interface TriageResult {
    warnings: string[];
    safeFor: string[];
    priority: 'critical' | 'moderate' | 'stable';
    summary: string;
}

const PRIORITY_CONFIG = {
    critical: { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', label: '🔴 CRITICAL PRIORITY' },
    moderate: { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', label: '🟡 MODERATE RISK' },
    stable: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', label: '🟢 STABLE STATUS' },
};

// Hard-coded translations for common hackathon demo languages
const LOCALIZATIONS: Record<string, any> = {
    en: { label: 'Local Translation', analyze: 'Analyze', highRisk: 'High-Risk Warnings', clearance: 'Clinical Clearances' },
    fr: { label: 'Traduction Locale (FR)', analyze: 'Analyser', highRisk: 'Alertes à Haut Risque', clearance: 'Autorisations Cliniques' },
    es: { label: 'Traducción Local (ES)', analyze: 'Analizar', highRisk: 'Alertas de Alto Riesgo', clearance: 'Autorizaciones Clínicas' },
    hi: { label: 'स्थानीय अनुवाद (HI)', analyze: 'विश्लेषण करें', highRisk: 'उच्च जोखिम चेतावनी', clearance: 'नैदानिक मंजूरी' }
};

export default function AiTriage({ profile }: AiTriageProps) {
    const [result, setResult] = useState<TriageResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [lang, setLang] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        // Auto-detect language if location available (Demo logic for hackathon)
        if (navigator.language.startsWith('fr')) setLang('fr');
        else if (navigator.language.startsWith('es')) setLang('es');
        else if (navigator.language.startsWith('hi')) setLang('hi');
    }, []);

    const generateTriage = async (targetLang = 'en') => {
        setLoading(true);
        setError('');
        setExpanded(true);
        try {
            const res = await fetch('/api/triage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.fullName,
                    bloodGroup: profile.bloodGroup,
                    allergies: profile.allergies,
                    conditions: profile.conditions,
                    medications: profile.medications,
                    targetLang: targetLang // Pass to API for Gemini translation if available
                }),
            });
            const data = await res.json();
            setResult(data);
            setLang(targetLang);
        } catch (e: unknown) {
            setError('Intelligence service timeout. Retrying...');
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = (newLang: string) => {
        setIsTranslating(true);
        setTimeout(() => {
            generateTriage(newLang);
            setIsTranslating(false);
        }, 800);
    };

    const cfg = result ? PRIORITY_CONFIG[result.priority] : null;
    const t = LOCALIZATIONS[lang] || LOCALIZATIONS.en;

    return (
        <div className="space-y-4">
            <div className={`glass-card !p-5 transition-all duration-500 ${expanded && result ? 'ring-1 ring-white/10' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Sparkles size={16} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="h-header text-sm text-white tracking-wide uppercase">AI Triage Intelligence</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Guidance for First Responders</p>
                        </div>
                    </div>

                    {loading || isTranslating ? (
                        <Loader2 size={18} className="animate-spin text-indigo-400" />
                    ) : result ? (
                        <div className="flex items-center gap-2">
                            <div className="flex bg-white/5 rounded-lg border border-white/5 p-0.5">
                                {Object.keys(LOCALIZATIONS).map(l => (
                                    <button
                                        key={l}
                                        onClick={() => handleTranslate(l)}
                                        className={`px-2 py-1 text-[8px] font-bold uppercase rounded-md transition-all ${lang === l ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all text-gray-500">
                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => generateTriage(lang)}
                            className="h-header text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                            {t.analyze}
                        </button>
                    )}
                </div>

                {/* Result Area */}
                {expanded && result && !loading && !isTranslating && (
                    <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className={`rounded-xl p-4 border ${cfg!.bg} ${cfg!.border}`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className={`h-header text-xs font-black tracking-widest ${cfg!.color}`}>{cfg!.label}</p>
                                <div className="flex items-center gap-1 opacity-50">
                                    <Globe size={10} />
                                    <span className="text-[8px] font-bold uppercase">{lang} localized</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed font-medium">{result.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {result.warnings.length > 0 && (
                                <div className="space-y-2">
                                    <p className="label !text-rose-500/80 !mb-2 flex items-center gap-1.5 font-black">
                                        <AlertTriangle size={12} /> {t.highRisk}
                                    </p>
                                    <div className="space-y-1.5">
                                        {result.warnings.map((w, i) => (
                                            <div key={i} className="text-xs text-rose-200/90 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 leading-relaxed">
                                                {w}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.safeFor.length > 0 && (
                                <div className="space-y-2">
                                    <p className="label !text-emerald-500/80 !mb-2 font-black">{t.clearance}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.safeFor.map((s, i) => (
                                            <span key={i} className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-tight">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => generateTriage(lang)}
                            className="w-full py-2 text-[10px] font-bold text-gray-600 hover:text-gray-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 border-t border-white/5 pt-4">
                            <RefreshCw size={10} /> Re-analyze conditions
                        </button>
                    </div>
                )}

                {error && <p className="text-rose-400 text-[10px] mt-4 font-bold text-center uppercase tracking-widest">{error}</p>}
            </div>

            {/* ── UNIQUE FEATURE: Voice Responder ── */}
            {result && !loading && !isTranslating && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <VoiceResponder profile={profile} triageSummary={result.summary} />
                </div>
            )}
        </div>
    );
}
