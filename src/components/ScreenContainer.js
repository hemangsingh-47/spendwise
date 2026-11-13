import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, layout } from '../styles/theme';

/**
 * Reusable ScreenContainer Component
 * Provides unified background, safe area insets, horizontal padding,
 * and keyboard-avoiding scroll behavior for forms.
 * 
 * Props:
 * - children: React nodes
 * - scrollable: boolean (default: true for screens with inputs)
 * - contentContainerStyle: object (styles for inner scroll container)
 * - style: object (styles for outer container)
 */
export const ScreenContainer = ({
  children,
  scrollable = true,
  contentContainerStyle,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, contentContainerStyle]}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xl,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xl,
  },
});

export default ScreenContainer;
