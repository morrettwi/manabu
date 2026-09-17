// Theme — palet warna & konstanta visual aplikasi Manabu

export const colors = {
  // Warna utama — unu (ungu Jepang)
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  // Warna aksen — sakura (merah muda)
  accent: '#EC4899',
  accentLight: '#F9A8D4',
  // Sukses / peringatan / error
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  // Latar
  background: '#0F0F12',
  surface: '#1A1A22',
  surfaceLight: '#25252F',
  // Teks
  text: '#F8F8F2',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B7B',
  // Khusus kana
  hiragana: '#F472B6',  // merah muda untuk Hiragana
  katakana: '#60A5FA',  // biru untuk Katakana
  kanji: '#FBBF24',     // emas untuk Kanji
  vocabulary: '#34D399', // hijau untuk Kosakata
  grammar: '#A78BFA',   // ungu untuk Tata Bahasa
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  display: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Warna berdasarkan tipe konten
export const colorByType = (type: string): string => {
  switch (type) {
    case 'hiragana': return colors.hiragana;
    case 'katakana': return colors.katakana;
    case 'kanji': return colors.kanji;
    case 'vocabulary': return colors.vocabulary;
    case 'grammar': return colors.grammar;
    default: return colors.primary;
  }
};

// Label berdasarkan tipe konten
export const labelByType = (type: string): string => {
  switch (type) {
    case 'hiragana': return 'Hiragana';
    case 'katakana': return 'Katakana';
    case 'kanji': return 'Kanji';
    case 'vocabulary': return 'Kosakata';
    case 'grammar': return 'Tata Bahasa';
    default: return 'Lainnya';
  }
};
