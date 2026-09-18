// Placement Test Engine — tes penempatan untuk menentukan level awal
// Menentukan level pengguna (pemula/dasar/menengah) & seeding kartu SRS yang sesuai.

import { type UserLevel, type PlacementResult } from './storage';
import { allHiragana, type Kana } from '../data/hiragana';
import { allKatakana } from '../data/katakana';
import { kanjiN5, type Kanji } from '../data/kanji';
import { vocabulary, type Word } from '../data/vocabulary';
import { createCard, type SRSCard } from './srs';

// ====================================================
// Tipe soal penempatan
// ====================================================

export type PlacementTier = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary';

export type PlacementQuestion = {
  id: string;
  tier: PlacementTier;
  prompt: string;           // teks yang ditampilkan (mis. karakter kana)
  promptSub: string;        // sub-label (mis. "Hiragana")
  choices: string[];
  correctIndex: number;
  explanation: string;
};

// ====================================================
// Helper
// ====================================================

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// ====================================================
// Pembuat soal per tier
// ====================================================

function makeKanaQuestion(kana: Kana, tier: PlacementTier): PlacementQuestion {
  const pool: Kana[] = tier === 'hiragana' ? allHiragana : allKatakana;
  const wrongs = pickRandom(pool.filter((k) => k.romaji !== kana.romaji), 3);
  const choices = shuffle([kana, ...wrongs]).map((k) => k.romaji);
  return {
    id: `${tier}-${kana.character}`,
    tier,
    prompt: kana.character,
    promptSub: tier === 'hiragana' ? 'Hiragana' : 'Katakana',
    choices,
    correctIndex: choices.indexOf(kana.romaji),
    explanation: `${kana.character} = ${kana.romaji}`,
  };
}

function makeKanjiQuestion(kanji: Kanji): PlacementQuestion {
  const wrongs = pickRandom(kanjiN5.filter((k) => k.meaning !== kanji.meaning), 3);
  const choices = shuffle([kanji, ...wrongs]).map((k) => k.meaning);
  return {
    id: `kanji-${kanji.character}`,
    tier: 'kanji',
    prompt: kanji.character,
    promptSub: 'Kanji N5',
    choices,
    correctIndex: choices.indexOf(kanji.meaning),
    explanation: `${kanji.character} = ${kanji.meaning}`,
  };
}

function makeVocabQuestion(word: Word): PlacementQuestion {
  const wrongs = pickRandom(vocabulary.filter((w) => w.meaning !== word.meaning), 3);
  const choices = shuffle([word, ...wrongs]).map((w) => w.meaning);
  return {
    id: `vocab-${word.japanese}`,
    tier: 'vocabulary',
    prompt: word.japanese,
    promptSub: word.reading,
    choices,
    correctIndex: choices.indexOf(word.meaning),
    explanation: `${word.japanese} (${word.reading}) = ${word.meaning}`,
  };
}

// ====================================================
// Hasilkan semua soal penempatan (15 soal, 4 tier)
// ====================================================

export function placementQuestions(): PlacementQuestion[] {
  const hiraQs = pickRandom(allHiragana.filter((k) => k.row === 'vowel' || k.row === 'k' || k.row === 's'), 5)
    .map((k) => makeKanaQuestion(k, 'hiragana'));
  const kataQs = pickRandom(allKatakana.filter((k) => k.row === 'vowel' || k.row === 'k'), 4)
    .map((k) => makeKanaQuestion(k, 'katakana'));
  const kanjiQs = pickRandom(kanjiN5.slice(0, 20), 3).map(makeKanjiQuestion);
  const vocabQs = pickRandom(vocabulary.slice(0, 30), 3).map(makeVocabQuestion);

  return [...hiraQs, ...kataQs, ...kanjiQs, ...vocabQs];
}

// ====================================================
// Penilaian — tentukan level berdasarkan jawaban
// ====================================================

export type PlacementAnswer = {
  questionId: string;
  selectedIndex: number;
};

