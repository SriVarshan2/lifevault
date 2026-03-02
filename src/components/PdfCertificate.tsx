'use client';
import { useState } from 'react';
import { FileText, Download, Printer, ShieldCheck, Mail, Share } from 'lucide-react';
import { LifeSignalProfile } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';

interface PdfCertificateProps {
    profile: LifeSignalProfile;
    emergencyUrl: string;
}

export default function PdfCertificate({ profile, emergencyUrl }: PdfCertificateProps) {
    const [generating, setGenerating] = useState(false);

    const handlePrint = () => {
        setGenerating(true);
        // Simple approach: Use a printable-only hidden div or a new window
        // For a hackathon, a well-styled print CSS on a dedicated hidden element is highly effective
        setTimeout(() => {
            window.print();
            setGenerating(false);
        }, 500);
    };

    return (
        <div className="glass-card !p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FileText size={16} className="text-emerald-400" />
                </div>
                <div>
                    <p className="h-header text-sm text-white tracking-wide uppercase">Physical ID Certificate</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Printable wallet cards & backup</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <QRCodeSVG value={emergencyUrl} size={40} />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-white font-bold mb-1">Printable Medical Vault</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed italic">
                        Generates a professional PDF with your medical summary and both Responder & Clinical QR codes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handlePrint}
                    className="btn-primary !py-3 !text-[10px] flex items-center justify-center gap-2"
                >
                    <Printer size={14} /> Print ID Card
                </button>
                <button
                    className="btn-secondary !py-3 !text-[10px] flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    disabled
                >
                    <Mail size={14} /> Email PDF
                </button>
            </div>

            {/* Hidden Printable Content (Only visible to printer) */}
            <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-[1000]">
                <div className="max-w-xl mx-auto border-2 border-black p-8 rounded-3xl">
                    <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">LifeVault</h1>
                            <p className="text-sm font-bold grey-500">Official Emergency Medical ID</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase grey-500">Document ID</p>
                            <p className="text-sm font-mono">{profile.id.slice(0, 12).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold uppercase grey-500 mb-1">Patient Full Name</p>
                                <p className="text-2xl font-black uppercase">{profile.fullName}</p>
                            </div>
                            <div className="bg-black text-white p-4 rounded-xl text-center">
                                <p className="text-xs font-bold mb-1">BLOOD GROUP</p>
                                <p className="text-5xl font-black">{profile.bloodGroup}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase grey-500 mb-1">Emergency Contact (ICE)</p>
                                <p className="font-bold">{profile.emergencyContact.name}</p>
                                <p className="font-mono text-sm">{profile.emergencyContact.phone}</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex flex-col items-center">
                            <div className="text-center">
                                <div className="border border-black p-2 rounded-xl inline-block bg-white">
                                    <QRCodeSVG value={emergencyUrl} size={140} />
                                </div>
                                <p className="text-[10px] font-bold uppercase mt-2">Responder QR (Public)</p>
                            </div>
                            <div className="text-center">
                                <div className="border-4 border-black p-2 rounded-xl inline-block bg-white">
                                    <QRCodeSVG value={JSON.stringify(profile)} size={140} />
                                </div>
                                <p className="text-[10px] font-bold uppercase mt-2">Doctor QR (Offline Data)</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-black/10 grid grid-cols-2 gap-8 text-[10px] leading-relaxed">
                        <div>
                            <p className="font-black uppercase mb-1 underline">Medical Summary</p>
                            <p><strong>Allergies:</strong> {profile.allergies || 'None documented'}</p>
                            <p><strong>Conditions:</strong> {profile.conditions || 'None documented'}</p>
                            <p><strong>Medications:</strong> {profile.medications || 'None documented'}</p>
                        </div>
                        <div className="text-right italic">
                            <p>LifeVault Zero-Knowledge Cryptographic Identification System. Verifiable at {emergencyUrl}</p>
                            <p className="mt-2 font-bold">Issue Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
