/**
 * SpendWise Centralized Design Theme
 * Black & White Minimal - Professional Fintech Style
 * Inspired by clean corporate expense management workflows (e.g. Zoho Expense)
 */

export const colors = {
  black: '#000000',
  dark: '#171717',
  darkGrey: '#404040',
  grey: '#737373',
  lightGrey: '#A3A3A3',
  border: '#E5E5E5',
  background: '#F5F5F5',
  card: '#FAFAFA',
  white: '#FFFFFF',

  // Semantic state colors (subtle and accessible)
  error: '#DC2626',
  errorBackground: '#FEF2F2',
  success: '#16A34A',
  successBackground: '#F0FDF4',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: colors.black,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    color: colors.black,
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.black,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.dark,
  },
  secondaryBody: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.grey,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: colors.lightGrey,
  },
};

export const fontSizes = {
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  secondary: 14,
  caption: 12,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  full: 9999,
};

export const layout = {
  screenPaddingHorizontal: 20,
  buttonHeight: 48,
  inputHeight: 48,
  borderWidth: 1,
  cardElevation: 1,
};

export default {
  colors,
  typography,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
};
