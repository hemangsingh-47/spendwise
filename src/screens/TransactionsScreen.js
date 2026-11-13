import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionItem } from '../components/dashboard';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';
import { ROUTES } from '../constants/routes';

const CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Health',
  'Bills',
  'Salary',
  'Freelance',
  'Other',
];

export default function TransactionsScreen({ navigation }) {
  const { transactions, isLoading, error } = useTransactions();

  // Search & Filter State (Phase 5)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filtered transactions computed via useMemo
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Type Filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      // 2. Category Filter
      if (categoryFilter !== 'All' && tx.category !== categoryFilter) {
        return false;
      }
      // 3. Search Query (matches description or category)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const descMatch = (tx.description || '').toLowerCase().includes(query);
        const catMatch = (tx.category || '').toLowerCase().includes(query);
        return descMatch || catMatch;
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTransactions.length} of {transactions.length} records
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(ROUTES.ADD_TRANSACTION)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search description or category..."
            placeholderTextColor={colors.lightGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 3. Type Filters (All / Income / Expense) */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'All' },
          { key: 'income', label: '↑ Income' },
          { key: 'expense', label: '↓ Expense' },
        ].map((tab) => {
          const isActive = typeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setTypeFilter(tab.key)}
              activeOpacity={0.7}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Category Filter Horizontal Scroll */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => {
            const isSelected = categoryFilter === item;
            return (
              <TouchableOpacity
                onPress={() => setCategoryFilter(item)}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 5. Main Transaction List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.black} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading records: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              currencySymbol="₹"
              onPress={() =>
                navigation.navigate(ROUTES.TRANSACTION_DETAILS, {
                  transactionId: item.id,
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIconText}>📝</Text>
              </View>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || categoryFilter !== 'All' || typeFilter !== 'all'
                  ? 'No records match your active search and filter criteria.'
                  : 'Start tracking your spending by adding your first transaction.'}
              </Text>
              <Button
                title="Add New Transaction"
                variant="primary"
                onPress={() => navigation.navigate(ROUTES.ADD_TRANSACTION)}
                style={styles.emptyButton}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.medium,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  searchContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.medium,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.dark,
    height: '100%',
  },
  clearSearch: {
    fontSize: 12,
    color: colors.grey,
    paddingHorizontal: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  filterChip: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    marginHorizontal: 3,
  },
  filterChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  categoryContainer: {
    marginVertical: spacing.xs,
  },
  categoryScroll: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs + 2,
  },
  categoryPillSelected: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.darkGrey,
  },
  categoryPillTextSelected: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.grey,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: 200,
  },
});
