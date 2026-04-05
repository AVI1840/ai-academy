let americanVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

const loadVoices = () => {
  if (voicesLoaded) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;
  
  voicesLoaded = true;
  
  // Prioritize natural American English voices
  const priorities = [
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.name.includes('Samantha'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.name.includes('Alex'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.name.includes('Ava'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.name.includes('Karen'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium')),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && !v.name.includes('Google') && v.localService,
    (v: SpeechSynthesisVoice) => v.lang === 'en-US' && v.name.includes('Google US'),
    (v: SpeechSynthesisVoice) => v.lang === 'en-US',
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.lang.includes('US'),
  ];
  
  for (const check of priorities) {
    const found = voices.find(check);
    if (found) {
      americanVoice = found;
      console.log('Selected voice:', found.name, found.lang);
      return;
    }
  }
  
  // Fallback to any English voice
  americanVoice = voices.find(v => v.lang.startsWith('en')) || null;
};

// Load voices when available
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speak = (text: string, rate = 0.8) => {
  if (!('speechSynthesis' in window)) return;
  
  loadVoices();
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.05;
  
  if (americanVoice) {
    utterance.voice = americanVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};

export const speakSlow = (text: string) => speak(text, 0.65);
