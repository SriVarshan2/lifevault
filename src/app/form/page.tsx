'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Heart, ArrowRight, ArrowLeft, Save,
    User, Droplets, ShieldAlert, Phone, ShieldCheck,
    ChevronRight, Sparkles
} from 'lucide-react';
import { LifeSignalProfile, BloodGroup } from '@/lib/types';
import { saveProfile, getProfile, saveVaultMeta } from '@/lib/storage';
import { hashPin, generateSalt, generateId } from '@/lib/crypto';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function FormPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        bloodGroup: '' as BloodGroup | '',
        allergies: '',
        conditions: '',
        medications: '',
        insuranceId: '',
        // Diabetes Profile
        hasDiabetes: false,
        diabetesType: '' as any,
        insulinDependent: false,
        // Doctor Info
        docName: '',
        docPhone: '',
        docHospital: '',
        // Emergency Contact
        contactName: '',
        contactPhone: '',
        pin: '',
        confirmPin: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const existing = getProfile();
        if (existing) {
            setForm({
                fullName: existing.fullName || '',
                bloodGroup: existing.bloodGroup || '',
                allergies: existing.allergies || '',
                conditions: existing.conditions || '',
                medications: existing.medications || '',
                insuranceId: existing.insuranceId || '',
                hasDiabetes: existing.diabetesProfile?.hasDiabetes || false,
                diabetesType: existing.diabetesProfile?.type || '',
                insulinDependent: existing.diabetesProfile?.insulinDependent || false,
                docName: existing.personalDoctor?.name || '',
                docPhone: existing.personalDoctor?.phone || '',
                docHospital: existing.personalDoctor?.hospital || '',
                contactName: existing.emergencyContact?.name || '',
                contactPhone: existing.emergencyContact?.phone || '',
                pin: '',
                confirmPin: '',
            });
        }
    }, []);

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (step === 0) {
            if (!form.fullName.trim()) e.fullName = 'Full identification name required';
            if (!form.bloodGroup) e.bloodGroup = 'Clinical blood group must be selected';
        }
        if (step === 2) {
            if (!form.contactName.trim()) e.contactName = 'ICE Contact name required';
            if (!form.contactPhone.trim()) e.contactPhone = 'ICE Contact phone required';
        }
        if (step === 3 && form.pin) {
            if (form.pin.length < 4) e.pin = 'PIN must be at least 4 digits';
            if (form.pin !== form.confirmPin) e.confirmPin = 'PINs do not match';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) setStep(s => s + 1); };
    const back = () => setStep(s => s - 1);

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const existing = getProfile();
            const now = new Date().toISOString();
            const profile: LifeSignalProfile = {
                id: existing?.id ?? generateId(),
                fullName: form.fullName.trim(),
                bloodGroup: form.bloodGroup as BloodGroup,
                allergies: form.allergies.trim(),
                conditions: form.conditions.trim(),
                medications: form.medications.trim(),
                insuranceId: form.insuranceId.trim(),
                diabetesProfile: {
                    hasDiabetes: form.hasDiabetes,
                    type: form.diabetesType || null,
                    insulinDependent: form.insulinDependent,
                    lastSugarReading: existing?.diabetesProfile?.lastSugarReading || null,
                    targetRange: existing?.diabetesProfile?.targetRange || { min: 80, max: 140 },
                    carriesGlucoseKit: existing?.diabetesProfile?.carriesGlucoseKit || false,
                },
                personalDoctor: form.docName ? {
                    name: form.docName,
                    specialty: 'Physician',
                    phone: form.docPhone,
                    hospital: form.docHospital
                } : null,
                emergencyContact: {
                    name: form.contactName.trim(),
                    phone: form.contactPhone.trim(),
                },
                vitalHistory: existing?.vitalHistory || [],
                createdAt: existing?.createdAt || now,
                updatedAt: now,
            };
            saveProfile(profile);

            if (form.pin) {
                const salt = generateSalt();
                const pinHash = await hashPin(form.pin, salt);
                saveVaultMeta({ pinHash, pinSalt: salt, lastModified: now });
            }

            router.push('/vault');
        } finally {
            setSaving(false);
        }
    };

    const steps = [
        { title: 'Identity', icon: User, desc: 'Personal identification' },
        { title: 'Clinical', icon: ShieldAlert, desc: 'Medical intelligence' },
        { title: 'Emergency', icon: Phone, desc: 'Emergency response' },
        { title: 'Security', icon: ShieldCheck, desc: 'Vault protection' },
    ];

    return (
        <div className="max-w-md mx-auto px-5 py-8 pb-32">

            {/* Branding */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg bg-emergency flex items-center justify-center">
                    <Heart className="text-white" size={16} fill="currentColor" />
                </div>
                <span className="h-header text-xl tracking-tight text-white uppercase">LifeVault Setup</span>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-start mb-10 px-2">
                {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${step === i ? 'bg-emergency border-emergency shadow-lg shadow-emergency/20 text-white' :
                            step > i ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-gray-600'
                            }`}>
                            <s.icon size={18} />
                        </div>
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${step === i ? 'text-emergency' : 'text-gray-600'}`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="mb-8">
                    <h2 className="h-header text-2xl text-white mb-1">{steps[step].title}</h2>
                    <p className="text-sm text-gray-500">{steps[step].desc}</p>
                </div>

                {step === 0 && (
                    <div className="space-y-6">
                        <div>
                            <label className="label">Full Legal Name</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                            />
                            {errors.fullName && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label className="label">Clinical Blood Group</label>
                            <div className="grid grid-cols-4 gap-2">
                                {BLOOD_GROUPS.map(bg => (
                                    <button
                                        key={bg}
                                        onClick={() => setForm({ ...form, bloodGroup: bg })}
                                        className={`py-3 rounded-xl h-header text-lg transition-all border ${form.bloodGroup === bg
                                            ? 'bg-emergency border-emergency text-white shadow-lg shadow-emergency/20'
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {bg}
                                    </button>
                                ))}
                            </div>
                            {errors.bloodGroup && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.bloodGroup}</p>}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="label">Drug Allergies (Comma separated)</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="e.g. Penicillin, Sulfa"
                                value={form.allergies}
                                onChange={e => setForm({ ...form, allergies: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Chronic Conditions</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="e.g. Type 1 Diabetes, Epilepsy"
                                value={form.conditions}
                                onChange={e => setForm({ ...form, conditions: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Current Medications</label>
                            <textarea
                                className="input-field min-h-[80px] resize-none"
                                placeholder="e.g. Insulin, Metoprolol"
                                value={form.medications}
                                onChange={e => setForm({ ...form, medications: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Health Insurance ID (Optional)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Policy #123456"
                                value={form.insuranceId}
                                onChange={e => setForm({ ...form, insuranceId: e.target.value })}
                            />
                        </div>

                        {/* DIABETES SECTION */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-[#6b7280]">Diabetes Profile</label>
                                <button
                                    onClick={() => setForm({ ...form, hasDiabetes: !form.hasDiabetes })}
                                    className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${form.hasDiabetes ? 'bg-[#16a34a]/20 border-[#16a34a] text-[#16a34a]' : 'bg-white/5 border-white/10 text-[#6b7280]'}`}
                                >
                                    {form.hasDiabetes ? 'ENABLED' : 'DISABLED'}
                                </button>
                            </div>

                            {form.hasDiabetes && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-[#6b7280] uppercase mb-2 block">Type</label>
                                            <select
                                                value={form.diabetesType}
                                                onChange={e => setForm({ ...form, diabetesType: e.target.value as any })}
                                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl px-4 py-3 text-sm focus:border-emergency outline-none"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Type 1">Type 1</option>
                                                <option value="Type 2">Type 2</option>
                                                <option value="Gestational">Gestational</option>
                                                <option value="Pre-diabetic">Pre-diabetic</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.insulinDependent}
                                                    onChange={e => setForm({ ...form, insulinDependent: e.target.checked })}
                                                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-emergency"
                                                />
                                                <span className="text-[10px] font-bold text-[#6b7280] uppercase">Insulin Dependent</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex gap-3 mb-6">
                            <Droplets size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-300 leading-relaxed italic">
                                This contact will be the primary recipient of SOS alerts including your GPS coordinates.
                            </p>
                        </div>
                        <div>
                            <label className="label">Contact Full Name</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Emergency Contact Name"
                                value={form.contactName}
                                onChange={e => setForm({ ...form, contactName: e.target.value })}
                            />
                            {errors.contactName && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.contactName}</p>}
                        </div>
                        <div>
                            <label className="label">Contact Phone Number</label>
                            <input
                                type="tel"
                                className="input-field font-mono"
                                placeholder="+1 555 000 0000"
                                value={form.contactPhone}
                                onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                            />
                            {errors.contactPhone && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.contactPhone}</p>}
                        </div>

                        {/* PHYSICIAN SECTION */}
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-[#6b7280] block">Personal Physician</label>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Doctor's Name"
                                        value={form.docName}
                                        onChange={e => setForm({ ...form, docName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        className="input-field font-mono"
                                        placeholder="Doctor's Phone"
                                        value={form.docPhone}
                                        onChange={e => setForm({ ...form, docPhone: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Hospital/Clinic"
                                        value={form.docHospital}
                                        onChange={e => setForm({ ...form, docHospital: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl flex gap-3 mb-6">
                            <ShieldCheck size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-orange-300 leading-relaxed italic">
                                Your PIN protects your Master Profile and Doctor QR. Do not forget it.
                            </p>
                        </div>
                        <div>
                            <label className="label">Security PIN (4+ Digits)</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="••••"
                                maxLength={8}
                                value={form.pin}
                                onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })}
                            />
                            {errors.pin && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.pin}</p>}
                        </div>
                        <div>
                            <label className="label">Confirm Security PIN</label>
                            <input
                                type="password"
                                inputMode="numeric"
                                className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="••••"
                                maxLength={8}
                                value={form.confirmPin}
                                onChange={e => setForm({ ...form, confirmPin: e.target.value.replace(/\D/g, '') })}
                            />
                            {errors.confirmPin && <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-tight">{errors.confirmPin}</p>}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} className="opacity-80" />
                                        Save & Create Emergency ID
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation Controls */}
                {step < 3 && (
                    <div className="flex gap-4 pt-10">
                        {step > 0 && (
                            <button onClick={back} className="btn-secondary !w-20 flex items-center justify-center">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <button
                            onClick={next}
                            className="btn-primary !py-4 flex items-center justify-center gap-2 group"
                        >
                            Continue
                            <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Trust Footer */}
            <div className="mt-8 text-center px-4">
                <div className="inline-flex items-center gap-2 text-[10px] text-gray-700 font-bold uppercase tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5">
                    <Sparkles size={12} className="text-yellow-600" />
                    Military Grade Encryption · Local-Only Storage
                </div>
            </div>
        </div>
    );
}
