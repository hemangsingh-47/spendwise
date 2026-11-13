import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, layout, fontWeights } from '../../styles/theme';

/**
 * Reusable QuickActionButton Component
 * Minimalist action card used on Dashboard for fast access.
 * 
 * Props:
 * - title: string
 * - iconSymbol: string (e.g. '+', '-', '≡')
 * - onPress: function
 * - variant: 'primary' | 'secondary' (default: 'secondary')
 */
export const QuickActionButton = ({
  title,
  iconSymbol,
  onPress,
  variant = 'secondary',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          isPrimary ? styles.primaryIcon : styles.secondaryIcon,
        ]}
      >
        <Text
          style={[
            styles.iconText,
            isPrimary ? styles.primaryIconText : styles.secondaryIconText,
          ]}
        >
          {iconSymbol}
        </Text>
      </View>
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.medium,
    borderWidth: layout.borderWidth,
    marginHorizontal: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  primaryIcon: {
    backgroundColor: colors.dark,
  },
  secondaryIcon: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
  primaryIconText: {
    color: colors.white,
  },
  secondaryIconText: {
    color: colors.dark,
  },
  label: {
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.dark,
  },
});

export default QuickActionButton;
