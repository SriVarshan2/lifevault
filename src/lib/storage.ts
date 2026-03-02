import { LifeSignalProfile, VaultMeta } from './types';

const PROFILE_KEY = 'lifevault:profile';
const META_KEY = 'lifevault:meta';

export const getProfile = (): LifeSignalProfile | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

export const saveProfile = (profile: LifeSignalProfile): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const deleteProfile = (): void => {
    localStorage.removeItem(PROFILE_KEY);
};

export const getVaultMeta = (): VaultMeta | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(META_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

export const saveVaultMeta = (meta: VaultMeta): void => {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
};

export const clearVault = (): void => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(META_KEY);
};
