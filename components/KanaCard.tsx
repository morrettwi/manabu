// KanaCard — kartu tunggal huruf kana dengan audio
import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, radius, spacing } from '../lib/theme';
import { speakJapanese } from '../lib/tts';
import type { Kana } from '../data/hiragana';

type Props = {
  kana: Kana;
  onLearned?: (kana: Kana) => void;
  learned?: boolean;
};

export function KanaCard({ kana, onLearned, learned }: Props) {
  const accent = kana.type === 'hiragana' ? colors.hiragana : colors.katakana;

  const handlePress = async () => {
    await Haptics.selectionAsync();
    speakJapanese(kana.romaji);
    onLearned?.(kana);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: accent },
        pressed && styles.pressed,
        learned && styles.learned,
      ]}
    >
      <Text style={styles.character}>{kana.character}</Text>
      <Text style={[styles.romaji, { color: accent }]}>{kana.romaji}</Text>
      {learned && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 72,
    height: 88,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6, transform: [{ scale: 0.95 }] },
  learned: { backgroundColor: colors.surfaceLight },
  character: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '600',
  },
  romaji: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  check: {
    position: 'absolute',
    top: 4,
    right: 6,
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
  },
});
