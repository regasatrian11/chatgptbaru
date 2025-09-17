// Device fingerprinting utility
export interface DeviceFingerprint {
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  hardwareConcurrency: number;
  deviceMemory: number | undefined;
  colorDepth: number;
  pixelRatio: number;
}

export function generateDeviceFingerprint(): DeviceFingerprint {
  const nav = navigator as any;
  
  return {
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio
  };
}

export function createDeviceHash(fingerprint: DeviceFingerprint): string {
  const data = JSON.stringify(fingerprint);
  let hash = 0;
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

export async function getPublicIP(): Promise<string> {
  try {
    // Try multiple IP services for reliability
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        const data = await response.json();
        
        // Different services return IP in different formats
        if (data.ip) return data.ip;
        if (data.origin) return data.origin;
        
      } catch (error) {
        console.warn(`Failed to get IP from ${service}:`, error);
        continue;
      }
    }
    
    // Fallback: use a simple hash of device fingerprint as "IP"
    const fingerprint = generateDeviceFingerprint();
    return createDeviceHash(fingerprint);
    
  } catch (error) {
    console.error('Failed to get public IP:', error);
    // Return a consistent fallback based on device
    const fingerprint = generateDeviceFingerprint();
    return createDeviceHash(fingerprint);
  }
}