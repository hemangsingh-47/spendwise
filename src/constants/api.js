import { Platform, NativeModules } from 'react-native';

/**
 * SpendWise API Configuration
 * 
 * Networking notes for college developers:
 * 1. Physical Phone over Wi-Fi (Expo Go):
 *    - Uses your computer's local Wi-Fi IP address (e.g. 10.165.196.121:5000).
 *    - Auto-detects the host from Metro bundler's scriptURL, or uses DEV_MACHINE_IP fallback.
 * 2. Android Emulator (AVD):
 *    - Maps '10.0.2.2:5000' to the host machine's localhost.
 * 3. iOS Simulator & Web:
 *    - Uses 'localhost:5000'.
 */

// Your computer's current Wi-Fi IPv4 address (from 'ipconfig')
export const DEV_MACHINE_IP = '192.168.1.6';
const PORT = 5000;

const resolveApiBaseUrl = () => {
  // 1. Explicit production backend URL via Expo environment variable (Phase 11 & 12)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // 2. Auto-detect host IP from Metro bundle URL when running inside Expo Go
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const host = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:${PORT}/api/v1`;
      }
    }
  } catch (e) {
    // Ignore and proceed to fallbacks
  }

  // 3. Physical device on Wi-Fi fallback
  if (DEV_MACHINE_IP) {
    return `http://${DEV_MACHINE_IP}:${PORT}/api/v1`;
  }

  // 4. Android Emulator fallback
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}/api/v1`;
  }

  // 5. iOS Simulator / Web fallback
  return `http://localhost:${PORT}/api/v1`;
};

export const API_BASE_URL = resolveApiBaseUrl();

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: 'spendwise_auth_token',
  USER: 'spendwise_user_profile',
};

export default {
  API_BASE_URL,
  DEV_MACHINE_IP,
  STORAGE_KEYS,
};

