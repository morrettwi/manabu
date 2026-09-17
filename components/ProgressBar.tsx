// ProgressBar — bar progres dengan animasi
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, fontSize, radius, spacing } from '../lib/theme';

type Props = {
  progress: number;   // 0 - 1
  label?: string;
  color?: string;
  showText?: boolean;
};

export function ProgressBar({ progress, label, color, showText = true }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const animStyle = useAnimatedStyle(() => ({
    width: withTiming(`${clamped * 100}%`, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showText && <Text style={styles.value}>{Math.round(clamped * 100)}%</Text>}
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, animStyle, { backgroundColor: color ?? colors.primary }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: spacing.xs },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: { color: colors.textSecondary, fontSize: fontSize.sm },
  value: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  track: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
