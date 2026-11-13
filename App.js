import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>SpendWise</Text>
      <Text style={styles.tagline}>Personal Expense Tracker</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Project setup successful.</Text>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#737373',
    marginBottom: 24,
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#171717',
  },
});
