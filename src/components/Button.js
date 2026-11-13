import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';

/**
 * Reusable SpendWise Button Component
 * 
 * Props:
 * - title: string (button label)
 * - onPress: function (callback on tap)
 * - variant: 'primary' | 'secondary' | 'outline' (default: 'primary')
 * - disabled: boolean (disables interaction and dims button)
 * - loading: boolean (shows activity indicator)
 * - style: object (custom container style override)
 * - textStyle: object (custom text style override)
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.white : colors.black}
        />
      ) : (
        <Text
          style={[
            styles.baseText,
            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: layout.buttonHeight,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.black,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
  },
  disabledButton: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    opacity: 0.6,
  },
  baseText: {
    fontSize: 15,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.dark,
  },
  disabledText: {
    color: colors.grey,
  },
});

export default Button;
