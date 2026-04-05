import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak, speakSlow } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { WordItem } from '@/lib/types';

interface Props {
  words: WordItem[];
  onComplete: (score: number, learnedWords: string[]) => void;
}

// Minimum seconds the card must be flipped before "next" appears
const MIN_READ_SECONDS = 2;

const WordLesson = ({ words, onComplete }: Props) => {
  const [phase, setPhase] = useState<'flashcard' | 'match'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);
  const [matchPairs, setMatchPairs] = useState<{ english: string; hebrew: string; matched: boolean }[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const word = words[currentIndex];

  // Reset canAdvance whenever the card changes
  useEffect(() => {
    setCanAdvance(false);
  }, [currentIndex]);

  const handleFlip = () => {
    setFlipped(true);
    speakSlow(word.english);
    // Must wait MIN_READ_SECONDS before they can move on
    setTimeout(() => setCanAdvance(true), MIN_READ_SECONDS * 1000);
  };

  const handleNextFlashcard = () => {
    if (!canAdvance) return;
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    } else {
      setPhase('match');
      setMatchPairs(words.map(w => ({ english: w.english, hebrew: w.hebrew, matched: false })));
    }
  };

  const shuffledHebrew = [...words].sort(() => Math.random() - 0.5);

  const handleMatchHebrew = (hebrew: string) => {
    if (!selectedEnglish) return;
    const pair = words.find(w => w.english === selectedEnglish);
    if (pair?.hebrew === hebrew) {
      setCorrectCount(prev => prev + 1);
      setMatchPairs(prev => prev.map(p => p.english === selectedEnglish ? { ...p, matched: true } : p));
      setSelectedEnglish(null);
      setFeedback(getEncouragement());
      speak(selectedEnglish);
      setAttempts(0);
      setTimeout(() => {
        setFeedback(null);
        if (matchPairs.filter(p => !p.matched).length <= 1) {
          onComplete(Math.round((correctCount + 1) / words.length * 100), words.map(w => w.english));
        }
      }, 800);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setFeedback(getAlmostMessage());
        setMatchPairs(prev => prev.map(p => p.english === selectedEnglish ? { ...p, matched: true } : p));
        setSelectedEnglish(null);
        setCorrectCount(prev => prev + 0.5);
        setTimeout(() => {
          setFeedback(null);
          setAttempts(0);
        }, 800);
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => setFeedback(null), 600);
      }
    }
  };

  if (phase === 'flashcard') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            className="glass-card-warm rounded-3xl p-8 w-full max-w-xs text-center"
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {word.emoji}
            </motion.div>
            {!flipped ? (
              <>
                <div className="text-kid-lg font-rubik mb-4">{word.hebrew}</div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFlip}
                  className="pitch-gradient text-primary-foreground rounded-3xl px-6 py-3 tap-target font-rubik font-bold text-kid shadow-lg"
                >
                  !גלה באנגלית 🔊
                </motion.button>
              </>
            ) : (
              <>
                <div className="text-english text-kid-2xl font-nunito font-black mb-2">{word.english}</div>
                <div className="text-kid font-rubik text-muted-foreground mb-4">{word.hebrew}</div>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speakSlow(word.english)}
                    className="bg-muted rounded-full p-3 tap-target"
                  >
                    <Volume2 size={24} className="text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileTap={canAdvance ? { scale: 0.95 } : {}}
                    onClick={handleNextFlashcard}
                    disabled={!canAdvance}
                    className={`rounded-2xl px-6 py-3 tap-target font-rubik font-bold shadow-lg transition-all ${
                      canAdvance
                        ? 'gold-gradient text-secondary-foreground'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    {canAdvance
                      ? (currentIndex < words.length - 1 ? '➡️ הבא' : '!בואו נתרגל 🎯')
                      : '⏳ קרא את המילה...'}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-6">
          {words.map((_, i) => (
            <motion.div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i <= currentIndex ? 'bg-primary' : 'bg-muted'}`}
              animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[60vh] p-4">
      <p className="text-kid font-rubik font-bold mb-4 text-center">!חבר מילים 🎯</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <div className="space-y-2">
          {matchPairs.map((p) => (
            <motion.button
              key={p.english}
              whileTap={{ scale: 0.95 }}
              onClick={() => !p.matched && setSelectedEnglish(p.english)}
              className={`w-full rounded-2xl p-3 tap-target text-english font-nunito font-bold text-kid transition-all ${
                p.matched ? 'bg-success/15 text-success border-2 border-success/30' :
                selectedEnglish === p.english ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' :
                'fun-card'
              }`}
              disabled={p.matched}
            >
              {p.english}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {shuffledHebrew.map((w) => {
            const matched = matchPairs.find(p => p.hebrew === w.hebrew)?.matched;
            return (
              <motion.button
                key={w.hebrew}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMatchHebrew(w.hebrew)}
                className={`w-full rounded-2xl p-3 tap-target font-rubik font-bold text-kid transition-all ${
                  matched ? 'bg-success/15 text-success border-2 border-success/30' : 'fun-card'
                }`}
                disabled={matched || !selectedEnglish}
              >
                {w.hebrew}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
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

export default WordLesson;
