import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, layout, fontWeights } from '../styles/theme';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import { ROUTES } from '../constants/routes';

export default function TransactionDetailsScreen({ route, navigation }) {
  const { transactionId } = route.params || {};
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency);
  const { getTransactionById, deleteTransaction, uploadReceipt, deleteReceipt } = useTransactions();

  const [isUploading, setIsUploading] = useState(false);
  const [fullImageModal, setFullImageModal] = useState(false);

  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    return (
      <ScreenContainer contentContainerStyle={styles.container}>
        <Card variant="white" style={styles.card}>
          <Text style={styles.notFoundText}>Transaction record not found.</Text>
          <Button
            title="Back to Transactions"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
        </Card>
      </ScreenContainer>
    );
  }

  const isIncome = transaction.type === 'income';

  const handleAttachReceipt = () => {
    Alert.alert(
      'Attach Receipt Photo',
      'Choose an option:',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Camera permission is required.');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
              if (!result.canceled && result.assets[0]?.uri) {
                await processUpload(result.assets[0].uri);
              }
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Gallery permission is required.');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
              if (!result.canceled && result.assets[0]?.uri) {
                await processUpload(result.assets[0].uri);
              }
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const processUpload = async (uri) => {
    try {
      setIsUploading(true);
      await uploadReceipt(transaction.id, uri);
      Alert.alert('Success', 'Receipt photo uploaded successfully!');
    } catch (err) {
      Alert.alert('Upload Failed', err.message || 'Could not upload receipt');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveReceipt = () => {
    Alert.alert(
      'Remove Receipt',
      'Are you sure you want to delete this receipt image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsUploading(true);
              await deleteReceipt(transaction.id);
            } catch (err) {
              Alert.alert('Error', err.message);
            } finally {
              setIsUploading(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description || transaction.category}"? This will permanently remove it from MongoDB.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Deletion Failed', err.message || 'Could not delete transaction.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Details Card */}
      <Card variant="white" style={styles.card}>
        {/* Type Badge */}
        <View style={[styles.badge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
          <Text style={[styles.badgeText, isIncome ? styles.incomeBadgeText : styles.expenseBadgeText]}>
            {isIncome ? '↑ INCOME' : '↓ EXPENSE'}
          </Text>
        </View>

        {/* Amount */}
        <Text style={styles.amount}>
          {isIncome ? '+' : '-'} {currencySymbol} {Number(transaction.amount).toLocaleString('en-IN')}
        </Text>

        <Text style={styles.description}>{transaction.description}</Text>

        <View style={styles.divider} />

        {/* Detail Rows */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category</Text>
          <Text style={styles.detailValue}>{transaction.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{transaction.paymentMethod || 'Not specified'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Record ID</Text>
          <Text style={[styles.detailValue, styles.idText]}>{transaction.id}</Text>
        </View>

        {/* Receipt Attachment Section (Phase 10) */}
        <View style={styles.receiptSectionWrap}>
          <Text style={styles.detailLabel}>RECEIPT PHOTO</Text>
          {transaction.receiptUrl ? (
            <View style={styles.receiptContainer}>
              <TouchableOpacity
                onPress={() => setFullImageModal(true)}
                activeOpacity={0.8}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: transaction.receiptUrl }}
                  style={styles.receiptImage}
                  resizeMode="cover"
                />
                <View style={styles.viewBadge}>
                  <Ionicons name="expand-outline" size={12} color={colors.white} />
                  <Text style={styles.viewBadgeText}>Tap to enlarge</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.receiptBtnRow}>
                <TouchableOpacity
                  style={styles.receiptSmallBtn}
                  onPress={handleAttachReceipt}
                  disabled={isUploading}
                >
                  <Text style={styles.receiptSmallBtnText}>Change Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.receiptSmallBtn, { borderColor: colors.border }]}
                  onPress={handleRemoveReceipt}
                  disabled={isUploading}
                >
                  <Text style={[styles.receiptSmallBtnText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.noReceiptBox}
              onPress={handleAttachReceipt}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color={colors.black} />
              ) : (
                <>
                  <Ionicons name="document-attach-outline" size={20} color={colors.grey} />
                  <Text style={styles.noReceiptText}>No receipt attached</Text>
                  <Text style={styles.noReceiptSub}>Tap to attach photo (Camera / Gallery)</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonSpacing} />

        {/* Edit Button */}
        <Button
          title="Edit Transaction"
          variant="secondary"
          onPress={() =>
            navigation.navigate(ROUTES.EDIT_TRANSACTION, {
              transactionId: transaction.id,
            })
          }
          style={styles.actionButton}
        />

        {/* Delete Button */}
        <Button
          title="Delete Transaction"
          variant="secondary"
          onPress={handleDelete}
          textStyle={{ color: colors.error }}
          style={[styles.actionButton, styles.deleteButton]}
        />
      </Card>

      {/* Full-screen Receipt Image Modal */}
      <Modal
        visible={fullImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageModal(false)}
      >
        <View style={styles.modalBg}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setFullImageModal(false)}
          >
            <Ionicons name="close-circle" size={32} color={colors.white} />
          </TouchableOpacity>
          {transaction.receiptUrl && (
            <Image
              source={{ uri: transaction.receiptUrl }}
              style={styles.modalFullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    marginBottom: spacing.md,
  },
  incomeBadge: {
    backgroundColor: colors.black,
  },
  expenseBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
  },
  incomeBadgeText: {
    color: colors.white,
  },
  expenseBadgeText: {
    color: colors.dark,
  },
  amount: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 15,
    color: colors.grey,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xs + 2,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.grey,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  idText: {
    fontSize: 11,
    color: colors.lightGrey,
  },
  buttonSpacing: {
    height: spacing.lg,
  },
  actionButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.grey,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  backBtn: {
    width: '100%',
  },
  receiptSectionWrap: {
    width: '100%',
    marginVertical: spacing.md,
  },
  receiptContainer: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  viewBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: fontWeights.medium,
  },
  receiptBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  receiptSmallBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  receiptSmallBtnText: {
    fontSize: 11,
    fontWeight: fontWeights.medium,
    color: colors.dark,
  },
  noReceiptBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.medium,
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  noReceiptText: {
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginTop: 4,
  },
  noReceiptSub: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalFullImage: {
    width: '100%',
    height: '80%',
  },
});
