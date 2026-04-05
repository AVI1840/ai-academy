import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { SentenceBuilderItem } from '@/lib/types';

interface Props {
  items: SentenceBuilderItem[];
  onComplete: (score: number, learnedWords: string[]) => void;
}

const SentenceBuilderLesson = ({ items, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wrongShake, setWrongShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const item = items[currentIndex];
  const correctWords = item.sentence.split(' ');

  const shuffledWords = useMemo(() => {
    return [...item.words].sort(() => Math.random() - 0.5);
  }, [item.words]);

  const availableWords = shuffledWords.filter(w => !selectedWords.includes(w));

  const handleWordTap = (word: string) => {
    if (showSuccess) return;
    const nextPos = selectedWords.length;
    const expected = correctWords[nextPos];

    if (word.toLowerCase() === expected.toLowerCase()) {
      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);
      setFeedback(null);

      if (newSelected.length === correctWords.length) {
        // Sentence complete!
        setShowSuccess(true);
        const scoreForThis = attempts === 0 ? 1 : attempts <= 2 ? 0.75 : 0.5;
        setCorrectCount(prev => prev + scoreForThis);
        setFeedback(getEncouragement());
        speak(item.sentence);

        setTimeout(() => {
          setShowSuccess(false);
          setFeedback(null);
          setAttempts(0);
          if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedWords([]);
          } else {
            const finalCorrect = correctCount + scoreForThis;
            onComplete(
              Math.round((finalCorrect / items.length) * 100),
              items.flatMap(i => i.words)
            );
          }
        }, 2000);
      }
    } else {
      setAttempts(prev => prev + 1);
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      setFeedback(attempts >= 2 ? getAlmostMessage() : getTryAgainMessage());
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleClear = () => {
    setSelectedWords([]);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
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

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="w-full max-w-md"
        >
          {/* Task card */}
          <div className="glass-card-warm rounded-3xl p-6 mb-4 text-center">
            <motion.span
              className="text-5xl block mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.emoji}
            </motion.span>
            <p className="text-kid font-rubik font-bold mb-1">!בנה את המשפט 🔨</p>
            <p className="text-kid font-rubik text-muted-foreground">{item.hebrew}</p>
          </div>

          {/* Sentence building area */}
          <motion.div
            className="min-h-[60px] bg-card border-2 border-dashed border-border rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-center justify-center"
            animate={wrongShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {selectedWords.length === 0 && (
              <p className="text-muted-foreground font-rubik text-sm">...לחץ על מילים לבנות משפט</p>
            )}
            {selectedWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className={`text-english font-nunito font-bold text-kid px-3 py-1 rounded-xl ${
                  showSuccess ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Available words */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {availableWords.map((word) => (
              <motion.button
                key={word}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleWordTap(word)}
                disabled={showSuccess}
                className="text-english font-nunito font-bold text-kid bg-card border-2 border-border rounded-2xl px-4 py-2 tap-target shadow-sm hover:bg-primary/5 transition-colors"
              >
                {word}
              </motion.button>
            ))}
          </div>

          {/* Clear button */}
          {selectedWords.length > 0 && !showSuccess && (
            <div className="text-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="bg-muted rounded-2xl px-5 py-2 font-rubik text-sm text-muted-foreground"
              >
                נקה ↩️
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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

export default SentenceBuilderLesson;
