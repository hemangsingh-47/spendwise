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
import { validateEmail } from '../utils/validation';
import { ROUTES } from '../constants/routes';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [demoMessage, setDemoMessage] = useState('');

  const handleResetPassword = () => {
    // 1. Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setDemoMessage('');
      return;
    }

    // 2. Clear error
    setError(null);

    // 3. Demo feedback message (Strict Phase 3 Scope)
    const successMsg = `Demo Reset Instructions Sent!\nA password reset link has been dispatched to ${email.trim()}.`;
    setDemoMessage(successMsg);
    Alert.alert(
      'SpendWise Password Reset',
      successMsg,
      [
        {
          text: 'Return to Sign In',
          onPress: () => navigation.navigate(ROUTES.LOGIN),
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>SpendWise</Text>
        <Caption style={styles.brandSubtitle}>PERSONAL EXPENSE TRACKER</Caption>
      </View>

      {/* Main Card */}
      <Card variant="white" style={styles.card}>
        <Heading1 style={styles.heading}>Reset password</Heading1>
        <SecondaryBody style={styles.subheading}>
          Enter the email address associated with your SpendWise account and we'll send you recovery instructions.
        </SecondaryBody>

        {/* Demo Message Banner */}
        {demoMessage ? (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>{demoMessage}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <Input
          label="Email Address"
          placeholder="student@college.edu"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        {/* Submit Reset Button */}
        <Button
          title="Send Reset Link"
          variant="primary"
          onPress={handleResetPassword}
          style={styles.resetButton}
        />

        {/* Back to Login Link */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Text style={styles.footerLink}>← Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
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
  demoBanner: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  demoBannerText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  resetButton: {
    marginBottom: spacing.lg,
  },
  footerContainer: {
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  backButton: {
    paddingVertical: spacing.xs,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.black,
  },
});
