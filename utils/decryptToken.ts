import { jwtDecrypt } from 'jose';

/**
 * Decrypts a JWE token using the provided secret
 * @param token - The encrypted JWE string
 * @param secretString - Your 256-bit secret (must be exactly 32 characters)
 * @returns Decoded payload
 */
export async function decryptToken(token: string, secretString: string): Promise<any> {
  if (!token || !secretString) {
    throw new Error('Token and secret are required for decryption');
  }

  // Convert the secret string into a 32-byte Uint8Array
  const encoder = new TextEncoder();
  const secret = encoder.encode(secretString);

  if (secret.length !== 32) {
    throw new Error('Secret must be exactly 32 bytes (e.g., 32 ASCII characters) for A256GCM');
  }

  try {
    const { payload } = await jwtDecrypt(token, secret);
    
    return payload;
  } catch (err: any) {
    console.error('Decryption failed:', err.message);
    throw new Error('Invalid or corrupted token');
  }
}

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
