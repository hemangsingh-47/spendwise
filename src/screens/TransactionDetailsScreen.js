import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';
import { ROUTES } from '../constants/routes';

export default function TransactionDetailsScreen({ route, navigation }) {
  const { transactionId } = route.params || {};
  const { getTransactionById, deleteTransaction } = useTransactions();

  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    return (
      <ScreenContainer contentContainerStyle={styles.container}>
        <Card variant="white" style={styles.card}>
          <Text style={styles.notFoundText}>Transaction record not found.</Text>
          <Button
            title="Back to Transactions"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
        </Card>
      </ScreenContainer>
    );
  }

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description || transaction.category}"? This will permanently remove it from MongoDB.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Deletion Failed', err.message || 'Could not delete transaction.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Details Card */}
      <Card variant="white" style={styles.card}>
        {/* Type Badge */}
        <View style={[styles.badge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
          <Text style={[styles.badgeText, isIncome ? styles.incomeBadgeText : styles.expenseBadgeText]}>
            {isIncome ? '↑ INCOME' : '↓ EXPENSE'}
          </Text>
        </View>

        {/* Amount */}
        <Text style={styles.amount}>
          {isIncome ? '+' : '-'} ₹ {Number(transaction.amount).toLocaleString('en-IN')}
        </Text>

        <Text style={styles.description}>{transaction.description}</Text>

        <View style={styles.divider} />

        {/* Detail Rows */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category</Text>
          <Text style={styles.detailValue}>{transaction.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{transaction.paymentMethod || 'Not specified'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Record ID</Text>
          <Text style={[styles.detailValue, styles.idText]}>{transaction.id}</Text>
        </View>

        <View style={styles.buttonSpacing} />

        {/* Edit Button */}
        <Button
          title="Edit Transaction"
          variant="secondary"
          onPress={() =>
            navigation.navigate(ROUTES.EDIT_TRANSACTION, {
              transactionId: transaction.id,
            })
          }
          style={styles.actionButton}
        />

        {/* Delete Button */}
        <Button
          title="Delete Transaction"
          variant="secondary"
          onPress={handleDelete}
          textStyle={{ color: colors.error }}
          style={[styles.actionButton, styles.deleteButton]}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginBottom: spacing.md,
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
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
  },
  incomeBadgeText: {
    color: colors.white,
  },
  expenseBadgeText: {
    color: colors.dark,
  },
  amount: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.grey,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xs + 2,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.grey,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  idText: {
    fontSize: 11,
    color: colors.lightGrey,
  },
  buttonSpacing: {
    height: spacing.lg,
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.grey,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  backBtn: {
    width: '100%',
  },
});
