import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { speak } from '@/lib/speech';
import { getEncouragement, getAlmostMessage, getTryAgainMessage } from '@/lib/motivational';
import type { DialogueLine } from '@/lib/types';

interface Props {
  dialogue: DialogueLine[];
  onComplete: (score: number) => void;
}

const ConversationLesson = ({ dialogue, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState<{ speaker: string; text: string; isEnglish: boolean }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const line = dialogue[currentIndex];

  const handleCoachLine = () => {
    if (line.speaker === 'coach' && line.text) {
      speak(line.text);
      setMessages(prev => [...prev, { speaker: 'coach', text: line.text!, isEnglish: true }]);
      setMessages(prev => [...prev, { speaker: 'coach', text: line.hebrew, isEnglish: false }]);
      
      setTimeout(() => {
        if (currentIndex < dialogue.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1800);
    }
  };

  const handleChildOption = (option: string, optionIndex: number) => {
    if (optionIndex === line.correct) {
      speak(option);
      setCorrectCount(prev => prev + 1);
      setMessages(prev => [...prev, { speaker: 'child', text: option, isEnglish: true }]);
      setFeedback(getEncouragement());
      setAttempts(0);
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < dialogue.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          const total = dialogue.filter(d => d.speaker === 'child').length;
          onComplete(Math.round(correctCount / total * 100));
        }
      }, 1200);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setFeedback(getAlmostMessage());
        setMessages(prev => [...prev, { speaker: 'child', text: line.options![line.correct!], isEnglish: true }]);
        setTimeout(() => {
          setFeedback(null);
          if (currentIndex < dialogue.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            const total = dialogue.filter(d => d.speaker === 'child').length;
            onComplete(Math.round((correctCount + 0.5) / total * 100));
          }
        }, 1500);
      } else {
        setFeedback(getTryAgainMessage());
        setTimeout(() => setFeedback(null), 600);
      }
    }
  };

  // Auto-trigger coach lines
  if (line?.speaker === 'coach' && !messages.find(m => m.text === line.text)) {
    setTimeout(handleCoachLine, 600);
  }

  return (
    <div className="flex flex-col min-h-[60vh] p-4">
      <div className="flex-1 space-y-3 mb-4 max-w-md mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className={`flex ${msg.speaker === 'coach' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`rounded-3xl px-5 py-3 max-w-[80%] shadow-md ${
                  msg.speaker === 'coach'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.speaker === 'coach' && <span className="text-xs block mb-1 opacity-80">👨‍🏫 המאמן דויד</span>}
                <span className={msg.isEnglish ? 'text-english font-nunito font-bold text-kid' : 'font-rubik text-sm'}>
                  {msg.text}
                </span>
                {msg.isEnglish && (
                  <button onClick={() => speak(msg.text)} className="mr-2 inline-block opacity-70 hover:opacity-100">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {line?.speaker === 'child' && line.options && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md mx-auto w-full"
        >
          <p className="text-center text-sm font-rubik text-muted-foreground mb-3">{line.hebrew}</p>
          <div className="space-y-2">
            {line.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleChildOption(option, i)}
                className="w-full fun-card rounded-2xl p-4 tap-target text-english font-nunito font-bold text-kid text-center"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center mt-4 text-kid-lg font-rubik font-bold bg-card/80 backdrop-blur rounded-2xl px-6 py-3 shadow-lg mx-auto"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationLesson;
