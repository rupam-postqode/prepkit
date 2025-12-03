// lib/services/device-fingerprinting.ts

import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export class DeviceFingerprintService {
  
  /**
   * Generate device fingerprint from request headers
   */
  async generateFingerprint(req: NextRequest): Promise<string> {
    const userAgent = req.headers.get('user-agent') || '';
    const acceptLanguage = req.headers.get('accept-language') || '';
    const acceptEncoding = req.headers.get('accept-encoding') || '';
    
    // Client can send additional device info via custom header
    const clientData = req.headers.get('x-device-data') || '';
    
    const fingerprintData = {
      userAgent,
      acceptLanguage,
      acceptEncoding,
      clientData,
    };
    
    return this.hashFingerprint(JSON.stringify(fingerprintData));
  }
  
  private hashFingerprint(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  /**
   * Register a new device for a user
   */
  async registerDevice(userId: string, fingerprint: string): Promise<void> {
    const existingDevice = await prisma.userDevice.findFirst({
      where: {
        userId,
        fingerprint,
      },
    });
    
    if (existingDevice) {
      // Update last used
      await prisma.userDevice.update({
        where: { id: existingDevice.id },
        data: {
          lastUsed: new Date(),
          isActive: true,
        },
      });
      return;
    }
    
    // Create new device
    await prisma.userDevice.create({
      data: {
        userId,
        fingerprint,
        isActive: true,
        lastUsed: new Date(),
      },
    });
  }
  
  /**
   * Verify if device is registered
   */
  async verifyDevice(userId: string, fingerprint: string): Promise<boolean> {
    const device = await prisma.userDevice.findFirst({
      where: {
        userId,
        fingerprint,
        isActive: true,
      },
    });
    
    if (device) {
      // Update last used
      await prisma.userDevice.update({
        where: { id: device.id },
        data: { lastUsed: new Date() },
      });
      return true;
    }
    
    return false;
  }
  
  /**
   * Get active device count for user
   */
  async getActiveDeviceCount(userId: string): Promise<number> {
    return await prisma.userDevice.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }
  
  /**
   * Deactivate a device
   */
  async deactivateDevice(userId: string, fingerprint: string): Promise<void> {
    await prisma.userDevice.updateMany({
      where: {
        userId,
        fingerprint,
      },
      data: {
        isActive: false,
      },
    });
  }
  
  /**
   * Get all devices for user
   */
  async getUserDevices(userId: string) {
    return await prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastUsed: 'desc' },
    });
  }
  
  /**
   * Deactivate oldest device to make room for new one
   */
  async deactivateOldestDevice(userId: string): Promise<void> {
    const devices = await prisma.userDevice.findMany({
      where: { userId, isActive: true },
      orderBy: { lastUsed: 'asc' },
      take: 1,
    });
    
    if (devices.length > 0) {
      await prisma.userDevice.update({
        where: { id: devices[0].id },
        data: { isActive: false },
      });
    }
  }
}
