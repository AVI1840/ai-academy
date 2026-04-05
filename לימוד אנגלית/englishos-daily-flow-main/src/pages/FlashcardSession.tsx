import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loadProgress, saveProgress, getDailySession, processAnswer, 
  updateWordInProgress, updateStreak, addDailyStat, shouldShowPhraseMode 
} from '@/lib/srsEngine';
import { Word, AnswerQuality, UserProgress } from '@/lib/types';
import { Volume2, X } from 'lucide-react';

const FlashcardSession = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    const updated = updateStreak(p);
    setProgress(updated);
    saveProgress(updated);
    const words = getDailySession(updated.words);
    setSessionWords(words);
    if (words.length === 0) {
      navigate('/');
    }
  }, [navigate]);

  const currentWord = sessionWords[currentIndex];
  const progressPercent = sessionWords.length > 0 
    ? ((currentIndex) / sessionWords.length) * 100 
    : 0;

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAnswer = useCallback((quality: AnswerQuality) => {
    if (!progress || !currentWord) return;

    const updatedWord = processAnswer(currentWord, quality);
    let updatedProgress = updateWordInProgress(progress, updatedWord);
    
    if (quality !== 'didnt_know') {
      setCorrectCount(prev => prev + 1);
    }

    if (currentIndex + 1 >= sessionWords.length) {
      // Session complete
      updatedProgress = addDailyStat(updatedProgress, sessionWords.length, correctCount + (quality !== 'didnt_know' ? 1 : 0));
      saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setSessionComplete(true);
    } else {
      saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setCurrentIndex(prev => prev + 1);
      setFlipped(false);
    }
  }, [progress, currentWord, currentIndex, sessionWords.length, correctCount]);

  const handleFinish = () => {
    if (progress && shouldShowPhraseMode(progress.phraseLastShown)) {
      navigate('/phrases');
    } else {
      navigate('/dashboard');
    }
  };

  if (!progress || sessionWords.length === 0) return null;

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <div className="text-center animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-1">
            {sessionWords.length} words studied
          </p>
          <p className="text-muted-foreground mb-8">
            {correctCount} correct answers
          </p>
          <button
            onClick={handleFinish}
            className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl active:scale-[0.98] transition-transform"
          >
            Continue
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

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="flashcard-container w-full max-w-sm cursor-pointer"
          onClick={() => {
            if (!flipped) {
              speak(currentWord.english);
            }
            setFlipped(!flipped);
          }}
        >
          <div className={`flashcard-inner relative w-full aspect-[3/4] ${flipped ? 'flipped' : ''}`}>
            {/* Front */}
            <div className="flashcard-front absolute inset-0 bg-card rounded-3xl flex flex-col items-center justify-center p-8 shadow-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                {currentWord.category.replace('_', ' ')}
              </span>
              <h2 className="text-3xl font-bold text-foreground text-center mb-4">
                {currentWord.english}
              </h2>
              <button 
                onClick={(e) => { e.stopPropagation(); speak(currentWord.english); }}
                className="text-primary"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <p className="text-sm text-muted-foreground mt-6">Tap to flip</p>
            </div>

            {/* Back */}
            <div className="flashcard-back absolute inset-0 bg-card rounded-3xl flex flex-col items-center justify-center p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-foreground text-rtl mb-4">
                {currentWord.hebrew}
              </h2>
              <div className="bg-secondary rounded-xl p-4 w-full mt-4">
                <p className="text-sm text-secondary-foreground leading-relaxed">
                  {currentWord.example}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      {flipped && (
        <div className="flex gap-3 mt-6 animate-slide-up">
          <button
            onClick={() => handleAnswer('didnt_know')}
            className="flex-1 py-4 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
          >
            Didn't know
          </button>
          <button
            onClick={() => handleAnswer('got_it')}
            className="flex-1 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
          >
            Got it
          </button>
          <button
            onClick={() => handleAnswer('easy')}
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardSession;
