// Layout tab bar — 5 menu navigasi utama
import { Tabs } from 'expo-router';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, fontSize, spacing } from '../../lib/theme';
import { getXP, getLevel, getStreak } from '../../lib/storage';
import { useEffect, useState } from 'react';

const TABS = [
  { name: 'index', title: 'Beranda', icon: '🏠' },
  { name: 'kana', title: 'Kana', icon: 'あ' },
  { name: 'srs', title: 'SRS', icon: '🎴' },
  { name: 'kuis', title: 'Kuis', icon: '✍️' },
  { name: 'stats', title: 'Statistik', icon: '📊' },
];

export default function TabLayout() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const load = async () => {
      setXp(await getXP());
      setLevel(await getLevel());
      setStreak(await getStreak());
    };
    load();
    // Refresh saat tab berubah
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceLight,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600' },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <Text style={[styles.icon, { color }]}>{tab.icon}</Text>
                {tab.title === 'Beranda' && streak > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>🔥{streak}</Text>
                  </View>
                )}
                {focused && <View style={styles.dot} />}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -14,
    backgroundColor: colors.error,
    borderRadius: 999,
    paddingHorizontal: 4,
    minWidth: 18,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  dot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
