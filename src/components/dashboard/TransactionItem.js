import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, layout, fontWeights } from '../../styles/theme';

/**
 * Reusable TransactionItem Component
 * Renders a single transaction row in clean monochrome fintech aesthetics.
 * 
 * Props:
 * - transaction: object { id, type, amount, category, description, date, paymentMethod }
 * - onPress: function (optional tap callback)
 * - currencySymbol: string (default: '₹')
 */
export const TransactionItem = ({
  transaction,
  onPress,
  currencySymbol = '₹',
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const formattedAmount = Number(transaction.amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
    >
      {/* Category Icon Badge */}
      <View style={[styles.badge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
        <Text style={[styles.badgeText, isIncome ? styles.incomeBadgeText : styles.expenseBadgeText]}>
          {isIncome ? '↑' : '↓'}
        </Text>
      </View>

      {/* Main Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || transaction.category}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{transaction.date}</Text>
          {transaction.paymentMethod ? (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.paymentMethod}>{transaction.paymentMethod}</Text>
            </>
          ) : null}
        </View>
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, isIncome && styles.incomeText]}>
          {isIncome ? '+' : '-'} {currencySymbol} {formattedAmount}
        </Text>
        <Text style={styles.typeLabel}>{isIncome ? 'Income' : 'Expense'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.medium,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  incomeBadge: {
    backgroundColor: colors.black,
  },
  expenseBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
  },
  incomeBadgeText: {
    color: colors.white,
  },
  expenseBadgeText: {
    color: colors.dark,
  },
  infoContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  category: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.grey,
  },
  dot: {
    fontSize: 10,
    color: colors.lightGrey,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
    color: colors.lightGrey,
  },
  paymentMethod: {
    fontSize: 11,
    color: colors.grey,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    letterSpacing: -0.2,
  },
  incomeText: {
    color: colors.black,
  },
  typeLabel: {
    fontSize: 10,
    color: colors.grey,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default TransactionItem;
