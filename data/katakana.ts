import type { Kana } from './hiragana';

// 46 katakana dasar (gojuon)
export const katakana: Kana[] = [
  // Baris vokal
  { character: 'ア', romaji: 'a', pronunciation: 'a', column: 'a', row: 'vowel', type: 'katakana' },
  { character: 'イ', romaji: 'i', pronunciation: 'i', column: 'i', row: 'vowel', type: 'katakana' },
  { character: 'ウ', romaji: 'u', pronunciation: 'u', column: 'u', row: 'vowel', type: 'katakana' },
  { character: 'エ', romaji: 'e', pronunciation: 'e', column: 'e', row: 'vowel', type: 'katakana' },
  { character: 'オ', romaji: 'o', pronunciation: 'o', column: 'o', row: 'vowel', type: 'katakana' },
  // Baris K
  { character: 'カ', romaji: 'ka', pronunciation: 'ka', column: 'a', row: 'k', type: 'katakana' },
  { character: 'キ', romaji: 'ki', pronunciation: 'ki', column: 'i', row: 'k', type: 'katakana' },
  { character: 'ク', romaji: 'ku', pronunciation: 'ku', column: 'u', row: 'k', type: 'katakana' },
  { character: 'ケ', romaji: 'ke', pronunciation: 'ke', column: 'e', row: 'k', type: 'katakana' },
  { character: 'コ', romaji: 'ko', pronunciation: 'ko', column: 'o', row: 'k', type: 'katakana' },
  // Baris S
  { character: 'サ', romaji: 'sa', pronunciation: 'sa', column: 'a', row: 's', type: 'katakana' },
  { character: 'シ', romaji: 'shi', pronunciation: 'shi', column: 'i', row: 's', type: 'katakana' },
  { character: 'ス', romaji: 'su', pronunciation: 'su', column: 'u', row: 's', type: 'katakana' },
  { character: 'セ', romaji: 'se', pronunciation: 'se', column: 'e', row: 's', type: 'katakana' },
  { character: 'ソ', romaji: 'so', pronunciation: 'so', column: 'o', row: 's', type: 'katakana' },
  // Baris T
  { character: 'タ', romaji: 'ta', pronunciation: 'ta', column: 'a', row: 't', type: 'katakana' },
  { character: 'チ', romaji: 'chi', pronunciation: 'chi', column: 'i', row: 't', type: 'katakana' },
  { character: 'ツ', romaji: 'tsu', pronunciation: 'tsu', column: 'u', row: 't', type: 'katakana' },
  { character: 'テ', romaji: 'te', pronunciation: 'te', column: 'e', row: 't', type: 'katakana' },
  { character: 'ト', romaji: 'to', pronunciation: 'to', column: 'o', row: 't', type: 'katakana' },
  // Baris N
  { character: 'ナ', romaji: 'na', pronunciation: 'na', column: 'a', row: 'n', type: 'katakana' },
  { character: 'ニ', romaji: 'ni', pronunciation: 'ni', column: 'i', row: 'n', type: 'katakana' },
  { character: 'ヌ', romaji: 'nu', pronunciation: 'nu', column: 'u', row: 'n', type: 'katakana' },
  { character: 'ネ', romaji: 'ne', pronunciation: 'ne', column: 'e', row: 'n', type: 'katakana' },
  { character: 'ノ', romaji: 'no', pronunciation: 'no', column: 'o', row: 'n', type: 'katakana' },
  // Baris H
  { character: 'ハ', romaji: 'ha', pronunciation: 'ha', column: 'a', row: 'h', type: 'katakana' },
  { character: 'ヒ', romaji: 'hi', pronunciation: 'hi', column: 'i', row: 'h', type: 'katakana' },
  { character: 'フ', romaji: 'fu', pronunciation: 'fu', column: 'u', row: 'h', type: 'katakana' },
  { character: 'ヘ', romaji: 'he', pronunciation: 'he', column: 'e', row: 'h', type: 'katakana' },
  { character: 'ホ', romaji: 'ho', pronunciation: 'ho', column: 'o', row: 'h', type: 'katakana' },
  // Baris M
  { character: 'マ', romaji: 'ma', pronunciation: 'ma', column: 'a', row: 'm', type: 'katakana' },
  { character: 'ミ', romaji: 'mi', pronunciation: 'mi', column: 'i', row: 'm', type: 'katakana' },
  { character: 'ム', romaji: 'mu', pronunciation: 'mu', column: 'u', row: 'm', type: 'katakana' },
  { character: 'メ', romaji: 'me', pronunciation: 'me', column: 'e', row: 'm', type: 'katakana' },
  { character: 'モ', romaji: 'mo', pronunciation: 'mo', column: 'o', row: 'm', type: 'katakana' },
  // Baris Y
  { character: 'ヤ', romaji: 'ya', pronunciation: 'ya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'ユ', romaji: 'yu', pronunciation: 'yu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'ヨ', romaji: 'yo', pronunciation: 'yo', column: 'o', row: 'y', type: 'katakana' },
  // Baris R
  { character: 'ラ', romaji: 'ra', pronunciation: 'ra', column: 'a', row: 'r', type: 'katakana' },
  { character: 'リ', romaji: 'ri', pronunciation: 'ri', column: 'i', row: 'r', type: 'katakana' },
  { character: 'ル', romaji: 'ru', pronunciation: 'ru', column: 'u', row: 'r', type: 'katakana' },
  { character: 'レ', romaji: 're', pronunciation: 're', column: 'e', row: 'r', type: 'katakana' },
  { character: 'ロ', romaji: 'ro', pronunciation: 'ro', column: 'o', row: 'r', type: 'katakana' },
  // Baris W & N
  { character: 'ワ', romaji: 'wa', pronunciation: 'wa', column: 'a', row: 'w', type: 'katakana' },
  { character: 'ヲ', romaji: 'wo', pronunciation: 'wo', column: 'o', row: 'w', type: 'katakana' },
  { character: 'ン', romaji: 'n', pronunciation: 'n', column: 'n', row: 'n', type: 'katakana' },
];

