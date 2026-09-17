// Layout root — Expo Router, membungkus semua layar dengan provider
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { colors } from '../lib/theme';
import { initTTS } from '../lib/tts';

export default function RootLayout() {
  useEffect(() => {
    // Inisialisasi TTS saat aplikasi dibuka
    initTTS().catch(() => {});
  }, []);

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
      </Stack>
    </GestureHandlerRootView>
  );
}