export function gradePlacement(questions: PlacementQuestion[], answers: PlacementAnswer[]): PlacementResult {
  // Hitung benar per tier
  const tierStats: Record<PlacementTier, { correct: number; total: number }> = {
    hiragana: { correct: 0, total: 0 },
    katakana: { correct: 0, total: 0 },
    kanji: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
  };

  let totalCorrect = 0;
  for (const q of questions) {
    tierStats[q.tier].total += 1;
    const ans = answers.find((a) => a.questionId === q.id);
    if (ans && ans.selectedIndex === q.correctIndex) {
      tierStats[q.tier].correct += 1;
      totalCorrect += 1;
    }
  }

  // Akurasi kana (hiragana + katakana) & vocab (kanji + kosakata)
  const kanaTotal = tierStats.hiragana.total + tierStats.katakana.total;
  const kanaCorrect = tierStats.hiragana.correct + tierStats.katakana.correct;
  const vocabTotal = tierStats.kanji.total + tierStats.vocabulary.total;
  const vocabCorrect = tierStats.kanji.correct + tierStats.vocabulary.correct;

  const kanaAccuracy = kanaTotal > 0 ? kanaCorrect / kanaTotal : 0;
  const vocabAccuracy = vocabTotal > 0 ? vocabCorrect / vocabTotal : 0;

  // Threshold level
  let level: UserLevel = 'pemula';
  if (kanaAccuracy >= 0.8 && vocabAccuracy >= 0.6) {
    level = 'menengah';
  } else if (kanaAccuracy >= 0.6) {
    level = 'dasar';
  }

  return {
    level,
    score: totalCorrect,
    total: questions.length,
    kanaAccuracy,
    vocabAccuracy,
    takenAt: Date.now(),
  };
}

// ====================================================
// Seeding kartu SRS berdasarkan level
// ====================================================

export function seedCardsForLevel(level: UserLevel): SRSCard[] {
  if (level === 'menengah') {
    // Sudah lancar kana → fokus kanji + kosakata + beberapa katakana lanjutan
    const kataCards: SRSCard[] = allKatakana
      .filter((k) => k.row === 't' || k.row === 'n' || k.row === 'h')
      .slice(0, 15)
      .map((k) =>
        createCard({
          id: `kana-k-${k.character}`,
          front: k.character,
          back: k.romaji,
          type: 'kana',
          extra: { romaji: k.romaji, type: 'katakana' },
        })
      );
    const kanjiCards: SRSCard[] = kanjiN5.slice(0, 20).map((k) =>
      createCard({
        id: `kanji-${k.character}`,
        front: k.character,
        back: k.meaning,
        type: 'kanji',
        extra: { onyomi: k.onyomi, kunyomi: k.kunyomi, meaning: k.meaning },
      })
    );
    const vocabCards: SRSCard[] = vocabulary.slice(0, 20).map((w) =>
      createCard({
        id: `vocab-${w.japanese}`,
        front: w.japanese,
        back: w.meaning,
        type: 'vocabulary',
        extra: { reading: w.reading, romaji: w.romaji, meaning: w.meaning },
      })
    );
    return [...kataCards, ...kanjiCards, ...vocabCards];
  }

  if (level === 'dasar') {
    // Sudah kenal hiragana dasar → semua hiragana + 25 katakana awal
    const hiraCards: SRSCard[] = allHiragana.slice(0, 46).map((k) =>
      createCard({
        id: `kana-h-${k.character}`,
        front: k.character,
        back: k.romaji,
        type: 'kana',
        extra: { romaji: k.romaji, type: 'hiragana' },
      })
    );
    const kataCards: SRSCard[] = allKatakana.slice(0, 25).map((k) =>
      createCard({
        id: `kana-k-${k.character}`,
        front: k.character,
        back: k.romaji,
        type: 'kana',
        extra: { romaji: k.romaji, type: 'katakana' },
      })
    );
    return [...hiraCards, ...kataCards];
  }

  // pemula — 20 hiragana dasar (baris vokal + K + S + T)
  return allHiragana
    .filter((k) => k.row === 'vowel' || k.row === 'k' || k.row === 's' || k.row === 't')
    .slice(0, 20)
    .map((k) =>
      createCard({
        id: `kana-h-${k.character}`,
        front: k.character,
        back: k.romaji,
        type: 'kana',
        extra: { romaji: k.romaji, type: 'hiragana' },
      })
    );
}

// Label ramah untuk level
export function levelLabel(level: UserLevel): string {
  switch (level) {
    case 'menengah': return 'Menengah';
    case 'dasar': return 'Dasar';
    case 'pemula': return 'Pemula';
  }
}

// Deskripsi singkat level
export function levelDescription(level: UserLevel): string {
  switch (level) {
    case 'menengah': return 'Kamu sudah lancar kana — fokus ke kanji & kosakata.';
    case 'dasar': return 'Kamu kenal hiragana — lanjutkan ke katakana & dasar kanji.';
    case 'pemula': return 'Mulai dari nol — pelajari huruf hiragana dasar.';
  }
}
