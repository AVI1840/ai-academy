import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak, speakSlow } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { SpellingItem } from '@/lib/types';

interface Props {
  items: SpellingItem[];
  onComplete: (score: number, learnedWords: string[]) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const SpellingLesson = ({ items, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [revealedHints, setRevealedHints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  const item = items[currentIndex];
  const targetWord = item.word.toUpperCase();

  const handleLetterPress = useCallback((letter: string) => {
    const nextPos = typedLetters.length;
    if (nextPos >= targetWord.length) return;

    if (letter === targetWord[nextPos]) {
      const newTyped = [...typedLetters, letter];
      setTypedLetters(newTyped);
      setFeedback(null);

      if (newTyped.length === targetWord.length) {
        // Word complete!
        setCorrectCount(prev => prev + (revealedHints === 0 ? 1 : revealedHints <= 1 ? 0.75 : 0.5));
        setShowConfetti(true);
        setFeedback(getEncouragement());
        speak(item.word);

        setTimeout(() => {
          setShowConfetti(false);
          setFeedback(null);
          if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTypedLetters([]);
            setRevealedHints(0);
          } else {
            const finalCorrect = correctCount + (revealedHints === 0 ? 1 : revealedHints <= 1 ? 0.75 : 0.5);
            onComplete(Math.round((finalCorrect / items.length) * 100), items.map(i => i.word));
          }
        }, 1500);
      }
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);

      // After wrong attempt, reveal a hint
      if (revealedHints < targetWord.length - 1) {
        setRevealedHints(prev => prev + 1);
        setFeedback(getAlmostMessage());
      } else {
        setFeedback(getTryAgainMessage());
      }
      setTimeout(() => setFeedback(null), 1200);
    }
  }, [typedLetters, targetWord, item, currentIndex, items, correctCount, revealedHints, onComplete]);

  const confettiEmojis = ['🌟', '⭐', '✨', '🎉', '🏆', '💫'];

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 300 - 150, opacity: 1, rotate: 0 }}
            animate={{ y: 500, opacity: 0, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            className="fixed text-3xl pointer-events-none z-50"
            style={{ left: `${20 + Math.random() * 60}%`, top: 0 }}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex gap-2 mb-4">
        {items.map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${i < currentIndex ? 'bg-success' : i === currentIndex ? 'bg-primary' : 'bg-muted'}`}
            animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Word card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-card-warm rounded-3xl p-6 w-full max-w-sm text-center mb-4"
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {item.emoji}
          </motion.div>
          <p className="text-kid font-rubik mb-1">{item.hebrew}</p>
          <p className="text-sm text-muted-foreground font-rubik mb-3">{item.hint}</p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => speakSlow(item.word)}
            className="bg-muted rounded-full p-3 tap-target mx-auto mb-4"
          >
            <Volume2 size={24} className="text-muted-foreground" />
          </motion.button>

          {/* Letter slots */}
          <motion.div
            className="flex gap-2 justify-center mb-2"
            animate={wrongShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {targetWord.split('').map((letter, i) => {
              const isTyped = i < typedLetters.length;
              const isHinted = !isTyped && i < revealedHints;
              return (
                <motion.div
                  key={i}
                  initial={isTyped ? { scale: 0 } : {}}
                  animate={isTyped ? { scale: 1 } : {}}
                  className={`w-10 h-12 rounded-xl flex items-center justify-center text-kid-lg font-nunito font-black border-2 ${
                    isTyped
                      ? 'bg-success/15 border-success text-success'
                      : isHinted
                      ? 'bg-secondary/15 border-secondary/40 text-secondary/60'
                      : 'bg-card border-border'
                  }`}
                >
                  {isTyped ? typedLetters[i] : isHinted ? letter : '_'}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="mb-3 text-kid font-rubik font-bold bg-card/80 backdrop-blur rounded-2xl px-6 py-3 shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* On-screen keyboard */}
      <div className="w-full max-w-md space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((letter) => (
              <motion.button
                key={letter}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterPress(letter)}
                className="bg-card border-2 border-border rounded-xl w-9 h-11 flex items-center justify-center font-nunito font-bold text-kid tap-target shadow-sm hover:bg-primary/10 active:bg-primary/20 transition-colors"
              >
                {letter}
              </motion.button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellingLesson;
