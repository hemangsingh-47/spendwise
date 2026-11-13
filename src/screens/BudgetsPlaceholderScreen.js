import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, fontWeights } from '../styles/theme';
import { ROUTES } from '../constants/routes';

/**
 * Budgets Tab Placeholder Screen
 * Clean, structured placeholder matching the black-and-white theme.
 * Clearly states that Budget Management belongs to future Phase 6 (backend models) / Phase 11.
 */
export default function BudgetsPlaceholderScreen({ navigation }) {
  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Card variant="white" style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📊</Text>
        </View>

        <Text style={styles.title}>Budget Management</Text>
        <Text style={styles.subtitle}>
          Set monthly spending limits for categories like Food, Transport, and Entertainment to stay on top of your student finances.
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Upcoming Phase Milestone</Text>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Category-wise monthly spend targets</Text>
          <Text style={styles.featureItem}>• Real-time progress bar alerts</Text>
          <Text style={styles.featureItem}>• MongoDB backend aggregation support</Text>
        </View>

        <Button
          title="Back to Dashboard"
          variant="primary"
          onPress={() => navigation.navigate(ROUTES.DASHBOARD_TAB)}
          style={styles.backButton}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  card: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.4,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    fontSize: 13,
    color: colors.dark,
    lineHeight: 22,
  },
  backButton: {
    alignSelf: 'stretch',
  },
});
