import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, borderRadius, fontWeights, layout } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import { ROUTES } from '../constants/routes';
import { Ionicons } from '@expo/vector-icons';
import notificationService from '../services/notificationService';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '../utils/currency';
import api from '../services/api';

/**
 * SpendWise Profile & Application Settings Screen (Phase 11)
 * 
 * Features:
 * - User details (Avatar initials, name, email, account type, currency)
 * - Edit profile (update full name & select currency preference)
 * - Change password (current password check, min 6 char validation, password match verification)
 * - Notification preferences (OS permission checking & local notification toggle)
 * - Backend server health status check
 * - Sign out with confirmation
 */
export default function ProfileScreen({ navigation }) {
  const { openDrawer } = useDrawer();
  const { user, logout, updateProfile, changePassword } = useAuth();

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'INR');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Preferences State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Backend Health Status State
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Sync state when user context updates
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setSelectedCurrency(user.currency || 'INR');
    }
  }, [user]);

  // Load initial notification setting
  useEffect(() => {
    notificationService.isEnabled().then(setNotificationsEnabled);
  }, []);

  // Handle toggling notifications
  const handleToggleNotifications = async (value) => {
    if (value) {
      const granted = await notificationService.requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Notification permission was not granted by your device. Please enable notifications in your phone Settings to receive budget alerts.'
        );
        setNotificationsEnabled(false);
        await notificationService.setEnabled(false);
        return;
      }
      setNotificationsEnabled(true);
      await notificationService.setEnabled(true);
      Alert.alert('Notifications Enabled', 'You will receive warnings when spending reaches 80% or 100% of your budget.');
    } else {
      setNotificationsEnabled(false);
      await notificationService.setEnabled(false);
    }
  };

  // Avatar Initials
  const initials = (user?.name || 'SW')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SW';

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your SpendWise session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Save Profile Handler
  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert('Validation Error', 'Name must be at least 2 characters.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const result = await updateProfile({
        name: trimmedName,
        currency: selectedCurrency,
      });

      if (result.success) {
        setIsEditModalOpen(false);
        Alert.alert('Success', 'Profile and currency preference updated successfully.');
      } else {
        Alert.alert('Update Failed', result.message || 'Could not update profile.');
      }
    } catch (err) {
      Alert.alert(
        'Update Error',
        err.response?.data?.message || err.message || 'Failed to update profile.'
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'All password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Validation Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Validation Error', 'New password must be different from current password.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert('Success', 'Password changed successfully. Please remember your new password.');
      } else {
        Alert.alert('Failed', result.message || 'Could not change password.');
      }
    } catch (err) {
      Alert.alert(
        'Password Change Error',
        err.response?.data?.message || err.message || 'Incorrect current password or server error.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Check Backend Health
  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await api.get('/health');
      if (res.data?.success) {
        setHealthStatus({
          ok: true,
          message: `Connected: ${res.data.status || 'OK'} (${res.data.environment || 'production'})`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        setHealthStatus({
          ok: false,
          message: 'Server responded with unexpected status',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      setHealthStatus({
        ok: false,
        message: err.message || 'Unable to reach backend',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* 1. Header with Hamburger Menu */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openDrawer}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Open Navigation Menu"
        >
          <Ionicons name="menu-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Profile & Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* 2. User Info Card */}
      <Card variant="white" style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'SpendWise User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@college.edu'}</Text>
        
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>College Student • CSE Account</Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Preferred Currency</Text>
          <View style={styles.currencyBadge}>
            <Text style={styles.currencyBadgeText}>
              {user?.currency || 'INR'} ({getCurrencySymbol(user?.currency)})
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account ID</Text>
          <Text style={styles.idText} numberOfLines={1}>
            {user?._id || 'Local Active'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Security Level</Text>
          <Text style={styles.securityText}>JWT • bcrypt (10 rounds)</Text>
        </View>
      </Card>

      {/* 3. Account Actions Card */}
      <Card variant="white" style={styles.card}>
        <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => setIsEditModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconWrap}>
            <Ionicons name="person-circle-outline" size={22} color={colors.black} />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionSubtitle}>Update your display name and default currency</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.grey} />
        </TouchableOpacity>

        <View style={styles.rowDivider} />

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => setIsPasswordModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconWrap}>
            <Ionicons name="key-outline" size={22} color={colors.black} />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Change Password</Text>
            <Text style={styles.actionSubtitle}>Update your account login password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.grey} />
        </TouchableOpacity>
      </Card>

      {/* 4. Notification Preferences Card */}
      <Card variant="white" style={styles.card}>
        <Text style={styles.sectionTitle}>PREFERENCES & NOTIFICATIONS</Text>
        <View style={styles.notifRow}>
          <View style={styles.notifTextWrap}>
            <Text style={styles.notifTitle}>Budget Threshold Alerts</Text>
            <Text style={styles.notifSubtitle}>
              Receive local notifications when category spending reaches 80% or exceeds 100% of limits.
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.black }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      {/* 5. Production & Health Diagnostics Card */}
      <Card variant="card" style={styles.card}>
        <Text style={styles.sectionTitle}>SYSTEM & VIVA DIAGNOSTICS</Text>
        
        <View style={styles.healthActionRow}>
          <Button
            title={isCheckingHealth ? 'Testing API...' : 'Test Backend Connection'}
            variant="secondary"
            loading={isCheckingHealth}
            onPress={handleCheckHealth}
            style={styles.healthBtn}
          />
        </View>

        {healthStatus && (
          <View
            style={[
              styles.healthResultBadge,
              healthStatus.ok ? styles.healthSuccess : styles.healthFail,
            ]}
          >
            <Ionicons
              name={healthStatus.ok ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={healthStatus.ok ? '#15803d' : colors.error}
            />
            <Text
              style={[
                styles.healthResultText,
                healthStatus.ok ? { color: '#15803d' } : { color: colors.error },
              ]}
            >
              {healthStatus.message} [{healthStatus.timestamp}]
            </Text>
          </View>
        )}

        <Button
          title="Inspect Design System Preview"
          variant="secondary"
          onPress={() => navigation.navigate(ROUTES.DESIGN_SYSTEM_PREVIEW)}
          style={{ width: '100%', marginTop: spacing.sm }}
        />
      </Card>

      {/* 6. Sign Out Button */}
      <View style={styles.logoutContainer}>
        <Button
          title="Sign Out of SpendWise"
          variant="primary"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
        <Text style={styles.buildInfoText}>
          SpendWise v1.0.0 (Phase 11) • Build 1 • College CSE Project
        </Text>
      </View>

      {/* =============================================================== */}
      {/* MODAL 1: EDIT PROFILE MODAL */}
      {/* =============================================================== */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <Input
              label="Full Name"
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Hemang Singh"
              autoCapitalize="words"
            />

            {/* Email (Read Only as per Phase 11 rule) */}
            <View style={styles.readOnlyField}>
              <Text style={styles.fieldLabel}>Registered Email (Locked)</Text>
              <View style={styles.readOnlyInput}>
                <Ionicons name="lock-closed-outline" size={16} color={colors.grey} />
                <Text style={styles.readOnlyText}>{user?.email || 'N/A'}</Text>
              </View>
              <Text style={styles.helperText}>
                Email cannot be modified directly to preserve multi-user security.
              </Text>
            </View>

            {/* Currency Preference Selector */}
            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
              Default Currency Preference
            </Text>
            <View style={styles.currencyRow}>
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <TouchableOpacity
                    key={curr.code}
                    style={[
                      styles.currencyPill,
                      isSelected && styles.currencyPillActive,
                    ]}
                    onPress={() => setSelectedCurrency(curr.code)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.currencyPillSymbol,
                        isSelected && styles.currencyPillSymbolActive,
                      ]}
                    >
                      {curr.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.currencyPillCode,
                        isSelected && styles.currencyPillCodeActive,
                      ]}
                    >
                      {curr.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.helperText}>
              Updates display symbols across all charts & cards without altering DB transaction amounts.
            </Text>

            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setIsEditModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                variant="primary"
                loading={isUpdatingProfile}
                onPress={handleSaveProfile}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =============================================================== */}
      {/* MODAL 2: CHANGE PASSWORD MODAL */}
      {/* =============================================================== */}
      <Modal
        visible={isPasswordModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPasswordModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity
                onPress={() => setIsPasswordModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry={true}
              showTogglePassword={true}
            />

            <Input
              label="New Password (min. 6 characters)"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new strong password"
              secureTextEntry={true}
              showTogglePassword={true}
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              secureTextEntry={true}
              showTogglePassword={true}
            />

            <Text style={styles.helperText}>
              Passwords are salted and securely hashed using bcrypt on the server before storage.
            </Text>

            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setIsPasswordModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={isChangingPassword ? 'Updating...' : 'Update Password'}
                variant="primary"
                loading={isChangingPassword}
                onPress={handleChangePassword}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.3,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: fontWeights.bold,
  },
  name: {
    fontSize: 20,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: colors.grey,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginBottom: spacing.md,
  },
  roleText: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: fontWeights.medium,
  },
  currencyBadge: {
    backgroundColor: colors.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  currencyBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: fontWeights.bold,
  },
  idText: {
    fontSize: 11,
    color: colors.darkGrey,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    maxWidth: 160,
  },
  securityText: {
    fontSize: 11,
    color: colors.darkGrey,
    fontWeight: fontWeights.semibold,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionIconWrap: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  notifTextWrap: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.black,
    marginBottom: 2,
  },
  notifSubtitle: {
    fontSize: 12,
    color: colors.grey,
    lineHeight: 16,
  },
  healthActionRow: {
    width: '100%',
    marginBottom: spacing.xs,
  },
  healthBtn: {
    width: '100%',
  },
  healthResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    marginTop: spacing.sm,
    gap: 6,
  },
  healthSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  healthFail: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  healthResultText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    flex: 1,
  },
  logoutContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: colors.black,
  },
  buildInfoText: {
    fontSize: 11,
    color: colors.lightGrey,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: 6,
  },
  readOnlyField: {
    marginBottom: spacing.md,
  },
  readOnlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: 8,
  },
  readOnlyText: {
    fontSize: 14,
    color: colors.grey,
  },
  helperText: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 4,
    lineHeight: 15,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
    marginBottom: 4,
  },
  currencyPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    backgroundColor: colors.white,
  },
  currencyPillActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  currencyPillSymbol: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  currencyPillSymbolActive: {
    color: colors.white,
  },
  currencyPillCode: {
    fontSize: 10,
    fontWeight: fontWeights.medium,
    color: colors.grey,
    marginTop: 2,
  },
  currencyPillCodeActive: {
    color: colors.lightGrey,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
