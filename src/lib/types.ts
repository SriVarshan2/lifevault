export type BloodGroup =
    | 'A+' | 'A-' | 'B+' | 'B-'
    | 'AB+' | 'AB-' | 'O+' | 'O-'
    | 'Unknown';

export interface EmergencyContact {
    name: string;
    phone: string;
}

export interface LifeSignalProfile {
    id: string;
    fullName: string;
    bloodGroup: BloodGroup;
    allergies: string;         // comma-separated
    conditions: string;        // comma-separated chronic conditions
    medications: string;       // comma-separated current medications
    emergencyContact: EmergencyContact;
    insuranceId?: string;
    createdAt: string;
    updatedAt: string;

    // NEW: Advanced Medical ID fields
    diabetesProfile?: {
        hasDiabetes: boolean;
        type: 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetic' | null;
        insulinDependent: boolean;
        lastSugarReading: {
            value: number;        // mg/dL
            unit: 'mg/dL' | 'mmol/L';
            recordedAt: string;   // ISO timestamp
        } | null;
        targetRange: {
            min: number;
            max: number;
        };
        carriesGlucoseKit: boolean;
    };

    vitalHistory?: {
        id: string;
        type: 'blood_sugar' | 'blood_pressure' | 'heart_rate' | 'weight';
        value: string;
        unit: string;
        recordedAt: string;
        note?: string;
    }[];

    personalDoctor?: {
        name: string;
        specialty: string;
        phone: string;
        hospital: string;
    } | null;
}

export interface VaultMeta {
    pinHash: string;    // SHA-256 of PIN
    pinSalt: string;    // Random salt
    lastModified: string;
}
