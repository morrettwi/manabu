// StatCard — kartu statistik untuk dashboard
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../lib/theme';

type Props = {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
};

export function StatCard({ icon, value, label, color }: Props) {
  return (
    <View style={[styles.card, color ? { borderColor: color } : null]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 96,
    justifyContent: 'center',
  },
  icon: { fontSize: 24, marginBottom: spacing.xs },
  value: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
