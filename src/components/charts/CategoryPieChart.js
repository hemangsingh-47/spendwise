import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontWeights, borderRadius, spacing } from '../../styles/theme';

const SHADES = [
  '#000000', // Pure black
  '#262626', // Charcoal
  '#525252', // Slate dark
  '#737373', // Fintech grey
  '#A3A3A3', // Light grey
  '#D4D4D4', // Very light grey
];

/**
 * SpendWise Category Expense Breakdown Chart
 * Pure React Native component conforming strictly to the minimal fintech palette.
 * Replaces crash-prone SVG views with a high-performance Segmented Distribution Track
 * and itemized category breakdown list.
 * 
 * @param {{ data: Array<{ category: string, amount: number, percentage: number }>, totalExpense: number }} props
 */
export default function CategoryPieChart({ data = [], totalExpense = 0, currencySymbol = '₹' }) {
  if (!data || data.length === 0 || totalExpense === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No category expenses recorded this month.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Outflow Total Summary Banner */}
      <View style={styles.totalHeaderRow}>
        <View>
          <Text style={styles.totalLabel}>TOTAL OUTFLOW</Text>
          <Text style={styles.totalAmount}>{currencySymbol}{totalExpense.toLocaleString()}</Text>
        </View>
        <View style={styles.categoriesBadge}>
          <Text style={styles.categoriesBadgeText}>
            {data.length} {data.length === 1 ? 'Category' : 'Categories'}
          </Text>
        </View>
      </View>

      {/* 2. Proportional Multi-Segment Distribution Bar */}
      <View style={styles.segmentTrack}>
        {data.map((cat, idx) => {
          const pct = Math.max(2, cat.percentage || 0);
          const isFirst = idx === 0;
          const isLast = idx === data.length - 1;

          return (
            <View
              key={`segment_${cat.category}`}
              style={[
                styles.segmentItem,
                {
                  flex: pct,
                  backgroundColor: SHADES[idx % SHADES.length],
                  borderTopLeftRadius: isFirst ? 6 : 0,
                  borderBottomLeftRadius: isFirst ? 6 : 0,
                  borderTopRightRadius: isLast ? 6 : 0,
                  borderBottomRightRadius: isLast ? 6 : 0,
                  marginRight: isLast ? 0 : 2,
                },
              ]}
            />
          );
        })}
      </View>

      {/* 3. Itemized Category Breakdown List */}
      <View style={styles.listContainer}>
        {data.map((cat, idx) => {
          const shadeColor = SHADES[idx % SHADES.length];

          return (
            <View key={cat.category} style={styles.categoryRow}>
              {/* Left Column: Color Dot & Category Info */}
              <View style={styles.categoryLeft}>
                <View style={[styles.colorDot, { backgroundColor: shadeColor }]} />
                <View style={styles.nameAndProgress}>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {cat.category}
                  </Text>
                  {/* Mini proportional bar */}
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${Math.min(100, cat.percentage || 0)}%`,
                          backgroundColor: shadeColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Right Column: Percentage Badge & Total Amount */}
              <View style={styles.categoryRight}>
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{cat.percentage}%</Text>
                </View>
                <Text style={styles.amountText}>{currencySymbol}{cat.amount.toLocaleString()}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  totalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginTop: 2,
  },
  categoriesBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.small,
  },
  categoriesBadgeText: {
    fontSize: 11,
    color: colors.darkGrey,
    fontWeight: fontWeights.semibold,
  },
  segmentTrack: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  segmentItem: {
    height: '100%',
  },
  listContainer: {
    gap: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
    marginTop: -8, // aligns with category title
  },
  nameAndProgress: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: 4,
  },
  miniBarTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  percentBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 42,
    alignItems: 'center',
  },
  percentText: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  amountText: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
    minWidth: 70,
    textAlign: 'right',
  },
  emptyContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.grey,
  },
});
