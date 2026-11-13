import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransactionProvider } from './src/context/TransactionContext';
import AuthNavigator from './src/navigation/AuthNavigator';

/**
 * SpendWise Root Application Component
 * Sets up safe area insets, global Transaction Context provider,
 * NavigationContainer, and mounts the application navigator.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <TransactionProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </TransactionProvider>
    </SafeAreaProvider>
  );
}
