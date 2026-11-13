import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontWeights } from '../../styles/theme';

/**
 * Reusable SectionHeader Component
 * Clean heading with an optional right-aligned action button.
 * 
 * Props:
 * - title: string
 * - actionText: string (optional, e.g. 'View All')
 * - onActionPress: function (optional)
 */
export const SectionHeader = ({ title, actionText, onActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionText && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionText}>{actionText} →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.3,
  },
  actionText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
});

export default SectionHeader;
