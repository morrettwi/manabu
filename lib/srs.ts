// Engine SRS — Algoritma SM-2 (SuperMemo 2)
// Menentukan jadwal pengulangan kartu berdasarkan kualitas jawaban pengguna.
// Algoritma ini terbukti efektif untuk hafalan jangka panjang.

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

// 0-2: salah/terlupa, 3: sulit, 4: baik, 5: mudah
export const RATING = {
  AGAIN: 0 as Rating,    // salah total, ulang lagi sekarang
  HARD: 3 as Rating,     // sulit, interval pendek
  GOOD: 4 as Rating,     // baik, interval normal
  EASY: 5 as Rating,     // mudah, interval panjang
};

// Tipe data kartu SRS
export type SRSCard = {
  id: string;
  // Data SRS
  ease: number;          // Ease Factor (kelancangan), mulai 2.5
  interval: number;      // interval hari sampai ulangan berikutnya
  repetitions: number;   // jumlah pengulangan sukses berturut-turut
  nextReview: number;    // timestamp (ms) kapan harus diulang
  lastReviewed: number;  // timestamp review terakhir
  // Metadata kartu
  front: string;          // sisi depan (mis. huruf/kanji/kata)
  back: string;           // sisi belakang (mis. arti/romaji)
  type: 'kana' | 'kanji' | 'vocabulary' | 'grammar';
  extra?: Record<string, string>; // data tambahan (romaji, contoh, dll)
};

// Inisialisasi kartu baru
export function createCard(params: {
  id: string;
  front: string;
  back: string;
  type: SRSCard['type'];
  extra?: Record<string, string>;
}): SRSCard {
  const now = Date.now();
  return {
    id: params.id,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: now,        // bisa langsung diulang
    lastReviewed: 0,
    front: params.front,
    back: params.back,
    type: params.type,
    extra: params.extra,
  };
}

/**
 * Inti algoritma SM-2
 * Input: kartu saat ini + rating jawaban
 * Output: kartu yang sudah diperbarui
 *
 * Rumus:
 * - Jika rating < 3: repetitions = 0, interval = 1 (ulang lagi)
 * - Jika rating >= 3:
 *     repetitions == 0 → interval = 1
 *     repetitions == 1 → interval = 6
 *     repetitions >= 2 → interval = round(prev_interval × ease)
 * - ease = ease + (0.1 - (5 - rating) × (0.08 + (5 - rating) × 0.02))
 * - ease minimum = 1.3
 */
export function reviewCard(card: SRSCard, rating: Rating): SRSCard {
  const now = Date.now();
  let { ease, interval, repetitions } = card;

  // Update Ease Factor
  ease = ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (ease < 1.3) ease = 1.3;
  if (ease > 3.0) ease = 3.0; // jaga agar tidak terlalu longgar

  if (rating < 3) {
    // Jawaban salah / lupa — reset pengulangan
    repetitions = 0;
    interval = 1; // ulang besok
  } else {
    // Jawaban benar
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const nextReview = now + interval * DAY_MS;

  return {
    ...card,
    ease,
    interval,
    repetitions,
    nextReview,
    lastReviewed: now,
  };
}

// Cek apakah kartu jatuh tempo untuk diulang hari ini
export function isDue(card: SRSCard, now: number = Date.now()): boolean {
  return card.nextReview <= now;
}

// Ambil semua kartu yang jatuh tempo dari daftar
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const now = Date.now();
  return cards.filter((c) => isDue(c, now));
}

// Hitung statistik SRS
export function getSRSStats(cards: SRSCard[]) {
  const now = Date.now();
  const due = cards.filter((c) => isDue(c, now));
  const mastered = cards.filter((c) => c.repetitions >= 3 && c.interval >= 7);
  const learning = cards.filter((c) => c.repetitions < 3);
  const young = cards.filter((c) => c.repetitions >= 3 && c.interval < 7);

  return {
    total: cards.length,
    due: due.length,
    mastered: mastered.length,
    learning: learning.length,
    young: young.length,
    newCards: cards.filter((c) => c.repetitions === 0).length,
  };
}
