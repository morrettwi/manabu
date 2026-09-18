// Layout root — Expo Router, membungkus semua layar dengan provider
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors, fontSize, spacing } from '../lib/theme';
import { initTTS } from '../lib/tts';
import { isOnboarded } from '../lib/storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [state, setState] = useState({ loading: true, onboarded: false });

  // Inisialisasi TTS saat aplikasi dibuka
  useEffect(() => {
    initTTS().catch(() => {});
  }, []);

  // Cek status onboarding saat mount
  useEffect(() => {
    (async () => {
      const onboarded = await isOnboarded();
      setState({ loading: false, onboarded });
    })();
  }, []);

  // Gerbang: arahkan ke placement bila belum onboarding
  useEffect(() => {
    if (state.loading) return;
    const inPlacement = segments[0] === 'placement';
    if (!state.onboarded && !inPlacement) {
      router.replace('/placement');
    } else if (state.onboarded && inPlacement) {
      router.replace('/(tabs)');
    }
  }, [state, segments, router]);

  // Splash saat memuat status onboarding
  if (state.loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 96, color: colors.primary, fontWeight: '700' }}>学</Text>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.lg, marginTop: spacing.sm }}>Manabu</Text>
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="placement" />
      </Stack>
    </GestureHandlerRootView>
  );
}
