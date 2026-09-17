// Beranda — dashboard utama
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatCard } from '../../components/StatCard';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, fontSize, radius, spacing } from '../../lib/theme';
import { getXP, getLevel, getStreak, getSettings, loadCards, getStats } from '../../lib/storage';
import { getDueCards, getSRSStats, type SRSCard } from '../../lib/srs';

type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  progress: number;
};

export default function Beranda() {
  const router = useRouter();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [studiedToday, setStudiedToday] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [xpVal, lvl, str, settings, cards] = await Promise.all([
      getXP(), getLevel(), getStreak(), getSettings(), loadCards(),
    ]);
    setXp(xpVal);
    setLevel(lvl);
    setStreak(str);
    setDailyGoal(settings.dailyGoal);

    const stats = getSRSStats(cards);
    setDueCount(stats.due);
    setMasteredCount(stats.mastered);

    // Hitung yang dipelajari hari ini dari stats
    const dailyStats = await getStats();
    const today = new Date().toISOString().slice(0, 10);
    const todayStat = dailyStats.find((s) => s.date === today);
    setStudiedToday(todayStat?.studied ?? 0);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // XP untuk level berikutnya
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpForNextLevel = Math.pow(level, 2) * 50;
  const xpProgress = (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);

  const lessons: Lesson[] = [
    { id: 'hira', title: 'Hiragana', subtitle: '46 huruf dasar', icon: 'あ', color: colors.hiragana, route: '/kana', progress: 0 },
    { id: 'kata', title: 'Katakana', subtitle: '46 huruf asing', icon: 'ア', color: colors.katakana, route: '/kana', progress: 0 },
    { id: 'kanji', title: 'Kanji N5', subtitle: '80 kanji dasar', icon: '字', color: colors.kanji, route: '/kana', progress: 0 },
    { id: 'srs', title: 'Kartu Ulangan', subtitle: `${dueCount} kartu jatuh tempo`, icon: '🎴', color: colors.primaryLight, route: '/srs', progress: dueCount > 0 ? 1 : 0 },
    { id: 'kuis', title: 'Kuis', subtitle: 'Uji pengetahuan', icon: '✍️', color: colors.accent, route: '/kuis', progress: 0 },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>こんにちは!</Text>
          <Text style={styles.subtitle}>Selamat datang kembali di Manabu</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
      </View>

      {/* Target harian */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target Harian</Text>
        <View style={styles.dailyCard}>
          <View style={styles.dailyTop}>
            <Text style={styles.dailyIcon}>🎯</Text>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.dailyNum}>{studiedToday} / {dailyGoal}</Text>
              <Text style={styles.dailyLabel}>kartu dipelajari hari ini</Text>
            </View>
          </View>
          <ProgressBar
            progress={dailyGoal > 0 ? studiedToday / dailyGoal : 0}
            color={studiedToday >= dailyGoal ? colors.success : colors.primary}
          />
          {studiedToday >= dailyGoal && (
            <Text style={styles.doneText}>✓ Target harian tercapai! Hebat!</Text>
          )}
        </View>
      </View>

      {/* Statistik cepat */}
      <View style={styles.section}>
        <View style={styles.statRow}>
          <StatCard icon="🔥" value={streak} label="Hari Berturut" color={colors.error} />
          <StatCard icon="⚡" value={xp} label="Total XP" color={colors.warning} />
          <StatCard icon="🎓" value={masteredCount} label="Dikuasai" color={colors.success} />
        </View>
      </View>

      {/* Progress level */}
      <View style={styles.section}>
        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>Level {level}</Text>
          <Text style={styles.xpLabel}>{xp} XP</Text>
          <ProgressBar
            progress={Math.max(0, Math.min(1, xpProgress))}
            color={colors.primaryLight}
            showText={false}
          />
          <Text style={styles.xpToNext}>
            {Math.max(0, Math.round(xpForNextLevel - xp))} XP menuju Level {level + 1}
          </Text>
        </View>
      </View>

      {/* Mulai belajar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mulai Belajar</Text>
        {dueCount > 0 && (
          <Pressable
            style={styles.urgentBtn}
            onPress={() => router.push('/srs')}
          >
            <Text style={styles.urgentIcon}>🎴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.urgentTitle}>{dueCount} kartu menunggu!</Text>
              <Text style={styles.urgentSub}>Ketuk untuk mulai sesi ulangan</Text>
            </View>
            <Text style={styles.urgentArrow}>→</Text>
          </Pressable>
        )}
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [
              styles.lessonCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push(lesson.route as any)}
          >
            <View style={[styles.lessonIcon, { backgroundColor: lesson.color + '22' }]}>
              <Text style={[styles.lessonIconText, { color: lesson.color }]}>{lesson.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonSub}>{lesson.subtitle}</Text>
            </View>
            <Text style={styles.lessonArrow}>→</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  greeting: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: 2 },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  levelText: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  dailyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  dailyTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  dailyIcon: { fontSize: 28 },
  dailyNum: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  dailyLabel: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  doneText: { color: colors.success, fontSize: fontSize.sm, fontWeight: '600', marginTop: spacing.sm },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  levelLabel: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  xpLabel: { color: colors.warning, fontSize: fontSize.sm, fontWeight: '600' },
  xpToNext: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: spacing.xs },
  urgentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  urgentIcon: { fontSize: 28 },
  urgentTitle: { color: '#fff', fontWeight: '700', fontSize: fontSize.md },
  urgentSub: { color: 'rgba(255,255,255,0.8)', fontSize: fontSize.xs },
  urgentArrow: { color: '#fff', fontSize: 20, fontWeight: '700' },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  lessonIconText: { fontSize: 24, fontWeight: '600' },
  lessonTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  lessonSub: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  lessonArrow: { color: colors.textMuted, fontSize: 18 },
});
