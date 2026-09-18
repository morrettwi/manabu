// Daily Plan — "Belajar Hari Ini"
// Mesin rencana harian cerdas: pengguna tidak perlu mikir harus belajar apa.
// Prioritas: ulangan jatuh tempo → pasangan tertukar → item lemah → kuis → item baru.
// Tugas "selesai" dihitung dari state live (bukan log terpisah).

import {
  type DailyPlan,
  type DailyTask,
  type UserLevel,
  getDailyPlan as loadDailyPlan,
  saveDailyPlan,
  getSettings,
  getUserLevel,
  getStats,
  loadCards,
} from './storage';
import { getDueCards } from './srs';
import { type WeaknessReport, getWeaknessReport } from './weakness';
import { colors } from './theme';

// ====================================================
// Input untuk generateDailyPlan
// ====================================================

export type DailyPlanInput = {
  dueCount: number;
  report: WeaknessReport;
  level: UserLevel;
  dailyGoal: number;
  studiedToday: number;
};

// ====================================================
// Pure: hasilkan rencana dari input
// ====================================================

export function generateDailyPlan(input: DailyPlanInput): DailyPlan {
  const { dueCount, report, level, dailyGoal, studiedToday } = input;
  const tasks: DailyTask[] = [];

  // 1. Ulangan jatuh tempo (prioritas tertinggi)
  if (dueCount > 0) {
    tasks.push({
      id: 'review',
      type: 'review',
      title: `Ulang ${dueCount} kartu jatuh tempo`,
      subtitle: 'Sesi ulangan SRS',
      icon: '🎴',
      color: colors.primary,
      route: '/srs',
      count: dueCount,
      done: false, // hadir berarti belum selesai
    });
  }

  // 2. Latihan pasangan tertukar
  if (report.confusions.length > 0) {
    const top = report.confusions[0];
    tasks.push({
      id: 'weakness-drill',
      type: 'weakness-drill',
      title: 'Latihan pasangan tertukar',
      subtitle: `Fokus ${top.a} ⇄ ${top.b} (×${top.count})`,
      icon: '🎯',
      color: colors.accent,
      route: '/kuis?mode=weakness',
      count: report.focusKana.length,
      done: false,
    });
  }

  // 3. Perkuat item lemah
  if (report.weakItems.length > 0) {
    tasks.push({
      id: 'weak-items',
      type: 'weak-items',
      title: `Perkuat ${report.weakItems.length} item yang lemah`,
      subtitle: 'Kuis khusus kelemahan',
      icon: '💪',
      color: colors.warning,
      route: '/kuis',
      count: report.weakItems.length,
      done: false,
    });
  }

  // 4. Kuis campuran (ditandai selesai bila target harian tercapai)
  tasks.push({
    id: 'quiz',
    type: 'quiz',
    title: 'Kuis campuran',
    subtitle: 'Uji pengetahuan umum',
    icon: '✍️',
    color: colors.vocabulary,
    route: '/kuis',
    count: 10,
    done: studiedToday >= dailyGoal && dailyGoal > 0,
  });

  // 5. Item baru sesuai level (saran)
  if (tasks.length < 4) {
    const newItem = newItemTask(level);
    if (newItem) tasks.push(newItem);
  }

  // Batasi 4 tugas
  const capped = tasks.slice(0, 4);

  const today = new Date().toISOString().slice(0, 10);
  return { date: today, tasks: capped };
}

// Sarana tugas "item baru" berdasarkan level
function newItemTask(level: UserLevel): DailyTask | null {
  switch (level) {
    case 'pemula':
      return {
        id: 'new-hiragana',
        type: 'new-items',
        title: 'Pelajari 5 huruf Hiragana baru',
        subtitle: 'Lanjutkan hafalan kana',
        icon: 'あ',
        color: colors.hiragana,
        route: '/kana',
        count: 5,
        done: false,
      };
    case 'dasar':
      return {
        id: 'new-katakana',
        type: 'new-items',
        title: 'Pelajari 5 huruf Katakana baru',
        subtitle: 'Huruf untuk kata serapan',
        icon: 'ア',
        color: colors.katakana,
        route: '/kana',
        count: 5,
        done: false,
      };
    case 'menengah':
      return {
        id: 'new-kanji',
        type: 'new-items',
        title: 'Pelajari 5 Kanji N5 baru',
        subtitle: 'Karakter Tionghoa',
        icon: '字',
        color: colors.kanji,
        route: '/kana',
        count: 5,
        done: false,
      };
  }
}

// Apakah semua tugas hari ini selesai?
export function isAllDone(plan: DailyPlan): boolean {
  return plan.tasks.length === 0 || plan.tasks.every((t) => t.done);
}

// ====================================================
// Wrapper: muat state live lalu hasilkan rencana
// ====================================================

export async function getDailyPlanLive(): Promise<DailyPlan> {
  const [cards, report, level, settings, stats] = await Promise.all([
    loadCards(),
    getWeaknessReport(),
    getUserLevel(),
    getSettings(),
    getStats(),
  ]);

  const due = getDueCards(cards);
  const today = new Date().toISOString().slice(0, 10);
  const todayStat = stats.find((s) => s.date === today);

  const plan = generateDailyPlan({
    dueCount: due.length,
    report,
    level,
    dailyGoal: settings.dailyGoal,
    studiedToday: todayStat?.studied ?? 0,
  });

  // Simpan untuk referensi (date tracking)
  await saveDailyPlan(plan);
  return plan;
}

// Ambil rencana tersimpan (jangan regenerasi) — dipakai bila cuma butuh cache
export async function getCachedDailyPlan(): Promise<DailyPlan | null> {
  return loadDailyPlan();
}
