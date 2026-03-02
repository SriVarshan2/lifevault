'use client';
import { Heart, Activity, Phone, ShieldAlert, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MedicalIdDemo() {
    const demoData = {
        name: "Arjun Kumar",
        age: "28",
        gender: "Male",
        bloodGroup: "O+",
        organDonor: true,
        allergies: [
            { name: "Penicillin", severity: "LIFE THREATENING", reaction: "Anaphylaxis" },
            { name: "Dust / Pollen", severity: "Mild", reaction: "Sneezing" }
        ],
        diabetes: {
            type: "Type 2 Diabetes",
            lastSugar: "187 mg/dL",
            time: "8:30 AM Today",
            insulin: true,
            range: "80–140 mg/dL"
        },
        medications: [
            { name: "Metformin 500mg", freq: "Twice daily" },
            { name: "Lisinopril 10mg", freq: "Once daily" },
            { name: "EpiPen", freq: "Carry at all times" }
        ],
        conditions: [
            { name: "Type 2 Diabetes", status: "Active" },
            { name: "Hypertension", status: "Managed" },
            { name: "Asthma", status: "Managed" }
        ],
        contacts: [
            { name: "Priya Kumar", relation: "Wife", phone: "+91 98765 43210", primary: true },
            { name: "Dr. Ramesh Patel", relation: "Physician", phone: "+91 91234 56789", primary: false, hospital: "Apollo Hospital" }
        ]
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans pb-12">
            {/* ⚠ URGENT EMERGENCY BANNER */}
            <div className="bg-[#dc2626] px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-white text-sm">⚠</span>
                    <div>
                        <p className="text-white font-bold text-sm tracking-wide">
                            EMERGENCY MEDICAL INFORMATION
                        </p>
                        <p className="text-red-200 text-[10px] tracking-widest">
                            FIRST RESPONDER ACCESS · NO LOGIN REQUIRED
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 mt-6 space-y-4">

                {/* PATIENT PROFILE */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-1">Patient Identity</p>
                    <h1 className="text-3vw md:text-3xl font-black tracking-tight">{demoData.name}</h1>
                    <div className="flex gap-4 mt-2">
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Gender / Age</p>
                            <p className="font-mono text-sm">{demoData.gender}, {demoData.age}y</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Blood Type</p>
                            <p className="font-mono text-sm text-[#dc2626] font-bold underline">{demoData.bloodGroup}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Organ Donor</p>
                            <p className="font-mono text-sm">{demoData.organDonor ? "YES" : "NO"}</p>
                        </div>
                    </div>
                </div>

                {/* CRITICAL ALLERGIES */}
                <div className="bg-[#111111] border-2 border-[#dc2626]/30 rounded-xl overflow-hidden">
                    <div className="bg-[#dc2626]/10 border-b border-[#dc2626]/20 py-2 px-6 flex items-center gap-2">
                        <AlertCircle size={14} className="text-[#dc2626]" />
                        <p className="text-[10px] font-black text-[#dc2626] uppercase tracking-widest">Critical Allergies</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {demoData.allergies.map((a, i) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg leading-none">{a.name}</p>
                                    <p className="text-xs text-[#6b7280] mt-1 italic">Reaction: {a.reaction}</p>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-1 rounded border ${a.severity.includes('LIFE')
                                    ? 'bg-[#dc2626]/20 border-[#dc2626] text-[#dc2626] animate-pulse'
                                    : 'bg-white/5 border-white/10 text-[#6b7280]'
                                    }`}>
                                    {a.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DIABETES PROFILE */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
                    <div className="bg-[#16a34a]/10 border-b border-[#16a34a]/20 py-2 px-6 flex items-center gap-2">
                        <Activity size={14} className="text-[#16a34a]" />
                        <p className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest">Diabetes Profile</p>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="col-span-2 pb-4 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-[#6b7280] uppercase">Last Sugar Reading</p>
                                <p className="text-3xl font-black text-[#d97706] tracking-tighter">{demoData.diabetes.lastSugar}</p>
                                <p className="text-[9px] text-[#6b7280] font-mono">{demoData.diabetes.time}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black bg-[#d97706]/20 text-[#d97706] border border-[#d97706]/40 px-2 py-1 rounded uppercase tracking-widest">High</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Condition Type</p>
                            <p className="text-sm font-bold">{demoData.diabetes.type}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Target Range</p>
                            <p className="text-sm font-mono">{demoData.diabetes.range}</p>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 text-[#d97706]">
                                <CheckCircle2 size={12} />
                                <p className="text-[10px] font-bold uppercase tracking-tight">Insulin Dependent: {demoData.diabetes.insulin ? "YES" : "NO"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MEDICATIONS & CONDITIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MEDICATIONS */}
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Medications</p>
                        <div className="space-y-4">
                            {demoData.medications.map((m, i) => (
                                <div key={i} className="border-l-2 border-[#1f1f1f] pl-3 py-0.5">
                                    <p className="text-[13px] font-bold leading-none">{m.name}</p>
                                    <p className="text-[10px] text-[#6b7280] mt-1">{m.freq}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* CONDITIONS */}
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-4">Chronic Conditions</p>
                        <div className="space-y-4">
                            {demoData.conditions.map((c, i) => (
                                <div key={i} className="border-l-2 border-[#1f1f1f] pl-3 py-0.5">
                                    <p className="text-[13px] font-bold leading-none">{c.name}</p>
                                    <p className="text-[10px] text-[#6b7280] mt-1">{c.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* EMERGENCY CONTACTS */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 space-y-6">
                    <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Emergency Contacts</p>
                    {demoData.contacts.map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{c.name}</p>
                                    {c.primary && <span className="text-[8px] bg-[#16a34a] text-white px-1.5 py-0.5 font-bold uppercase rounded">Primary</span>}
                                </div>
                                <p className="text-xs text-[#6b7280] mb-0.5">{c.relation} {c.hospital && `· ${c.hospital}`}</p>
                                <p className="font-mono text-xs">{c.phone}</p>
                            </div>
                            <a
                                href={`tel:${c.phone.replace(/[\s\-\(\)]/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="h-12 w-12 rounded-full bg-[#16a34a] hover:bg-[#15803d] flex items-center justify-center transition-transform active:scale-90"
                            >
                                <Phone size={20} className="text-white" fill="currentColor" />
                            </a>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="pt-6 text-center space-y-4 opacity-50">
                    <p className="text-[9px] leading-relaxed max-w-xs mx-auto">
                        Do NOT share this link publicly. This information is intended for emergency medical responders only.
                        Last updated 2 hours ago.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest underline decoration-[#6b7280]/30 underline-offset-4 decoration-2">
                        I am the patient — Edit my Vault
                    </button>
                    <p className="text-[10px] text-gray-600 font-mono text-center mt-4">
                        ID: VAULT-DEMO-2024
                    </p>
                </div>

            </div>
        </div>
    );
}
