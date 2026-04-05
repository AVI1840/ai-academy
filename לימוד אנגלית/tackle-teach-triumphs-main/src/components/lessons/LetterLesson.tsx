import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak, speakSlow } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { LetterItem } from '@/lib/types';

interface Props {
  items: LetterItem[];
  onComplete: (score: number) => void;
}

const LetterLesson = ({ items, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'learn' | 'tap'>('learn');
  const [tapped, setTapped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<LetterItem[]>([]);
  const [targetLetter, setTargetLetter] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const item = items[currentIndex];

  const handleLearn = () => {
    speakSlow(item.word);
    setTapped(true);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTapped(false);
    } else {
      startTapPhase();
    }
  };

  const startTapPhase = () => {
    setPhase('tap');
    setCurrentIndex(0);
    const target = items[0];
    setTargetLetter(target.letter);
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
    setAttempts(0);
  };

  const handleTap = (tappedItem: LetterItem) => {
    if (tappedItem.letter === targetLetter) {
      speak(tappedItem.word);
      setCorrectCount(prev => prev + 1);
      setFeedback(getEncouragement());
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < items.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setTargetLetter(items[nextIdx].letter);
          setShuffledItems([...items].sort(() => Math.random() - 0.5));
          setAttempts(0);
        } else {
          const score = Math.round((correctCount + 1) / items.length * 100);
          onComplete(score);
        }
      }, 1000);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setFeedback(getAlmostMessage());
        setTimeout(() => {
          setFeedback(null);
          setCorrectCount(prev => prev + 0.5);
          if (currentIndex < items.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setTargetLetter(items[nextIdx].letter);
            setShuffledItems([...items].sort(() => Math.random() - 0.5));
            setAttempts(0);
          } else {
            const score = Math.round((correctCount + 0.5) / items.length * 100);
            onComplete(score);
          }
        }, 1200);
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => setFeedback(null), 700);
      }
    }
  };

  if (phase === 'learn') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <motion.div 
              className="text-8xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {item.emoji}
            </motion.div>
            <div className="text-english text-kid-3xl font-nunito font-black mb-2">
              {item.letter}
            </div>
            <div className="text-english text-kid-xl font-nunito font-bold text-muted-foreground mb-2">
              {item.word}
            </div>
            <div className="text-sm font-rubik text-muted-foreground mb-6">
              נשמע: "{item.pronunciation}"
            </div>

            {!tapped ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearn}
                className="pitch-gradient text-primary-foreground rounded-3xl px-8 py-4 tap-target font-rubik font-bold text-kid flex items-center gap-3 mx-auto shadow-xl"
              >
                <Volume2 size={24} />
                <span>הקשיב 🔊</span>
              </motion.button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speakSlow(item.word)}
                  className="bg-muted rounded-full p-3 tap-target"
                >
                  <Volume2 size={24} className="text-muted-foreground" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="gold-gradient text-secondary-foreground rounded-3xl px-8 py-4 tap-target font-rubik font-bold text-kid shadow-lg"
                >
                  {currentIndex < items.length - 1 ? 'הבא ➡️' : '!בואו נתרגל 🎯'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-8">
          {items.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex ? 'bg-primary scale-150' : i < currentIndex ? 'bg-success' : 'bg-muted'
              }`}
              animate={i === currentIndex ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.p
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className="text-kid-lg font-rubik font-bold mb-6 text-center"
      >
        ?איפה האות <span className="text-english font-nunito text-kid-2xl text-primary">{targetLetter}</span>
      </motion.p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-6">
        {shuffledItems.map((si, i) => (
          <motion.button
            key={`${si.letter}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTap(si)}
            className="fun-card rounded-3xl p-6 tap-target flex flex-col items-center gap-2"
          >
            <span className="text-4xl">{si.emoji}</span>
            <span className="text-english text-kid-xl font-nunito font-bold">{si.letter}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="text-kid-lg font-rubik font-bold text-center bg-card/80 backdrop-blur rounded-2xl px-6 py-3 shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mt-4">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? 'bg-primary scale-150' : i < currentIndex ? 'bg-success' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LetterLesson;
