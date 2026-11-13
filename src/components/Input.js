import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';

/**
 * Reusable SpendWise Input Field Component
 * 
 * Props:
 * - label: string (optional label above the input)
 * - value: string (current input value)
 * - onChangeText: function (text change callback)
 * - placeholder: string (placeholder text)
 * - error: string (validation error message, if any)
 * - secureTextEntry: boolean (for password masking)
 * - showTogglePassword: boolean (shows 'Show'/'Hide' button for password fields)
 * - keyboardType: string (e.g. 'email-address', 'default', 'numeric')
 * - autoCapitalize: string ('none', 'words', etc.)
 * - containerStyle: object (custom styling for wrapper)
 */
export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  showTogglePassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  containerStyle,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  const hasError = Boolean(error);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGrey}
          secureTextEntry={isPasswordHidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.textInput}
          {...restProps}
        />

        {showTogglePassword ? (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            style={styles.toggleButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.toggleText}>
              {isPasswordHidden ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.dark,
    marginBottom: spacing.xs + 2,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    backgroundColor: colors.white,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    height: '100%',
  },
  toggleButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
    fontWeight: fontWeights.medium,
  },
});

export default Input;
