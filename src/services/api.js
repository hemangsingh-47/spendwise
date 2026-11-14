import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/api';

/**
 * SpendWise Centralized Axios HTTP Client
 * Automatically manages Bearer JWT headers, request timeouts, and error normalization.
 */
let memoryAuthToken = null;

export const setMemoryToken = (token) => {
  memoryAuthToken = token;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor: Injects Bearer JWT token into outgoing requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = memoryAuthToken || (await AsyncStorage.getItem(STORAGE_KEYS.TOKEN));
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('[API-Client] Error reading token from storage:', e.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Formats error responses and captures 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let errorMessage = 'Network error. Please check your internet connection and backend server.';

    if (error.response) {
      // Backend returned an error response
      errorMessage = error.response.data?.message || `Server error (${error.response.status})`;

      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        console.warn('[API-Client] 401 Unauthorized encountered:', errorMessage);
      }
    } else if (error.request) {
      errorMessage = `Cannot connect to server at ${API_BASE_URL}. Ensure the Node.js backend is running.`;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export default api;

