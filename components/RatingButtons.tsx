// RatingButtons — tombol penilaian SRS (Ulang/Sulit/Baik/Mudah)
import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, radius, spacing } from '../lib/theme';
import { RATING, type Rating } from '../lib/srs';

type Props = {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
};

const BUTTONS: { rating: Rating; label: string; sublabel: string; color: string }[] = [
  { rating: RATING.AGAIN, label: 'Ulang', sublabel: '<1m', color: colors.error },
  { rating: RATING.HARD, label: 'Sulit', sublabel: 'besok', color: colors.warning },
  { rating: RATING.GOOD, label: 'Baik', sublabel: '3 hari', color: colors.success },
  { rating: RATING.EASY, label: 'Mudah', sublabel: '6 hari', color: colors.primaryLight },
];

export function RatingButtons({ onRate, disabled }: Props) {
  const handlePress = async (rating: Rating) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRate(rating);
  };

  return (
    <View style={styles.wrapper}>
      {BUTTONS.map((btn) => (
        <Pressable
          key={btn.label}
          onPress={() => handlePress(btn.rating)}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: btn.color, opacity: pressed ? 0.8 : 1 },
            disabled && styles.disabled,
          ]}
        >
          <Text style={styles.label}>{btn.label}</Text>
          <Text style={styles.sublabel}>{btn.sublabel}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
  label: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  sublabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
