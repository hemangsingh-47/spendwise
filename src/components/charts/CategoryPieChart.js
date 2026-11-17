import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { colors, fontWeights, borderRadius, spacing } from '../../styles/theme';

const SHADES = [
  '#000000', // pure black
  '#262626', // dark charcoal
  '#525252', // medium dark grey
  '#737373', // grey
  '#A3A3A3', // light grey
  '#D4D4D4', // very light grey
];

/**
 * SpendWise Category Expense Donut Chart
 * Renders an SVG Donut Chart with proportional category arcs and an itemized breakdown.
 * @param {{ data: Array<{ category: string, amount: number, percentage: number }>, totalExpense: number }} props
 */
export default function CategoryPieChart({ data = [], totalExpense = 0 }) {
  if (!data || data.length === 0 || totalExpense === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No category expenses recorded this month.</Text>
      </View>
    );
  }

  const radius = 55;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const center = radius + strokeWidth;
  const size = center * 2;

  let accumulatedPercent = 0;

  return (
    <View style={styles.container}>
      {/* SVG Donut */}
      <View style={styles.donutWrap}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background circle track */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.border}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Segment arcs */}
            {data.map((cat, idx) => {
              const fraction = (cat.percentage || 0) / 100;
              const strokeDashoffset = circumference * (1 - fraction);
              const rotationAngle = (accumulatedPercent / 100) * 360;
              accumulatedPercent += cat.percentage || 0;

              return (
                <Circle
                  key={cat.category}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={SHADES[idx % SHADES.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(${rotationAngle}, ${center}, ${center})`}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center label */}
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerSubtitle}>TOTAL</Text>
          <Text style={styles.centerAmount}>₹{totalExpense >= 1000 ? `${(totalExpense / 1000).toFixed(1)}k` : totalExpense}</Text>
        </View>
      </View>

      {/* Itemized Legend List */}
      <View style={styles.listContainer}>
        {data.map((cat, idx) => (
          <View key={cat.category} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: SHADES[idx % SHADES.length] },
                ]}
              />
              <Text style={styles.categoryName} numberOfLines={1}>
                {cat.category}
              </Text>
            </View>

            <View style={styles.legendRight}>
              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{cat.percentage}%</Text>
              </View>
              <Text style={styles.amountText}>₹{cat.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  donutWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSubtitle: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.5,
  },
  centerAmount: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  listContainer: {
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: fontWeights.medium,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  percentBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  percentText: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  amountText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.black,
    minWidth: 60,
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
