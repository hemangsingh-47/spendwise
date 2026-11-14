import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import {
  BalanceCard,
  SummaryCard,
  QuickActionButton,
  TransactionItem,
  SectionHeader,
} from '../components/dashboard';
import { colors, spacing, borderRadius, fontWeights, layout } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    incomeCount,
    expenseCount,
    recentTransactions,
    isRefreshing,
    refreshTransactions,
  } = useTransactions();

  // Current month formatting
  const currentMonth = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const displayName = user?.name || 'SpendWise User';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTransactions}
            tintColor={colors.black}
            colors={[colors.black]}
          />
        }
      >
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{displayName}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active Session • {user?.currency || 'INR'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.PROFILE_TAB)}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Total Balance Card */}
        <BalanceCard
          balance={totalBalance}
          currencySymbol="₹"
          monthLabel={currentMonth}
        />

        {/* 3. Income & Expense Summary Cards */}
        <View style={styles.summaryRow}>
          <SummaryCard
            type="income"
            amount={totalIncome}
            count={incomeCount}
            currencySymbol="₹"
          />
          <View style={styles.summarySpacer} />
          <SummaryCard
            type="expense"
            amount={totalExpenses}
            count={expenseCount}
            currencySymbol="₹"
          />
        </View>

        {/* 4. Quick Actions */}
        <View style={styles.quickActionsSection}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              title="Add Expense"
              iconSymbol="-"
              variant="primary"
              onPress={() =>
                navigation.navigate(ROUTES.ADD_TRANSACTION, { defaultType: 'expense' })
              }
            />
            <QuickActionButton
              title="Add Income"
              iconSymbol="+"
              variant="secondary"
              onPress={() =>
                navigation.navigate(ROUTES.ADD_TRANSACTION, { defaultType: 'income' })
              }
            />
            <QuickActionButton
              title="All Records"
              iconSymbol="≡"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.TRANSACTIONS_TAB)}
            />
          </View>
        </View>

        {/* 5. Monthly Overview Card */}
        <Card variant="white" style={styles.overviewCard}>
          <SectionHeader title="Monthly Overview" />
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Inflow:</Text>
            <Text style={styles.overviewValue}>+ ₹ {totalIncome.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Outflow:</Text>
            <Text style={styles.overviewValue}>- ₹ {totalExpenses.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.overviewRow}>
            <Text style={styles.netLabel}>Remaining Net:</Text>
            <Text style={styles.netValue}>
              {totalBalance >= 0 ? '+' : '-'} ₹ {Math.abs(totalBalance).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* 6. Recent Transactions */}
        <View style={styles.recentSection}>
          <SectionHeader
            title="Recent Transactions"
            actionText="View All"
            onActionPress={() => navigation.navigate(ROUTES.TRANSACTIONS_TAB)}
          />

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyRecent}>
              <Text style={styles.emptyText}>No transactions recorded yet.</Text>
              <Text style={styles.emptySubtext}>Use quick actions above to record an expense or income.</Text>
            </View>
          ) : (
            recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                currencySymbol="₹"
                onPress={() =>
                  navigation.navigate(ROUTES.TRANSACTION_DETAILS, { transactionId: tx.id })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingTop: spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: fontWeights.medium,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.4,
  },
  badge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.small,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.darkGrey,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeights.bold,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  summarySpacer: {
    width: spacing.md,
  },
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  overviewCard: {
    marginBottom: spacing.xl,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  overviewLabel: {
    fontSize: 13,
    color: colors.grey,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  netValue: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  recentSection: {
    marginBottom: spacing.xl,
  },
  emptyRecent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.grey,
  },
});
