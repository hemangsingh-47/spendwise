import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * SpendWise Authentication Context
 * Manages user authentication state, JWT session persistence via AsyncStorage,
 * login, registration, and logout across the application.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check persistent session on app startup
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await authService.getToken();
        if (storedToken) {
          // Temporarily attach stored token to validate with server
          await authService.saveToken(storedToken);
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            // Token invalid or expired
            await authService.clearToken();
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.warn('[AuthContext] Session restore expired or unreachable:', error.message);
        await authService.clearToken();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    const result = await authService.register({ name, email, password });
    if (result.success && result.token) {
      await authService.saveToken(result.token);
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  };

  /**
   * Log in an existing user
   */
  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    if (result.success && result.token) {
      await authService.saveToken(result.token);
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  };

  /**
   * Log out current user and clear persistent storage
   */
  const logout = async () => {
    try {
      await authService.clearToken();
    } catch (e) {
      console.warn('[AuthContext] Error clearing token on logout:', e.message);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  /**
   * Update profile settings (Name, Currency)
   */
  const updateProfile = async (profileData) => {
    const result = await authService.updateProfile(profileData);
    if (result.success && result.data) {
      setUser(result.data);
    }
    return result;
  };

  /**
   * Change user password
   */
  const changePassword = async (currentPassword, newPassword) => {
    return await authService.changePassword({ currentPassword, newPassword });
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    register,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

