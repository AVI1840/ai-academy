import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { QuizQuestion } from '@/lib/types';

interface Props {
  questions: QuizQuestion[];
  timerSeconds?: number;
  speedBonus?: boolean;
  onComplete: (score: number) => void;
}

// No per-question timer — kids should read and think, not rush
const QuizLesson = ({ questions, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const question = questions[currentIndex];

  // Delay showing options so kids read the question first
  useEffect(() => {
    setOptionsVisible(false);
    const t = setTimeout(() => setOptionsVisible(true), 900);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    setAttempts(0);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const score = Math.round((correctCount / questions.length) * 100);
      onComplete(score);
    }
  }, [currentIndex, questions.length, correctCount, onComplete]);

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null || !optionsVisible) return;

    if (optionIndex === question.correct) {
      setSelectedOption(optionIndex);
      setCorrectCount(prev => prev + 1);
      setFeedback(getEncouragement());
      speak(question.options[optionIndex]);
      if (question.explanation_he) setShowExplanation(true);
      // Wait longer so they can read the explanation
      setTimeout(goNext, 2500);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setSelectedOption(question.correct);
        setFeedback(getAlmostMessage());
        setCorrectCount(prev => prev + 0.5);
        if (question.explanation_he) setShowExplanation(true);
        setTimeout(goNext, 3000);
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => setFeedback(null), 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
      {/* Progress — just count, no pressure */}
      <div className="w-full max-w-md mb-5">
        <div className="flex justify-between text-sm font-rubik text-muted-foreground mb-2">
          <span className="bg-muted rounded-full px-3 py-1">
            שאלה {currentIndex + 1} מתוך {questions.length}
          </span>
          <span className="bg-muted rounded-full px-3 py-1 text-xs">
            {'⭐'.repeat(Math.min(3, Math.round(correctCount)))}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-primary"
            animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card-warm rounded-3xl p-6 mb-5 text-center">
            <motion.span
              className="text-5xl block mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {question.emoji}
            </motion.span>
            <p className="text-english text-kid-lg font-nunito font-bold">{question.question}</p>
          </div>

          {/* Options appear after short delay so they read the question */}
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={optionsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                whileTap={selectedOption === null && optionsVisible ? { scale: 0.97 } : {}}
                whileHover={selectedOption === null && optionsVisible ? { scale: 1.02, x: -3 } : {}}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null || !optionsVisible}
                className={`w-full rounded-2xl p-4 tap-target font-bold text-kid text-right transition-all ${
                  selectedOption !== null && i === question.correct
                    ? 'bg-success text-success-foreground shadow-lg scale-[1.02]'
                    : selectedOption === i && i !== question.correct
                    ? 'bg-destructive/15 text-destructive border-2 border-destructive/30'
                    : 'fun-card'
                }`}
              >
                <span className="text-english font-nunito">{option}</span>
              </motion.button>
            ))}
          </div>

          {/* Explanation — shown after answering, they MUST wait to read it */}
          <AnimatePresence>
            {showExplanation && question.explanation_he && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 glass-card-warm rounded-2xl p-4 text-center font-rubik text-sm text-muted-foreground"
              >
                📜 {question.explanation_he}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

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

export default QuizLesson;
