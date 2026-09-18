// Kuis — pilihan ganda dengan timer
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fontSize, radius, spacing } from '../../lib/theme';
import { allHiragana, type Kana } from '../../data/hiragana';
import { allKatakana } from '../../data/katakana';
import { vocabulary, type Word } from '../../data/vocabulary';
import { addXP, updateStreak, recordStudy, type Mistake } from '../../lib/storage';
import { recordMistake, getFocusKana } from '../../lib/weakness';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

type Question = {
  prompt: string;           // pertanyaan / prompt
  promptSub?: string;       // sub-teks (mis. romaji)
  speak?: string;          // teks untuk TTS
  choices: string[];        // pilihan jawaban
  correctIndex: number;
  explanation?: string;
};

type QuizMode = 'kana-reading' | 'vocab-meaning' | 'mixed' | 'weakness';

const QUESTION_COUNT = 10;
const TIME_PER_QUESTION = 15;

// Acak array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Ambil n elemen acak
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Pool semua kana + lookup karakter
const allKanaPool: Kana[] = [...allHiragana, ...allKatakana];
function kanaByCharacter(ch: string): Kana | undefined {
  return allKanaPool.find((k) => k.character === ch);
}

// Infer tipe item dari prompt (kana vs kosakata)
function inferItemType(prompt: string): Mistake['type'] {
  return allKanaPool.some((k) => k.character === prompt) ? 'kana' : 'vocabulary';
}

// Buat soal kana: tampilkan karakter, pilih romaji
function makeKanaQuestion(): Question {
  const pool: Kana[] = [...allHiragana, ...allKatakana];
  const correct = pickRandom(pool, 1)[0];
  const wrongs = pickRandom(pool.filter((k) => k.romaji !== correct.romaji), 3);
  const choices = shuffle([correct, ...wrongs]).map((k) => k.romaji);
  return {
    prompt: correct.character,
    promptSub: correct.type === 'hiragana' ? 'Hiragana' : 'Katakana',
    speak: correct.romaji,
    choices,
    correctIndex: choices.indexOf(correct.romaji),
    explanation: `${correct.character} = ${correct.romaji}`,
  };
}

// Buat soal kosakata: tampilkan kata Jepang, pilih arti
function makeVocabQuestion(): Question {
  const correct = pickRandom(vocabulary, 1)[0];
  const wrongs = pickRandom(vocabulary.filter((w) => w.meaning !== correct.meaning), 3);
  const choices = shuffle([correct, ...wrongs]).map((w) => w.meaning);
  return {
    prompt: correct.japanese,
    promptSub: correct.reading,
    speak: correct.japanese,
    choices,
    correctIndex: choices.indexOf(correct.meaning),
    explanation: `${correct.japanese} (${correct.reading}) = ${correct.meaning}`,
  };
}

function makeQuestion(mode: QuizMode, focusKana: string[] = []): Question {
  if (mode === 'weakness') return makeWeaknessQuestion(focusKana);
  if (mode === 'vocab-meaning') return makeVocabQuestion();
  if (mode === 'mixed') return Math.random() < 0.5 ? makeKanaQuestion() : makeVocabQuestion();
  return makeKanaQuestion();
}

// Buat soal dari pasangan tertukar (mode Fokus Kelemahan)
function makeWeaknessQuestion(focusKana: string[]): Question {
  const pool = focusKana.map(kanaByCharacter).filter(Boolean) as Kana[];
  if (pool.length === 0) return makeKanaQuestion();
  const correct = pickRandom(pool, 1)[0];
  const wrongs = pickRandom(allKanaPool.filter((k) => k.romaji !== correct.romaji && k.type === correct.type), 3);
  const choices = shuffle([correct, ...wrongs]).map((k) => k.romaji);
  return {
    prompt: correct.character,
    promptSub: correct.type === 'hiragana' ? 'Hiragana' : 'Katakana',
    speak: correct.romaji,
    choices,
    correctIndex: choices.indexOf(correct.romaji),
    explanation: `${correct.character} = ${correct.romaji}`,
  };
}

type QuizState = 'menu' | 'playing' | 'result';

