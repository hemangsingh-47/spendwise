import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import BudgetsScreen from '../screens/BudgetsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ROUTES } from '../constants/routes';
import { colors, fontWeights } from '../styles/theme';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.DASHBOARD_TAB}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: fontWeights.semibold,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.DASHBOARD_TAB) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.TRANSACTIONS_TAB) {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === ROUTES.BUDGETS_TAB) {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === ROUTES.ANALYTICS_TAB) {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === ROUTES.PROFILE_TAB) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.DASHBOARD_TAB}
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={ROUTES.TRANSACTIONS_TAB}
        component={TransactionsScreen}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Tab.Screen
        name={ROUTES.BUDGETS_TAB}
        component={BudgetsScreen}
        options={{ tabBarLabel: 'Budgets' }}
      />
      <Tab.Screen
        name={ROUTES.ANALYTICS_TAB}
        component={AnalyticsScreen}
        options={{ tabBarLabel: 'Analytics' }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE_TAB}
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
