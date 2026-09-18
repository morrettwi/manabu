// ConfusionPairBadge — tampilan pasangan dua karakter tertukar
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../lib/theme';

type Props = {
  a: string;        // karakter pertama
  b: string;        // karakter kedua
  count?: number;   // berapa kali tertukar
  reason?: string;  // alasan (opsional)
};

export function ConfusionPairBadge({ a, b, count, reason }: Props) {
  return (
    <View style={styles.badge}>
      <View style={styles.pair}>
        <Text style={styles.char}>{a}</Text>
        <Text style={styles.arrow}>⇄</Text>
        <Text style={styles.char}>{b}</Text>
      </View>
      {count !== undefined && <Text style={styles.count}>×{count}</Text>}
      {reason && <Text style={styles.reason}>{reason}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent + '44',
    alignItems: 'center',
    minWidth: 90,
  },
  pair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  char: {
    color: colors.accent,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  arrow: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  count: {
    color: colors.warning,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  reason: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
});
