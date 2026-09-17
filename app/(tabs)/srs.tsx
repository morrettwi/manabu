// SRS — sesi flashcard dengan penilaian
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Flashcard } from '../../components/Flashcard';
import { RatingButtons } from '../../components/RatingButtons';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fontSize, radius, spacing } from '../../lib/theme';
import { useSRS } from '../../lib/useSRS';
import { createCard, type SRSCard } from '../../lib/srs';
import { saveCards } from '../../lib/storage';
import { allHiragana } from '../../data/hiragana';
import { allKatakana } from '../../data/katakana';

// Buat kartu awal dari data kana + kosakata (seeding)
function seedInitialCards(): SRSCard[] {
  const kanaCards: SRSCard[] = [
    ...allHiragana.slice(0, 10).map((k) =>
      createCard({
        id: `kana-h-${k.character}`,
        front: k.character,
        back: k.romaji,
        type: 'kana',
        extra: { romaji: k.romaji, type: 'hiragana' },
      })
    ),
    ...allKatakana.slice(0, 10).map((k) =>
      createCard({
        id: `kana-k-${k.character}`,
        front: k.character,
        back: k.romaji,
        type: 'kana',
        extra: { romaji: k.romaji, type: 'katakana' },
      })
    ),
  ];
  return kanaCards;
}

export default function SRSScreen() {
  const { cards, dueCards, currentCard, currentIdx, session, loading, answerCard, speakCurrent, isSessionEnd, reload } = useSRS();
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Jika belum ada kartu sama sekali, seed dengan kana awal
  useEffect(() => {
    if (!loading && cards.length === 0 && !seeded && !seeding) {
      setSeeding(true);
      const seed = seedInitialCards();
      saveCards(seed).then(async () => {
        setSeeded(true);
        setSeeding(false);
        await reload(); // muat ulang state dari storage
      });
    }
  }, [loading, cards.length, seeded, seeding, reload]);

  const [showBack, setShowBack] = useState(false);

  const handleRate = useCallback((rating: any) => {
    setShowBack(false);
    answerCard(rating);
  }, [answerCard]);

  // Reset showBack saat kartu berubah
  useEffect(() => {
    setShowBack(false);
  }, [currentIdx]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Memuat...</Text>
      </View>
    );
  }

  // Sesi selesai
  if (isSessionEnd || (dueCards.length === 0 && cards.length > 0)) {
    return <SessionComplete session={session} totalCards={cards.length} />;
  }

  // Belum ada kartu — tampilkan onboarding
  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🎴</Text>
        <Text style={styles.emptyTitle}>Belum Ada Kartu</Text>
        <Text style={styles.emptyDesc}>
          Kami sedang menyiapkan 20 kartu kana pertama untuk Anda. Ketuk tombol di bawah untuk memulai.
        </Text>
        <Pressable
          style={styles.startBtn}
          disabled={seeding}
          onPress={async () => {
            setSeeding(true);
            const seed = seedInitialCards();
            await saveCards(seed);
            setSeeded(true);
            setSeeding(false);
            await reload();
          }}
        >
          <Text style={styles.startBtnText}>
            {seeding ? 'Menyiapkan...' : 'Tambah 20 Kartu Kana'}
          </Text>
        </Pressable>
      </View>
    );
  }

  const progress = dueCards.length > 0 ? currentIdx / dueCards.length : 0;

  return (
    <View style={styles.container}>
      {/* Header sesi */}
      <View style={styles.sessionHeader}>
        <View>
          <Text style={styles.sessionLabel}>Sesi Ulangan</Text>
          <Text style={styles.sessionCount}>
            {currentIdx + 1} / {dueCards.length}
          </Text>
        </View>
        <View style={styles.sessionStats}>
          <Text style={styles.sessionStatText}>✓ {session.correct}</Text>
          <Text style={styles.sessionStatText}>⚡ {session.xpGained} XP</Text>
        </View>
      </View>

      <ProgressBar progress={progress} color={colors.primary} showText={false} />

      {/* Kartu flashcard */}
      <View style={styles.cardArea}>
        {currentCard && (
          <>
            <Flashcard
              front={currentCard.front}
              back={currentCard.back}
              extra={currentCard.extra}
              type={currentCard.type}
              onSpeak={speakCurrent}
            />
          </>
        )}
      </View>

      {/* Tombol penilaian */}
      <View style={styles.ratingArea}>
        <Text style={styles.ratingHint}>Seberapa baik Anda mengingat kartu ini?</Text>
        <RatingButtons onRate={handleRate} />
      </View>
    </View>
  );
}

// Komponen sesi selesai
function SessionComplete({ session, totalCards }: { session: { reviewed: number; correct: number; xpGained: number }; totalCards: number }) {
  const accuracy = session.reviewed > 0 ? Math.round((session.correct / session.reviewed) * 100) : 0;

  return (
    <View style={styles.center}>
      <Text style={styles.doneIcon}>🎉</Text>
      <Text style={styles.doneTitle}>Sesi Selesai!</Text>
      <View style={styles.doneStats}>
        <View style={styles.doneStatItem}>
          <Text style={styles.doneStatValue}>{session.reviewed}</Text>
          <Text style={styles.doneStatLabel}>Kartu</Text>
        </View>
        <View style={styles.doneStatItem}>
          <Text style={styles.doneStatValue}>{accuracy}%</Text>
          <Text style={styles.doneStatLabel}>Akurasi</Text>
        </View>
        <View style={styles.doneStatItem}>
          <Text style={styles.doneStatValue}>+{session.xpGained}</Text>
          <Text style={styles.doneStatLabel}>XP</Text>
        </View>
      </View>
      <Text style={styles.doneMsg}>
        {accuracy >= 80 ? 'Luar biasa! Terus berlatih!' :
         accuracy >= 50 ? 'Bagus! Coba lagi untuk meningkat.' :
         'Terus berlatih, Anda akan lebih baik!'}
      </Text>
      <Pressable style={styles.startBtn} onPress={() => {/* restart akan reload */}}>
        <Text style={styles.startBtnText}>Selesai</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sessionLabel: { color: colors.textSecondary, fontSize: fontSize.xs },
  sessionCount: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  sessionStats: { flexDirection: 'row', gap: spacing.md },
  sessionStatText: { color: colors.success, fontSize: fontSize.sm, fontWeight: '600' },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  ratingArea: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  ratingHint: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    paddingBottom: 100,
  },
  loading: { color: colors.text, fontSize: fontSize.lg },
  emptyIcon: { fontSize: 72 },
  emptyTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.md },
  emptyDesc: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  startBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.xl,
  },
  startBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
  doneIcon: { fontSize: 80 },
  doneTitle: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700', marginTop: spacing.md },
  doneStats: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  doneStatItem: { alignItems: 'center' },
  doneStatValue: { color: colors.primary, fontSize: fontSize.xxl, fontWeight: '700' },
  doneStatLabel: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 4 },
  doneMsg: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.lg, textAlign: 'center' },
});
