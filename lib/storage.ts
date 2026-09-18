// Storage — wrapper AsyncStorage untuk persistensi data pengguna
// Menyimpan: kartu SRS, XP, streak, pengaturan, statistik

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SRSCard } from './srs';

const KEYS = {
  CARDS: '@manabu/cards',
  XP: '@manabu/xp',
  LEVEL: '@manabu/level',
  STREAK: '@manabu/streak',
  LAST_STUDY: '@manabu/lastStudy',
  SETTINGS: '@manabu/settings',
  STATS: '@manabu/stats',
  ACHIEVEMENTS: '@manabu/achievements',
  // Onboarding & penempatan
  ONBOARDING: '@manabu/onboarding',
  USER_LEVEL: '@manabu/user_level',
  PLACEMENT: '@manabu/placement',
  // Kelemahan & rencana harian
  MISTAKES: '@manabu/mistakes',
  DAILY_PLAN: '@manabu/daily_plan',
  // Penghitung pelajaran selesai (untuk lencana)
  LESSONS: '@manabu/lessons',
} as const;

// --- Kartu SRS ---
export async function saveCards(cards: SRSCard[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Gagal menyimpan kartu:', e);
  }
}

export async function loadCards(): Promise<SRSCard[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CARDS);
    return data ? (JSON.parse(data) as SRSCard[]) : [];
  } catch (e) {
    console.error('Gagal memuat kartu:', e);
    return [];
  }
}

// --- XP & Level ---
export async function getXP(): Promise<number> {
  const data = await AsyncStorage.getItem(KEYS.XP);
  return data ? parseInt(data, 10) : 0;
}

export async function addXP(amount: number): Promise<number> {
  const current = await getXP();
  const updated = current + amount;
  await AsyncStorage.setItem(KEYS.XP, updated.toString());
  return updated;
}

export async function getLevel(): Promise<number> {
  const xp = await getXP();
  // Level = floor(sqrt(xp / 50)) + 1, sehingga tiap level butuh lebih banyak XP
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

// --- Streak (hari berturut-turut belajar) ---
export async function getStreak(): Promise<number> {
  const data = await AsyncStorage.getItem(KEYS.STREAK);
  return data ? parseInt(data, 10) : 0;
}

export async function updateStreak(): Promise<number> {
  const lastStudyStr = await AsyncStorage.getItem(KEYS.LAST_STUDY);
  const today = new Date().toDateString();
  let streak = await getStreak();

  if (lastStudyStr !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastStudyStr === yesterday) {
      streak += 1; // lanjut streak
    } else if (lastStudyStr !== today) {
      streak = 1; // reset streak
    }
    await AsyncStorage.setItem(KEYS.STREAK, streak.toString());
    await AsyncStorage.setItem(KEYS.LAST_STUDY, today);
  }
  return streak;
}

// --- Statistik harian ---
export type DailyStat = {
  date: string;      // YYYY-MM-DD
  studied: number;   // jumlah kartu dipelajari
  correct: number;   // jumlah jawaban benar
  xpGained: number;
};

export async function getStats(): Promise<DailyStat[]> {
  const data = await AsyncStorage.getItem(KEYS.STATS);
  return data ? (JSON.parse(data) as DailyStat[]) : [];
}

export async function recordStudy(correct: number, studied: number): Promise<void> {
  const stats = await getStats();
  const today = new Date().toISOString().slice(0, 10);
  const todayStat = stats.find((s) => s.date === today);

  if (todayStat) {
    todayStat.studied += studied;
    todayStat.correct += correct;
  } else {
    stats.push({ date: today, studied, correct, xpGained: 0 });
  }

  // Simpan maks 30 hari
  const recent = stats.slice(-30);
  await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(recent));
}

// --- Pengaturan ---
export type Settings = {
  dailyGoal: number;          // target kartu per hari
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reminderTime: string;      // HH:MM
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
};

const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 20,
  soundEnabled: true,
  hapticsEnabled: true,
  reminderTime: '20:00',
  jlptLevel: 'N5',
};

export async function getSettings(): Promise<Settings> {
  const data = await AsyncStorage.getItem(KEYS.SETTINGS);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
}

