import { getPublicIP, generateDeviceFingerprint, createDeviceHash } from '../utils/deviceFingerprint';

interface DemoAuthData {
  ip: string;
  deviceHash: string;
  timestamp: number;
  userAgent: string;
}

const DEMO_AUTH_KEY = 'mikasa_demo_auth';
const DEMO_EXPIRY_HOURS = 24; // Demo access expires after 24 hours

export class DemoAuthService {
  private static instance: DemoAuthService;
  
  private constructor() {}
  
  static getInstance(): DemoAuthService {
    if (!DemoAuthService.instance) {
      DemoAuthService.instance = new DemoAuthService();
    }
    return DemoAuthService.instance;
  }
  
  async checkDemoAccess(): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Get current device info
      const currentIP = await getPublicIP();
      const currentFingerprint = generateDeviceFingerprint();
      const currentDeviceHash = createDeviceHash(currentFingerprint);
      
      // Check if demo has been used before
      const savedAuth = localStorage.getItem(DEMO_AUTH_KEY);
      
      if (!savedAuth) {
        // First time using demo - allow and save
        await this.saveDemoAuth(currentIP, currentDeviceHash);
        return { allowed: true };
      }
      
      const authData: DemoAuthData = JSON.parse(savedAuth);
      
      // Check if demo has expired
      const now = Date.now();
      const expiryTime = authData.timestamp + (DEMO_EXPIRY_HOURS * 60 * 60 * 1000);
      
      if (now > expiryTime) {
        // Demo expired - reset and allow
        localStorage.removeItem(DEMO_AUTH_KEY);
        await this.saveDemoAuth(currentIP, currentDeviceHash);
        return { allowed: true };
      }
      
      // Check if same device/IP
      if (authData.ip === currentIP && authData.deviceHash === currentDeviceHash) {
        // Same device - allow
        return { allowed: true };
      }
      
      // Different device/IP - deny
      return { 
        allowed: false, 
        reason: 'Demo login sudah digunakan di perangkat lain. Setiap demo hanya dapat digunakan di satu perangkat.' 
      };
      
    } catch (error) {
      console.error('Error checking demo access:', error);
      // On error, allow access but log the issue
      return { allowed: true };
    }
  }
  
  private async saveDemoAuth(ip: string, deviceHash: string): Promise<void> {
    const authData: DemoAuthData = {
      ip,
      deviceHash,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(authData));
  }
  
  resetDemoAuth(): void {
    localStorage.removeItem(DEMO_AUTH_KEY);
  }
  
  getDemoInfo(): DemoAuthData | null {
    const savedAuth = localStorage.getItem(DEMO_AUTH_KEY);
    if (!savedAuth) return null;
    
    try {
      return JSON.parse(savedAuth);
    } catch {
      return null;
    }
  }
  
  getRemainingTime(): number {
    const authData = this.getDemoInfo();
    if (!authData) return 0;
    
    const now = Date.now();
    const expiryTime = authData.timestamp + (DEMO_EXPIRY_HOURS * 60 * 60 * 1000);
    
    return Math.max(0, expiryTime - now);
  }
  
  getFormattedRemainingTime(): string {
    const remaining = this.getRemainingTime();
    if (remaining === 0) return '0 jam';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    } else {
      return `${minutes} menit`;
    }
  }
}