import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontWeights, borderRadius, spacing } from '../../styles/theme';

/**
 * SpendWise Monthly Income vs Expense Bar Chart
 * Pure React Native layout chart conforming strictly to the Black & White minimal fintech palette.
 * @param {{ data: Array<{ month: number, year: number, label: string, income: number, expense: number }> }} props
 */
export default function MonthlyBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No monthly trend data available.</Text>
      </View>
    );
  }

  // Find max value to normalize bar heights
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income || 0, d.expense || 0)),
    1000 // minimum scale
  );

  const chartHeight = 150;

  return (
    <View style={styles.wrapper}>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.black }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.lightGrey }]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>

      {/* Bars Container */}
      <View style={[styles.chartArea, { height: chartHeight }]}>
        {data.map((item, index) => {
          const incomeHeight = Math.max(4, Math.round(((item.income || 0) / maxVal) * chartHeight));
          const expenseHeight = Math.max(4, Math.round(((item.expense || 0) / maxVal) * chartHeight));

          return (
            <View key={`${item.year}_${item.month}_${index}`} style={styles.monthColumn}>
              {/* Bars paired */}
              <View style={styles.barsPair}>
                {/* Income Bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: incomeHeight,
                      backgroundColor: colors.black,
                    },
                  ]}
                />
                {/* Expense Bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: expenseHeight,
                      backgroundColor: colors.lightGrey,
                    },
                  ]}
                />
              </View>

              {/* Month Label */}
              <Text style={styles.monthLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: fontWeights.medium,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 2,
  },
  monthColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barsPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginBottom: 6,
  },
  bar: {
    width: 12,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.grey,
    marginTop: 4,
  },
  emptyContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.grey,
  },
});
