// Statistik — aktivitas mingguan, kartu dikuasai, pencapaian
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatCard } from '../../components/StatCard';
import { ProgressBar } from '../../components/ProgressBar';
import { ConfusionPairBadge } from '../../components/ConfusionPairBadge';
import { colors, fontSize, radius, spacing } from '../../lib/theme';
import {
  getXP, getLevel, getStreak, getStats, loadCards,
  getPlacement, getUserLevel,
  type DailyStat, type PlacementResult, type UserLevel,
} from '../../lib/storage';
import { getSRSStats } from '../../lib/srs';
import { getWeaknessReport, type WeaknessReport } from '../../lib/weakness';
import { levelLabel } from '../../lib/placement';
import { achievements, getUnlockedAchievements, getNextAchievements } from '../../lib/achievements';

const { width } = Dimensions.get('window');
const BAR_W = (width - spacing.md * 2 - spacing.sm * 6) / 7;

export default function StatsScreen() {
  const router = useRouter();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [srsStats, setSrsStats] = useState<{ total: number; due: number; mastered: number; learning: number; young: number; newCards: number } | null>(null);
  const [weakness, setWeakness] = useState<WeaknessReport | null>(null);
  const [placement, setPlacement] = useState<PlacementResult | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel>('pemula');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [xpVal, lvl, str, stats, cards, wReport, pResult, uLevel] = await Promise.all([
      getXP(), getLevel(), getStreak(), getStats(), loadCards(),
      getWeaknessReport(), getPlacement(), getUserLevel(),
    ]);
    setXp(xpVal);
    setLevel(lvl);
    setStreak(str);
    setDailyStats(stats);
    setSrsStats(getSRSStats(cards));
    setWeakness(wReport);
    setPlacement(pResult);
    setUserLevel(uLevel);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Data 7 hari terakhir untuk grafik
  const last7Days = useCallback(() => {
    const days: { day: string; studied: number; isToday: boolean }[] = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const dateStr = date.toISOString().slice(0, 10);
      const stat = dailyStats.find((s) => s.date === dateStr);
      days.push({
        day: dayNames[date.getDay()],
        studied: stat?.studied ?? 0,
        isToday: i === 0,
      });
    }
    return days;
  }, [dailyStats]);

  const weekData = last7Days();
  const maxStudied = Math.max(...weekData.map((d) => d.studied), 1);
  const weekTotal = weekData.reduce((sum, d) => sum + d.studied, 0);

  const unlocked = getUnlockedAchievements({ xp, streak, mastered: srsStats?.mastered ?? 0, lessons: 0 });
  const next = getNextAchievements({ xp, streak, mastered: srsStats?.mastered ?? 0, lessons: 0 });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <Text style={styles.pageTitle}>Statistik</Text>

      {/* Ringkasan */}
      <View style={styles.section}>
        <View style={styles.statRow}>
          <StatCard icon="⚡" value={xp} label="Total XP" color={colors.warning} />
          <StatCard icon="🔥" value={streak} label="Streak" color={colors.error} />
          <StatCard icon="🎓" value={level} label="Level" color={colors.primary} />
        </View>
      </View>

      {/* Level penempatan */}
      {placement && (
        <View style={styles.section}>
          <View style={styles.levelCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelIcon}>📐</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>Level: {levelLabel(userLevel)}</Text>
                <Text style={styles.levelDesc}>
                  Skor tes: {placement.score}/{placement.total} · Kana {Math.round(placement.kanaAccuracy * 100)}% · Kosakata {Math.round(placement.vocabAccuracy * 100)}%
                </Text>
              </View>
            </View>
            <Pressable style={styles.retakeBtn} onPress={() => router.push('/placement')}>
              <Text style={styles.retakeBtnText}>Ulangi Tes Penempatan</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Grafik mingguan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktivitas Mingguan</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTotal}>{weekTotal} kartu</Text>
            <Text style={styles.chartLabel}>7 hari terakhir</Text>
          </View>
          <View style={styles.chart}>
            {weekData.map((d, i) => {
              const h = (d.studied / maxStudied) * 120;
              return (
                <View key={i} style={styles.barCol}>
                  <View style={[styles.bar, { height: Math.max(4, h), backgroundColor: d.isToday ? colors.primary : colors.primaryLight }]} />
                  <Text style={[styles.barLabel, d.isToday && { color: colors.primary, fontWeight: '700' }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Progress SRS */}
      {srsStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progres Belajar</Text>
          <View style={styles.srsCard}>
            <View style={styles.srsRow}>
              <Text style={styles.srsLabel}>Dikuasai</Text>
              <Text style={[styles.srsValue, { color: colors.success }]}>{srsStats.mastered}</Text>
            </View>
            <ProgressBar progress={srsStats.total > 0 ? srsStats.mastered / srsStats.total : 0} color={colors.success} showText={false} />
            <View style={[styles.srsRow, { marginTop: spacing.md }]}>
              <Text style={styles.srsLabel}>Sedang Dipelajari</Text>
              <Text style={[styles.srsValue, { color: colors.warning }]}>{srsStats.learning}</Text>
            </View>
            <View style={styles.srsRow}>
              <Text style={styles.srsLabel}>Muda (young)</Text>
              <Text style={[styles.srsValue, { color: colors.primaryLight }]}>{srsStats.young}</Text>
            </View>
            <View style={styles.srsRow}>
              <Text style={styles.srsLabel}>Jatuh Tempo</Text>
              <Text style={[styles.srsValue, { color: colors.error }]}>{srsStats.due}</Text>
            </View>
            <View style={[styles.srsRow, { marginTop: spacing.sm }]}>
              <Text style={styles.srsTotal}>Total Kartu: {srsStats.total}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Analisis Kelemahan */}
      {weakness && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analisis Kelemahan</Text>
          {weakness.totalMistakes === 0 ? (
            <Text style={styles.emptyMsg}>Belum ada data kelemahan. Kerjakan kuis atau SRS untuk mulai dilacak.</Text>
          ) : (
            <View style={styles.weakCard}>
              {weakness.confusions.length > 0 && (
                <View style={styles.weakBlock}>
                  <Text style={styles.weakSubTitle}>Pasangan Sering Tertukar</Text>
                  <View style={styles.confusionsRow}>
                    {weakness.confusions.map((c, i) => (
                      <ConfusionPairBadge key={i} a={c.a} b={c.b} count={c.count} reason={c.reason} />
                    ))}
                  </View>
                </View>
              )}
              {weakness.weakItems.length > 0 && (
                <View style={styles.weakBlock}>
                  <Text style={styles.weakSubTitle}>Item yang Perlu Diperkuat</Text>
                  {weakness.weakItems.slice(0, 5).map((w, i) => (
                    <View key={i} style={styles.weakItemRow}>
                      <Text style={styles.weakItemId}>{w.id}</Text>
                      <Text style={styles.weakItemStat}>
                        {Math.round(w.accuracy * 100)}% ({w.correct}/{w.attempts})
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              {weakness.confusions.length === 0 && weakness.weakItems.length === 0 && (
                <Text style={styles.emptyMsg}>Tidak ada pola kelemahan signifikan. Terus berlatih!</Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Pencapaian */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pencapaian ({unlocked.length}/{achievements.length})</Text>
        <View style={styles.badgesRow}>
          {unlocked.map((a) => (
            <View key={a.id} style={[styles.badge, { borderColor: a.color }]}>
              <Text style={styles.badgeIcon}>{a.icon}</Text>
              <Text style={styles.badgeTitle}>{a.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pencapaian berikutnya */}
      {next.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Berikutnya</Text>
          {next.map((a) => {
            const current = a.metric === 'xp' ? xp : a.metric === 'streak' ? streak : a.metric === 'mastered' ? (srsStats?.mastered ?? 0) : 0;
            const progress = current / a.target;
            return (
              <View key={a.id} style={styles.nextBadge}>
                <View style={styles.nextRow}>
                  <Text style={styles.nextIcon}>{a.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nextTitle}>{a.title}</Text>
                    <Text style={styles.nextDesc}>{a.description}</Text>
                  </View>
                  <Text style={[styles.nextCount, { color: a.color }]}>{current}/{a.target}</Text>
                </View>
                <ProgressBar progress={progress} color={a.color} showText={false} />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  chartTotal: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  chartLabel: { color: colors.textSecondary, fontSize: fontSize.xs },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
  barCol: { alignItems: 'center', gap: spacing.xs },
  bar: { width: BAR_W, borderRadius: 4 },
  barLabel: { color: colors.textMuted, fontSize: fontSize.xs },
  srsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  srsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  srsLabel: { color: colors.textSecondary, fontSize: fontSize.sm },
  srsValue: { fontSize: fontSize.lg, fontWeight: '700' },
  srsTotal: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.sm,
  },
  badgeIcon: { fontSize: 28 },
  badgeTitle: { color: colors.text, fontSize: fontSize.xs, fontWeight: '600', textAlign: 'center', marginTop: spacing.xs },
  nextBadge: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: spacing.sm,
  },
  nextRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  nextIcon: { fontSize: 32, marginRight: spacing.md },
  nextTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  nextDesc: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  nextCount: { fontSize: fontSize.sm, fontWeight: '700' },
  // Level penempatan
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  levelIcon: { fontSize: 28 },
  levelTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  levelDesc: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  retakeBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  retakeBtnText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '600' },
  // Analisis kelemahan
  emptyMsg: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.md },
  weakCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  weakBlock: { marginBottom: spacing.md },
  weakSubTitle: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs },
  confusionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  weakItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  weakItemId: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  weakItemStat: { color: colors.textSecondary, fontSize: fontSize.sm },
});
