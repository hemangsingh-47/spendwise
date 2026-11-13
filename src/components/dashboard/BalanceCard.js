import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontWeights } from '../../styles/theme';

/**
 * Reusable BalanceCard Component
 * Displays the net total account balance prominently in Black & White Minimal fintech style.
 * 
 * Props:
 * - balance: number (net balance amount)
 * - currencySymbol: string (default: '₹')
 * - monthLabel: string (e.g. 'November 2026')
 */
export const BalanceCard = ({
  balance = 0,
  currencySymbol = '₹',
  monthLabel = 'Current Month',
}) => {
  const formattedBalance = Number(balance).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{monthLabel}</Text>
        </View>
      </View>

      <Text style={styles.amount}>
        {currencySymbol} {formattedBalance}
      </Text>

      <Text style={styles.footerNote}>
        Net balance across recorded income & expenses
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    borderRadius: borderRadius.large,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    color: colors.lightGrey,
    letterSpacing: 1.2,
  },
  badge: {
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: fontWeights.medium,
  },
  amount: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  footerNote: {
    fontSize: 12,
    color: colors.grey,
  },
});

export default BalanceCard;
