# Manabu (学ぶ)

> Aplikasi Belajar Bahasa Jepang untuk Android — 100% Gratis & Sumber Terbuka

**Manabu** (学ぶ) berarti "belajar" dalam bahasa Jepang. Aplikasi Android ini menggabungkan SRS (Spaced Repetition System), gamifikasi, dan latihan interaktif untuk membantu Anda menguasai Hiragana, Katakana, Kanji, dan kosakata bahasa Jepang — tanpa biaya apapun.

---

## 🚀 Cara Menjalankan

### Opsi 1: Prototipe Cepat (Browser)
File `index.html` adalah prototipe interaktif yang langsung jalan di browser — tanpa install apa-apa:
```bash
# Kloning lalu buka index.html di browser, atau:
python3 -m http.server 8000   # lalu buka http://localhost:8000
```
🔗 Live demo: https://morrettwi.github.io/manabu/

### Opsi 2: Aplikasi Lengkap (Expo — Android/Web)
Aplikasi React Native sungguhan dengan semua fitur:

```bash
# 1. Kloning
git clone https://github.com/morrettwi/manabu.git
cd manabu

# 2. Install dependensi
npm install        # atau: pnpm install

# 3. Jalankan
npx expo start
```

Setelah server berjalan, pilih cara menjalankan:
- **Telepon Android**: Install aplikasi **Expo Go** dari Play Store, lalu scan kode QR yang muncul
- **Web**: Tekan `w` di terminal untuk membuka di browser
- **Emulator**: Tekan `a` untuk Android (butuh Android Studio)

> 💡 **Untuk pemula**: Cara paling mudah adalah install **Expo Go** di HP Android, lalu scan QR code. Tidak perlu coding!

---

## 📱 Layar Aplikasi

| Layar | Fungsi |
|-------|--------|
| 🏠 **Beranda** | Dashboard: target harian, streak, XP, level, dan daftar pelajaran |
| あ **Kana** | Grid Hiragana & Katakana lengkap — ketuk huruf untuk dengar sebutan (TTS) |
| 🎴 **SRS** | Flashcard dengan animasi flip 3D + penilaian (Ulang/Sulit/Baik/Mudah) |
| ✍️ **Kuis** | Pilihan ganda dengan timer 15 detik, bonus XP kecepatan, bintang penilaian |
| 📊 **Statistik** | Grafik aktivitas mingguan, progres SRS, dan lencana pencapaian |

## ✨ Fitur Utama

1. **Sistem Kana Interaktif** — 46+ huruf Hiragana & Katakana (gojuon, dakuten, handakuten, yoon) dengan audio
2. **Pembelajaran Kanji JLPT N5** — 80 kanji dasar dengan on'yomi, kun'yomi, arti, dan contoh
3. **Sistem Pengulangan Berjarak (SRS)** — Algoritma SM-2 (SuperMemo 2) untuk hafalan jangka panjang
4. **Kosakata** — 90+ kata JLPT N5 dikelompokkan per kategori (keluarga, makanan, sekolah, dll)
5. **Tata Bahasa** — 17 pola tata bahasa dasar dengan contoh kalimat
6. **Gamifikasi** — XP, level, streak harian, dan 10 lencana pencapaian
7. **Text-to-Speech** — Sebutan bahasa Jepang native via expo-speech
8. **Mode Offline** — Semua data tersimpan lokal dengan AsyncStorage
9. **Dark Mode** — Antarmuka gelap yang nyaman di mata

## 📁 Struktur Proyek