// Katakana dakuten
export const katakanaDakuten: Kana[] = [
  { character: 'ガ', romaji: 'ga', pronunciation: 'ga', column: 'a', row: 'g', type: 'katakana' },
  { character: 'ギ', romaji: 'gi', pronunciation: 'gi', column: 'i', row: 'g', type: 'katakana' },
  { character: 'グ', romaji: 'gu', pronunciation: 'gu', column: 'u', row: 'g', type: 'katakana' },
  { character: 'ゲ', romaji: 'ge', pronunciation: 'ge', column: 'e', row: 'g', type: 'katakana' },
  { character: 'ゴ', romaji: 'go', pronunciation: 'go', column: 'o', row: 'g', type: 'katakana' },
  { character: 'ザ', romaji: 'za', pronunciation: 'za', column: 'a', row: 'z', type: 'katakana' },
  { character: 'ジ', romaji: 'ji', pronunciation: 'ji', column: 'i', row: 'z', type: 'katakana' },
  { character: 'ズ', romaji: 'zu', pronunciation: 'zu', column: 'u', row: 'z', type: 'katakana' },
  { character: 'ゼ', romaji: 'ze', pronunciation: 'ze', column: 'e', row: 'z', type: 'katakana' },
  { character: 'ゾ', romaji: 'zo', pronunciation: 'zo', column: 'o', row: 'z', type: 'katakana' },
  { character: 'ダ', romaji: 'da', pronunciation: 'da', column: 'a', row: 'd', type: 'katakana' },
  { character: 'ヂ', romaji: 'di', pronunciation: 'ji', column: 'i', row: 'd', type: 'katakana' },
  { character: 'ヅ', romaji: 'du', pronunciation: 'zu', column: 'u', row: 'd', type: 'katakana' },
  { character: 'デ', romaji: 'de', pronunciation: 'de', column: 'e', row: 'd', type: 'katakana' },
  { character: 'ド', romaji: 'do', pronunciation: 'do', column: 'o', row: 'd', type: 'katakana' },
  { character: 'バ', romaji: 'ba', pronunciation: 'ba', column: 'a', row: 'b', type: 'katakana' },
  { character: 'ビ', romaji: 'bi', pronunciation: 'bi', column: 'i', row: 'b', type: 'katakana' },
  { character: 'ブ', romaji: 'bu', pronunciation: 'bu', column: 'u', row: 'b', type: 'katakana' },
  { character: 'ベ', romaji: 'be', pronunciation: 'be', column: 'e', row: 'b', type: 'katakana' },
  { character: 'ボ', romaji: 'bo', pronunciation: 'bo', column: 'o', row: 'b', type: 'katakana' },
];

