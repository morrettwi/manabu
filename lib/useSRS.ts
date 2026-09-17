// useSRS — React Hook untuk mengelola sesi SRS
// Menggabungkan engine SRS + storage + TTS

import { useState, useEffect, useCallback, useRef } from 'react';
import { loadCards, saveCards, addXP, updateStreak, recordStudy } from './storage';
import {
  type SRSCard,
  type Rating,
  reviewCard,
  getDueCards,
  getSRSStats,
  RATING,
} from './srs';
import { speakJapanese } from './tts';

export type SRSStats = ReturnType<typeof getSRSStats>;

export function useSRS() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stats, setStats] = useState<SRSStats | null>(null);
  const [session, setSession] = useState({
    reviewed: 0,
    correct: 0,
    xpGained: 0,
  });
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  // Muat kartu saat mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      const loaded = await loadCards();
      setCards(loaded);
      const due = getDueCards(loaded);
      setDueCards(due);
      setStats(getSRSStats(loaded));
      setLoading(false);
    })();
  }, []);

  const currentCard = dueCards[currentIdx];

  // Muat ulang kartu dari storage (setelah seeding eksternal)
  const reload = useCallback(async () => {
    const loaded = await loadCards();
    setCards(loaded);
    setDueCards(getDueCards(loaded));
    setStats(getSRSStats(loaded));
    setCurrentIdx(0);
  }, []);

  // Jawab kartu saat ini
  const answerCard = useCallback(
    async (rating: Rating) => {
      if (!currentCard) return;

      const updatedCard = reviewCard(currentCard, rating);

      // Jika kartu belum ada di koleksi, tambahkan; jika sudah, perbarui
      const exists = cards.some((c) => c.id === currentCard.id);
      const finalCards: SRSCard[] = exists
        ? cards.map((c) => (c.id === updatedCard.id ? updatedCard : c))
        : [...cards, updatedCard];

      setCards(finalCards);
      await saveCards(finalCards);

      // Update statistik sesi
      const isCorrect = rating >= 3;
      const xpGain = isCorrect ? (rating === 5 ? 15 : rating === 4 ? 10 : 5) : 1;
      setSession((prev) => ({
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        xpGained: prev.xpGained + xpGain,
      }));

      // Tambah XP & streak
      await addXP(xpGain);
      await updateStreak();

      // Reset rating "again" → kartu kembali ke antrian
      if (rating === RATING.AGAIN) {
        // Tetap di kartu ini (ulang lagi), jangan maju
        // tapi update state-nya
        setDueCards((prev) => {
          const copy = [...prev];
          copy[currentIdx] = updatedCard;
          return copy;
        });
      } else {
        // Lanjut ke kartu berikutnya
        setCurrentIdx((prev) => prev + 1);
        setDueCards((prev) => {
          const copy = [...prev];
          copy[currentIdx] = updatedCard;
          return copy;
        });
      }

      setStats(getSRSStats(finalCards));
    },
    [currentCard, cards, currentIdx]
  );

  // Ucapkan kartu saat ini
  const speakCurrent = useCallback(() => {
    if (currentCard?.front) {
      speakJapanese(currentCard.front);
    }
  }, [currentCard]);

  // Akhiri sesi & catat statistik
  const endSession = useCallback(async () => {
    await recordStudy(session.correct, session.reviewed);
    setSession({ reviewed: 0, correct: 0, xpGained: 0 });
  }, [session]);

  // Tambah kartu baru ke koleksi
  const addCard = useCallback(
    async (card: SRSCard) => {
      const exists = cards.some((c) => c.id === card.id);
      if (exists) return;
      const newCards = [...cards, card];
      setCards(newCards);
      setDueCards((prev) => [...prev, card]);
      setStats(getSRSStats(newCards));
      await saveCards(newCards);
    },
    [cards]
  );

  return {
    cards,
    dueCards,
    currentCard,
    currentIdx,
    stats,
    session,
    loading,
    answerCard,
    speakCurrent,
    endSession,
    addCard,
    reload,
    isSessionEnd: currentIdx >= dueCards.length,
  };
}
