import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionProvider } from './src/context/TransactionContext';
import AuthNavigator from './src/navigation/AuthNavigator';

/**
 * SpendWise Root Application Component
 * Sets up safe area insets, global Auth & Transaction Context providers,
 * NavigationContainer, and mounts the protected application navigator.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <TransactionProvider>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </TransactionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
