import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { colors, spacing, borderRadius, fontWeights } from '../styles/theme';
import analyticsService from '../services/analyticsService';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useTransactions } from '../context/TransactionContext';

export default function AnalyticsScreen() {
  const { transactions } = useTransactions();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [sumRes, trendRes, catRes] = await Promise.all([
        analyticsService.getSummary(selectedMonth, selectedYear),
        analyticsService.getMonthlyTrend(6),
        analyticsService.getCategoryBreakdown(selectedMonth, selectedYear),
      ]);

      setSummary(sumRes);
      setMonthlyTrend(trendRes || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Failed to load analytics:', err.message);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics, transactions]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const isCurrentMonth =
    selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadAnalytics(true)}
            tintColor={colors.black}
            colors={[colors.black]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Financial Analytics</Text>
            <Text style={styles.headerSubtitle}>Reports, trends & spending insights</Text>
          </View>
        </View>

        {/* Month Selector Bar */}
        <View style={styles.monthNavCard}>
          <TouchableOpacity
            style={styles.navArrowButton}
            onPress={handlePrevMonth}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.dark} />
          </TouchableOpacity>

          <View style={styles.monthLabelCenter}>
            <Text style={styles.monthLabelText}>
              {monthNames[selectedMonth - 1]} {selectedYear}
            </Text>
            {isCurrentMonth && <Text style={styles.currentMonthBadge}>Current Month</Text>}
          </View>

          <TouchableOpacity
            style={[styles.navArrowButton, isCurrentMonth && styles.navArrowDisabled]}
            onPress={handleNextMonth}
            disabled={isCurrentMonth}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isCurrentMonth ? colors.lightGrey : colors.dark}
            />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.black} />
            <Text style={styles.loadingText}>Calculating metrics...</Text>
          </View>
        ) : (
          <>
            {/* KPI Grid */}
            <View style={styles.kpiGrid}>
              {/* Net Savings */}
              <Card variant="white" style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>NET SAVINGS</Text>
                <Text
                  style={[
                    styles.kpiMainValue,
                    summary && summary.netSavings < 0 && { color: colors.error },
                  ]}
                >
                  ₹{summary ? Math.abs(summary.netSavings).toLocaleString() : '0'}
                </Text>
                <Text style={styles.kpiSubValue}>
                  {summary && summary.netSavings >= 0 ? 'Surplus' : 'Deficit'} • {summary?.savingsPercentage || 0}% rate
                </Text>
              </Card>

              {/* Total Inflow & Outflow mini-cards */}
              <View style={styles.kpiSubRow}>
                <Card variant="white" style={[styles.kpiHalfCard, { marginRight: spacing.sm }]}>
                  <Text style={styles.kpiMiniLabel}>INFLOW</Text>
                  <Text style={styles.kpiIncomeValue}>
                    +₹{summary?.totalIncome?.toLocaleString() || '0'}
                  </Text>
                  <Text style={styles.kpiCountSub}>{summary?.incomeCount || 0} entries</Text>
                </Card>

                <Card variant="white" style={[styles.kpiHalfCard, { marginLeft: spacing.sm }]}>
                  <Text style={styles.kpiMiniLabel}>OUTFLOW</Text>
                  <Text style={styles.kpiExpenseValue}>
                    -₹{summary?.totalExpenses?.toLocaleString() || '0'}
                  </Text>
                  <Text style={styles.kpiCountSub}>{summary?.expenseCount || 0} entries</Text>
                </Card>
              </View>
            </View>

            {/* Monthly Comparison Card */}
            {summary?.comparison?.hasPreviousData && (
              <Card variant="white" style={styles.comparisonCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Month-over-Month Comparison</Text>
                  <Text style={styles.cardSubtitle}>
                    vs {monthNames[summary.comparison.previousMonth - 1]}
                  </Text>
                </View>

                <View style={styles.comparisonMetricsRow}>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compLabel}>Expense Change</Text>
                    <Text
                      style={[
                        styles.compValue,
                        summary.comparison.expenseChange > 0
                          ? { color: colors.error }
                          : { color: colors.success },
                      ]}
                    >
                      {summary.comparison.expenseChange > 0 ? '+₹' : '-₹'}
                      {Math.abs(summary.comparison.expenseChange).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.compDivider} />
                  <View style={styles.comparisonItem}>
                    <Text style={styles.compLabel}>Income Change</Text>
                    <Text
                      style={[
                        styles.compValue,
                        summary.comparison.incomeChange >= 0
                          ? { color: colors.success }
                          : { color: colors.error },
                      ]}
                    >
                      {summary.comparison.incomeChange >= 0 ? '+₹' : '-₹'}
                      {Math.abs(summary.comparison.incomeChange).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* 6-Month Income vs Expense Trend Chart */}
            <Card variant="white" style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>6-Month Cashflow Trend</Text>
                  <Text style={styles.cardSubtitle}>Income vs Expenses comparison</Text>
                </View>
              </View>
              <MonthlyBarChart data={monthlyTrend} />
            </Card>

            {/* Category-wise Expense Breakdown */}
            <Card variant="white" style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>Category Breakdown</Text>
                  <Text style={styles.cardSubtitle}>
                    {monthNames[selectedMonth - 1]} spending distribution
                  </Text>
                </View>
              </View>
              <CategoryPieChart
                data={categories}
                totalExpense={summary?.totalExpenses || 0}
              />
            </Card>
          </>
        )}
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  headerRow: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 2,
  },
  monthNavCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  navArrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    opacity: 0.4,
  },
  monthLabelCenter: {
    alignItems: 'center',
  },
  monthLabelText: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  currentMonthBadge: {
    fontSize: 10,
    color: colors.grey,
    fontWeight: fontWeights.medium,
    marginTop: 1,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.grey,
  },
  kpiGrid: {
    marginBottom: spacing.lg,
  },
  kpiCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.large,
    marginBottom: spacing.sm,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
  },
  kpiMainValue: {
    fontSize: 28,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
    marginTop: 4,
    marginBottom: 4,
  },
  kpiSubValue: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: fontWeights.medium,
  },
  kpiSubRow: {
    flexDirection: 'row',
  },
  kpiHalfCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
  },
  kpiMiniLabel: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.5,
  },
  kpiIncomeValue: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginTop: 4,
  },
  kpiExpenseValue: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.darkGrey,
    marginTop: 4,
  },
  kpiCountSub: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },
  comparisonCard: {
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  comparisonMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.xs,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  compLabel: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  compValue: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
  },
  compDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  chartCard: {
    padding: spacing.md,
    borderRadius: borderRadius.large,
    marginBottom: spacing.lg,
  },
});
