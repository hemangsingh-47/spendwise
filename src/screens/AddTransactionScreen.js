import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';

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
  const { addTransaction } = useTransactions();
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
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
      await addTransaction({
        type,
        amount: numAmount,
        category,
        description: description.trim(),
        date,
        paymentMethod,
      });

      Alert.alert(
        'Transaction Recorded',
        `${type === 'income' ? 'Income' : 'Expense'} of ₹${numAmount} successfully saved to MongoDB!`,
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
          label="Amount (₹)"
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
});
