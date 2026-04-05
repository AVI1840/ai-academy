import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak, speakSlow } from '@/lib/speech';
import { getEncouragement } from '@/lib/motivational';
import type { WordMemory } from '@/lib/types';

interface Props {
  words: WordMemory[];
  onComplete: (results: { word: string; correct: boolean }[]) => void;
}

// Fallback Hebrew distractors if pool is small
const FALLBACK_DISTRACTORS = [
  'אדום', 'כחול', 'ירוק', 'גדול', 'קטן', 'מהיר', 'לרוץ', 'מים',
  'ספר', 'בית', 'ילד', 'שמח', 'אוכל', 'יפה', 'חזק', 'שמש',
];

function buildChoices(correct: string, pool: WordMemory[]): string[] {
  const distractors = pool
    .filter(w => w.hebrew && w.hebrew !== correct)
    .map(w => w.hebrew);

  // Add fallbacks if needed
  FALLBACK_DISTRACTORS.forEach(d => {
    if (d !== correct && !distractors.includes(d)) distractors.push(d);
  });

  // Pick 3 unique random distractors
  const shuffled = distractors.sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 3);
  const all = [...picked, correct].sort(() => Math.random() - 0.5);
  return all;
}

const COACH_MESSAGES = [
  "Hey! What does this mean? 🤔",
  "Do you know this word? 💡",
  "Quick! What is the meaning? ⚡",
  "Let's see if you remember! 🧠",
  "What does an Israeli say for this? 🇮🇱",
];

const WordReview = ({ words, onComplete }: Props) => {
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<{ word: string; correct: boolean }[]>([]);
  const [coachMsg] = useState(() => COACH_MESSAGES[Math.floor(Math.random() * COACH_MESSAGES.length)]);
  const [coachAnim, setCoachAnim] = useState(false);
  const audioPlayed = useRef(false);

  const current = words[idx] as WordMemory & { _pool?: WordMemory[] };

  // Build choices + play audio when word changes
  useEffect(() => {
    setSelected(null);
    audioPlayed.current = false;
    const pool = current._pool ?? words.filter((_, i) => i !== idx);
    setChoices(current.hebrew ? buildChoices(current.hebrew, pool) : []);
    // Auto-play after short delay
    const t = setTimeout(() => {
      speak(current.word);
      audioPlayed.current = true;
    }, 500);
    return () => clearTimeout(t);
  }, [idx]);

  const handleSelect = (choice: string) => {
    if (selected) return; // already answered
    setSelected(choice);
    const correct = choice === current.hebrew;

    // Animate coach
    setCoachAnim(true);
    setTimeout(() => setCoachAnim(false), 600);

    if (correct) {
      speak(current.word);
    } else {
      speakSlow(current.word);
    }

    const newResults = [...results, { word: current.word, correct }];
    setResults(newResults);

    // Move to next after 1.6s
    setTimeout(() => {
      if (idx < words.length - 1) {
        setIdx(i => i + 1);
      } else {
        onComplete(newResults);
      }
    }, 1600);
  };

  const hasHebrew = !!current.hebrew;

  return (
    <div className="min-h-[60vh] flex flex-col items-center px-5 pt-6 pb-8">

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {words.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < idx ? 'w-6 bg-primary' :
              i === idx ? 'w-8 bg-primary' : 'w-4 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* American Coach */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-sm"
        >
          {/* Coach bubble */}
          <div className="flex items-end gap-3 mb-5">
            <motion.div
              className="text-5xl shrink-0"
              animate={coachAnim ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              🧑‍🏫
            </motion.div>
            <div className="bg-card rounded-3xl rounded-bl-sm px-5 py-3 shadow-md flex-1">
              <p className="text-xs text-muted-foreground font-rubik mb-1">🇺🇸 Coach Mike</p>
              <p className="font-nunito font-bold text-sm text-foreground">{coachMsg}</p>
            </div>
          </div>

          {/* Word card */}
          <div className="bg-card rounded-3xl p-6 text-center shadow-lg mb-5">
            {current.emoji && (
              <div className="text-5xl mb-3">{current.emoji}</div>
            )}
            <div className="text-english text-kid-2xl font-nunito font-black text-foreground mb-3">
              {current.word}
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => speak(current.word)}
                className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-rubik font-medium transition-colors"
              >
                <Volume2 size={15} /> שמע
              </button>
              <button
                onClick={() => speakSlow(current.word)}
                className="flex items-center gap-1.5 bg-sky/15 hover:bg-sky/25 text-sky-700 rounded-full px-4 py-2 text-sm font-rubik font-medium transition-colors"
              >
                <Volume2 size={15} /> איטי
              </button>
            </div>
          </div>

          {/* Question */}
          <p className="text-center font-rubik font-bold text-kid text-foreground mb-4">
            ?מה המשמעות בעברית
          </p>

          {/* Answer choices */}
          {hasHebrew ? (
            <div className="grid grid-cols-2 gap-3">
              {choices.map((choice, ci) => {
                const isCorrect = choice === current.hebrew;
                const isSelected = selected === choice;
                const showResult = selected !== null;

                let bg = 'bg-card border-border/40';
                if (showResult) {
                  if (isCorrect) bg = 'bg-success/15 border-success';
                  else if (isSelected && !isCorrect) bg = 'bg-destructive/15 border-destructive';
                  else bg = 'bg-muted/30 border-border/20';
                } else {
                  bg = 'bg-card border-border/40 hover:border-primary/50 hover:bg-primary/5';
                }

                return (
                  <motion.button
                    key={ci}
                    whileTap={!selected ? { scale: 0.95 } : {}}
                    onClick={() => handleSelect(choice)}
                    disabled={!!selected}
                    className={`rounded-2xl p-4 border-2 tap-target font-rubik font-bold text-kid text-center transition-all ${bg}`}
                  >
                    {showResult && isCorrect && (
                      <span className="block text-xl mb-1">✅</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="block text-xl mb-1">❌</span>
                    )}
                    {choice}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            // No Hebrew stored yet — teach mode only
            <div className="bg-muted/30 rounded-2xl p-5 text-center">
              <p className="text-sm font-rubik text-muted-foreground mb-3">
                שמע את המילה וחזור עליה בקול!
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  speak(current.word);
                  setTimeout(() => {
                    const newResults = [...results, { word: current.word, correct: true }];
                    setResults(newResults);
                    if (idx < words.length - 1) setIdx(i => i + 1);
                    else onComplete(newResults);
                  }, 1200);
                }}
                className="pitch-gradient text-primary-foreground rounded-2xl px-8 py-3 font-rubik font-bold text-kid shadow-lg"
              >
                הבנתי! ←
              </motion.button>
            </div>
          )}

          {/* Feedback after answer */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`mt-4 rounded-2xl px-5 py-3 text-center font-rubik font-bold text-kid ${
                  selected === current.hebrew
                    ? 'bg-success/20 text-success'
                    : 'bg-muted text-foreground'
                }`}
              >
                {selected === current.hebrew
                  ? `${getEncouragement()} 🌟`
                  : `התשובה הנכונה: ${current.hebrew} 💪`
                }
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WordReview;
