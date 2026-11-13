import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { typography } from '../styles/theme';

export const Heading1 = ({ children, style, ...props }) => (
  <Text style={[styles.h1, style]} {...props}>
    {children}
  </Text>
);

export const Heading2 = ({ children, style, ...props }) => (
  <Text style={[styles.h2, style]} {...props}>
    {children}
  </Text>
);

export const Heading3 = ({ children, style, ...props }) => (
  <Text style={[styles.h3, style]} {...props}>
    {children}
  </Text>
);

export const Body = ({ children, style, ...props }) => (
  <Text style={[styles.body, style]} {...props}>
    {children}
  </Text>
);

export const SecondaryBody = ({ children, style, ...props }) => (
  <Text style={[styles.secondaryBody, style]} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, style, ...props }) => (
  <Text style={[styles.caption, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  body: typography.body,
  secondaryBody: typography.secondaryBody,
  caption: typography.caption,
});

export default {
  Heading1,
  Heading2,
  Heading3,
  Body,
  SecondaryBody,
  Caption,
};
