/**
 * Token Encryption/Decryption Utilities
 *
 * Handles secure encryption and decryption of GitHub tokens
 * Uses AES-256-GCM encryption with environment-based secret key
 *
 * IMPORTANT: Set GITHUB_TOKEN_ENCRYPTION_KEY in environment variables
 * Generate with: openssl rand -base64 32
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Get encryption key from environment
 * Falls back to a default key for development (NOT for production)
 */
function getEncryptionKey(): Buffer {
  const key = import.meta.env.GITHUB_TOKEN_ENCRYPTION_KEY || process.env.GITHUB_TOKEN_ENCRYPTION_KEY;

  if (!key) {
    console.warn('[Token Encryption] Warning: Using default encryption key. Set GITHUB_TOKEN_ENCRYPTION_KEY in production!');
    // Default key for development only - DO NOT use in production
    return Buffer.from('dev-encryption-key-please-change-in-production-32bytes!', 'utf-8');
  }

  // Convert base64 key to buffer
  return Buffer.from(key, 'base64');
}

/**
 * Encrypt a GitHub token
 *
 * @param token - The plaintext GitHub token
 * @returns Encrypted token string (format: iv:encrypted:authTag)
 */
export function encryptToken(token: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:encrypted:authTag (all in hex)
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('[Token Encryption] Encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a GitHub token
 *
 * @param encryptedToken - The encrypted token string (format: iv:encrypted:authTag)
 * @returns Decrypted plaintext token
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedToken.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('[Token Encryption] Decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Validate that a token can be encrypted and decrypted
 * Used for testing encryption setup
 */
export function validateEncryption(): boolean {
  try {
    const testToken = 'test_token_12345';
    const encrypted = encryptToken(testToken);
    const decrypted = decryptToken(encrypted);
    return decrypted === testToken;
  } catch (error) {
    console.error('[Token Encryption] Validation failed:', error);
    return false;
  }
}
