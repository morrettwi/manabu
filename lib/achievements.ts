// Sistem pencapaian (achievement / badge)
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;        // nama emoji/icon
  target: number;
  metric: 'xp' | 'streak' | 'mastered' | 'lessons';
  color: string;
};

export const achievements: Achievement[] = [
  { id: 'first-step', title: 'Langkah Pertama', description: 'Selesaikan pelajaran pertama', icon: '🌟', target: 1, metric: 'lessons', color: '#FBBF24' },
  { id: 'xp-100', title: 'Pemula', description: 'Kumpulkan 100 XP', icon: '🎖️', target: 100, metric: 'xp', color: '#60A5FA' },
  { id: 'xp-500', title: 'Pembelajar', description: 'Kumpulkan 500 XP', icon: '🏅', target: 500, metric: 'xp', color: '#34D399' },
  { id: 'xp-1000', title: 'Penggiat', description: 'Kumpulkan 1.000 XP', icon: '🥇', target: 1000, metric: 'xp', color: '#F59E0B' },
  { id: 'streak-3', title: 'Konsisten', description: 'Belajar 3 hari berturut-turut', icon: '🔥', target: 3, metric: 'streak', color: '#EF4444' },
  { id: 'streak-7', title: 'Seminggu', description: 'Belajar 7 hari berturut-turut', icon: '🔥', target: 7, metric: 'streak', color: '#F97316' },
  { id: 'streak-30', title: 'Sebulan Penuh', description: 'Belajar 30 hari berturut-turut', icon: '👑', target: 30, metric: 'streak', color: '#A78BFA' },
  { id: 'master-10', title: 'Penguasa Kana', description: 'Kuasai 10 kartu', icon: '📚', target: 10, metric: 'mastered', color: '#F472B6' },
  { id: 'master-50', title: 'Ahli', description: 'Kuasai 50 kartu', icon: '🎓', target: 50, metric: 'mastered', color: '#10B981' },
  { id: 'master-100', title: 'Master', description: 'Kuasai 100 kartu', icon: '🏆', target: 100, metric: 'mastered', color: '#FBBF24' },
];

export function getUnlockedAchievements(
  stats: { xp: number; streak: number; mastered: number; lessons: number }
): Achievement[] {
  return achievements.filter((a) => stats[a.metric] >= a.target);
}

export function getNextAchievements(
  stats: { xp: number; streak: number; mastered: number; lessons: number }
): Achievement[] {
  return achievements.filter((a) => stats[a.metric] < a.target).slice(0, 3);
}
