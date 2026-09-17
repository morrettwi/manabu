// Tipe data untuk kana (Hiragana & Katakana)
export type Kana = {
  character: string;   // huruf Jepang, mis. あ
  romaji: string;      // romanisasi, mis. a
  pronunciation: string; // cara baca dalam bahasa Indonesia
  column: string;      // kolom vokal: a, i, u, e, o
  row: string;         // baris: vokal, k, s, t, n, h, m, y, r, w
  type: 'hiragana' | 'katakana';
};

// 46 hiragana dasar (gojuon)
export const hiragana: Kana[] = [
  // Baris vokal
  { character: 'あ', romaji: 'a', pronunciation: 'a', column: 'a', row: 'vowel', type: 'hiragana' },
  { character: 'い', romaji: 'i', pronunciation: 'i', column: 'i', row: 'vowel', type: 'hiragana' },
  { character: 'う', romaji: 'u', pronunciation: 'u', column: 'u', row: 'vowel', type: 'hiragana' },
  { character: 'え', romaji: 'e', pronunciation: 'e', column: 'e', row: 'vowel', type: 'hiragana' },
  { character: 'お', romaji: 'o', pronunciation: 'o', column: 'o', row: 'vowel', type: 'hiragana' },
  // Baris K
  { character: 'か', romaji: 'ka', pronunciation: 'ka', column: 'a', row: 'k', type: 'hiragana' },
  { character: 'き', romaji: 'ki', pronunciation: 'ki', column: 'i', row: 'k', type: 'hiragana' },
  { character: 'く', romaji: 'ku', pronunciation: 'ku', column: 'u', row: 'k', type: 'hiragana' },
  { character: 'け', romaji: 'ke', pronunciation: 'ke', column: 'e', row: 'k', type: 'hiragana' },
  { character: 'こ', romaji: 'ko', pronunciation: 'ko', column: 'o', row: 'k', type: 'hiragana' },
  // Baris S
  { character: 'さ', romaji: 'sa', pronunciation: 'sa', column: 'a', row: 's', type: 'hiragana' },
  { character: 'し', romaji: 'shi', pronunciation: 'shi', column: 'i', row: 's', type: 'hiragana' },
  { character: 'す', romaji: 'su', pronunciation: 'su', column: 'u', row: 's', type: 'hiragana' },
  { character: 'せ', romaji: 'se', pronunciation: 'se', column: 'e', row: 's', type: 'hiragana' },
  { character: 'そ', romaji: 'so', pronunciation: 'so', column: 'o', row: 's', type: 'hiragana' },
  // Baris T
  { character: 'た', romaji: 'ta', pronunciation: 'ta', column: 'a', row: 't', type: 'hiragana' },
  { character: 'ち', romaji: 'chi', pronunciation: 'chi', column: 'i', row: 't', type: 'hiragana' },
  { character: 'つ', romaji: 'tsu', pronunciation: 'tsu', column: 'u', row: 't', type: 'hiragana' },
  { character: 'て', romaji: 'te', pronunciation: 'te', column: 'e', row: 't', type: 'hiragana' },
  { character: 'と', romaji: 'to', pronunciation: 'to', column: 'o', row: 't', type: 'hiragana' },
  // Baris N
  { character: 'な', romaji: 'na', pronunciation: 'na', column: 'a', row: 'n', type: 'hiragana' },
  { character: 'に', romaji: 'ni', pronunciation: 'ni', column: 'i', row: 'n', type: 'hiragana' },
  { character: 'ぬ', romaji: 'nu', pronunciation: 'nu', column: 'u', row: 'n', type: 'hiragana' },
  { character: 'ね', romaji: 'ne', pronunciation: 'ne', column: 'e', row: 'n', type: 'hiragana' },
  { character: 'の', romaji: 'no', pronunciation: 'no', column: 'o', row: 'n', type: 'hiragana' },
  // Baris H
  { character: 'は', romaji: 'ha', pronunciation: 'ha', column: 'a', row: 'h', type: 'hiragana' },
  { character: 'ひ', romaji: 'hi', pronunciation: 'hi', column: 'i', row: 'h', type: 'hiragana' },
  { character: 'ふ', romaji: 'fu', pronunciation: 'fu', column: 'u', row: 'h', type: 'hiragana' },
  { character: 'へ', romaji: 'he', pronunciation: 'he', column: 'e', row: 'h', type: 'hiragana' },
  { character: 'ほ', romaji: 'ho', pronunciation: 'ho', column: 'o', row: 'h', type: 'hiragana' },
  // Baris M
  { character: 'ま', romaji: 'ma', pronunciation: 'ma', column: 'a', row: 'm', type: 'hiragana' },
  { character: 'み', romaji: 'mi', pronunciation: 'mi', column: 'i', row: 'm', type: 'hiragana' },
  { character: 'む', romaji: 'mu', pronunciation: 'mu', column: 'u', row: 'm', type: 'hiragana' },
  { character: 'め', romaji: 'me', pronunciation: 'me', column: 'e', row: 'm', type: 'hiragana' },
  { character: 'も', romaji: 'mo', pronunciation: 'mo', column: 'o', row: 'm', type: 'hiragana' },
  // Baris Y
  { character: 'や', romaji: 'ya', pronunciation: 'ya', column: 'a', row: 'y', type: 'hiragana' },
  { character: 'ゆ', romaji: 'yu', pronunciation: 'yu', column: 'u', row: 'y', type: 'hiragana' },
  { character: 'よ', romaji: 'yo', pronunciation: 'yo', column: 'o', row: 'y', type: 'hiragana' },
  // Baris R
  { character: 'ら', romaji: 'ra', pronunciation: 'ra', column: 'a', row: 'r', type: 'hiragana' },
  { character: 'り', romaji: 'ri', pronunciation: 'ri', column: 'i', row: 'r', type: 'hiragana' },
  { character: 'る', romaji: 'ru', pronunciation: 'ru', column: 'u', row: 'r', type: 'hiragana' },
  { character: 'れ', romaji: 're', pronunciation: 're', column: 'e', row: 'r', type: 'hiragana' },
  { character: 'ろ', romaji: 'ro', pronunciation: 'ro', column: 'o', row: 'r', type: 'hiragana' },
  // Baris W & N
  { character: 'わ', romaji: 'wa', pronunciation: 'wa', column: 'a', row: 'w', type: 'hiragana' },
  { character: 'を', romaji: 'wo', pronunciation: 'wo', column: 'o', row: 'w', type: 'hiragana' },
  { character: 'ん', romaji: 'n', pronunciation: 'n', column: 'n', row: 'n', type: 'hiragana' },
];

