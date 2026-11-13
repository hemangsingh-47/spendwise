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
import { colors, spacing, borderRadius, fontWeights, layout } from '../styles/theme';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
} from '../utils/validation';
import { ROUTES } from '../constants/routes';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [demoMessage, setDemoMessage] = useState('');

  const handleRegister = () => {
    // 1. Run all client-side validation rules
    const nameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, 6);
    const confirmError = validateConfirmPassword(password, confirmPassword);
    const termsError = validateTerms(termsAccepted);

    const newErrors = {};
    if (nameError) newErrors.fullName = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;
    if (termsError) newErrors.terms = termsError;

    setErrors(newErrors);

    // 2. Stop if any validation check failed
    if (Object.keys(newErrors).length > 0) {
      setDemoMessage('');
      return;
    }

    // 3. Frontend-only demo feedback (Strict Phase 3 Scope)
    const successMsg = `Demo Account Created Successfully!\nName: ${fullName.trim()}\nEmail: ${email.trim()}`;
    setDemoMessage(successMsg);
    Alert.alert(
      'SpendWise Demo Registration',
      successMsg + '\n\nYou can now sign in.',
      [
        {
          text: 'Go to Sign In',
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

      {/* Main Registration Card */}
      <Card variant="white" style={styles.card}>
        <Heading1 style={styles.heading}>Create account</Heading1>
        <SecondaryBody style={styles.subheading}>
          Start tracking your expenses and manage your college budget easily.
        </SecondaryBody>

        {/* Demo Message Banner */}
        {demoMessage ? (
          <View style={styles.demoBanner}>
            <Text style={styles.demoBannerText}>{demoMessage}</Text>
          </View>
        ) : null}

        {/* Full Name Input */}
        <Input
          label="Full Name"
          placeholder="e.g. Hemang Singh"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
          }}
          autoCapitalize="words"
          error={errors.fullName}
        />

        {/* Email Input */}
        <Input
          label="Email Address"
          placeholder="student@college.edu"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* Password Input */}
        <Input
          label="Password (min 6 characters)"
          placeholder="Create a strong password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          secureTextEntry={true}
          showTogglePassword={true}
          error={errors.password}
        />

        {/* Confirm Password Input */}
        <Input
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }
          }}
          secureTextEntry={true}
          showTogglePassword={true}
          error={errors.confirmPassword}
        />

        {/* Terms and Conditions Checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => {
            const nextVal = !termsAccepted;
            setTermsAccepted(nextVal);
            if (errors.terms && nextVal) {
              setErrors((prev) => ({ ...prev, terms: null }));
            }
          }}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted && styles.checkboxChecked,
              errors.terms && styles.checkboxError,
            ]}
          >
            {termsAccepted ? <Text style={styles.checkmarkText}>✓</Text> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsHighlight}>Terms and Conditions</Text> &{' '}
            <Text style={styles.termsHighlight}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {errors.terms ? (
          <Text style={styles.termsErrorText}>{errors.terms}</Text>
        ) : null}

        {/* Create Account Button */}
        <Button
          title="Create Account"
          variant="primary"
          onPress={handleRegister}
          style={styles.registerButton}
        />

        {/* Footer Navigation Link to Login */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  brandTitle: {
    fontSize: 20,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: layout.borderWidth + 0.5,
    borderColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGrey,
    lineHeight: 18,
  },
  termsHighlight: {
    fontWeight: fontWeights.semibold,
    color: colors.black,
  },
  termsErrorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.md,
    fontWeight: fontWeights.medium,
  },
  registerButton: {
    marginTop: spacing.md,
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
});