```
manabu/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx            # Root layout (provider, TTS init)
│   └── (tabs)/                # Tab navigator
│       ├── _layout.tsx        # Tab bar dengan 5 menu
│       ├── index.tsx          # 🏠 Beranda (dashboard)
│       ├── kana.tsx           # あ Kana (grid + audio)
│       ├── srs.tsx            # 🎴 SRS (flashcard)
│       ├── kuis.tsx           # ✍️ Kuis (pilihan ganda)
│       └── stats.tsx          # 📊 Statistik
├── components/                # Komponen UI reusable
│   ├── Flashcard.tsx          # Kartu dengan animasi flip 3D
│   ├── KanaCard.tsx           # Kartu huruf kana
│   ├── ProgressBar.tsx        # Bar progres animasi
│   ├── RatingButtons.tsx      # Tombol penilaian SRS
│   ├── ScreenContainer.tsx    # Layout wrapper
│   └── StatCard.tsx           # Kartu statistik
├── data/                      # Database pembelajaran
│   ├── hiragana.ts            # 46+ hiragana (gojuon, dakuten, handakuten)
│   ├── katakana.ts            # 46+ katakana + yoon
│   ├── kanji.ts               # 80 kanji JLPT N5
│   ├── vocabulary.ts          # 90+ kosakata JLPT N5
│   └── grammar.ts             # 17 pola tata bahasa
├── lib/                        # Logika & utilitas
│   ├── srs.ts                  # Engine algoritma SM-2
│   ├── storage.ts              # Wrapper AsyncStorage
│   ├── tts.ts                  # Text-to-Speech
│   ├── theme.ts                # Palet warna & konstanta
│   ├── achievements.ts         # Sistem lencana
│   └── useSRS.ts               # React hook untuk SRS
├── assets/images/             # Ikon & splash screen
├── index.html                 # Prototipe interaktif (Fase 2)
├── app.json                   # Konfigurasi Expo
├── package.json               # Dependensi
└── tsconfig.json              # Konfigurasi TypeScript
```

## 🛠️ Teknologi (100% Gratis)

| Teknologi | Kegunaan |
|-----------|----------|
| React Native + Expo | Framework utama aplikasi Android |
| Expo Router | Navigasi file-based (modern) |
| expo-speech | Text-to-Speech bahasa Jepang |
| react-native-reanimated | Animasi halus (flashcard flip) |
| AsyncStorage | Penyimpanan lokal (offline) |
| @expo/vector-icons | Ikon |
| TypeScript | Type safety |
| GitHub Pages | Hosting prototipe |

## 🧠 Algoritma SRS (SM-2)

Manabu menggunakan algoritma **SuperMemo 2 (SM-2)** yang terbukti efektif untuk hafalan jangka panjang:

```
Setiap kartu memiliki:
- ease: tingkat kelancangan (mulai 2.5)
- interval: hari sampai ulangan berikutnya
- repetitions: jumlah pengulangan sukses berturut

Saat dijawab:
- Ulang (salah)    → interval = 1 hari, ulang besok
- Sulit (benar)    → interval pendek, ease turun
- Baik (benar)     → interval normal
- Mudah (benar)    → interval panjang, ease naik
```

## 🗺️ Roadmap

- [x] **Fase 1: Penelitian & Konsep** — Pemilihan teknologi & sumber data
- [x] **Fase 2: Prototipe Interaktif** — Prototipe fungsional (`index.html`)
- [x] **Fase 3: Pengembangan Aplikasi** — React Native + Expo (5 layar + SRS + data)
- [ ] **Fase 4: Beta & Uji Pengguna** — Distribusi via Expo + EAS Build
- [ ] **Fase 5: Rilis di Google Play** — Publikasi gratis

### Rencana Selanjutnya
- [ ] Layar Kanji lengkap (N5–N1)
- [ ] Latihan menulis dengan stroke order (KanjiVG)
- [ ] Mode listening dengan audio native
- [ ] Tata bahasa interaktif dengan latihan
- [ ] Widget layar utama Android
- [ ] Notifikasi pengingat belajar
- [ ] Sinkronisasi cloud (opsional)

## 📚 Sumber Data Gratis

| Sumber | Deskripsi |
|--------|-----------|
| [JMDict / EDICT](https://www.edrdg.org/jmdict/j_jmdict.html) | Database kosakata Jepang (180,000+ entri) |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) | Database 13,000+ kanji |
| [Tatoeba](https://tatoeba.org/en) | Database kalimat contoh multibahasa |
| [KanjiVG](https://kanjivg.tagaini.net/) | SVG animasi stroke order |

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan.

## 🤝 Berkontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

---

Dibangun dengan ❤️ untuk pembelajar bahasa Jepang di mana pun.
