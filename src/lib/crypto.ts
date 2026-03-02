import { createHash, randomBytes } from "crypto";

/** Hashes a PIN string using SHA-256 with salt (Node.js safe) */
export const hashPin = async (pin: string, salt: string): Promise<string> => {
    return createHash("sha256")
        .update(pin + salt)
        .digest("hex");
};

/** Generates a random hex salt */
export const generateSalt = (): string => {
    return randomBytes(16).toString("hex");
};

/** Verifies a PIN */
export const verifyPin = async (
    pin: string,
    storedHash: string,
    salt: string
): Promise<boolean> => {
    const hash = await hashPin(pin, salt);
    return hash === storedHash;
};

/** Generates short unique ID */
export const generateId = (): string =>
    Math.random().toString(36).substring(2, 10).toUpperCase();git status