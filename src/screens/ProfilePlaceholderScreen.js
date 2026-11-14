import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, borderRadius, fontWeights, layout } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export default function ProfilePlaceholderScreen({ navigation }) {
  const { user, logout, updateProfile, changePassword } = useAuth();

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editCurrency, setEditCurrency] = useState(user?.currency || 'INR');
  const [isUpdating, setIsUpdating] = useState(false);

  // Change Password State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Avatar initials
  const initials = (user?.name || 'SW')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your session?',
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

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    setIsUpdating(true);
    try {
      await updateProfile({ name: editName.trim(), currency: editCurrency.trim() });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPass || !newPass) {
      Alert.alert('Validation Error', 'Please enter both current and new passwords.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Validation Error', 'New password must be at least 6 characters.');
      return;
    }
    setIsSavingPass(true);
    try {
      await changePassword(currentPass, newPass);
      setIsChangingPass(false);
      setCurrentPass('');
      setNewPass('');
      Alert.alert('Success', 'Password changed successfully.');
    } catch (err) {
      Alert.alert('Password Change Failed', err.message || 'Incorrect password.');
    } finally {
      setIsSavingPass(false);
    }
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* User Info Card */}
      <Card variant="white" style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'SpendWise User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@college.edu'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Verified Student Account</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Currency:</Text>
          <Text style={styles.infoValue}>{user?.currency || 'INR'} (₹)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID:</Text>
          <Text style={[styles.infoValue, styles.idText]}>{user?._id || 'Session Active'}</Text>
        </View>
      </Card>

      {/* Profile Management Section */}
      <Card variant="white" style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editToggleText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <Input
              label="Full Name"
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
            />
            <Input
              label="Currency (e.g. INR, USD)"
              value={editCurrency}
              onChangeText={setEditCurrency}
              placeholder="INR"
              autoCapitalize="characters"
            />
            <Button
              title={isUpdating ? 'Saving...' : 'Save Profile'}
              variant="primary"
              loading={isUpdating}
              onPress={handleSaveProfile}
              style={styles.actionBtn}
            />
          </View>
        ) : null}

        {/* Change Password Toggle */}
        <TouchableOpacity
          style={styles.changePassRow}
          onPress={() => setIsChangingPass(!isChangingPass)}
        >
          <Text style={styles.changePassText}>
            {isChangingPass ? 'Close Password Change' : 'Change Password →'}
          </Text>
        </TouchableOpacity>

        {isChangingPass ? (
          <View style={styles.editForm}>
            <Input
              label="Current Password"
              value={currentPass}
              onChangeText={setCurrentPass}
              placeholder="Enter current password"
              secureTextEntry={true}
              showTogglePassword={true}
            />
            <Input
              label="New Password (min 6 chars)"
              value={newPass}
              onChangeText={setNewPass}
              placeholder="Enter new password"
              secureTextEntry={true}
              showTogglePassword={true}
            />
            <Button
              title={isSavingPass ? 'Updating...' : 'Update Password'}
              variant="primary"
              loading={isSavingPass}
              onPress={handleChangePassword}
              style={styles.actionBtn}
            />
          </View>
        ) : null}
      </Card>

      {/* Developer & Viva Shortcuts */}
      <Card variant="card" style={styles.card}>
        <Text style={styles.sectionTitle}>Evaluation & Tools</Text>
        <Button
          title="Inspect Design System Preview"
          variant="secondary"
          onPress={() => navigation.navigate(ROUTES.DESIGN_SYSTEM_PREVIEW)}
          style={styles.actionBtn}
        />
        <Button
          title="Sign Out"
          variant="primary"
          onPress={handleLogout}
          style={styles.actionBtn}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  card: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
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
    marginBottom: spacing.md,
  },
  roleBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
    marginBottom: spacing.lg,
  },
  roleText: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.darkGrey,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xs,
    borderTopWidth: layout.borderWidth,
    borderTopColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.grey,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  idText: {
    fontSize: 11,
    color: colors.grey,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  editToggleText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  editForm: {
    width: '100%',
    marginTop: spacing.sm,
  },
  changePassRow: {
    width: '100%',
    paddingVertical: spacing.sm,
  },
  changePassText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  actionBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
