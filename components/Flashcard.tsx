// Flashcard — kartu belajar dengan animasi flip 3D
// Pakai react-native-reanimated untuk animasi halus

import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, radius, spacing } from '../lib/theme';
import { speakJapanese } from '../lib/tts';

type Props = {
  front: string;
  back: string;
  extra?: Record<string, string>;
  type?: string;
  onSpeak?: () => void;
};

export function Flashcard({ front, back, extra, type = 'kana', onSpeak }: Props) {
  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const flip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = flipped ? 0 : 180;
    rotation.value = withTiming(next, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    setFlipped(!flipped);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value + 180}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));

  const accentColor = type === 'kanji' ? colors.kanji
    : type === 'katakana' ? colors.katakana
    : type === 'vocabulary' ? colors.vocabulary
    : type === 'grammar' ? colors.grammar
    : colors.hiragana;

  const handleSpeak = () => {
    if (onSpeak) onSpeak();
    else speakJapanese(front);
  };

  return (
    <Pressable onPress={flip} style={styles.wrapper}>
      {/* Depan kartu */}
      <Animated.View style={[styles.card, styles.frontCard, frontStyle, { borderColor: accentColor }]}>
        <View style={[styles.badge, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>TAMPILAN</Text>
        </View>
        <Text style={styles.frontText}>{front}</Text>
        {extra?.romaji && !flipped && (
          <Text style={[styles.subText, { color: accentColor }]}>{extra.romaji}</Text>
        )}
        <Pressable onPress={handleSpeak} style={styles.speakBtn}>
          <Text style={styles.speakIcon}>🔊</Text>
        </Pressable>
        <Text style={styles.hint}>Ketuk untuk membalik</Text>
      </Animated.View>

      {/* Belakang kartu */}
      <Animated.View style={[styles.card, styles.backCard, backStyle, { borderColor: accentColor }]}>
        <View style={[styles.badge, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>ARTI</Text>
        </View>
        <Text style={styles.backText}>{back}</Text>
        {extra && Object.entries(extra).map(([key, val]) => (
          <Text key={key} style={styles.extraText}>{val}</Text>
        ))}
        <Text style={styles.hint}>Ketuk untuk membalik</Text>
      </Animated.View>
    </Pressable>
  );
}

const CARD_W = 280;
const CARD_H = 360;

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_W,
    height: CARD_H,
  },
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: radius.xl,
    borderWidth: 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  frontCard: {},
  backCard: {},
  badge: {
    position: 'absolute',
    top: spacing.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    color: colors.text,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  frontText: {
    color: colors.text,
    fontSize: fontSize.display,
    fontWeight: '700',
  },
  backText: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subText: {
    fontSize: fontSize.lg,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  extraText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  speakBtn: {
    position: 'absolute',
    bottom: spacing.xl + 8,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakIcon: {
    fontSize: 22,
  },
  hint: {
    position: 'absolute',
    bottom: spacing.md,
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
