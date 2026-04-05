import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { PictureMatchItem } from '@/lib/types';

interface Props {
  items: PictureMatchItem[];
  onComplete: (score: number, learnedWords: string[]) => void;
}

const PictureMatchLesson = ({ items, onComplete }: Props) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [wrongPair, setWrongPair] = useState<{ emoji: string; word: string } | null>(null);

  const shuffledWords = useMemo(() => {
    return [...items].sort(() => Math.random() - 0.5);
  }, [items]);

  const shuffledEmojis = useMemo(() => {
    return [...items].sort(() => Math.random() - 0.5);
  }, [items]);

  const handleEmojiTap = (emoji: string) => {
    if (matchedPairs.has(emoji)) return;
    setSelectedEmoji(emoji === selectedEmoji ? null : emoji);
    setWrongPair(null);
  };

  const handleWordTap = (word: string, itemEmoji: string) => {
    if (!selectedEmoji || matchedPairs.has(word)) return;

    const matchingItem = items.find(i => i.emoji === selectedEmoji);
    if (matchingItem && matchingItem.word.toLowerCase() === word.toLowerCase()) {
      // Correct match!
      setCorrectCount(prev => prev + 1);
      const newMatched = new Set(matchedPairs);
      newMatched.add(selectedEmoji);
      newMatched.add(word);
      setMatchedPairs(newMatched);
      setSelectedEmoji(null);
      setFeedback(getEncouragement());
      speak(word);
      setAttempts(0);
      setWrongPair(null);

      setTimeout(() => {
        setFeedback(null);
        // Check if all matched
        if (newMatched.size === items.length * 2) {
          onComplete(
            Math.round((correctCount + 1) / items.length * 100),
            items.map(i => i.word)
          );
        }
      }, 800);
    } else {
      // Wrong match
      setAttempts(prev => prev + 1);
      setWrongPair({ emoji: selectedEmoji, word });

      if (attempts >= 2) {
        // Auto-match after 3 fails
        setFeedback(getAlmostMessage());
        if (matchingItem) {
          const newMatched = new Set(matchedPairs);
          newMatched.add(selectedEmoji);
          newMatched.add(matchingItem.word);
          setMatchedPairs(newMatched);
          setCorrectCount(prev => prev + 0.5);
          speak(matchingItem.word);
          setTimeout(() => {
            setFeedback(null);
            setWrongPair(null);
            setSelectedEmoji(null);
            setAttempts(0);
            if (newMatched.size === items.length * 2) {
              onComplete(
                Math.round((correctCount + 0.5) / items.length * 100),
                items.map(i => i.word)
              );
            }
          }, 1200);
        }
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => {
          setFeedback(null);
          setWrongPair(null);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
      <p className="text-kid font-rubik font-bold mb-1 text-center">!חבר תמונה למילה 🎯</p>
      <p className="text-sm text-muted-foreground font-rubik mb-4 text-center">
        לחץ על תמונה, ואז על המילה המתאימה
      </p>

      {/* Score */}
      <div className="bg-muted rounded-full px-4 py-1 mb-4 font-rubik text-sm">
        {matchedPairs.size / 2} / {items.length} ✅
      </div>

      <div className="w-full max-w-md">
        {/* Emoji grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {shuffledEmojis.map((item) => {
            const isMatched = matchedPairs.has(item.emoji);
            const isSelected = selectedEmoji === item.emoji;
            const isWrong = wrongPair?.emoji === item.emoji;
            return (
              <motion.button
                key={item.emoji}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleEmojiTap(item.emoji)}
                disabled={isMatched}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-4xl transition-all tap-target ${
                  isMatched
                    ? 'bg-success/15 border-2 border-success/30 opacity-60'
                    : isSelected
                    ? 'bg-primary/15 border-2 border-primary shadow-lg scale-[1.05]'
                    : isWrong
                    ? 'bg-destructive/10 border-2 border-destructive/30'
                    : 'fun-card'
                }`}
              >
                <span className="text-4xl">{item.emoji}</span>
                {isMatched && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-rubik text-success mt-1"
                  >
                    {item.hebrew}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Word options */}
        <div className="grid grid-cols-2 gap-2">
          {shuffledWords.map((item) => {
            const isMatched = matchedPairs.has(item.word);
            const isWrong = wrongPair?.word === item.word;
            return (
              <motion.button
                key={item.word}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleWordTap(item.word, item.emoji)}
                disabled={isMatched || !selectedEmoji}
                className={`rounded-2xl p-3 tap-target font-nunito font-bold text-kid text-english text-center transition-all ${
                  isMatched
                    ? 'bg-success/15 text-success border-2 border-success/30 opacity-60'
                    : isWrong
                    ? 'bg-destructive/10 border-2 border-destructive/30 text-destructive'
                    : !selectedEmoji
                    ? 'fun-card opacity-60'
                    : 'fun-card'
                }`}
              >
                {item.word}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="mt-4 text-kid-lg font-rubik font-bold bg-card/80 backdrop-blur rounded-2xl px-6 py-3 shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PictureMatchLesson;
