import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionProvider } from './src/context/TransactionContext';
import { DrawerProvider, useDrawer } from './src/context/DrawerContext';
import SlideDrawer from './src/components/navigation/SlideDrawer';
import { navigationRef } from './src/navigation/navigationRef';
import AuthNavigator from './src/navigation/AuthNavigator';

/**
 * SpendWise App Content Wrapper
 * Integrates global edge-swipe gesture support to open the drawer from anywhere on screen,
 * alongside standard button tap opening.
 */
function AppContent() {
  const { openDrawer, isOpen } = useDrawer();

  // Edge-swipe PanResponder: Swiping right from the left screen bezel (x < 35px) opens drawer
  const edgePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isOpen) return false; // Handled by drawer itself when open
        return (
          evt.nativeEvent.pageX < 35 &&
          gestureState.dx > 25 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 40) {
          openDrawer();
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...edgePanResponder.panHandlers}>
      <NavigationContainer ref={navigationRef}>
        <AuthNavigator />
      </NavigationContainer>
      <SlideDrawer />
    </View>
  );
}

/**
 * SpendWise Root Application Component
 * Sets up safe area insets, global Auth, Transaction & Pure Drawer Context providers,
 * NavigationContainer with centralized ref, and mounts the protected application navigator.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <TransactionProvider>
          <DrawerProvider>
            <AppContent />
          </DrawerProvider>
        </TransactionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
