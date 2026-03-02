import { LifeSignalProfile } from './types';

/**
 * Encodes the profile into a compressed JSON string for the QR code.
 * Uses short keys to minimize QR size (better scan reliability).
 */
export const encodeProfileForQR = (profile: LifeSignalProfile): string => {
    const contact = profile.emergencyContact;
    const safeProfile = {
        n: profile.fullName,
        b: profile.bloodGroup,
        a: profile.allergies,
        c: profile.conditions,
        m: profile.medications,
        e: contact ? `${contact.name}:${contact.phone}` : '',
        i: profile.insuranceId ?? '',
        t: profile.updatedAt,
    };
    return JSON.stringify(safeProfile);
};

export const decodeProfileFromQR = (encoded: string): Record<string, string> | null => {
    try {
        return JSON.parse(encoded);
    } catch (e) {
        console.error('Failed to decode profile', e);
        return null;
    }
};
