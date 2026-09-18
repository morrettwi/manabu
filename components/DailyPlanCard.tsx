// DailyPlanCard — kartu "Belajar Hari Ini" (rencana harian cerdas)
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, radius, spacing } from '../lib/theme';
import { type DailyPlan, type DailyTask } from '../lib/storage';
import { isAllDone } from '../lib/dailyPlan';

type Props = {
  plan: DailyPlan;
  onRefresh?: () => void;
};

export function DailyPlanCard({ plan, onRefresh }: Props) {
  const router = useRouter();
  const doneCount = plan.tasks.filter((t) => t.done).length;
  const allDone = isAllDone(plan);

  const openTask = (task: DailyTask) => {
    // Pisahkan route & query param bila ada (mis. /kuis?mode=weakness)
    if (task.route.includes('?')) {
      const [path, query] = task.route.split('?');
      const params = new URLSearchParams(query);
      const obj: Record<string, string> = {};
      params.forEach((v, k) => { obj[k] = v; });
      router.push({ pathname: path as any, params: obj });
    } else {
      router.push(task.route as any);
    }
    onRefresh?.();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Belajar Hari Ini</Text>
          <Text style={styles.subtitle}>
            {allDone ? 'Semua selesai! 🎉' : `${doneCount}/${plan.tasks.length} tugas selesai`}
          </Text>
        </View>
        <Text style={styles.todayLabel}>
          {new Date(plan.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
        </Text>
      </View>

      {allDone && (
        <Text style={styles.celebrate}>
          Hebat! Target hari ini tercapai. Kembali besok untuk materi baru. ✨
        </Text>
      )}

      {!allDone && plan.tasks.length === 0 && (
        <Text style={styles.empty}>Tidak ada tugas untuk hari ini.</Text>
      )}

      <View style={styles.taskList}>
        {plan.tasks.map((task) => (
          <Pressable
            key={task.id}
            style={({ pressed }) => [styles.task, pressed && { opacity: 0.7 }, task.done && styles.taskDone]}
            onPress={() => openTask(task)}
            disabled={task.done}
          >
            <View style={[styles.taskIcon, { backgroundColor: task.color + '22' }]}>
              <Text style={[styles.taskIconText, { color: task.color }]}>
                {task.done ? '✓' : task.icon}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.taskTitle, task.done && styles.taskTitleDone]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              <Text style={styles.taskSub} numberOfLines={1}>{task.subtitle}</Text>
            </View>
            {!task.done && <Text style={styles.taskArrow}>→</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  todayLabel: { color: colors.textMuted, fontSize: fontSize.xs },
  celebrate: {
    color: colors.success,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  empty: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm },
  taskList: { gap: spacing.sm, marginTop: spacing.xs },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  taskDone: { opacity: 0.5 },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  taskIconText: { fontSize: 20, fontWeight: '600' },
  taskTitle: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  taskTitleDone: { textDecorationLine: 'line-through' },
  taskSub: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 1 },
  taskArrow: { color: colors.textMuted, fontSize: 16 },
});
