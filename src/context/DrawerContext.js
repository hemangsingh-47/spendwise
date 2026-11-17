import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

const DRAWER_WIDTH = 300;
const DrawerContext = createContext();

/**
 * SpendWise Pure Animated Drawer Context
 * Manages side drawer open/close animations using 100% built-in React Native Animated API.
 * Guarantees zero crashes and zero native library dependencies in Expo Go.
 */
export const DrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  const openDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback((onFinished) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      if (typeof onFinished === 'function') {
        setTimeout(onFinished, 60);
      }
    });
  }, [animValue]);

  const toggleDrawer = useCallback(() => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [isOpen, openDrawer, closeDrawer]);

  // Derived animated styles
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        animValue,
        translateX,
        backdropOpacity,
        drawerWidth: DRAWER_WIDTH,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return ctx;
};

export default DrawerContext;
