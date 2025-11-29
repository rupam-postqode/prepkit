import crypto from 'crypto';
import { prisma } from './db';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

// Environment variables for encryption keys
const MASTER_KEY = process.env.CONTENT_ENCRYPTION_KEY || 'default-dev-key-change-in-production-32chars';
const KEY_VERSION = 'v1';

// Ensure master key is proper length
function getMasterKey(): Buffer {
  const key = Buffer.from(MASTER_KEY, 'utf8');
  if (key.length !== KEY_LENGTH) {
    // In production, this should throw an error
    // For development, we'll derive a proper key
    return crypto.scryptSync(key, 'salt', KEY_LENGTH);
  }
  return key;
}

/**
 * Generate a unique encryption key for content
 */
export function generateContentKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Encrypt content using AES-256-GCM
 */
export function encryptContent(plainText: string, contentKey?: string): {
  encryptedData: string;
  key: string;
  iv: string;
  authTag: string;
} {
  const key = contentKey || generateContentKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const keyBuffer = Buffer.from(key, 'hex');

  const cipher = crypto.createCipher(ALGORITHM, keyBuffer);
  cipher.setAAD(Buffer.from('PrepKit-Content'));

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    key: key,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt content using AES-256-GCM
 */
export function decryptContent(
  encryptedData: string,
  key: string,
  iv: string,
  authTag: string
): string {
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decipher = crypto.createDecipher(ALGORITHM, keyBuffer);
    decipher.setAAD(Buffer.from('PrepKit-Content'));
    decipher.setAuthTag(authTagBuffer);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Content decryption failed:', error);
    throw new Error('Failed to decrypt content');
  }
}

/**
 * Encrypt content for database storage
 */
export async function encryptForStorage(plainText: string): Promise<{
  encryptedContent: string;
  encryptionKey: string;
  encryptionIv: string;
  encryptionTag: string;
  keyVersion: string;
}> {
  const result = encryptContent(plainText);

  return {
    encryptedContent: result.encryptedData,
    encryptionKey: result.key,
    encryptionIv: result.iv,
    encryptionTag: result.authTag,
    keyVersion: KEY_VERSION,
  };
}

/**
 * Decrypt content from database storage
 */
export async function decryptFromStorage(
  encryptedContent: string,
  encryptionKey: string,
  encryptionIv: string,
  encryptionTag: string,
  keyVersion: string
): Promise<string> {
  // In the future, we can handle different key versions
  if (keyVersion !== KEY_VERSION) {
    throw new Error('Unsupported encryption key version');
  }

  return decryptContent(encryptedContent, encryptionKey, encryptionIv, encryptionTag);
}

/**
 * Secure key derivation for user-specific content keys
 */
export function deriveUserContentKey(userId: string, contentId: string): string {
  const masterKey = getMasterKey();
  const context = `${userId}:${contentId}:${KEY_VERSION}`;

  return crypto.scryptSync(masterKey, context, KEY_LENGTH).toString('hex');
}

/**
 * Validate content integrity
 */
export function validateContentIntegrity(
  content: string,
  expectedHash?: string
): boolean {
  if (!expectedHash) return true;

  const hash = crypto.createHash('sha256').update(content).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}

/**
 * Generate content hash for integrity checking
 */
export function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Secure random token generation for content access
 */
export function generateContentAccessToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt sensitive user data (like API keys, not content)
 */
export function encryptSensitiveData(data: string): string {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive user data
 */
export function decryptSensitiveData(encryptedData: string): string {
  try {
    const [ivHex, authTagHex, data] = encryptedData.split(':');

    const masterKey = getMasterKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Sensitive data decryption failed:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
}
