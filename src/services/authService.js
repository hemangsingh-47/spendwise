import api, { setMemoryToken } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/api';

/**
 * Authentication Service
 * Communicates with backend endpoints (/api/v1/auth) and manages stored JWT tokens.
 */
export const authService = {
  /**
   * Register a new user account
   */
  register: async ({ name, email, password }) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Log in an existing user
   */
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile settings
   */
  updateProfile: async ({ name, currency }) => {
    const response = await api.put('/auth/profile', {
      name,
      currency,
    });
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Save authentication token to persistent storage and memory
   */
  saveToken: async (token) => {
    setMemoryToken(token);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * Clear authentication token from persistent storage and memory
   */
  clearToken: async () => {
    setMemoryToken(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Get stored token
   */
  getToken: async () => {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

export default authService;

