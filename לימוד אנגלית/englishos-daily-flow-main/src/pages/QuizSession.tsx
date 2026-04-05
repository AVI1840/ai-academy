import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProgress, saveProgress, getDailySession, updateWordInProgress, addDailyStat } from '@/lib/srsEngine';
import { Word, UserProgress } from '@/lib/types';
import { X, Volume2 } from 'lucide-react';

function buildChoices(correct: Word, allWords: Word[]): Word[] {
  const distractors = allWords
    .filter(w => w.id !== correct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...distractors, correct].sort(() => Math.random() - 0.5);
}

const QuizSession = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<Word[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    const words = getDailySession(p.words);
    if (words.length === 0) {
      navigate('/');
      return;
    }
    setSessionWords(words);
    setChoices(buildChoices(words[0], p.words));
  }, [navigate]);

  useEffect(() => {
    if (sessionWords.length > 0 && currentIndex < sessionWords.length) {
      setChoices(buildChoices(sessionWords[currentIndex], progress?.words ?? sessionWords));
      setSelected(null);
    }
  }, [currentIndex]);

  const currentWord = sessionWords[currentIndex];
  const progressPercent = sessionWords.length > 0 ? (currentIndex / sessionWords.length) * 100 : 0;

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleSelect = useCallback((choice: Word) => {
    if (selected || !progress || !currentWord) return;
    setSelected(choice.id);

    const isCorrect = choice.id === currentWord.id;
    if (isCorrect) {
      speak(currentWord.english);
    }

    const newCorrect = correctCount + (isCorrect ? 1 : 0);

    // Update word mastery — correct quiz = "got_it", wrong = "didnt_know"
    const updated = { ...currentWord };
    if (isCorrect) {
      updated.timesCorrect = currentWord.timesCorrect + 1;
      if (updated.timesCorrect >= 5) {
        updated.state = 'mastered';
        updated.interval = 30;
      } else if (updated.timesCorrect >= 2) {
        updated.state = 'review';
        updated.interval = 7;
      } else {
        updated.state = 'learning';
        updated.interval = 1;
      }
    } else {
      updated.timesCorrect = 0;
      updated.state = 'learning';
      updated.interval = 0;
    }
    const next = new Date();
    next.setDate(next.getDate() + updated.interval);
    updated.nextReview = next.toISOString().split('T')[0];

    let updatedProgress = updateWordInProgress(progress, updated);

    setTimeout(() => {
      if (currentIndex + 1 >= sessionWords.length) {
        updatedProgress = addDailyStat(updatedProgress, sessionWords.length, newCorrect);
        saveProgress(updatedProgress);
        setProgress(updatedProgress);
        setCorrectCount(newCorrect);
        setSessionComplete(true);
      } else {
        saveProgress(updatedProgress);
        setProgress(updatedProgress);
        setCorrectCount(newCorrect);
        setCurrentIndex(i => i + 1);
      }
    }, 1200);
  }, [selected, progress, currentWord, currentIndex, sessionWords.length, correctCount, speak]);

  if (!progress || sessionWords.length === 0) return null;

  if (sessionComplete) {
    const pct = Math.round((correctCount / sessionWords.length) * 100);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-1">{sessionWords.length} words tested</p>
          <p className="text-3xl font-bold text-primary my-4">{pct}%</p>
          <p className="text-muted-foreground mb-8">{correctCount} / {sessionWords.length} correct</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl active:scale-[0.98] transition-transform"
          >
            View Stats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <button onClick={() => navigate('/')} className="text-muted-foreground">
          <X className="w-6 h-6" />
        </button>
        <span className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1} / {sessionWords.length}
        </span>
        <div className="w-6" />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-progress-track rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-progress-fill rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Word card */}
      <div className="bg-card rounded-3xl p-8 text-center shadow-lg mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
          {currentWord.category.replace('_', ' ')}
        </span>
        <h2 className="text-3xl font-bold text-foreground mb-4">{currentWord.english}</h2>
        <button
          onClick={() => speak(currentWord.english)}
          className="text-primary mx-auto block"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground mb-5 font-medium">מהי המשמעות בעברית?</p>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          const isCorrect = choice.id === currentWord.id;
          const isSelected = selected === choice.id;
          const showResult = selected !== null;

          let className = 'rounded-2xl p-4 border-2 text-center font-semibold text-sm transition-all active:scale-[0.97] ';
          if (showResult) {
            if (isCorrect) className += 'bg-green-500/15 border-green-500 text-foreground';
            else if (isSelected) className += 'bg-destructive/15 border-destructive text-foreground';
            else className += 'bg-muted/30 border-border/20 text-muted-foreground';
          } else {
            className += 'bg-card border-border/40 hover:border-primary/50 hover:bg-primary/5 text-foreground';
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              disabled={!!selected}
              className={className}
            >
              {showResult && isCorrect && <span className="block text-lg mb-1">✅</span>}
              {showResult && isSelected && !isCorrect && <span className="block text-lg mb-1">❌</span>}
              <span dir="rtl">{choice.hebrew}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected && (
        <div className={`mt-4 rounded-2xl px-5 py-3 text-center font-semibold text-sm ${
          selected === currentWord.id
            ? 'bg-green-500/20 text-green-400'
            : 'bg-muted text-foreground'
        }`}>
          {selected === currentWord.id
            ? 'נכון! 🌟'
            : `התשובה: ${currentWord.hebrew} 💪`
          }
        </div>
      )}
    </div>
  );
};

export default QuizSession;
