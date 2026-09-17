// TTS — Text-to-Speech untuk sebutan bahasa Jepang
// Memakai expo-speech dengan voice bahasa Jepang jika tersedia

import * as Speech from 'expo-speech';
import { getSettings } from './storage';

// Cek voice Jepang yang tersedia di perangkat
let japaneseVoice: string | null = null;

export async function initTTS(): Promise<void> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const jpVoice = voices.find((v) => v.language.startsWith('ja'));
    japaneseVoice = jpVoice?.identifier ?? null;
  } catch (e) {
    console.warn('TTS tidak tersedia:', e);
  }
}

/**
 * Ucapkan teks Jepang
 * @param text teks yang akan diucapkan (huruf Jepang atau romaji)
 * @param rate kecepatan bicara (0.5 - 1.0, default 0.9)
 */
export async function speakJapanese(text: string, rate: number = 0.9): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings.soundEnabled) return;

    const options: Speech.SpeechOptions = {
      language: 'ja-JP',
      rate,
      pitch: 1.0,
    };
    if (japaneseVoice) {
      options.voice = japaneseVoice;
    }

    await Speech.speak(text, options);
  } catch (e) {
    console.warn('Gagal memutar suara:', e);
  }
}

// Hentikan pemutaran suara
export function stopSpeaking(): void {
  Speech.stop();
}
