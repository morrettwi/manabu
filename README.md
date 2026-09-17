# Manabu (学ぶ)

> Aplikasi Belajar Bahasa Jepang untuk Android — 100% Gratis & Sumber Terbuka

**Manabu** (学ぶ) berarti "belajar" dalam bahasa Jepang. Aplikasi Android ini menggabungkan SRS (Spaced Repetition System), gamifikasi, dan latihan interaktif untuk membantu Anda menguasai Hiragana, Katakana, Kanji, dan kosakata bahasa Jepang — tanpa biaya apapun.

## 📱 Prototipe Interaktif

File `index.html` adalah **prototipe fungsional** yang dapat langsung dicoba di browser. Buka file tersebut untuk mencoba:

| Layar | Fungsi |
|-------|--------|
| 🏠 **Beranda** | Dashboard dengan target harian, streak, XP, dan daftar pelajaran |
| あ **Belajar Kana** | Grid Hiragana & Katakana lengkap — ketik untuk dengar sebutan (Text-to-Speech) |
| 🎴 **Kartu SRS** | Flashcard dengan animasi flip 3D dan sistem penilaian SRS |
| ✍️ **Kuis** | Kuis pilihan ganda dengan timer 15 detik, skor, dan umpan balik |
| 📊 **Statistik** | Grafik aktivitas mingguan, kartu yang dikuasai, dan sistem pencapaian |

## ✨ Fitur Utama

1. **Sistem Kana Interaktif** — 46 huruf Hiragana & Katakana dengan stroke order, audio native, latihan menulis
2. **Pembelajaran Kanji JLPT** — 2,136 kanji Jouyou dengan makna, on'yomi & kun'yomi, JLPT N5–N1
3. **Sistem Pengulangan Berjarak (SRS)** — Algoritma SM-2 untuk hafalan jangka panjang
4. **Kosakata** — 10,000+ kata dengan terjemahan, contoh kalimat, dan audio
5. **Tata Bahasa Terstruktur** — 200+ pola tata bahasa dengan penjelasan dan latihan
6. **Latihan Listening** — Audio native speaker dengan berbagai kecepatan
7. **Gamifikasi** — XP, level, streak harian, dan lencana pencapaian
8. **Widget & Notifikasi** — Widget layar utama Android dan notifikasi cerdas
9. **Mode Offline Penuh** — Semua data tersimpan secara lokal

## 🛠️ Teknologi (100% Gratis)

| Teknologi | Kegunaan |
|-----------|----------|
| React Native + Expo | Framework utama untuk membangun aplikasi Android |
| Android Studio | IDE & emulator Android |
| Firebase (Spark Plan) | Autentikasi, cloud sync, storage (tier gratis) |
| SQLite / WatermelonDB | Database lokal untuk mode offline |
| Android TTS Engine | Text-to-Speech untuk sebutan bahasa Jepang |
| KANJIDIC2 + JMDict | Database kanji & kosakata sumber terbuka |
| GitHub + GitHub Actions | Hosting kode & CI/CD |
| VS Code + ESLint | Editor kode & linting |

## 📐 Arsitektur

```
Tingkat 1 — Antarmuka Pengguna (UI)
  ├── Skrin Beranda (Dashboard)
  ├── Modul Belajar (Kana, Kanji, Tata Bahasa, Listening)
  └── Modul Latihan (Kartu SRS, Kuis, Dictation)

Tingkat 2 — Logika Bisnis
  ├── Engine SRS (Algoritma SM-2)
  ├── State Manager (Redux/Zustand)
  └── Audio Engine (TTS wrapper)

Tingkat 3 — Penyimpanan Data
  ├── Local SQLite (data kana, kanji, kosakata)
  ├── Asset Bundles (audio, stroke order SVG)
  └── Cloud Sync (Firebase Firestore, opsional)
```

## 🗺️ Roadmap

- [x] **Fase 1: Penelitian & Konsep** — Pemilihan teknologi & sumber data
- [x] **Fase 2: Prototipe Interaktif** — Prototipe fungsional (file `index.html`)
- [ ] **Fase 3: Pengembangan Aplikasi Penuh** — React Native + Expo
- [ ] **Fase 4: Beta & Uji Pengguna** — Distribusi beta
- [ ] **Fase 5: Rilis di Google Play** — Publikasi gratis

## 📚 Sumber Data Gratis

| Sumber | Deskripsi |
|--------|-----------|
| [JMDict / EDICT](https://www.edrdg.org/jmdict/j_jmdict.html) | Database kosakata Jepang-Inggris (180,000+ entri) |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) | Database 13,000+ kanji |
| [Tatoeba](https://tatoeba.org/en) | Database kalimat contoh multibahasa |
| [KanjiVG](https://kanjivg.tagaini.net/) | Data SVG untuk animasi stroke order |
| [Wikipedia JLPT](https://en.wikipedia.org/wiki/Japanese-Language_Proficiency_Test) | Daftar kanji & kosakata per level JLPT |

## 🚀 Cara Menjalankan Prototipe

```bash
# Kloning repositori
git clone https://github.com/USERNAME/manabu.git
cd manabu

# Buka prototipe di browser
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

Atau jalankan server lokal:
```bash
python3 -m http.server 8000
# Buka http://localhost:8000 di browser
```

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan.

## 🤝 Berkontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

---

Dibangun dengan ❤️ untuk pembelajar bahasa Jepang di mana pun.
