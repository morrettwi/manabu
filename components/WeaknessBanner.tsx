// WeaknessBanner — banner pesan kelemahan teratas
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, fontSize, radius, spacing } from '../lib/theme';

type Props = {
  message: string;              // mis. "Kamu sering tertukar に dan へ (×4)"
  onPress?: () => void;          // ketuk untuk latihan
};

export function WeaknessBanner({ message, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.banner, pressed && { opacity: 0.85 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.icon}>🎯</Text>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={styles.label}>Kelemahan Terdeteksi</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onPress && <Text style={styles.action}>Latih →</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '1A',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent + '44',
  },
  icon: { fontSize: 24 },
  label: { color: colors.accentLight, fontSize: fontSize.xs, fontWeight: '700' },
  message: { color: colors.text, fontSize: fontSize.sm, marginTop: 2 },
  action: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
