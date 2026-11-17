import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, borderRadius, fontWeights } from '../styles/theme';
import budgetService from '../services/budgetService';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import { getCurrencySymbol } from '../utils/currency';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Education',
  'Health',
  'Personal',
  'Other',
];

const CATEGORY_ICONS = {
  Food: 'fast-food-outline',
  Transport: 'car-outline',
  Shopping: 'cart-outline',
  Entertainment: 'film-outline',
  'Bills & Utilities': 'receipt-outline',
  Education: 'school-outline',
  Health: 'fitness-outline',
  Personal: 'person-outline',
  Other: 'cube-outline',
};

export default function BudgetsScreen() {
  const { openDrawer } = useDrawer();
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const currencySymbol = getCurrencySymbol(user?.currency);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBudgetForEdit, setSelectedBudgetForEdit] = useState(null);

  // Form States (Create)
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form States (Edit)
  const [editLimit, setEditLimit] = useState('');
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Load budgets and summary
  const loadBudgetData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMessage(null);

      const [budgetRes, summaryRes] = await Promise.all([
        budgetService.getBudgets(selectedMonth, selectedYear),
        budgetService.getBudgetSummary(selectedMonth, selectedYear),
      ]);

      setBudgets(budgetRes.data || []);
      setSummary(summaryRes || null);
    } catch (err) {
      console.error('Failed to load budgets:', err.message);
      setErrorMessage(err.message || 'Failed to load budgets. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth, selectedYear]);

  // Reload when transactions change or month/year changes
  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData, transactions]);

  // Handle Create Budget
  const handleCreateBudget = async () => {
    const finalCategory = category === 'Other' && customCategory.trim()
      ? customCategory.trim()
      : category;

    if (!finalCategory) {
      setFormError('Please select or enter a category');
      return;
    }

    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) {
      setFormError('Budget limit must be a positive number greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');

      await budgetService.createBudget({
        category: finalCategory,
        limit: numLimit,
        month: selectedMonth,
        year: selectedYear,
      });

      setModalVisible(false);
      setLimit('');
      setCustomCategory('');
      setCategory('Food');
      await loadBudgetData(true);
    } catch (err) {
      setFormError(err.message || 'Failed to create budget');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (budget) => {
    setSelectedBudgetForEdit(budget);
    setEditLimit(String(budget.limit));
    setEditError('');
    setEditModalVisible(true);
  };

  // Handle Update Budget
  const handleUpdateBudget = async () => {
    if (!selectedBudgetForEdit) return;

    const numLimit = parseFloat(editLimit);
    if (isNaN(numLimit) || numLimit <= 0) {
      setEditError('Budget limit must be greater than 0');
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError('');

      await budgetService.updateBudget(selectedBudgetForEdit.id, {
        limit: numLimit,
      });

      setEditModalVisible(false);
      setSelectedBudgetForEdit(null);
      await loadBudgetData(true);
    } catch (err) {
      setEditError(err.message || 'Failed to update budget limit');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete Budget with confirmation
  const handleDeleteBudget = (budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to remove the ${budget.category} budget of ${currencySymbol}${budget.limit.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await budgetService.deleteBudget(budget.id);
              await loadBudgetData(true);
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete budget');
            }
          },
        },
      ]
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Month & Year Bar */}
      <View style={styles.monthSelectorRow}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openDrawer}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Open Navigation Menu"
          >
            <Ionicons name="menu-outline" size={24} color={colors.black} />
          </TouchableOpacity>

          <View>
            <Text style={styles.screenTitle}>Monthly Budgets</Text>
            <Text style={styles.screenSubtitle}>
              {monthNames[selectedMonth - 1]} {selectedYear}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBudgetButton}
          activeOpacity={0.8}
          onPress={() => {
            setFormError('');
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addBudgetText}>Set Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Budget Overview Card */}
      {summary && (
        <Card variant="white" style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View>
              <Text style={styles.overviewSubtitle}>TOTAL BUDGET</Text>
              <Text style={styles.overviewBudgetAmount}>
                {currencySymbol}{summary.totalBudget.toLocaleString()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              summary.overallStatus === 'exceeded'
                ? styles.badgeExceeded
                : summary.overallStatus === 'warning'
                ? styles.badgeWarning
                : styles.badgeNormal,
            ]}>
              <Text style={[
                styles.statusBadgeText,
                summary.overallStatus === 'exceeded'
                  ? styles.textExceeded
                  : summary.overallStatus === 'warning'
                  ? styles.textWarning
                  : styles.textNormal,
              ]}>
                {summary.overallStatus === 'exceeded'
                  ? 'Exceeded'
                  : summary.overallStatus === 'warning'
                  ? 'Near Limit'
                  : 'On Track'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, summary.spendingPercentage || 0)}%` },
                summary.overallStatus === 'exceeded'
                  ? { backgroundColor: colors.error }
                  : summary.overallStatus === 'warning'
                  ? { backgroundColor: colors.warning }
                  : { backgroundColor: colors.black },
              ]}
            />
          </View>

          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Spent</Text>
              <Text style={styles.metricValue}>{currencySymbol}{summary.totalSpent.toLocaleString()}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Remaining</Text>
              <Text
                style={[
                  styles.metricValue,
                  summary.remainingBudget < 0 && { color: colors.error },
                ]}
              >
                {currencySymbol}{summary.remainingBudget.toLocaleString()}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Used</Text>
              <Text style={styles.metricValue}>{summary.spendingPercentage}%</Text>
            </View>
          </View>

          {/* Warning Banner if exceeded or near limit */}
          {summary.overallStatus === 'exceeded' && (
            <View style={styles.warningBanner}>
              <Ionicons name="alert-circle" size={16} color={colors.error} />
              <Text style={styles.warningBannerText}>
                Monthly budget exceeded by {currencySymbol}{Math.abs(summary.remainingBudget).toLocaleString()}!
              </Text>
            </View>
          )}
          {summary.overallStatus === 'warning' && (
            <View style={[styles.warningBanner, { backgroundColor: colors.warningBackground }]}>
              <Ionicons name="warning-outline" size={16} color={colors.warning} />
              <Text style={[styles.warningBannerText, { color: colors.warning }]}>
                You have reached {summary.spendingPercentage}% of your total budget.
              </Text>
            </View>
          )}
        </Card>
      )}

      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Category Limits</Text>
        <Text style={styles.sectionCount}>{budgets.length} Active</Text>
      </View>
    </View>
  );

  const renderBudgetItem = ({ item }) => {
    const iconName = CATEGORY_ICONS[item.category] || 'pricetag-outline';
    const isExceeded = item.status === 'exceeded';
    const isWarning = item.status === 'warning';

    return (
      <Card variant="white" style={styles.budgetCard}>
        {/* Top: Category & Status */}
        <View style={styles.budgetTopRow}>
          <View style={styles.categoryInfo}>
            <View style={styles.categoryIconWrap}>
              <Ionicons name={iconName} size={20} color={colors.dark} />
            </View>
            <View>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.budgetLimitSub}>Limit: {currencySymbol}{item.limit.toLocaleString()}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            isExceeded
              ? styles.badgeExceeded
              : isWarning
              ? styles.badgeWarning
              : styles.badgeNormal,
          ]}>
            <Text style={[
              styles.statusBadgeText,
              isExceeded
                ? styles.textExceeded
                : isWarning
                ? styles.textWarning
                : styles.textNormal,
            ]}>
              {isExceeded ? 'Exceeded' : isWarning ? 'Warning' : 'Normal'}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, item.percentage || 0)}%` },
              isExceeded
                ? { backgroundColor: colors.error }
                : isWarning
                ? { backgroundColor: colors.warning }
                : { backgroundColor: colors.black },
            ]}
          />
        </View>

        {/* Numbers Row */}
        <View style={styles.budgetNumbersRow}>
          <Text style={styles.budgetSpentText}>
            Spent: <Text style={styles.boldText}>{currencySymbol}{item.spent.toLocaleString()}</Text>
          </Text>
          <Text style={styles.budgetProgressText}>
            {item.percentage}% used
          </Text>
          <Text style={[
            styles.budgetRemainingText,
            item.remaining < 0 && { color: colors.error },
          ]}>
            {item.remaining >= 0 ? `Left: ${currencySymbol}${item.remaining.toLocaleString()}` : `Over: ${currencySymbol}${Math.abs(item.remaining).toLocaleString()}`}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={15} color={colors.dark} />
            <Text style={styles.editButtonText}>Edit Limit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBudget(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={15} color={colors.grey} />
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <Card variant="white" style={styles.emptyCard}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="wallet-outline" size={32} color={colors.grey} />
      </View>
      <Text style={styles.emptyTitle}>No Budgets Set Yet</Text>
      <Text style={styles.emptySubtitle}>
        Setting monthly category budgets helps you keep your expenses under control and save more each month.
      </Text>
      <Button
        title="Set Your First Budget"
        variant="primary"
        onPress={() => {
          setFormError('');
          setModalVisible(true);
        }}
        style={styles.emptyCTA}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.black} />
          <Text style={styles.loadingText}>Loading budgets...</Text>
        </View>
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          renderItem={renderBudgetItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadBudgetData(true)}
              tintColor={colors.black}
              colors={[colors.black]}
            />
          }
        />
      )}

      {/* CREATE BUDGET MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Category Budget</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category selector */}
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryPillsWrap}>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      category === cat && styles.categoryPillActive,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        category === cat && styles.categoryPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {category === 'Other' && (
                <Input
                  label="Custom Category Name"
                  placeholder="e.g. Subscriptions"
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  containerStyle={{ marginTop: spacing.sm }}
                />
              )}

              {/* Monthly Limit Input */}
              <Input
                label={`Monthly Limit (${currencySymbol})`}
                placeholder="e.g. 5000"
                keyboardType="numeric"
                value={limit}
                onChangeText={setLimit}
                containerStyle={{ marginTop: spacing.md }}
              />

              {formError ? (
                <View style={styles.formErrorBox}>
                  <Text style={styles.formErrorText}>{formError}</Text>
                </View>
              ) : null}

              <Button
                title="Save Budget"
                variant="primary"
                onPress={handleCreateBudget}
                loading={submitting}
                style={styles.modalSubmitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* EDIT BUDGET MODAL */}
      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit {selectedBudgetForEdit?.category} Budget
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <Input
              label={`New Monthly Limit (${currencySymbol})`}
              placeholder="e.g. 6000"
              keyboardType="numeric"
              value={editLimit}
              onChangeText={setEditLimit}
              containerStyle={{ marginTop: spacing.md }}
            />

            {editError ? (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>{editError}</Text>
              </View>
            ) : null}

            <Button
              title="Update Limit"
              variant="primary"
              onPress={handleUpdateBudget}
              loading={editSubmitting}
              style={styles.modalSubmitButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.grey,
  },
  headerContainer: {
    marginBottom: spacing.md,
  },
  monthSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 2,
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    gap: 4,
  },
  addBudgetText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  overviewCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.large,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  overviewSubtitle: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
  },
  overviewBudgetAmount: {
    fontSize: 26,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.small,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  warningBannerText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.error,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.grey,
  },
  budgetCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.medium,
  },
  budgetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.small,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.black,
  },
  budgetLimitSub: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.small,
  },
  badgeNormal: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeWarning: {
    backgroundColor: colors.warningBackground,
  },
  badgeExceeded: {
    backgroundColor: colors.errorBackground,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
  },
  textNormal: {
    color: colors.darkGrey,
  },
  textWarning: {
    color: colors.warning,
  },
  textExceeded: {
    color: colors.error,
  },
  budgetNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetSpentText: {
    fontSize: 13,
    color: colors.grey,
  },
  boldText: {
    color: colors.black,
    fontWeight: fontWeights.semibold,
  },
  budgetProgressText: {
    fontSize: 12,
    color: colors.grey,
  },
  budgetRemainingText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.black,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.dark,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.grey,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptyCTA: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    padding: spacing.lg,
    maxHeight: '85%',
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
  inputLabel: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  categoryPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.small,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryPillText: {
    fontSize: 13,
    color: colors.dark,
  },
  categoryPillTextActive: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  formErrorBox: {
    backgroundColor: colors.errorBackground,
    padding: spacing.sm,
    borderRadius: borderRadius.small,
    marginTop: spacing.sm,
  },
  formErrorText: {
    fontSize: 12,
    color: colors.error,
  },
  modalSubmitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
});
