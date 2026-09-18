// Placement Test — tes penempatan di awal buka aplikasi
// Menentukan level awal pengguna & seeding kartu SRS yang sesuai.
import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { colors, fontSize, radius, spacing } from '../lib/theme';
import { ProgressBar } from '../components/ProgressBar';
import {
  placementQuestions,
  gradePlacement,
  seedCardsForLevel,
  levelLabel,
  levelDescription,
  type PlacementQuestion,
  type PlacementAnswer,
} from '../lib/placement';
import {
  setOnboarded,
  setUserLevel,
  setPlacement,
  saveCards,
  addLesson,
  type PlacementResult,
} from '../lib/storage';

type Phase = 'intro' | 'testing' | 'result';

export default function PlacementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions] = useState<PlacementQuestion[]>(() => placementQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);

  // Pilih jawaban lalu lanjut
  const handleSelect = useCallback(
    (index: number) => {
      if (selected !== null) return;
      setSelected(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const q = questions[currentIdx];
      const correct = index === q.correctIndex;
      if (!correct) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const newAnswers = [...answers, { questionId: q.id, selectedIndex: index }];
      setAnswers(newAnswers);

      // Lanjut setelah jeda singkat
      setTimeout(() => {
        if (currentIdx + 1 >= questions.length) {
          setPhase('result');
        } else {
          setCurrentIdx((i) => i + 1);
          setSelected(null);
        }
      }, 900);
    },
    [selected, questions, currentIdx, answers]
  );

  // Selesaikan: grade, seed, onboard, pulang
  const finish = useCallback(
    async (result: PlacementResult) => {
      setFinishing(true);
      const cards = seedCardsForLevel(result.level);
      await saveCards(cards);
      await setUserLevel(result.level);
      await setPlacement(result);
      await setOnboarded(true);
      await addLesson(1);
      router.replace('/');
    },
    [router]
  );

  // Skip → dianggap pemula
  const skipToPemula = useCallback(async () => {
    const result: PlacementResult = {
      level: 'pemula',
      score: 0,
      total: 0,
      kanaAccuracy: 0,
      vocabAccuracy: 0,
      takenAt: Date.now(),
    };
    await finish(result);
  }, [finish]);

  // Hitung hasil (di phase result)
  const result: PlacementResult = useMemo(
    () => gradePlacement(questions, answers),
    [questions, answers]
  );

  // ============ INTRO ============
  if (phase === 'intro') {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
        <ScrollView contentContainerStyle={styles.introContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>学</Text>
          <Text style={styles.appName}>Manabu</Text>
          <Text style={styles.tagline}>Tes Penempatan</Text>
          <Text style={styles.introDesc}>
            Selamat datang! Sebelum mulai, mari kita ukur level bahasa Jepang Anda. Jawab {questions.length} soal singkat — kami akan susun rencana belajar yang sesuai.
          </Text>
          <View style={styles.introBullets}>
            <Text style={styles.bullet}>✓ 4 tingkat: Hiragana → Katakana → Kanji → Kosakata</Text>
            <Text style={styles.bullet}>✓ Tanpa batas waktu, jawab santai</Text>
            <Text style={styles.bullet}>✓ Hasil menentukan kartu awal Anda</Text>
          </View>
          <Pressable style={styles.primaryBtn} onPress={() => setPhase('testing')}>
            <Text style={styles.primaryBtnText}>Mulai Tes</Text>
          </Pressable>
          <Pressable style={styles.skipBtn} onPress={skipToPemula}>
            <Text style={styles.skipBtnText}>Saya pemula, lewati tes</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ============ RESULT ============
  if (phase === 'result') {
    const kanaPct = Math.round(result.kanaAccuracy * 100);
    const vocabPct = Math.round(result.vocabAccuracy * 100);
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
        <ScrollView contentContainerStyle={styles.introContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultIcon}>
            {result.level === 'menengah' ? '🎉' : result.level === 'dasar' ? '👍' : '🌱'}
          </Text>
          <Text style={styles.resultTitle}>Level Anda: {levelLabel(result.level)}</Text>
          <Text style={styles.resultDesc}>{levelDescription(result.level)}</Text>

          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Skor</Text>
              <Text style={styles.scoreValue}>{result.score}/{result.total}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Akurasi Kana</Text>
              <Text style={styles.scoreValue}>{kanaPct}%</Text>
            </View>
            <ProgressBar progress={result.kanaAccuracy} color={colors.hiragana} showText={false} />
            <View style={[styles.scoreRow, { marginTop: spacing.md }]}>
              <Text style={styles.scoreLabel}>Akurasi Kosakata</Text>
              <Text style={styles.scoreValue}>{vocabPct}%</Text>
            </View>
            <ProgressBar progress={result.vocabAccuracy} color={colors.vocabulary} showText={false} />
          </View>

          <Text style={styles.seedingNote}>
            Kami menyiapkan {seedCardsForLevel(result.level).length} kartu awal sesuai level Anda.
          </Text>

          <Pressable style={styles.primaryBtn} onPress={() => finish(result)} disabled={finishing}>
            <Text style={styles.primaryBtnText}>{finishing ? 'Menyiapkan...' : 'Mulai Belajar'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ============ TESTING ============
  const q = questions[currentIdx];
  const progress = (currentIdx + (selected !== null ? 1 : 0)) / questions.length;
  const tierLabel: Record<string, string> = {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji N5',
    vocabulary: 'Kosakata',
  };
  const isAnswered = selected !== null;

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.testHeader}>
        <Text style={styles.testProgress}>Soal {currentIdx + 1}/{questions.length}</Text>
        <Text style={styles.tierBadge}>{tierLabel[q.tier] ?? q.tier}</Text>
      </View>
      <ProgressBar progress={progress} color={colors.primary} showText={false} />

      <View style={styles.questionArea}>
        <Text style={styles.questionSub}>{q.promptSub}</Text>
        <Text style={styles.questionText}>{q.prompt}</Text>
        <Pressable
          style={styles.speakBtn}
          onPress={() => Speech.speak(q.prompt, { language: 'ja-JP', rate: 0.85 })}
        >
          <Text style={styles.speakIcon}>🔊 Dengar</Text>
        </Pressable>
      </View>

      <View style={styles.choices}>
        {q.choices.map((choice, i) => {
          const isCorrect = i === q.correctIndex;
          const isSelected = i === selected;
          let bg: string = colors.surface;
          let border: string = colors.surfaceLight;
          if (isAnswered) {
            if (isCorrect) { bg = colors.success + '22'; border = colors.success; }
            else if (isSelected) { bg = colors.error + '22'; border = colors.error; }
          }
          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              disabled={isAnswered}
              style={[styles.choice, { backgroundColor: bg, borderColor: border }]}
            >
              <Text
                style={[
                  styles.choiceText,
                  isAnswered && isCorrect && { color: colors.success, fontWeight: '700' },
                  isAnswered && isSelected && !isCorrect && { color: colors.error },
                ]}
              >
                {choice}
              </Text>
              {isAnswered && isCorrect && <Text style={styles.choiceIcon}>✓</Text>}
              {isAnswered && isSelected && !isCorrect && <Text style={styles.choiceIcon}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {isAnswered && q.explanation && (
        <View style={styles.explanation}>
          <Text style={styles.explanationText}>{q.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  introContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  logo: {
    fontSize: 96,
    color: colors.primary,
    fontWeight: '700',
  },
  appName: {
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  tagline: {
    fontSize: fontSize.lg,
    color: colors.primaryLight,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  introDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  introBullets: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.xxl,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },
  // result
  resultIcon: { fontSize: 80 },
  resultTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  resultDesc: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scoreLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  scoreValue: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  seedingNote: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  // testing
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testProgress: { color: colors.textSecondary, fontSize: fontSize.sm },
  tierBadge: {
    color: colors.primaryLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
    backgroundColor: colors.primary + '22',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  questionArea: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  questionSub: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm },
  questionText: { color: colors.text, fontSize: fontSize.display, fontWeight: '700' },
  speakBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
  },
  speakIcon: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  choices: { gap: spacing.sm, width: '100%' },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  choiceText: { color: colors.text, fontSize: fontSize.lg, fontWeight: '500' },
  choiceIcon: { fontSize: 20, fontWeight: '700' },
  explanation: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
  },
  explanationText: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center' },
});
