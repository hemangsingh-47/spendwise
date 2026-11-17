import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDrawer } from '../../context/DrawerContext';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { navigate } from '../../navigation/navigationRef';
import { ROUTES } from '../../constants/routes';
import { colors, fontWeights, borderRadius, spacing } from '../../styles/theme';
import { getCurrencySymbol } from '../../utils/currency';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const DRAWER_WIDTH = Math.min(320, SCREEN_WIDTH * 0.82);

/**
 * SpendWise Robust Animated Slide Drawer
 * 
 * Engineered to completely eliminate Android touch-race conditions:
 * - Backdrop touch area ONLY covers the empty space to the right of the drawer (x > DRAWER_WIDTH).
 *   This prevents taps on the hamburger icon from immediately triggering close on the backdrop!
 * - Android status bar height padding accounted for explicitly.
 * - PanResponder supports swiping left to dismiss.
 * - Smooth spring physics with useNativeDriver.
 */
export default function SlideDrawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const { user, logout } = useAuth();
  const { totalBalance = 0 } = useTransactions();
  const currencySymbol = getCurrencySymbol(user?.currency);

  const animValue = useRef(new Animated.Value(0)).current;

  // Trigger silky spring animation whenever modal opens
  useEffect(() => {
    if (isOpen) {
      animValue.setValue(0);
      Animated.spring(animValue, {
        toValue: 1,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, animValue]);

  // Handle closing with animation
  const handleClose = (callback) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      closeDrawer();
      if (typeof callback === 'function') {
        setTimeout(callback, 50);
      }
    });
  };

  // PanResponder to swipe left to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.8 &&
          gestureState.dx < -15
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          handleClose();
        }
      },
    })
  ).current;

  // Extract user initials
  const fullName = user?.name || user?.fullName || 'College Student';
  const email = user?.email || 'student@spendwise.app';
  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SW';

  const handleNavigateTab = (tabRoute) => {
    handleClose(() => {
      navigate(tabRoute);
    });
  };

  const handleNavigateDirect = (routeName) => {
    handleClose(() => {
      navigate(routeName);
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of SpendWise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            handleClose(async () => {
              await logout();
            });
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'home-outline',
      targetTab: ROUTES.DASHBOARD_TAB,
    },
    {
      label: 'Transactions',
      icon: 'receipt-outline',
      targetTab: ROUTES.TRANSACTIONS_TAB,
    },
    {
      label: 'Budgets & Limits',
      icon: 'pie-chart-outline',
      targetTab: ROUTES.BUDGETS_TAB,
    },
    {
      label: 'Financial Analytics',
      icon: 'bar-chart-outline',
      targetTab: ROUTES.ANALYTICS_TAB,
    },
    {
      label: 'Profile & Settings',
      icon: 'person-outline',
      targetTab: ROUTES.PROFILE_TAB,
    },
  ];

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  });

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={() => handleClose()}
    >
      <View style={styles.overlayRoot}>
        {/* 1. Visual Backdrop (Darkens background) */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
          pointerEvents="none"
        />

        {/* 2. Dismiss Touch Area (ONLY outside the drawer, to the right) */}
        <TouchableOpacity
          style={[styles.dismissArea, { left: DRAWER_WIDTH }]}
          activeOpacity={1}
          onPress={() => handleClose()}
          accessibilityLabel="Dismiss Menu"
        />

        {/* 3. Animated Drawer Panel */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.panel,
            {
              width: DRAWER_WIDTH,
              transform: [{ translateX }],
            },
          ]}
        >
          {/* Header Section (with proper Android Status Bar padding) */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {fullName}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>College Student • CSE</Text>
              </View>
            </View>

            {/* Explicit Close 'X' Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => handleClose()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close Drawer"
            >
              <Ionicons name="close" size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Net Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>NET BALANCE</Text>
              <Text
                style={[
                  styles.balanceValue,
                  totalBalance < 0 && { color: colors.error },
                ]}
                numberOfLines={1}
              >
                {currencySymbol}{totalBalance.toLocaleString()}
              </Text>
              <Text style={styles.balanceSubtext}>Live MongoDB Balance</Text>
            </View>

            {/* Quick Action: New Transaction */}
            <TouchableOpacity
              style={styles.addTxButton}
              onPress={() => {
                handleClose(() => {
                  navigate(ROUTES.ADD_TRANSACTION);
                });
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color={colors.white} />
              <Text style={styles.addTxButtonText}>New Transaction</Text>
            </TouchableOpacity>

            {/* Navigation Menu Links */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>NAVIGATION</Text>
            </View>

            <View style={styles.menuList}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.menuItem}
                  onPress={() => handleNavigateTab(item.targetTab)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={20} color={colors.dark} />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.lightGrey} />
                </TouchableOpacity>
              ))}
            </View>

            {/* College Viva & Tools */}
            <View style={[styles.sectionTitleRow, { marginTop: spacing.lg }]}>
              <Text style={styles.sectionTitle}>COLLEGE VIVA & TOOLS</Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigateDirect(ROUTES.DESIGN_SYSTEM_PREVIEW)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name="color-palette-outline" size={20} color={colors.dark} />
              </View>
              <Text style={styles.menuItemText}>Design System Preview</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.lightGrey} />
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Section */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={styles.versionInfo}>
              <Text style={styles.versionText}>SpendWise v1.0.0</Text>
              <Text style={styles.versionSubtext}>React Native • CSE Assignment</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    position: 'relative',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  dismissArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: DRAWER_WIDTH,
    zIndex: 5,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 30,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 54,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: fontWeights.semibold,
    color: colors.darkGrey,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.xs,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 0.8,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    color: colors.black,
    marginTop: 2,
  },
  balanceSubtext: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    paddingVertical: 10,
    borderRadius: borderRadius.small,
    marginBottom: spacing.lg,
    gap: 6,
  },
  addTxButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
  },
  sectionTitleRow: {
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    color: colors.grey,
    letterSpacing: 1,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.small,
  },
  menuIconWrap: {
    width: 28,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.dark,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'android' ? spacing.lg : spacing.xl,
    backgroundColor: colors.white,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: spacing.sm,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.error,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 6,
  },
  versionText: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: fontWeights.medium,
  },
  versionSubtext: {
    fontSize: 10,
    color: colors.lightGrey,
    marginTop: 1,
  },
});