export default function KuisScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [state, setState] = useState<QuizState>('menu');
  const [mode, setMode] = useState<QuizMode>('kana-reading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [correctCount, setCorrectCount] = useState(0);
  const [focusKana, setFocusKana] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Muat kana fokus kelemahan (untuk mode weakness)
  useEffect(() => {
    (async () => {
      const fk = await getFocusKana();
      setFocusKana(fk);
    })();
  }, []);

  // Mulai kuis
  const startQuiz = useCallback((m: QuizMode) => {
    const qs = Array.from({ length: QUESTION_COUNT }, () => makeQuestion(m, focusKana));
    setQuestions(qs);
    setMode(m);
    setCurrentQ(0);
    setScore(0);
    setCorrectCount(0);
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setState('playing');
  }, [focusKana]);

  // Auto-start mode weakness bila dibuka via /kuis?mode=weakness
  useEffect(() => {
    if (params.mode === 'weakness' && state === 'menu' && focusKana.length > 0) {
      startQuiz('weakness');
    }
  }, [params.mode, state, focusKana, startQuiz]);

  // Timer
  useEffect(() => {
    if (state !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Waktu habis — anggap salah
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, currentQ]);

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(-1); // -1 menandakan timeout
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    // Catat kelemahan: waktu habis dianggap salah
    const q = questions[currentQ];
    recordMistake({
      id: q.prompt,
      type: inferItemType(q.prompt),
      chosen: '?',
      correct: q.choices[q.correctIndex],
      timestamp: Date.now(),
      source: 'quiz',
      mode,
    });
    setTimeout(() => nextQuestion(), 1500);
  }, [currentQ, questions, mode]);

  // Jawab
  const answer = useCallback((index: number) => {
    if (selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(index);

    const q = questions[currentQ];
    const isCorrect = index === q.correctIndex;
    if (isCorrect) {
      const points = timeLeft + 5; // bonus kecepatan
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addXP(10);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Catat kelemahan: jawaban salah
      recordMistake({
        id: q.prompt,
        type: inferItemType(q.prompt),
        chosen: q.choices[index],
        correct: q.choices[q.correctIndex],
        timestamp: Date.now(),
        source: 'quiz',
        mode,
      });
    }
    setTimeout(() => nextQuestion(), 1500);
  }, [selected, questions, currentQ, timeLeft, mode]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      // Selesai
      setState('result');
      updateStreak();
      recordStudy(correctCount, questions.length);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setTimeLeft(TIME_PER_QUESTION);
    }
  }, [currentQ, questions.length, correctCount]);

  // Ucapkan soal saat muncul
  useEffect(() => {
    if (state === 'playing' && questions[currentQ]?.speak) {
      const t = setTimeout(() => {
        Speech.speak(questions[currentQ].speak!, { language: 'ja-JP', rate: 0.9 });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state, currentQ, questions]);

  // --- Menu ---
  if (state === 'menu') {
    const modes: { key: QuizMode; title: string; desc: string; icon: string; color: string }[] = [
      { key: 'kana-reading', title: 'Baca Kana', desc: 'Tebak romaji dari huruf', icon: 'あ', color: colors.hiragana },
      { key: 'vocab-meaning', title: 'Arti Kosakata', desc: 'Tebak arti kata Jepang', icon: '📚', color: colors.vocabulary },
      { key: 'mixed', title: 'Campuran', desc: 'Kana + kosakata', icon: '🎲', color: colors.primaryLight },
      ...(focusKana.length > 0
        ? [{ key: 'weakness' as QuizMode, title: 'Fokus Kelemahan', desc: 'Latih pasangan tertukar', icon: '🎯', color: colors.accent }]
        : []),
    ];
    return (
      <ScreenContainer>
        <Text style={styles.pageTitle}>Kuis Bahasa Jepang</Text>
        <Text style={styles.pageDesc}>
          Uji pengetahuan Anda dengan {QUESTION_COUNT} soal pilihan ganda. Tiap soal punya {TIME_PER_QUESTION} detik. Jawab cepat untuk bonus XP!
        </Text>
        {modes.map((m) => (
          <Pressable
            key={m.key}
            style={({ pressed }) => [styles.modeCard, pressed && { opacity: 0.7 }]}
            onPress={() => startQuiz(m.key)}
          >
            <View style={[styles.modeIcon, { backgroundColor: m.color + '22' }]}>
              <Text style={[styles.modeIconText, { color: m.color }]}>{m.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modeTitle}>{m.title}</Text>
              <Text style={styles.modeDesc}>{m.desc}</Text>
            </View>
            <Text style={styles.modeArrow}>→</Text>
          </Pressable>
        ))}
      </ScreenContainer>
    );
  }

  // --- Result ---
  if (state === 'result') {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;
    return (
      <ScreenContainer>
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>
            {accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🎉' : '💪'}
          </Text>
          <Text style={styles.resultTitle}>
            {accuracy >= 80 ? 'Luar Biasa!' : accuracy >= 50 ? 'Bagus!' : 'Terus Berlatih!'}
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3].map((s) => (
              <Text key={s} style={[styles.star, s <= stars ? styles.starActive : null]}>★</Text>
            ))}
          </View>
          <View style={styles.resultStats}>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatValue}>{correctCount}/{questions.length}</Text>
              <Text style={styles.resultStatLabel}>Benar</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatValue}>{accuracy}%</Text>
              <Text style={styles.resultStatLabel}>Akurasi</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatValue}>+{score}</Text>
              <Text style={styles.resultStatLabel}>Skor</Text>
            </View>
          </View>
          <Pressable style={styles.startBtn} onPress={() => setState('menu')}>
            <Text style={styles.startBtnText}>Kuis Lagi</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // --- Playing ---
  const q = questions[currentQ];
  const isAnswered = selected !== null;
  const timeProgress = timeLeft / TIME_PER_QUESTION;

  return (
    <View style={styles.quizContainer}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <View>
          <Text style={styles.quizProgress}>Soal {currentQ + 1}/{questions.length}</Text>
          <Text style={styles.quizScore}>Skor: {score}</Text>
        </View>
        <View style={[styles.timer, { backgroundColor: timeLeft <= 5 ? colors.error + '22' : colors.surface }]}>
          <Text style={[styles.timerText, { color: timeLeft <= 5 ? colors.error : colors.text }]}>
            ⏱ {timeLeft}s
          </Text>
        </View>
      </View>

      <ProgressBar progress={timeProgress} color={timeLeft <= 5 ? colors.error : colors.primary} showText={false} />

      {/* Soal */}
      <View style={styles.questionArea}>
        <Text style={styles.questionSub}>{q.promptSub}</Text>
        <Text style={styles.questionText}>{q.prompt}</Text>
        <Pressable
          style={styles.speakBtn}
          onPress={() => q.speak && Speech.speak(q.speak, { language: 'ja-JP', rate: 0.9 })}
        >
          <Text style={styles.speakIcon}>🔊 Dengar</Text>
        </Pressable>
      </View>

      {/* Pilihan */}
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
              onPress={() => answer(i)}
              disabled={isAnswered}
              style={[styles.choice, { backgroundColor: bg, borderColor: border }]}
            >
              <Text style={[
                styles.choiceText,
                isAnswered && isCorrect && { color: colors.success, fontWeight: '700' },
                isAnswered && isSelected && !isCorrect && { color: colors.error },
              ]}>
                {choice}
              </Text>
              {isAnswered && isCorrect && <Text style={styles.choiceIcon}>✓</Text>}
              {isAnswered && isSelected && !isCorrect && <Text style={styles.choiceIcon}>✗</Text>}
            </Pressable>
          );
        })}
      </View>

      {/* Penjelasan setelah dijawab */}
      {isAnswered && q.explanation && (
        <View style={styles.explanation}>
          <Text style={styles.explanationText}>{q.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.md },
  pageDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, lineHeight: 22, marginBottom: spacing.lg },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  modeIconText: { fontSize: 24, fontWeight: '600' },
  modeTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  modeDesc: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  modeArrow: { color: colors.textMuted, fontSize: 18 },
  quizContainer: { flex: 1, backgroundColor: colors.background, paddingTop: spacing.lg, paddingBottom: 100 },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  quizProgress: { color: colors.textSecondary, fontSize: fontSize.xs },
  quizScore: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  timer: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.full },
  timerText: { fontSize: fontSize.sm, fontWeight: '700' },
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
  choices: { paddingHorizontal: spacing.md, marginTop: spacing.lg, gap: spacing.sm },
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
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
  },
  explanationText: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center' },
  resultCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  resultIcon: { fontSize: 80 },
  resultTitle: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700', marginTop: spacing.md },
  stars: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  star: { fontSize: 40, color: colors.surfaceLight },
  starActive: { color: colors.warning },
  resultStats: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xl },
  resultStatItem: { alignItems: 'center' },
  resultStatValue: { color: colors.primary, fontSize: fontSize.xxl, fontWeight: '700' },
  resultStatLabel: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 4 },
  startBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.xxl,
  },
  startBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
