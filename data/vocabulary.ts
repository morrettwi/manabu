// Kosakata JLPT N5 — kata-kata dasar yang paling sering dipakai
// Sumber: JMDict/EDICT (lisensi CC-BY-SA) — disederhanakan
export type Word = {
  japanese: string;      // kata Jepang, mis. 学生
  reading: string;        // cara baca kana, mis. がくせい
  romaji: string;        // romanisasi, mis. gakusei
  meaning: string;       // arti dalam bahasa Indonesia
  partOfSpeech: PartOfSpeech;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: WordCategory;
};

export type PartOfSpeech =
  | 'noun' | 'verb' | 'i-adjective' | 'na-adjective'
  | 'adverb' | 'particle' | 'conjunction' | 'pronoun'
  | 'counter' | 'interjection';

export type WordCategory =
  | 'pergaulan' | 'keluarga' | 'angka' | 'waktu'
  | 'makanan' | 'sekolah' | 'pekerjaan' | 'rumah'
  | 'alam' | 'tubuh' | 'warna' | 'arah' | 'transportasi' | 'sifat';

export const vocabulary: Word[] = [
  // --- Pergaulan / Sapaan ---
  { japanese: 'こんにちは', reading: 'こんにちは', romaji: 'konnichiwa', meaning: 'halo (siang)', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'ありがとう', reading: 'ありがとう', romaji: 'arigatou', meaning: 'terima kasih', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'すみません', reading: 'すみません', romaji: 'sumimasen', meaning: 'maaf / permisi', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'おはよう', reading: 'おはよう', romaji: 'ohayou', meaning: 'selamat pagi (santai)', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'こんばんは', reading: 'こんばんは', romaji: 'konbanwa', meaning: 'selamat malam', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'さようなら', reading: 'さようなら', romaji: 'sayounara', meaning: 'selamat tinggal', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'はい', reading: 'はい', romaji: 'hai', meaning: 'ya / betul', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },
  { japanese: 'いいえ', reading: 'いいえ', romaji: 'iie', meaning: 'tidak', partOfSpeech: 'interjection', jlpt: 'N5', category: 'pergaulan' },

  // --- Keluarga ---
  { japanese: '父', reading: 'ちち', romaji: 'chichi', meaning: 'ayah (punya sendiri)', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '母', reading: 'はは', romaji: 'haha', meaning: 'ibu (punya sendiri)', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: 'お父さん', reading: 'おとうさん', romaji: 'otousan', meaning: 'ayah', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: 'お母さん', reading: 'おかあさん', romaji: 'okaasan', meaning: 'ibu', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '兄', reading: 'あに', romaji: 'ani', meaning: 'kakak laki-laki', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '姉', reading: 'あね', romaji: 'ane', meaning: 'kakak perempuan', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '弟', reading: 'おとうと', romaji: 'otouto', meaning: 'adik laki-laki', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '妹', reading: 'いもうと', romaji: 'imouto', meaning: 'adik perempuan', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },
  { japanese: '家族', reading: 'かぞく', romaji: 'kazoku', meaning: 'keluarga', partOfSpeech: 'noun', jlpt: 'N5', category: 'keluarga' },

  // --- Angka ---
  { japanese: '一', reading: 'いち', romaji: 'ichi', meaning: 'satu', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '二', reading: 'に', romaji: 'ni', meaning: 'dua', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '三', reading: 'さん', romaji: 'san', meaning: 'tiga', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '四', reading: 'し、よん', romaji: 'shi/yon', meaning: 'empat', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '五', reading: 'ご', romaji: 'go', meaning: 'lima', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '六', reading: 'ろく', romaji: 'roku', meaning: 'enam', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '七', reading: 'しち、なな', romaji: 'shichi/nana', meaning: 'tujuh', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '八', reading: 'はち', romaji: 'hachi', meaning: 'delapan', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '九', reading: 'きゅう', romaji: 'kyuu', meaning: 'sembilan', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },
  { japanese: '十', reading: 'じゅう', romaji: 'juu', meaning: 'sepuluh', partOfSpeech: 'noun', jlpt: 'N5', category: 'angka' },

  // --- Waktu ---
  { japanese: '今日', reading: 'きょう', romaji: 'kyou', meaning: 'hari ini', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '明日', reading: 'あした', romaji: 'ashita', meaning: 'besok', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '昨日', reading: 'きのう', romaji: 'kinou', meaning: 'kemarin', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '今', reading: 'いま', romaji: 'ima', meaning: 'sekarang', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '朝', reading: 'あさ', romaji: 'asa', meaning: 'pagi', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '昼', reading: 'ひる', romaji: 'hiru', meaning: 'siang', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '夜', reading: 'よる', romaji: 'yoru', meaning: 'malam', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '今週', reading: 'こんしゅう', romaji: 'konshuu', meaning: 'minggu ini', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '来週', reading: 'らいしゅう', romaji: 'raishuu', meaning: 'minggu depan', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },
  { japanese: '先週', reading: 'せんしゅう', romaji: 'senshuu', meaning: 'minggu lalu', partOfSpeech: 'noun', jlpt: 'N5', category: 'waktu' },

  // --- Makanan ---
  { japanese: 'ご飯', reading: 'ごはん', romaji: 'gohan', meaning: 'nasi / makan', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: '水', reading: 'みず', romaji: 'mizu', meaning: 'air', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: 'お茶', reading: 'おちゃ', romaji: 'ocha', meaning: 'teh', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: 'パン', reading: 'パン', romaji: 'pan', meaning: 'roti', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: '肉', reading: 'にく', romaji: 'niku', meaning: 'daging', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: '魚', reading: 'さかな', romaji: 'sakana', meaning: 'ikan', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: '野菜', reading: 'やさい', romaji: 'yasai', meaning: 'sayur', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },
  { japanese: '果物', reading: 'くだもの', romaji: 'kudamono', meaning: 'buah', partOfSpeech: 'noun', jlpt: 'N5', category: 'makanan' },

  // --- Sekolah ---
  { japanese: '学生', reading: 'がくせい', romaji: 'gakusei', meaning: 'pelajar', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '先生', reading: 'せんせい', romaji: 'sensei', meaning: 'guru', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '学校', reading: 'がっこう', romaji: 'gakkou', meaning: 'sekolah', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '大学', reading: 'だいがく', romaji: 'daigaku', meaning: 'universitas', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '本', reading: 'ほん', romaji: 'hon', meaning: 'buku', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '教科書', reading: 'きょうかしょ', romaji: 'kyoukasho', meaning: 'buku pelajaran', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '勉強', reading: 'べんきょう', romaji: 'benkyou', meaning: 'belajar', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },
  { japanese: '試験', reading: 'しけん', romaji: 'shiken', meaning: 'ujian', partOfSpeech: 'noun', jlpt: 'N5', category: 'sekolah' },

  // --- Pekerjaan ---
  { japanese: '仕事', reading: 'しごと', romaji: 'shigoto', meaning: 'pekerjaan', partOfSpeech: 'noun', jlpt: 'N5', category: 'pekerjaan' },
  { japanese: '会社', reading: 'かいしゃ', romaji: 'kaisha', meaning: 'perusahaan', partOfSpeech: 'noun', jlpt: 'N5', category: 'pekerjaan' },
  { japanese: '会社員', reading: 'かいしゃいん', romaji: 'kaishain', meaning: 'karyawan', partOfSpeech: 'noun', jlpt: 'N5', category: 'pekerjaan' },
  { japanese: '医者', reading: 'いしゃ', romaji: 'isha', meaning: 'dokter', partOfSpeech: 'noun', jlpt: 'N5', category: 'pekerjaan' },
  { japanese: '犬', reading: 'いぬ', romaji: 'inu', meaning: 'anjing', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },

  // --- Rumah ---
  { japanese: '家', reading: 'いえ', romaji: 'ie', meaning: 'rumah', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: '部屋', reading: 'へや', romaji: 'heya', meaning: 'kamar', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: 'ドア', reading: 'ドア', romaji: 'doa', meaning: 'pintu', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: '窓', reading: 'まど', romaji: 'mado', meaning: 'jendela', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: '机', reading: 'つくえ', romaji: 'tsukue', meaning: 'meja', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: '椅子', reading: 'いす', romaji: 'isu', meaning: 'kursi', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },
  { japanese: 'ベッド', reading: 'ベッド', romaji: 'beddo', meaning: 'tempat tidur', partOfSpeech: 'noun', jlpt: 'N5', category: 'rumah' },

  // --- Alam ---
  { japanese: '山', reading: 'やま', romaji: 'yama', meaning: 'gunung', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '川', reading: 'かわ', romaji: 'kawa', meaning: 'sungai', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '海', reading: 'うみ', romaji: 'umi', meaning: 'laut', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '空', reading: 'そら', romaji: 'sora', meaning: 'langit', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '花', reading: 'はな', romaji: 'hana', meaning: 'bunga', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '木', reading: 'き', romaji: 'ki', meaning: 'pohon', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '雨', reading: 'あめ', romaji: 'ame', meaning: 'hujan', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },
  { japanese: '雪', reading: 'ゆき', romaji: 'yuki', meaning: 'salju', partOfSpeech: 'noun', jlpt: 'N5', category: 'alam' },

  // --- Tubuh ---
  { japanese: '頭', reading: 'あたま', romaji: 'atama', meaning: 'kepala', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },
  { japanese: '手', reading: 'て', romaji: 'te', meaning: 'tangan', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },
  { japanese: '足', reading: 'あし', romaji: 'ashi', meaning: 'kaki', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },
  { japanese: '目', reading: 'め', romaji: 'me', meaning: 'mata', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },
  { japanese: '耳', reading: 'みみ', romaji: 'mimi', meaning: 'telinga', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },
  { japanese: '口', reading: 'くち', romaji: 'kuchi', meaning: 'mulut', partOfSpeech: 'noun', jlpt: 'N5', category: 'tubuh' },

  // --- Warna ---
  { japanese: '赤', reading: 'あか', romaji: 'aka', meaning: 'merah', partOfSpeech: 'noun', jlpt: 'N5', category: 'warna' },
  { japanese: '青', reading: 'あお', romaji: 'ao', meaning: 'biru', partOfSpeech: 'noun', jlpt: 'N5', category: 'warna' },
  { japanese: '白', reading: 'しろ', romaji: 'shiro', meaning: 'putih', partOfSpeech: 'noun', jlpt: 'N5', category: 'warna' },
  { japanese: '黒', reading: 'くろ', romaji: 'kuro', meaning: 'hitam', partOfSpeech: 'noun', jlpt: 'N5', category: 'warna' },

  // --- Arah ---
  { japanese: '上', reading: 'うえ', romaji: 'ue', meaning: 'atas', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },
  { japanese: '下', reading: 'した', romaji: 'shita', meaning: 'bawah', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },
  { japanese: '左', reading: 'ひだり', romaji: 'hidari', meaning: 'kiri', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },
  { japanese: '右', reading: 'みぎ', romaji: 'migi', meaning: 'kanan', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },
  { japanese: '中', reading: 'なか', romaji: 'naka', meaning: 'dalam', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },
  { japanese: '外', reading: 'そと', romaji: 'soto', meaning: 'luar', partOfSpeech: 'noun', jlpt: 'N5', category: 'arah' },

  // --- Transportasi ---
  { japanese: '電車', reading: 'でんしゃ', romaji: 'densha', meaning: 'kereta api', partOfSpeech: 'noun', jlpt: 'N5', category: 'transportasi' },
  { japanese: '車', reading: 'くるま', romaji: 'kuruma', meaning: 'mobil', partOfSpeech: 'noun', jlpt: 'N5', category: 'transportasi' },
  { japanese: 'バス', reading: 'バス', romaji: 'basu', meaning: 'bus', partOfSpeech: 'noun', jlpt: 'N5', category: 'transportasi' },
  { japanese: '自転車', reading: 'じてんしゃ', romaji: 'jitensha', meaning: 'sepeda', partOfSpeech: 'noun', jlpt: 'N5', category: 'transportasi' },
  { japanese: '飛行機', reading: 'ひこうき', romaji: 'hikouki', meaning: 'pesawat', partOfSpeech: 'noun', jlpt: 'N5', category: 'transportasi' },

  // --- Sifat (kata sifat) ---
  { japanese: '大きい', reading: 'おおきい', romaji: 'ookii', meaning: 'besar', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '小さい', reading: 'ちいさい', romaji: 'chiisai', meaning: 'kecil', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '新しい', reading: 'あたらしい', romaji: 'atarashii', meaning: 'baru', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '古い', reading: 'ふるい', romaji: 'furui', meaning: 'lama (benda)', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '高い', reading: 'たかい', romaji: 'takai', meaning: 'tinggi / mahal', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '安い', reading: 'やすい', romaji: 'yasui', meaning: 'murah', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '良い', reading: 'いい', romaji: 'ii', meaning: 'bagus', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '暑い', reading: 'あつい', romaji: 'atsui', meaning: 'panas (cuaca)', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '寒い', reading: 'さむい', romaji: 'samui', meaning: 'dingin', partOfSpeech: 'i-adjective', jlpt: 'N5', category: 'sifat' },
  { japanese: '元気', reading: 'げんき', romaji: 'genki', meaning: 'sehat / bersemangat', partOfSpeech: 'na-adjective', jlpt: 'N5', category: 'sifat' },

  // --- Kata kerja dasar ---
  { japanese: '食べる', reading: 'たべる', romaji: 'taberu', meaning: 'makan', partOfSpeech: 'verb', jlpt: 'N5', category: 'rumah' },
  { japanese: '飲む', reading: 'のむ', romaji: 'nomu', meaning: 'minum', partOfSpeech: 'verb', jlpt: 'N5', category: 'makanan' },
  { japanese: '行く', reading: 'いく', romaji: 'iku', meaning: 'pergi', partOfSpeech: 'verb', jlpt: 'N5', category: 'transportasi' },
  { japanese: '来る', reading: 'くる', romaji: 'kuru', meaning: 'datang', partOfSpeech: 'verb', jlpt: 'N5', category: 'transportasi' },
  { japanese: '見る', reading: 'みる', romaji: 'miru', meaning: 'melihat', partOfSpeech: 'verb', jlpt: 'N5', category: 'sekolah' },
  { japanese: '聞く', reading: 'きく', romaji: 'kiku', meaning: 'mendengar / bertanya', partOfSpeech: 'verb', jlpt: 'N5', category: 'sekolah' },
  { japanese: '話す', reading: 'はなす', romaji: 'hanasu', meaning: 'berbicara', partOfSpeech: 'verb', jlpt: 'N5', category: 'pergaulan' },
  { japanese: '読む', reading: 'よむ', romaji: 'yomu', meaning: 'membaca', partOfSpeech: 'verb', jlpt: 'N5', category: 'sekolah' },
  { japanese: '書く', reading: 'かく', romaji: 'kaku', meaning: 'menulis', partOfSpeech: 'verb', jlpt: 'N5', category: 'sekolah' },
  { japanese: 'する', reading: 'する', romaji: 'suru', meaning: 'melakukan', partOfSpeech: 'verb', jlpt: 'N5', category: 'pekerjaan' },
];

// Helper: ambil kata berdasarkan kategori
export const getWordsByCategory = (cat: WordCategory) =>
  vocabulary.filter((w) => w.category === cat);

// Helper: ambil kata berdasarkan JLPT level
export const getWordsByJlpt = (level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') =>
  vocabulary.filter((w) => w.jlpt === level);
