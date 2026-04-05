import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProgress, saveProgress } from '@/lib/srsEngine';
import { professionalPhrases } from '@/lib/seedData';
import { ChevronRight, X } from 'lucide-react';

const PhraseMode = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVariations, setShowVariations] = useState(false);

  // Pick 5 random phrases
  const [selectedPhrases] = useState(() => {
    const shuffled = [...professionalPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  useEffect(() => {
    const p = loadProgress();
    p.phraseLastShown = new Date().toISOString().split('T')[0];
    saveProgress(p);
  }, []);

  const current = selectedPhrases[currentIndex];
  const isLast = currentIndex >= selectedPhrases.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate('/dashboard');
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowVariations(false);
    }
  };

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <button onClick={() => navigate('/')} className="text-muted-foreground">
          <X className="w-6 h-6" />
        </button>
        <span className="text-xs font-medium text-primary uppercase tracking-wider">Phrase Mode</span>
        <span className="text-sm text-muted-foreground">{currentIndex + 1}/{selectedPhrases.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-1 bg-progress-track rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-progress-fill rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / selectedPhrases.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Main Phrase */}
        <div className="bg-card rounded-3xl p-6 mb-4 animate-fade-in">
          <p className="text-xl font-semibold text-foreground leading-relaxed mb-4">
            "{current.phrase}"
          </p>
          <p className="text-base text-muted-foreground text-rtl leading-relaxed">
            {current.hebrew}
          </p>
        </div>

        {/* Variations */}
        {!showVariations ? (
          <button
            onClick={() => setShowVariations(true)}
            className="text-primary text-sm font-medium py-3 animate-fade-in"
          >
            How would you say this differently? →
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Variations</p>
            {current.variations.map((v, i) => (
              <div key={i} className="bg-secondary rounded-2xl p-4">
                <p className="text-sm text-secondary-foreground">{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-primary text-primary-foreground font-semibold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 mt-6 active:scale-[0.98] transition-transform"
      >
        {isLast ? 'Finish' : 'Next'}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PhraseMode;
