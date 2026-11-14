import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  ScreenContainer,
  Button,
  Input,
  Card,
  Heading1,
  SecondaryBody,
  Caption,
} from '../components';
import { colors, spacing, borderRadius, fontWeights } from '../styles/theme';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleLogin = async () => {
    setServerError('');

    // 1. Client-side input validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, 6);

    const newErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // 2. Submit credentials to Express backend
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Navigation is handled reactively by AuthContext in RootNavigator
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setServerError(msg);
      Alert.alert('Sign In Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Top Branding Section */}
      <View style={styles.brandContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>₹</Text>
        </View>
        <Text style={styles.brandTitle}>SpendWise</Text>
        <Caption style={styles.brandSubtitle}>PERSONAL EXPENSE TRACKER</Caption>
      </View>

      {/* Main Form Card */}
      <Card variant="white" style={styles.card}>
        <Heading1 style={styles.heading}>Welcome back</Heading1>
        <SecondaryBody style={styles.subheading}>
          Sign in to track your expenses and monitor your personal budget.
        </SecondaryBody>

        {/* Server Error Banner */}
        {serverError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <Input
          label="Email Address"
          placeholder="student@college.edu"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            if (serverError) setServerError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* Password Input */}
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            if (serverError) setServerError('');
          }}
          secureTextEntry={true}
          showTogglePassword={true}
          error={errors.password}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Submit Login Button */}
        <Button
          title={isSubmitting ? 'Signing In...' : 'Sign In'}
          variant="primary"
          loading={isSubmitting}
          onPress={handleLogin}
          style={styles.loginButton}
        />

        {/* Footer Navigation Link to Register */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.REGISTER)}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Shortcut to Design System Preview */}
      <TouchableOpacity
        style={styles.previewLink}
        onPress={() => navigation.navigate(ROUTES.DESIGN_SYSTEM_PREVIEW)}
        activeOpacity={0.7}
      >
        <Caption style={styles.previewLinkText}>
          View Design System Preview →
        </Caption>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoIconText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: fontWeights.bold,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    letterSpacing: 1.2,
    marginTop: 2,
    color: colors.grey,
  },
  card: {
    marginBottom: spacing.xl,
  },
  heading: {
    marginBottom: spacing.xs,
  },
  subheading: {
    marginBottom: spacing.xl,
  },
  errorBanner: {
    backgroundColor: colors.errorBackground,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: fontWeights.medium,
    color: colors.darkGrey,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: colors.grey,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  previewLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  previewLinkText: {
    color: colors.grey,
    textDecorationLine: 'underline',
  },
});
