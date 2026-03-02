'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LifeSignalProfile } from '../lib/types';
import { encodeProfileForQR } from '../lib/qr-logic';

interface EmergencyQRProps {
    profile: LifeSignalProfile;
}

export default function EmergencyQR({ profile }: EmergencyQRProps) {
    const qrData = encodeProfileForQR(profile);

    return (
        <div className="card card-emergency">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>EMERGENCY MEDICAL ID</h2>
                <span className="badge-red">OFFLINE ACCESS</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                First responders: Scan this code OR long-press to save medical summary.
            </p>

            <div className="qr-wrapper">
                <QRCodeSVG
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "/favicon.ico", // Could be a heart icon in production
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <div className="data-row">
                    <span className="data-label">Blood Type</span>
                    <span className="data-value" style={{ color: 'var(--accent-red)', fontSize: '1.5rem' }}>{profile.bloodGroup}</span>
                </div>
                <div className="data-row">
                    <span className="data-label">Allergies</span>
                    <span className="data-value">{profile.allergies.join(', ') || 'None'}</span>
                </div>
                <div className="data-row">
                    <span className="data-label">Conditions</span>
                    <span className="data-value">{profile.conditions.join(', ') || 'None'}</span>
                </div>
            </div>
        </div>
    );
}
