// Weakness Detection — deteksi kelemahan belajar pengguna
// Melacak jawaban salah dari Kuis & SRS, lalu menghitung:
// - Item lemah (akurasi rendah)
// - Pasangan tertukar (confusion pairs)
// - Pesan kelemahan ramah (mis. "Kamu sering tertukar に dan へ")

import {
  type Mistake,
  getMistakes,
  addMistake,
} from './storage';
import { kanaByRomaji, findConfusionPair } from '../data/confusionPairs';

// Item dengan akurasi rendah
export type WeakItem = {
  id: string;
  type: Mistake['type'];
  attempts: number;
  correct: number;
  accuracy: number;        // 0..1
  lastWrong: number;       // timestamp kesalahan terakhir
};

// Pasangan tertukar terdeteksi
export type Confusion = {
  a: string;               // karakter pertama
  b: string;               // karakter kedua
  aRomaji: string;
  bRomaji: string;
  count: number;           // berapa kali tertukar
  reason?: string;         // alasan (dari daftar pasangan diketahui)
};

export type WeaknessReport = {
  totalMistakes: number;
  weakItems: WeakItem[];          // urut akurasi naik
  confusions: Confusion[];        // top-3, count ≥ 2
  topMessage: string | null;      // pesan ramah
  focusKana: string[];            // karakter untuk kuis fokus
};

// Catat satu kesalahan (wrapper storage)
export async function recordMistake(mistake: Mistake): Promise<void> {
  await addMistake(mistake);
}

// ====================================================
// Pure compute — hitung laporan kelemahan dari array mistake
// ====================================================

const WEAK_THRESHOLD = 0.6;     // akurasi < 60% dianggap lemah
const MIN_ATTEMPTS = 3;         // minimal 3 percobaan sebelum dianggap lemah
const CONFUSION_MIN_COUNT = 2; // minimal 2 kali tertukar agar ditampilkan

export function computeWeaknessReport(mistakes: Mistake[]): WeaknessReport {
  // --- 1. Item lemah: kelompokkan per (id, type) ---
  const itemMap = new Map<string, { type: Mistake['type']; attempts: number; correct: number; lastWrong: number }>();

  for (const m of mistakes) {
    const key = `${m.type}:${m.id}`;
    const entry = itemMap.get(key) ?? { type: m.type, attempts: 0, correct: 0, lastWrong: 0 };
    entry.attempts += 1;
    // Dianggap "salah" bila chosen !== correct (untuk SRS, chosen='?' selalu ≠ correct)
    if (m.chosen !== m.correct) {
      entry.lastWrong = Math.max(entry.lastWrong, m.timestamp);
    } else {
      entry.correct += 1;
    }
    itemMap.set(key, entry);
  }

  const weakItems: WeakItem[] = [];
  for (const [id, e] of itemMap.entries()) {
    if (e.attempts >= MIN_ATTEMPTS) {
      const accuracy = e.correct / e.attempts;
      if (accuracy < WEAK_THRESHOLD) {
        weakItems.push({
          id: id.split(':').slice(1).join(':'), // ambil kembali id tanpa prefix type
          type: e.type,
          attempts: e.attempts,
          correct: e.correct,
          accuracy,
          lastWrong: e.lastWrong,
        });
      }
    }
  }
  weakItems.sort((a, b) => a.accuracy - b.accuracy); // terburuk dulu

  // --- 2. Confusion pairs: hanya dari kesalahan kana (quiz) ---
  // id = karakter prompt; chosen = romaji yang dipilih (karakter lawan)
  const pairMap = new Map<string, { a: string; b: string; aRomaji: string; bRomaji: string; count: number; reason?: string }>();

  for (const m of mistakes) {
    if (m.type !== 'kana' || m.source !== 'quiz') continue;
    const promptChar = m.id;                 // karakter yang ditampilkan
    const confusedKana = kanaByRomaji(m.chosen); // karakter lawan yang dipilih user
    if (!confusedKana || confusedKana.character === promptChar) continue;

    // Urutkan agar pasangan (a,b) dan (b,a) dihitung sama
    const [a, b] = [promptChar, confusedKana.character].sort();
    const [aRomaji, bRomaji] =
      promptChar <= confusedKana.character
        ? [m.correct, m.chosen]
        : [m.chosen, m.correct];
    const key = `${a}|${b}`;

    const existing = pairMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      const known = findConfusionPair(a, b);
      pairMap.set(key, {
        a,
        b,
        aRomaji,
        bRomaji,
        count: 1,
        reason: known?.reason,
      });
    }
  }

  const confusions: Confusion[] = Array.from(pairMap.values())
    .filter((p) => p.count >= CONFUSION_MIN_COUNT)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // --- 3. Pesan ramah ---
  let topMessage: string | null = null;
  if (confusions.length > 0) {
    const top = confusions[0];
    topMessage = `Kamu sering tertukar ${top.a} dan ${top.b} (×${top.count})`;
  }

  // --- 4. Fokus kana: gabungan karakter dari pasangan tertukar ---
  const focusKana: string[] = [];
  for (const c of confusions) {
    if (!focusKana.includes(c.a)) focusKana.push(c.a);
    if (!focusKana.includes(c.b)) focusKana.push(c.b);
  }

  return {
    totalMistakes: mistakes.length,
    weakItems,
    confusions,
    topMessage,
    focusKana,
  };
}

// ====================================================
// Convenience: muat dari storage lalu hitung
// ====================================================

export async function getWeaknessReport(): Promise<WeaknessReport> {
  const mistakes = await getMistakes();
  return computeWeaknessReport(mistakes);
}

export async function getTopWeaknessMessage(): Promise<string | null> {
  const report = await getWeaknessReport();
  return report.topMessage;
}

export async function getFocusKana(): Promise<string[]> {
  const report = await getWeaknessReport();
  return report.focusKana;
}
