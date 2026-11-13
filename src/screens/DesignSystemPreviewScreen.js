import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ScreenContainer,
  Button,
  Input,
  Card,
  Heading1,
  Heading2,
  Heading3,
  Body,
  SecondaryBody,
  Caption,
} from '../components';
import { colors, spacing, borderRadius } from '../styles/theme';

export default function DesignSystemPreviewScreen() {
  const [testInput, setTestInput] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <ScreenContainer>
      {/* Title */}
      <Heading1 style={styles.title}>Design System</Heading1>
      <SecondaryBody style={styles.subtitle}>
        SpendWise Black & White Minimal UI Palette & Reusable Components
      </SecondaryBody>

      {/* 1. Color Palette Section */}
      <Card style={styles.sectionCard}>
        <Heading3 style={styles.sectionTitle}>1. Color Palette</Heading3>
        <View style={styles.paletteGrid}>
          {[
            { name: 'Black', hex: colors.black, textDark: false },
            { name: 'Dark', hex: colors.dark, textDark: false },
            { name: 'Dark Grey', hex: colors.darkGrey, textDark: false },
            { name: 'Grey', hex: colors.grey, textDark: false },
            { name: 'Light Grey', hex: colors.lightGrey, textDark: true },
            { name: 'Border', hex: colors.border, textDark: true },
            { name: 'Background', hex: colors.background, textDark: true },
            { name: 'Card', hex: colors.card, textDark: true },
            { name: 'White', hex: colors.white, textDark: true },
          ].map((item) => (
            <View key={item.name} style={styles.paletteItem}>
              <View
                style={[
                  styles.colorChip,
                  { backgroundColor: item.hex, borderColor: colors.border },
                ]}
              />
              <Text style={styles.colorName}>{item.name}</Text>
              <Text style={styles.colorHex}>{item.hex}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* 2. Typography Examples */}
      <Card style={styles.sectionCard}>
        <Heading3 style={styles.sectionTitle}>2. Typography Scale</Heading3>
        <Heading1>Heading 1 (28px)</Heading1>
        <Heading2>Heading 2 (24px)</Heading2>
        <Heading3>Heading 3 (20px)</Heading3>
        <Body>Body text (16px) - Clean, readable fintech typography.</Body>
        <SecondaryBody>Secondary Body (14px) - For captions and descriptions.</SecondaryBody>
        <Caption>Caption (12px) - For timestamps and hints.</Caption>
      </Card>

      {/* 3. Reusable Buttons */}
      <Card style={styles.sectionCard}>
        <Heading3 style={styles.sectionTitle}>3. Button Component</Heading3>
        <Button
          title="Primary Button"
          variant="primary"
          onPress={() => alert('Primary pressed')}
          style={styles.elementMargin}
        />
        <Button
          title="Secondary Button"
          variant="secondary"
          onPress={() => alert('Secondary pressed')}
          style={styles.elementMargin}
        />
        <Button
          title="Disabled Button"
          variant="primary"
          disabled={true}
          onPress={() => {}}
          style={styles.elementMargin}
        />
        <Button
          title="Loading State"
          loading={buttonLoading}
          onPress={() => {
            setButtonLoading(true);
            setTimeout(() => setButtonLoading(false), 1500);
          }}
          style={styles.elementMargin}
        />
      </Card>

      {/* 4. Reusable Input Fields */}
      <Card style={styles.sectionCard}>
        <Heading3 style={styles.sectionTitle}>4. Input Component</Heading3>
        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={testInput}
          onChangeText={setTestInput}
          keyboardType="email-address"
        />
        <Input
          label="Password (with Show/Hide)"
          placeholder="Enter password"
          value={testPassword}
          onChangeText={setTestPassword}
          secureTextEntry={true}
          showTogglePassword={true}
        />
        <Input
          label="Field with Validation Error"
          placeholder="Invalid input demo"
          value=""
          error="This field is required."
          onChangeText={() => {}}
        />
      </Card>

      {/* 5. Card Variants */}
      <Card variant="white" style={styles.sectionCard}>
        <Heading3>5. White Card Variant</Heading3>
        <SecondaryBody>Subtle border with elevation and clean inner padding.</SecondaryBody>
      </Card>
      <Card variant="card" style={styles.sectionCard}>
        <Heading3>Card Variant (#FAFAFA)</Heading3>
        <SecondaryBody>Slightly tinted card variant for contrast.</SecondaryBody>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xxl,
  },
  sectionCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  elementMargin: {
    marginBottom: spacing.md,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paletteItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  colorChip: {
    width: '100%',
    height: 44,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    marginBottom: 4,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.dark,
  },
  colorHex: {
    fontSize: 10,
    color: colors.grey,
  },
});
