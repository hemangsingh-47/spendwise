import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, fontWeights, layout } from '../styles/theme';
import { MOCK_USER } from '../data/mockTransactions';
import { ROUTES } from '../constants/routes';

/**
 * Profile Tab Screen
 * Displays demo user details, app info, link to design preview, and demo logout.
 */
export default function ProfilePlaceholderScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Demo Sign Out',
      'Are you sure you want to return to the sign in screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => navigation.navigate(ROUTES.LOGIN),
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* User Info Card */}
      <Card variant="white" style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>HS</Text>
        </View>
        <Text style={styles.name}>{MOCK_USER.name}</Text>
        <Text style={styles.email}>{MOCK_USER.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{MOCK_USER.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Default Currency:</Text>
          <Text style={styles.infoValue}>INR (₹)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Version:</Text>
          <Text style={styles.infoValue}>SpendWise 1.0 (Phase 4–6)</Text>
        </View>
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
          title="Sign Out (Demo)"
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  actionBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
