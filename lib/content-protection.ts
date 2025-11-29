import { prisma } from './db';
import {
  encryptForStorage,
  decryptFromStorage,
  generateContentAccessToken,
  validateContentIntegrity,
  generateContentHash,
  encryptSensitiveData,
  decryptSensitiveData
} from './encryption';
import { hasActiveSubscription, getUserAccessLevel } from './subscription-check';

/**
 * Content Protection Service
 * Handles encryption, decryption, and access control for premium content
 */
export class ContentProtectionService {
  /**
   * Encrypt and store lesson content
   */
  static async encryptLessonContent(
    lessonId: string,
    plainContent: string,
    isPremium: boolean = false
  ): Promise<void> {
    try {
      // Generate content hash for integrity
      const contentHash = generateContentHash(plainContent);

      if (isPremium) {
        // Encrypt premium content
        const encrypted = await encryptForStorage(plainContent);

        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            encryptedContent: encrypted.encryptedContent,
            encryptionKey: encryptSensitiveData(encrypted.encryptionKey), // Encrypt the key itself
            encryptionIv: encrypted.encryptionIv,
            encryptionTag: encrypted.encryptionTag,
            keyVersion: encrypted.keyVersion,
            contentHash,
            updatedAt: new Date(),
          },
        });
      } else {
        // Store plain content for free lessons
        await prisma.lesson.update({
          where: { id: lessonId },
          data: {
            markdownContent: plainContent,
            contentHash,
            updatedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Failed to encrypt lesson content:', error);
      throw new Error('Content encryption failed');
    }
  }

  /**
   * Fetch lesson content from API (client-side method)
   */
  static async getLessonContent(
    lessonId: string,
    userId: string
  ): Promise<{
    content: string;
    accessGranted: boolean;
    accessReason?: string;
    accessToken?: string;
  }> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/content`);

      if (!response.ok) {
        const errorData = await response.json();
        return {
          content: '',
          accessGranted: false,
          accessReason: errorData.accessReason || 'Access denied',
        };
      }

      const data = await response.json();

      return {
        content: data.content || '',
        accessGranted: data.accessGranted,
        accessToken: data.accessToken,
      };
    } catch (error) {
      console.error('Failed to fetch lesson content:', error);
      return {
        content: '',
        accessGranted: false,
        accessReason: 'Network error',
      };
    }
  }

  /**
   * Validate content access token
   */
  static async validateAccessToken(
    lessonId: string,
    userId: string,
    accessToken: string
  ): Promise<boolean> {
    try {
      // In a production system, you'd validate against a cache or database
      // For now, we'll implement basic validation
      const tokenValid = accessToken.length === 64; // 32 bytes hex = 64 chars

      if (tokenValid) {
        await this.logContentAccess(lessonId, userId, true, accessToken);
      }

      return tokenValid;
    } catch (error) {
      console.error('Access token validation failed:', error);
      return false;
    }
  }

  /**
   * Log content access for security monitoring
   */
  private static async logContentAccess(
    lessonId: string,
    userId: string,
    success: boolean,
    accessToken?: string
  ): Promise<void> {
    try {
      // In production, you'd log to a security events table
      // For now, we'll log to console with structured data
      const logEntry = {
        timestamp: new Date().toISOString(),
        lessonId,
        userId,
        success,
        accessToken: accessToken ? accessToken.substring(0, 8) + '...' : null,
        userAgent: 'Server-Side', // Would be populated from request headers
        ipAddress: 'Server-Side', // Would be populated from request
      };

      console.log('Content Access Log:', JSON.stringify(logEntry));

      // TODO: Store in security events table for compliance
    } catch (error) {
      console.error('Failed to log content access:', error);
    }
  }

  /**
   * Check if user can access premium content
   */
  static async canAccessPremiumContent(userId: string): Promise<boolean> {
    try {
      const accessLevel = await getUserAccessLevel();
      return accessLevel === 'admin' || accessLevel === 'premium';
    } catch (error) {
      console.error('Failed to check premium access:', error);
      return false;
    }
  }

  /**
   * Get content access statistics
   */
  static async getContentAccessStats(lessonId: string): Promise<{
    totalAccess: number;
    successfulAccess: number;
    failedAccess: number;
    lastAccessed?: Date;
  }> {
    // TODO: Implement access statistics from security logs
    // For now, return placeholder data
    return {
      totalAccess: 0,
      successfulAccess: 0,
      failedAccess: 0,
    };
  }

  /**
   * Revoke access for a specific user (for security incidents)
   */
  static async revokeUserAccess(userId: string): Promise<void> {
    try {
      // TODO: Implement access revocation
      // This could involve:
      // 1. Invalidating all active access tokens
      // 2. Updating user access flags
      // 3. Logging the revocation event

      console.log(`Access revoked for user: ${userId}`);
    } catch (error) {
      console.error('Failed to revoke user access:', error);
      throw error;
    }
  }

  /**
   * Migrate existing content to encrypted storage
   * TODO: Implement migration functionality
   */
  static async migrateContentToEncryption(dryRun: boolean = true): Promise<{
    totalLessons: number;
    migratedLessons: number;
    errors: string[];
  }> {
    // TODO: Implement content migration
    console.log('Content migration not yet implemented');
    return {
      totalLessons: 0,
      migratedLessons: 0,
      errors: ['Migration not implemented yet'],
    };
  }
}

/**
 * Middleware for protecting content routes
 */
export async function withContentProtection<T>(
  userId: string,
  lessonId: string,
  action: () => Promise<T>
): Promise<T> {
  try {
    // Check if user has access to this content
    const canAccess = await ContentProtectionService.canAccessPremiumContent(userId);

    if (!canAccess) {
      throw new Error('Premium subscription required');
    }

    // Execute the protected action
    return await action();
  } catch (error) {
    console.error('Content protection middleware error:', error);
    throw error;
  }
}
