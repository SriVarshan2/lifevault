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

  const formatField = (value: string | string[] | undefined) => {
    if (!value) return 'None';
    if (Array.isArray(value)) return value.length ? value.join(', ') : 'None';
    return value || 'None';
  };

  return (
    <div className="card card-emergency">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          EMERGENCY MEDICAL ID
        </h2>
        <span className="badge-red">OFFLINE ACCESS</span>
      </div>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
        }}
      >
        First responders: Scan this code OR long-press to save medical summary.
      </p>

      <div className="qr-wrapper">
        <QRCodeSVG
          value={qrData}
          size={256}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: '/favicon.ico',
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div className="data-row">
          <span className="data-label">Blood Type</span>
          <span
            className="data-value"
            style={{ color: 'var(--accent-red)', fontSize: '1.5rem' }}
          >
            {profile.bloodGroup || 'Unknown'}
          </span>
        </div>

        <div className="data-row">
          <span className="data-label">Allergies</span>
          <span className="data-value">
            {formatField(profile.allergies)}
          </span>
        </div>

        <div className="data-row">
          <span className="data-label">Conditions</span>
          <span className="data-value">
            {formatField(profile.conditions)}
          </span>
        </div>
      </div>
    </div>
  );
}