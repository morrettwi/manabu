// Pasangan kana yang sering tertukar (mirip visual/auditif)
// Dipakai oleh Weakness Detection untuk pesan ramah & kuis fokus.

import { allHiragana, type Kana } from './hiragana';
import { allKatakana } from './katakana';

// Gabungan semua kana untuk lookup karakter dari romaji
const allKana: Kana[] = [...allHiragana, ...allKatakana];

// Cari karakter kana berdasarkan romaji (kembalikan karakter pertama yang cocok)
export function kanaByRomaji(romaji: string): Kana | undefined {
  return allKana.find((k) => k.romaji === romaji);
}

export type ConfusionPair = {
  a: string;        // karakter pertama, mis. シ
  b: string;        // karakter kedua, mis. ツ
  aRomaji: string;
  bRomaji: string;
  reason: string;   // kenapa tertukar
};

// Daftar pasangan kana yang sering tertukar
export const confusionPairs: ConfusionPair[] = [
  // --- Katakana mirip ---
  { a: 'シ', b: 'ツ', aRomaji: 'shi', bRomaji: 'tsu', reason: 'garis mirip, arah berbeda' },
  { a: 'ン', b: 'ソ', aRomaji: 'n', bRomaji: 'so', reason: 'garis lengkung hampir sama' },
  { a: 'ヌ', b: 'メ', aRomaji: 'nu', bRomaji: 'me', reason: 'bentuk mirip dengan loop' },
  { a: 'ワ', b: 'ク', aRomaji: 'wa', bRomaji: 'ku', reason: 'sudut mirip' },
  { a: 'カ', b: 'オ', aRomaji: 'ka', bRomaji: 'o', reason: 'bentuk dasar mirip' },
  { a: 'ア', b: 'マ', aRomaji: 'a', bRomaji: 'ma', reason: 'garis vertikal serupa' },
  { a: 'ク', b: 'タ', aRomaji: 'ku', bRomaji: 'ta', reason: 'sudut & garis mirip' },
  { a: 'ス', b: 'ヌ', aRomaji: 'su', bRomaji: 'nu', reason: 'loop & garis serupa' },
  { a: 'ヘ', b: 'ニ', aRomaji: 'he', bRomaji: 'ni', reason: 'dua garis miring serupa' },
  // --- Hiragana mirip ---
  { a: 'に', b: 'へ', aRomaji: 'ni', bRomaji: 'he', reason: 'garis lengkung mirip' },
  { a: 'ぬ', b: 'ね', aRomaji: 'nu', bRomaji: 'ne', reason: 'bentuk mirip dengan ekor' },
  { a: 'わ', b: 'れ', aRomaji: 'wa', bRomaji: 're', reason: 'garis lengkung serupa' },
  { a: 'る', b: 'ろ', aRomaji: 'ru', bRomaji: 'ro', reason: 'ada/tidak ada loop' },
  { a: 'た', b: 'な', aRomaji: 'ta', bRomaji: 'na', reason: 'garis atas & lengkung mirip' },
  { a: 'き', b: 'さ', aRomaji: 'ki', bRomaji: 'sa', reason: 'garis lengkung serupa' },
  { a: 'あ', b: 'お', aRomaji: 'a', bRomaji: 'o', reason: 'lengkung & garis mirip' },
  { a: 'め', b: 'ぬ', aRomaji: 'me', bRomaji: 'nu', reason: 'loop & ekor serupa' },
  { a: 'れ', b: 'ね', aRomaji: 're', bRomaji: 'ne', reason: 'bentuk ekor mirip' },
  { a: 'ん', b: 'そ', aRomaji: 'n', bRomaji: 'so', reason: 'garis lengkung mirip' },
];

// Cek apakah dua karakter membentuk pasangan tertukar yang diketahui
export function findConfusionPair(a: string, b: string): ConfusionPair | undefined {
  return confusionPairs.find(
    (p) => (p.a === a && p.b === b) || (p.a === b && p.b === a)
  );
}
