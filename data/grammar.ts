// Pola tata bahasa JLPT N5 — dasar tata bahasa Jepang
export type GrammarPattern = {
  id: string;
  title: string;           // judul pola, mis. "Partikel は (wa)"
  pattern: string;         // struktur pola, mis. "〜は〜です"
  meaning: string;         // penjelasan dalam bahasa Indonesia
  examples: {
    japanese: string;
    reading: string;
    meaning: string;
  }[];
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: GrammarCategory;
};

export type GrammarCategory =
  | 'partikel' | 'kopula' | 'adjektiva' | 'verba'
  | 'tenses' | 'pertanyaan' | 'negatif' | 'permintaan'
  | 'keinginan' | 'saran' | 'kondisional' | 'pasif';

export const grammarPatterns: GrammarPattern[] = [
  {
    id: 'n5-wa-topic',
    title: 'Partikel は (wa) — Topik Kalimat',
    pattern: 'A は B です',
    meaning: 'Partikel "は" menandai topik kalimat. "です" adalah kopula (seperti "adalah"). Digunakan untuk menyatakan A adalah B.',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: '私は学生です。', reading: 'わたしはがくせいです。', meaning: 'Saya adalah pelajar.' },
      { japanese: 'これは本です。', reading: 'これはほんです。', meaning: 'Ini adalah buku.' },
    ],
  },
  {
    id: 'n5-ga-subject',
    title: 'Partikel が (ga) — Subjek',
    pattern: 'A が B です',
    meaning: 'Partikel "が" menandai subjek baru atau informasi baru. Berbeda dari "は" yang menandai topik yang sudah dikenal.',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: '猫がいます。', reading: 'ねこがいます。', meaning: 'Ada kucing.' },
      { japanese: '何がありますか。', reading: 'なにがありますか。', meaning: 'Ada apa?' },
    ],
  },
  {
    id: 'n5-no-possession',
    title: 'Partikel の (no) — Kepemilikan',
    pattern: 'A の B',
    meaning: 'Partikel "の" menyatakan kepemilikan atau hubungan. A milik B, atau kata depan "dari/di".',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: '私の本です。', reading: 'わたしのほんです。', meaning: 'Ini buku saya.' },
      { japanese: '日本語の先生', reading: 'にほんごのせんせい', meaning: 'Guru bahasa Jepang' },
    ],
  },
  {
    id: 'n5-wo-object',
    title: 'Partikel を (wo) — Objek',
    pattern: 'A を B（verba)',
    meaning: 'Partikel "を" menandai objek langsung dari verba transitif (objek yang dikenai tindakan).',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: 'ご飯を食べます。', reading: 'ごはんをたべます。', meaning: 'Saya makan nasi.' },
      { japanese: '本を読みます。', reading: 'ほんをよみます。', meaning: 'Saya membaca buku.' },
    ],
  },
  {
    id: 'n5-ni-target',
    title: 'Partikel に (ni) — Tujuan/Waktu',
    pattern: 'A に B',
    meaning: 'Partikel "に" menyatakan tujuan, lokasi tujuan, atau waktu spesifik. Juga untuk menyatakan keberadaan.',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: '学校に行きます。', reading: 'がっこうにいきます。', meaning: 'Saya pergi ke sekolah.' },
      { japanese: '三時に会いましょう。', reading: 'さんじにあいましょう。', meaning: 'Mari bertemu jam tiga.' },
    ],
  },
  {
    id: 'n5-de-means',
    title: 'Partikel で (de) — Alat/Tempat',
    pattern: 'A で B',
    meaning: 'Partikel "で" menyatakan alat yang dipakai, cara, atau tempat suatu tindakan terjadi.',
    jlpt: 'N5',
    category: 'partikel',
    examples: [
      { japanese: '電車で行きます。', reading: 'でんしゃでいきます。', meaning: 'Saya pergi dengan kereta.' },
      { japanese: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', meaning: 'Saya belajar di perpustakaan.' },
    ],
  },
  {
    id: 'n5-desu-copula',
    title: 'です (desu) — Kopula (adalah)',
    pattern: '〜は〜です',
    meaning: '"です" adalah kopula yang setara dengan "adalah". Bentuk sopan afirmatif. Digunakan dengan kata benda dan kata sifat-na.',
    jlpt: 'N5',
    category: 'kopula',
    examples: [
      { japanese: '私は日本人です。', reading: 'わたしはにほんじんです。', meaning: 'Saya adalah orang Jepang.' },
      { japanese: '今日は月曜日です。', reading: 'きょうはげつようびです。', meaning: 'Hari ini Senin.' },
    ],
  },
  {
    id: 'n5-ja-nai-negative',
    title: 'じゃありません (ja arimasen) — Negatif',
    pattern: '〜は〜じゃありません / ではありません',
    meaning: 'Bentuk negatif dari "です". Menyatakan "bukan". "じゃありません" adalah bentuk santai, "ではありません" lebih formal.',
    jlpt: 'N5',
    category: 'negatif',
    examples: [
      { japanese: '私は学生じゃありません。', reading: 'わたしはがくせいじゃありません。', meaning: 'Saya bukan pelajar.' },
      { japanese: 'これは本ではありません。', reading: 'これはほんではありません。', meaning: 'Ini bukan buku.' },
    ],
  },
  {
    id: 'n5-ka-question',
    title: 'か (ka) — Partikel Pertanyaan',
    pattern: '〜か。',
    meaning: 'Partikel "か" di akhir kalimat mengubah kalimat pernyataan menjadi pertanyaan. Tidak perlu tanda tanya.',
    jlpt: 'N5',
    category: 'pertanyaan',
    examples: [
      { japanese: '学生ですか。', reading: 'がくせいですか。', meaning: 'Apakah (dia) pelajar?' },
      { japanese: '何ですか。', reading: 'なんですか。', meaning: 'Apa ini?' },
    ],
  },
  {
    id: 'n5-masu-form',
    title: '〜ます (masu) — Verba Sopan',
    pattern: 'Verba (stem) + ます',
    meaning: 'Bentuk verba sopan masa kini/akan datang. Ubah bentuk kamus menjadi stem + ます. Afirmatif positif.',
    jlpt: 'N5',
    category: 'verba',
    examples: [
      { japanese: '食べます', reading: 'たべます', meaning: 'makan (sopan)' },
      { japanese: '行きます', reading: 'いきます', meaning: 'pergi (sopan)' },
    ],
  },
  {
    id: 'n5-masen-negative',
    title: '〜ません (masen) — Verba Negatif',
    pattern: 'Verba (stem) + ません',
    meaning: 'Bentuk verba sopan negatif. Menyatakan "tidak melakukan". Bentuk negatif dari 〜ます.',
    jlpt: 'N5',
    category: 'negatif',
    examples: [
      { japanese: '食べません。', reading: 'たべません。', meaning: 'Saya tidak makan.' },
      { japanese: '行きません。', reading: 'いきません。', meaning: 'Saya tidak pergi.' },
    ],
  },
  {
    id: 'n5-mashita-past',
    title: '〜ました (mashita) — Verba Lampau',
    pattern: 'Verba (stem) + ました',
    meaning: 'Bentuk verba sopan lampau (sudah terjadi). Bentuk positif masa lalu dari 〜ます.',
    jlpt: 'N5',
    category: 'tenses',
    examples: [
      { japanese: '食べました。', reading: 'たべました。', meaning: 'Saya sudah makan.' },
      { japanese: '行きました。', reading: 'いきました。', meaning: 'Saya sudah pergi.' },
    ],
  },
  {
    id: 'n5-tai-desire',
    title: '〜たい (tai) — Keinginan',
    pattern: 'Verba (stem) + たいです',
    meaning: 'Menyatakan keinginan untuk melakukan sesuatu. Hanya untuk diri sendiri (untuk orang lain pakai たがる).',
    jlpt: 'N5',
    category: 'keinginan',
    examples: [
      { japanese: '日本へ行きたいです。', reading: 'にほんへいきたいです。', meaning: 'Saya ingin pergi ke Jepang.' },
      { japanese: '水が飲みたいです。', reading: 'みずがのみたいです。', meaning: 'Saya ingin minum air.' },
    ],
  },
  {
    id: 'n5-i-adjective',
    title: 'Kata Sifat-i (い-adjective)',
    pattern: 'い-sifat + です',
    meaning: 'Kata sifat yang berakhiran い. Langsung + です untuk bentuk sopan. Contoh: 大きい (besar), いい (bagus).',
    jlpt: 'N5',
    category: 'adjektiva',
    examples: [
      { japanese: '大きい車です。', reading: 'おおきいくるまです。', meaning: 'Mobil yang besar.' },
      { japanese: 'いい天気です。', reading: 'いいてんきです。', meaning: 'Cuaca yang bagus.' },
    ],
  },
  {
    id: 'n5-na-adjective',
    title: 'Kata Sifat-na (な-adjective)',
    pattern: 'な-sifat + な + kata benda',
    meaning: 'Kata sifat yang memakai "な" sebelum kata benda. Contoh: 元気 (sehat), 静か (tenang).',
    jlpt: 'N5',
    category: 'adjektiva',
    examples: [
      { japanese: '元気な人です。', reading: 'げんきなひとです。', meaning: 'Orang yang sehat.' },
      { japanese: '静かな部屋です。', reading: 'しずかなへやです。', meaning: 'Kamar yang tenang.' },
    ],
  },
  {
    id: 'n5-te-form',
    title: 'Bentuk 〜て (te-form)',
    pattern: 'Verba (te-form) + ...',
    meaning: 'Bentuk dasar untuk menyambung kalimat, meminta sesuatu (〜てください), atau menyatakan urutan tindakan.',
    jlpt: 'N5',
    category: 'verba',
    examples: [
      { japanese: '見てください。', reading: 'みてください。', meaning: 'Tolong lihat.' },
      { japanese: '起きて、顔を洗います。', reading: 'おきて、かおをあらいます。', meaning: 'Bangun, lalu cuci muka.' },
    ],
  },
  {
    id: 'n5-kudasai-request',
    title: '〜てください (te kudasai) — Permintaan',
    pattern: 'Verba (te-form) + ください',
    meaning: 'Meminta seseorang untuk melakukan sesuatu dengan sopan. "Tolong lakukan...".',
    jlpt: 'N5',
    category: 'permintaan',
    examples: [
      { japanese: '教えてください。', reading: 'おしえてください。', meaning: 'Tolong ajari saya.' },
      { japanese: '待ってください。', reading: 'まってください。', meaning: 'Tolong tunggu.' },
    ],
  },
];

// Helper: ambil pola berdasarkan kategori
export const getGrammarByCategory = (cat: GrammarCategory) =>
  grammarPatterns.filter((g) => g.category === cat);
