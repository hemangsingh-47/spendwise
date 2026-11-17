import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontWeights, borderRadius, spacing } from '../../styles/theme';

/**
 * SpendWise Monthly Income vs Expense Bar Chart
 * Pure React Native layout chart conforming strictly to the Black & White minimal fintech palette.
 * 
 * Features:
 * - Clear baseline separation: Bars sit directly on the X-axis line.
 * - Dedicated labels row below the axis so no bars ever collide with month names or lines.
 * - Automatic 25% scale headroom so high-value months (like Nov) never overlap top borders or legends.
 * - Subtle horizontal gridlines (100%, 50%, 0%) with clean currency reference markers.
 * - Current month highlighting with active indicator dot.
 * 
 * @param {{ data: Array<{ month: number, year: number, label: string, income: number, expense: number }> }} props
 */
export default function MonthlyBarChart({ data = [], currencySymbol = '₹' }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No monthly trend data available.</Text>
      </View>
    );
  }

  // Current month & year for highlighting
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Find max value to normalize bar heights
  const rawMax = Math.max(
    ...data.map((d) => Math.max(d.income || 0, d.expense || 0)),
    1000
  );

  // Add 25% headroom so bars never touch or overlap the top edge/legend
  const scaleMax = Math.ceil((rawMax * 1.25) / 1000) * 1000;

  const plotHeight = 130;
  const maxBarHeight = plotHeight - 15; // 115px max bar height

  // Formatter for Y-axis scale labels
  const formatScale = (val) => {
    if (val >= 100000) return `${currencySymbol}${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `${currencySymbol}${Math.round(val / 1000)}k`;
    return `${currencySymbol}${val}`;
  };

  return (
    <View style={styles.wrapper}>
      {/* Legend Header */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.black }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: colors.grey }]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>

      {/* Main Chart Plot Container */}
      <View style={styles.chartContainer}>
        {/* Plot Area with Gridlines & Bars */}
        <View style={[styles.plotArea, { height: plotHeight }]}>
          {/* Top Guideline (100% scaleMax) */}
          <View style={[styles.gridLineRow, { top: 0 }]}>
            <View style={styles.gridLine} />
            <Text style={styles.scaleLabel}>{formatScale(scaleMax)}</Text>
          </View>

          {/* Middle Guideline (50% scaleMax) */}
          <View style={[styles.gridLineRow, { top: plotHeight / 2 }]}>
            <View style={styles.gridLine} />
            <Text style={styles.scaleLabel}>{formatScale(scaleMax / 2)}</Text>
          </View>

          {/* Bar Columns Container */}
          <View style={styles.barsArea}>
            {data.map((item, index) => {
              const incomeHeight = Math.max(
                3,
                Math.round(((item.income || 0) / scaleMax) * maxBarHeight)
              );
              const expenseHeight = Math.max(
                3,
                Math.round(((item.expense || 0) / scaleMax) * maxBarHeight)
              );
              const isCurrent = item.month === currentMonth && item.year === currentYear;

              return (
                <View
                  key={`${item.year}_${item.month}_${index}`}
                  style={styles.monthBarColumn}
                >
                  <View style={styles.barsPair}>
                    {/* Income Bar (Black) */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: incomeHeight,
                          backgroundColor: colors.black,
                          marginRight: 4,
                        },
                      ]}
                    />

                    {/* Expense Bar (Grey) */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: expenseHeight,
                          backgroundColor: colors.grey,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Crisp X-Axis Baseline (Separates bars completely from labels) */}
        <View style={styles.baseline} />

        {/* Dedicated Month Labels Row (Underneath the baseline) */}
        <View style={styles.labelsRow}>
          {data.map((item, index) => {
            const isCurrent = item.month === currentMonth && item.year === currentYear;

            return (
              <View
                key={`label_${item.year}_${item.month}_${index}`}
                style={styles.labelColumn}
              >
                <Text
                  style={[
                    styles.monthLabel,
                    isCurrent && styles.currentMonthLabel,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                {isCurrent && <View style={styles.currentMonthDot} />}
              </View>
            );
          })}
        </View>
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
    alignItems: 'center',
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
  chartContainer: {
    width: '100%',
  },
  plotArea: {
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  gridLineRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  gridLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  scaleLabel: {
    fontSize: 9,
    color: colors.lightGrey,
    fontWeight: fontWeights.medium,
    marginLeft: 6,
    minWidth: 32,
    textAlign: 'right',
  },
  barsArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    zIndex: 2,
    paddingRight: 38, // Reserve space for Y-axis scale labels
  },
  monthBarColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barsPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    width: 11,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  baseline: {
    height: 1.5,
    backgroundColor: colors.black,
    width: '100%',
    marginTop: 0,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingRight: 38, // Align with barsArea
    height: 32,
  },
  labelColumn: {
    flex: 1,
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.grey,
  },
  currentMonthLabel: {
    color: colors.black,
    fontWeight: fontWeights.bold,
  },
  currentMonthDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.black,
    marginTop: 3,
  },
  emptyContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.grey,
  },
});
