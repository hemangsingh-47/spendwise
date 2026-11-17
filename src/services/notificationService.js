import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATIONS_ENABLED_KEY = '@spendwise_notifications_enabled';
const NOTIFIED_ALERTS_KEY = '@spendwise_notified_budget_alerts';

// Configure how notifications behave when received while app is foregrounded
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  // Gracefully handle in environments where native notification handler is restricted
}

/**
 * SpendWise Local Notification Service (Phase 10)
 * Handles permissions, threshold checking (80% and 100%), and duplicate alert prevention.
 */
export const notificationService = {
  /**
   * Request notification permissions from the OS
   * @returns {Promise<boolean>} granted
   */
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const granted = finalStatus === 'granted';
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, granted ? 'true' : 'false');
      return granted;
    } catch (err) {
      console.warn('[SpendWise-Notification] Permission request warning:', err.message);
      return false;
    }
  },

  /**
   * Check if notifications are enabled by the user
   * @returns {Promise<boolean>}
   */
  async isEnabled() {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
      if (stored !== null) return stored === 'true';
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      return false;
    }
  },

  /**
   * Set user notification preference
   * @param {boolean} enabled
   */
  async setEnabled(enabled) {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? 'true' : 'false');
    if (enabled) {
      await this.requestPermissions();
    }
  },

  /**
   * Trigger local notification for budget threshold alerts with duplicate prevention
   * @param {string} category
   * @param {number} spent
   * @param {number} limit
   * @param {number} month
   * @param {number} year
   */
  async evaluateBudgetThreshold(category, spent, limit, month, year) {
    try {
      const enabled = await this.isEnabled();
      if (!enabled || !limit || limit <= 0) return;

      const percentage = Math.round((spent / limit) * 100);

      // Determine threshold to check
      let threshold = null;
      let title = '';
      let body = '';

      if (percentage >= 100) {
        threshold = '100';
        title = `🚨 Budget Exceeded: ${category}`;
        body = `Your ${category} spending has reached ₹${spent.toLocaleString()} (Limit: ₹${limit.toLocaleString()}).`;
      } else if (percentage >= 80) {
        threshold = '80';
        title = `⚠️ Budget Alert: ${category}`;
        body = `You have used ${percentage}% of your ${category} budget (₹${spent.toLocaleString()} of ₹${limit.toLocaleString()}).`;
      }

      if (!threshold) return;

      // Unique key for this alert to prevent duplicate notifications
      const alertKey = `${year}_${month}_${category.toLowerCase()}_${threshold}`;

      // Check if already notified
      const rawNotified = await AsyncStorage.getItem(NOTIFIED_ALERTS_KEY);
      const notifiedMap = rawNotified ? JSON.parse(rawNotified) : {};

      if (notifiedMap[alertKey]) {
        // Already notified for this threshold this month
        return;
      }

      // Schedule instant local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          data: { category, percentage, threshold },
        },
        trigger: null, // deliver immediately
      });

      // Mark as notified in storage
      notifiedMap[alertKey] = new Date().toISOString();
      await AsyncStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify(notifiedMap));
      console.log(`[SpendWise-Notification] Triggered ${threshold}% alert for ${category}`);
    } catch (err) {
      console.warn('[SpendWise-Notification] Trigger notification error:', err.message);
    }
  },
};

export default notificationService;
