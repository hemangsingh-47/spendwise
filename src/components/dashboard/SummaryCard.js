import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, layout, fontWeights } from '../../styles/theme';

/**
 * Reusable SummaryCard Component
 * Displays income or expense summary stats in clean black & white fintech styling.
 * 
 * Props:
 * - type: 'income' | 'expense'
 * - amount: number
 * - currencySymbol: string (default: '₹')
 * - count: number (optional transaction count)
 */
export const SummaryCard = ({
  type = 'income',
  amount = 0,
  currencySymbol = '₹',
  count,
}) => {
  const isIncome = type === 'income';
  const formattedAmount = Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>{isIncome ? '↑' : '↓'}</Text>
        </View>
        <Text style={styles.label}>
          {isIncome ? 'TOTAL INCOME' : 'TOTAL EXPENSES'}
        </Text>
      </View>

      <Text style={styles.amount}>
        {isIncome ? '+' : '-'} {currencySymbol} {formattedAmount}
      </Text>

      {count !== undefined ? (
        <Text style={styles.countText}>
          {count} {count === 1 ? 'transaction' : 'transactions'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    padding: spacing.lg,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  indicatorContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: fontWeights.bold,
    color: colors.dark,
  },
  label: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    color: colors.grey,
    letterSpacing: 0.8,
  },
  amount: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  countText: {
    fontSize: 11,
    color: colors.grey,
  },
});

export default SummaryCard;