// --- Reset semua data ---
export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

// ====================================================
// Onboarding & Tes Penempatan
// ====================================================

// Tipe level pengguna hasil tes penempatan
export type UserLevel = 'pemula' | 'dasar' | 'menengah';

// Tipe hasil tes penempatan
export type PlacementResult = {
  level: UserLevel;
  score: number;        // total jawaban benar
  total: number;        // total soal
  kanaAccuracy: number; // 0..1
  vocabAccuracy: number; // 0..1
  takenAt: number;       // timestamp
};

export async function isOnboarded(): Promise<boolean> {
  const data = await AsyncStorage.getItem(KEYS.ONBOARDING);
  return data === 'true';
}

export async function setOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, value ? 'true' : 'false');
}

export async function getUserLevel(): Promise<UserLevel> {
  const data = await AsyncStorage.getItem(KEYS.USER_LEVEL);
  return (data as UserLevel) ?? 'pemula';
}

export async function setUserLevel(level: UserLevel): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_LEVEL, level);
}

export async function getPlacement(): Promise<PlacementResult | null> {
  const data = await AsyncStorage.getItem(KEYS.PLACEMENT);
  return data ? (JSON.parse(data) as PlacementResult) : null;
}

export async function setPlacement(result: PlacementResult): Promise<void> {
  await AsyncStorage.setItem(KEYS.PLACEMENT, JSON.stringify(result));
}

// ====================================================
// Kelemahan (mistake log)
// ====================================================

// Tipe satu entri kesalahan
export type Mistake = {
  id: string;            // id item (mis. karakter kana / id kartu SRS)
  type: 'kana' | 'kanji' | 'vocabulary' | 'grammar';
  chosen: string;        // jawaban yang dipilih pengguna
  correct: string;       // jawaban yang benar
  timestamp: number;     // waktu kesalahan (ms)
  source: 'quiz' | 'srs';
  mode?: string;         // mode kuis (mis. kana-reading, weakness)
};

const MAX_MISTAKES = 500;

export async function getMistakes(): Promise<Mistake[]> {
  const data = await AsyncStorage.getItem(KEYS.MISTAKES);
  return data ? (JSON.parse(data) as Mistake[]) : [];
}

export async function addMistake(mistake: Mistake): Promise<void> {
  const mistakes = await getMistakes();
  mistakes.push(mistake);
  // Batasi 500 entri terakhir (FIFO)
  const trimmed = mistakes.slice(-MAX_MISTAKES);
  await AsyncStorage.setItem(KEYS.MISTAKES, JSON.stringify(trimmed));
}

export async function clearMistakes(): Promise<void> {
  await AsyncStorage.setItem(KEYS.MISTAKES, JSON.stringify([]));
}

// ====================================================
// Rencana harian (daily plan)
// ====================================================

export type DailyTask = {
  id: string;
  type: 'review' | 'weakness-drill' | 'weak-items' | 'new-items' | 'quiz';
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;          // mis. /srs, /kuis, /kuis?mode=weakness
  count: number;          // jumlah item target
  done: boolean;          // sudah selesai? (dihitung live)
};

export type DailyPlan = {
  date: string;           // YYYY-MM-DD
  tasks: DailyTask[];
};

export async function getDailyPlan(): Promise<DailyPlan | null> {
  const data = await AsyncStorage.getItem(KEYS.DAILY_PLAN);
  return data ? (JSON.parse(data) as DailyPlan) : null;
}

export async function saveDailyPlan(plan: DailyPlan): Promise<void> {
  await AsyncStorage.setItem(KEYS.DAILY_PLAN, JSON.stringify(plan));
}

// ====================================================
// Penghitung pelajaran selesai (untuk lencana)
// ====================================================

export async function getLessonsDone(): Promise<number> {
  const data = await AsyncStorage.getItem(KEYS.LESSONS);
  return data ? parseInt(data, 10) : 0;
}

export async function addLesson(amount: number = 1): Promise<number> {
  const current = await getLessonsDone();
  const updated = current + amount;
  await AsyncStorage.setItem(KEYS.LESSONS, updated.toString());
  return updated;
}

// Ekspor keys untuk debugging
export { KEYS };