// Dakuten (ん) — huruf berubah bunyi dengan tanda "
export const hiraganaDakuten: Kana[] = [
  { character: 'が', romaji: 'ga', pronunciation: 'ga', column: 'a', row: 'g', type: 'hiragana' },
  { character: 'ぎ', romaji: 'gi', pronunciation: 'gi', column: 'i', row: 'g', type: 'hiragana' },
  { character: 'ぐ', romaji: 'gu', pronunciation: 'gu', column: 'u', row: 'g', type: 'hiragana' },
  { character: 'げ', romaji: 'ge', pronunciation: 'ge', column: 'e', row: 'g', type: 'hiragana' },
  { character: 'ご', romaji: 'go', pronunciation: 'go', column: 'o', row: 'g', type: 'hiragana' },
  { character: 'ざ', romaji: 'za', pronunciation: 'za', column: 'a', row: 'z', type: 'hiragana' },
  { character: 'じ', romaji: 'ji', pronunciation: 'ji', column: 'i', row: 'z', type: 'hiragana' },
  { character: 'ず', romaji: 'zu', pronunciation: 'zu', column: 'u', row: 'z', type: 'hiragana' },
  { character: 'ぜ', romaji: 'ze', pronunciation: 'ze', column: 'e', row: 'z', type: 'hiragana' },
  { character: 'ぞ', romaji: 'zo', pronunciation: 'zo', column: 'o', row: 'z', type: 'hiragana' },
  { character: 'だ', romaji: 'da', pronunciation: 'da', column: 'a', row: 'd', type: 'hiragana' },
  { character: 'ぢ', romaji: 'di', pronunciation: 'ji', column: 'i', row: 'd', type: 'hiragana' },
  { character: 'づ', romaji: 'du', pronunciation: 'zu', column: 'u', row: 'd', type: 'hiragana' },
  { character: 'で', romaji: 'de', pronunciation: 'de', column: 'e', row: 'd', type: 'hiragana' },
  { character: 'ど', romaji: 'do', pronunciation: 'do', column: 'o', row: 'd', type: 'hiragana' },
  { character: 'ば', romaji: 'ba', pronunciation: 'ba', column: 'a', row: 'b', type: 'hiragana' },
  { character: 'び', romaji: 'bi', pronunciation: 'bi', column: 'i', row: 'b', type: 'hiragana' },
  { character: 'ぶ', romaji: 'bu', pronunciation: 'bu', column: 'u', row: 'b', type: 'hiragana' },
  { character: 'べ', romaji: 'be', pronunciation: 'be', column: 'e', row: 'b', type: 'hiragana' },
  { character: 'ぼ', romaji: 'bo', pronunciation: 'bo', column: 'o', row: 'b', type: 'hiragana' },
];

// Handakuten (ぱ) — hanya untuk baris H, berubah ke P
export const hiraganaHandakuten: Kana[] = [
  { character: 'ぱ', romaji: 'pa', pronunciation: 'pa', column: 'a', row: 'p', type: 'hiragana' },
  { character: 'ぴ', romaji: 'pi', pronunciation: 'pi', column: 'i', row: 'p', type: 'hiragana' },
  { character: 'ぷ', romaji: 'pu', pronunciation: 'pu', column: 'u', row: 'p', type: 'hiragana' },
  { character: 'ぺ', romaji: 'pe', pronunciation: 'pe', column: 'e', row: 'p', type: 'hiragana' },
  { character: 'ぽ', romaji: 'po', pronunciation: 'po', column: 'o', row: 'p', type: 'hiragana' },
];

// Gabungan semua hiragana
export const allHiragana: Kana[] = [
  ...hiragana,
  ...hiraganaDakuten,
  ...hiraganaHandakuten,
];
