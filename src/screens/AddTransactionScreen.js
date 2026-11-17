import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import budgetService from '../services/budgetService';
import notificationService from '../services/notificationService';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Health',
  'Bills',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Gift',
  'Other',
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Net Banking'];

export default function AddTransactionScreen({ navigation, route }) {
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency);
  const { addTransaction, uploadReceipt } = useTransactions();
  const defaultType = route.params?.defaultType || 'expense';

  // Form State
  const [type, setType] = useState(defaultType); // 'income' | 'expense'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(
    defaultType === 'income' ? 'Salary' : 'Food'
  );
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptUri, setReceiptUri] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  // Image Picker: Camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is needed to capture and attach your expense receipt.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReceiptUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Camera Error', err.message || 'Could not open camera');
    }
  };

  // Image Picker: Gallery
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery access is needed to upload a photo of your receipt.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReceiptUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Gallery Error', err.message || 'Could not open gallery');
    }
  };

  const handlePromptReceipt = () => {
    Alert.alert(
      'Attach Receipt Photo',
      'Choose an option to upload your expense receipt:',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Gallery', onPress: handlePickFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    const newErrors = {};

    // 1. Amount validation
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero.';
    }

    // 2. Category validation
    if (!category) {
      newErrors.category = 'Category is required.';
    }

    // 3. Description validation
    if (!description.trim()) {
      newErrors.description = 'Please enter a short description.';
    } else if (description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters.';
    }

    // 4. Date validation
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      newErrors.date = 'Date must be formatted as YYYY-MM-DD.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const createdTx = await addTransaction({
        type,
        amount: numAmount,
        category,
        description: description.trim(),
        date,
        paymentMethod,
      });

      // If a receipt photo was picked, upload it to the newly created transaction
      if (createdTx?.id && receiptUri) {
        try {
          await uploadReceipt(createdTx.id, receiptUri);
        } catch (uploadErr) {
          console.warn('[AddTransaction] Receipt upload warning:', uploadErr.message);
        }
      }

      // Check Budget Warning Thresholds if expense
      if (type === 'expense') {
        try {
          const txDate = new Date(date);
          const month = txDate.getMonth() + 1;
          const year = txDate.getFullYear();
          const budgetData = await budgetService.getBudgets(month, year);
          const matchedBudget = (budgetData.data || []).find(
            (b) => b.category.toLowerCase() === category.toLowerCase()
          );

          if (matchedBudget && matchedBudget.limit > 0) {
            await notificationService.evaluateBudgetThreshold(
              category,
              matchedBudget.spent,
              matchedBudget.limit,
              month,
              year
            );
          }
        } catch (notifErr) {
          console.warn('[AddTransaction] Budget notification check warning:', notifErr.message);
        }
      }

      Alert.alert(
        'Transaction Recorded',
        `${type === 'income' ? 'Income' : 'Expense'} of ${currencySymbol}${numAmount.toLocaleString()} successfully saved to MongoDB!`,
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Save Failed', err.message || 'Could not save transaction to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Card */}
      <Card variant="white" style={styles.card}>
        {/* Type Selector (Income vs Expense) */}
        <Text style={styles.fieldLabel}>TRANSACTION TYPE</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeTab,
              type === 'expense' && styles.typeTabActive,
            ]}
            onPress={() => handleTypeChange('expense')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeTabText,
                type === 'expense' && styles.typeTabTextActive,
              ]}
            >
              ↓ Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              type === 'income' && styles.typeTabActive,
            ]}
            onPress={() => handleTypeChange('income')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.typeTabText,
                type === 'income' && styles.typeTabTextActive,
              ]}
            >
              ↑ Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <Input
          label={`Amount (${currencySymbol})`}
          placeholder="e.g. 450"
          value={amount}
          onChangeText={(val) => {
            setAmount(val);
            if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
          }}
          keyboardType="numeric"
          error={errors.amount}
        />

        {/* Description Input */}
        <Input
          label="Description"
          placeholder="e.g. College Canteen Lunch"
          value={description}
          onChangeText={(val) => {
            setDescription(val);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: null }));
            }
          }}
          error={errors.description}
        />

        {/* Category Selection */}
        <Text style={styles.fieldLabel}>CATEGORY</Text>
        <View style={styles.pillContainer}>
          {categoryList.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.category ? (
          <Text style={styles.fieldError}>{errors.category}</Text>
        ) : null}

        {/* Date Input */}
        <Input
          label="Date (YYYY-MM-DD)"
          placeholder="2026-11-13"
          value={date}
          onChangeText={(val) => {
            setDate(val);
            if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
          }}
          error={errors.date}
        />

        {/* Payment Method Selector */}
        <Text style={styles.fieldLabel}>PAYMENT METHOD</Text>
        <View style={styles.pillContainer}>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Receipt Photo Attachment (Phase 10) */}
        <Text style={styles.fieldLabel}>RECEIPT PHOTO (OPTIONAL)</Text>
        {receiptUri ? (
          <View style={styles.receiptPreviewContainer}>
            <Image source={{ uri: receiptUri }} style={styles.receiptThumbnail} />
            <View style={styles.receiptPreviewInfo}>
              <Text style={styles.receiptAttachedText}>Receipt attached</Text>
              <View style={styles.receiptActionButtons}>
                <TouchableOpacity
                  style={styles.receiptActionBtn}
                  onPress={handlePromptReceipt}
                  activeOpacity={0.7}
                >
                  <Text style={styles.receiptActionText}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.receiptActionBtn, { borderColor: colors.border }]}
                  onPress={() => setReceiptUri(null)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.receiptActionText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.attachReceiptBox}
            onPress={handlePromptReceipt}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={20} color={colors.dark} />
            <Text style={styles.attachReceiptText}>Attach Receipt Photo</Text>
            <Text style={styles.attachReceiptSub}>Camera or Gallery (JPEG, PNG)</Text>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <Button
          title={isSubmitting ? 'Saving to Database...' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
          variant="primary"
          loading={isSubmitting}
          onPress={handleSave}
          style={styles.saveButton}
        />

        <Button
          title="Cancel"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  card: {
    marginBottom: spacing.xxl,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
    marginBottom: spacing.xs + 2,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    padding: 4,
    borderWidth: layout.borderWidth,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  typeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.small,
  },
  typeTabActive: {
    backgroundColor: colors.black,
  },
  typeTabText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  typeTabTextActive: {
    color: colors.white,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryPillSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.dark,
  },
  categoryPillTextSelected: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  attachReceiptBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.medium,
    backgroundColor: colors.card,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  attachReceiptText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginTop: 4,
  },
  attachReceiptSub: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },
  receiptPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  receiptThumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.small,
    backgroundColor: colors.border,
  },
  receiptPreviewInfo: {
    flex: 1,
  },
  receiptAttachedText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.black,
    marginBottom: 6,
  },
  receiptActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  receiptActionBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  receiptActionText: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.dark,
  },
});
