import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, layout } from '../styles/theme';

/**
 * Reusable Card Component
 * 
 * Props:
 * - children: React nodes
 * - style: object (custom styling overrides)
 * - variant: 'white' | 'card' (default: 'white')
 */
export const Card = ({ children, style, variant = 'white', ...props }) => {
  const isCardBackground = variant === 'card';

  return (
    <View
      style={[
        styles.card,
        isCardBackground ? styles.cardBackground : styles.whiteBackground,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: layout.cardElevation,
  },
  whiteBackground: {
    backgroundColor: colors.white,
  },
  cardBackground: {
    backgroundColor: colors.card,
  },
});

export default Card;
