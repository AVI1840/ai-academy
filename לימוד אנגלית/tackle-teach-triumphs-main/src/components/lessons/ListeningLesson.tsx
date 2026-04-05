import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak, speakSlow } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { ListeningItem } from '@/lib/types';

interface Props {
  items: ListeningItem[];
  timerSeconds?: number;
  onComplete: (score: number, learnedWords: string[]) => void;
}

const ListeningLesson = ({ items, timerSeconds = 15, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  const item = items[currentIndex];

  // Auto-play on new question
  useEffect(() => {
    setHasPlayed(false);
    const timeout = setTimeout(() => {
      speak(item.text);
      setHasPlayed(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentIndex, item.text]);

  // Timer
  useEffect(() => {
    if (!hasPlayed) return;
    setTimeLeft(timerSeconds);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, timerSeconds, hasPlayed]);

  const goNext = useCallback(() => {
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    setAttempts(0);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const score = Math.round((correctCount / items.length) * 100);
      onComplete(score, items.map(i => i.text));
    }
  }, [currentIndex, items, correctCount, onComplete]);

  // Time up
  useEffect(() => {
    if (timeLeft === 0 && selectedOption === null && hasPlayed) {
      setFeedback('הזמן נגמר! בפעם הבאה תספיק 💪');
      setSelectedOption(item.correct);
      setShowExplanation(true);
      setTimeout(goNext, 2500);
    }
  }, [timeLeft, selectedOption, item, goNext, hasPlayed]);

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;

    if (optionIndex === item.correct) {
      setSelectedOption(optionIndex);
      setCorrectCount(prev => prev + 1);
      setFeedback(getEncouragement());
      speak(item.options[optionIndex]);
      setShowExplanation(true);
      setTimeout(goNext, 1800);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setSelectedOption(item.correct);
        setFeedback(getAlmostMessage());
        setCorrectCount(prev => prev + 0.5);
        setShowExplanation(true);
        setTimeout(goNext, 2500);
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => setFeedback(null), 700);
      }
    }
  };

  const timerPercentage = (timeLeft / timerSeconds) * 100;

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
      {/* Timer */}
      <div className="w-full max-w-md mb-5">
        <div className="flex justify-between text-sm font-rubik text-muted-foreground mb-2">
          <span className="bg-muted rounded-full px-3 py-1">{currentIndex + 1}/{items.length}</span>
          <span className={`rounded-full px-3 py-1 font-bold ${
            timerPercentage > 50 ? 'bg-success/10 text-success' : timerPercentage > 25 ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'
          }`}>
            ⏱️ {timeLeft}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full transition-colors ${
              timerPercentage > 50 ? 'bg-success' : timerPercentage > 25 ? 'bg-secondary' : 'bg-destructive'
            }`}
            animate={{ width: `${timerPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="w-full max-w-md"
        >
          {/* Listen card */}
          <div className="glass-card-warm rounded-3xl p-6 mb-5 text-center">
            <motion.span
              className="text-5xl block mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.emoji}
            </motion.span>
            <p className="text-kid font-rubik font-bold mb-4">?מה שמעת 👂</p>

            <div className="flex gap-3 justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => speak(item.text)}
                className="pitch-gradient text-primary-foreground rounded-2xl px-5 py-3 tap-target font-rubik font-bold text-kid shadow-lg"
              >
                🔊 שמע
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => speakSlow(item.text)}
                className="bg-muted rounded-2xl px-5 py-3 tap-target font-rubik font-bold text-sm"
              >
                🐢 לאט
              </motion.button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {item.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileTap={selectedOption === null ? { scale: 0.97 } : {}}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null}
                className={`w-full rounded-2xl p-4 tap-target font-bold text-kid text-right transition-all ${
                  selectedOption !== null && i === item.correct
                    ? 'bg-success text-success-foreground shadow-lg scale-[1.02]'
                    : selectedOption === i && i !== item.correct
                    ? 'bg-destructive/15 text-destructive border-2 border-destructive/30'
                    : 'fun-card'
                }`}
              >
                <span className="text-english font-nunito">{option}</span>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 glass-card-warm rounded-2xl p-4 text-center"
              >
                <p className="text-english font-nunito font-bold text-kid mb-1">{item.text}</p>
                <p className="font-rubik text-sm text-muted-foreground">{item.hebrew}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="mt-5 text-kid-lg font-rubik font-bold text-center bg-card/80 backdrop-blur rounded-2xl px-6 py-3 shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListeningLesson;