// Katakana handakuten
export const katakanaHandakuten: Kana[] = [
  { character: 'パ', romaji: 'pa', pronunciation: 'pa', column: 'a', row: 'p', type: 'katakana' },
  { character: 'ピ', romaji: 'pi', pronunciation: 'pi', column: 'i', row: 'p', type: 'katakana' },
  { character: 'プ', romaji: 'pu', pronunciation: 'pu', column: 'u', row: 'p', type: 'katakana' },
  { character: 'ペ', romaji: 'pe', pronunciation: 'pe', column: 'e', row: 'p', type: 'katakana' },
  { character: 'ポ', romaji: 'po', pronunciation: 'po', column: 'o', row: 'p', type: 'katakana' },
];

// Kombinasi kana (yoon) — mis. キャ kya
export const katakanaYoon: Kana[] = [
  { character: 'キャ', romaji: 'kya', pronunciation: 'kya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'キュ', romaji: 'kyu', pronunciation: 'kyu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'キョ', romaji: 'kyo', pronunciation: 'kyo', column: 'o', row: 'y', type: 'katakana' },
  { character: 'シャ', romaji: 'sha', pronunciation: 'sha', column: 'a', row: 'y', type: 'katakana' },
  { character: 'シュ', romaji: 'shu', pronunciation: 'shu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'ショ', romaji: 'sho', pronunciation: 'sho', column: 'o', row: 'y', type: 'katakana' },
  { character: 'チャ', romaji: 'cha', pronunciation: 'cha', column: 'a', row: 'y', type: 'katakana' },
  { character: 'チュ', romaji: 'chu', pronunciation: 'chu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'チョ', romaji: 'cho', pronunciation: 'cho', column: 'o', row: 'y', type: 'katakana' },
  { character: 'ニャ', romaji: 'nya', pronunciation: 'nya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'ニュ', romaji: 'nyu', pronunciation: 'nyu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'ニョ', romaji: 'nyo', pronunciation: 'nyo', column: 'o', row: 'y', type: 'katakana' },
  { character: 'ヒャ', romaji: 'hya', pronunciation: 'hya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'ヒュ', romaji: 'hyu', pronunciation: 'hyu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'ヒョ', romaji: 'hyo', pronunciation: 'hyo', column: 'o', row: 'y', type: 'katakana' },
  { character: 'ミャ', romaji: 'mya', pronunciation: 'mya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'ミュ', romaji: 'myu', pronunciation: 'myu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'ミョ', romaji: 'myo', pronunciation: 'myo', column: 'o', row: 'y', type: 'katakana' },
  { character: 'リャ', romaji: 'rya', pronunciation: 'rya', column: 'a', row: 'y', type: 'katakana' },
  { character: 'リュ', romaji: 'ryu', pronunciation: 'ryu', column: 'u', row: 'y', type: 'katakana' },
  { character: 'リョ', romaji: 'ryo', pronunciation: 'ryo', column: 'o', row: 'y', type: 'katakana' },
];

// Gabungan semua katakana
export const allKatakana: Kana[] = [
  ...katakana,
  ...katakanaDakuten,
  ...katakanaHandakuten,
  ...katakanaYoon,
];
