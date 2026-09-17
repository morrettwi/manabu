// Kana — grid Hiragana & Katakana dengan audio
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { KanaCard } from '../../components/KanaCard';
import { colors, fontSize, radius, spacing } from '../../lib/theme';
import { allHiragana, type Kana } from '../../data/hiragana';
import { allKatakana } from '../../data/katakana';
import * as Haptics from 'expo-haptics';

type TabType = 'hiragana' | 'katakana' | 'kanji';

export default function KanaScreen() {
  const [tab, setTab] = useState<TabType>('hiragana');
  const [learned, setLearned] = useState<Set<string>>(new Set());

  const data: Kana[] = tab === 'hiragana'
    ? allHiragana
    : tab === 'katakana'
    ? allKatakana
    : []; // kanji akan di-handle terpisah nanti

  const handleLearned = useCallback((kana: Kana) => {
    setLearned((prev) => new Set(prev).add(kana.character));
  }, []);

  const tabs: { key: TabType; label: string; color: string }[] = [
    { key: 'hiragana', label: 'Hiragana', color: colors.hiragana },
    { key: 'katakana', label: 'Katakana', color: colors.katakana },
    { key: 'kanji', label: 'Kanji', color: colors.kanji },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Tab selector */}
      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => {
              Haptics.selectionAsync();
              setTab(t.key);
            }}
            style={[
              styles.tab,
              tab === t.key && { backgroundColor: t.color },
            ]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {tab === 'hiragana' ? 'あ — Ketuk huruf untuk dengar sebutan' :
           tab === 'katakana' ? 'ア — Ketuk huruf untuk dengar sebutan' :
           '字 — Kanji JLPT N5'}
        </Text>
        <Text style={styles.infoCount}>{learned.size} / {data.length} dipelajari</Text>
      </View>

      {tab !== 'kanji' ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.character}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <KanaCard
              kana={item}
              onLearned={handleLearned}
              learned={learned.has(item.character)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.comingSoon}>
          <Text style={styles.comingIcon}>字</Text>
          <Text style={styles.comingTitle}>Kanji N5</Text>
          <Text style={styles.comingDesc}>
            80 kanji dasar JLPT N5 akan segera hadir di pembaruan berikutnya.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoText: { color: colors.textSecondary, fontSize: fontSize.xs },
  infoCount: { color: colors.primary, fontSize: fontSize.xs, fontWeight: '600' },
  grid: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  comingIcon: { fontSize: 80, color: colors.kanji },
  comingTitle: { color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.md },
  comingDesc: { color: colors.textSecondary, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm },
});
