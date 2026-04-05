// Motivational messages in Hebrew - rotating per session
const welcomeMessages = [
  'היום אתה הולך ללמוד משהו מגניב! 🌟',
  'כל מילה שאתה לומד מקרבת אותך לעולם! 🌍',
  'אתה מתקדם מדהים! המשך כך! 💪',
  'היום נכבוש עוד מילים חדשות! 🏆',
  'אתה כבר יודע כל כך הרבה! בוא נוסיף עוד! 🚀',
  'בוא נהפוך אותך לדובר אנגלית! 🎯',
  'היום הוא יום מעולה ללמוד! ☀️',
  'מוכן להרפתקה באנגלית? 🗺️',
  'כל שחקן גדול מתאמן כל יום - גם אתה! ⚽',
  'בוא נגלה מילים חדשות ומדהימות! ✨',
];

const encouragements = [
  'וואו, אתה אלוף! 🌟',
  'מדהים! ממשיך ומשתפר! 💪',
  'כל הכבוד! זה בדיוק נכון! 🎯',
  'יופי של תשובה! 🏆',
  'אתה פשוט מכונה! ⚡',
  'מצוין! כמו שחקן אמיתי! ⚽',
  'בול! אתה מבריק! 💡',
  'נהדר! אתה לומד סופר מהר! 🚀',
  'פצצה! תשובה מושלמת! 💥',
  'אתה רוקסטאר של אנגלית! 🎸',
  'וואלה מדהים! 🤩',
  'אין עליך! 👏',
];

const almostMessages = [
  'כמעט! אתה בכיוון הנכון! 🎯',
  'קרוב מאוד! בוא ננסה שוב! 💪',
  'יופי של ניסיון! עוד פעם! 🌟',
  'את/ה כמעט שם! 🏆',
  'מעולה שניסית! בוא עוד פעם! 🚀',
];

const tryAgainMessages = [
  'בוא ננסה שוב! 💪',
  'עוד ניסיון! אתה יכול! 🌟',
  'נסה שוב, אתה קרוב! ⚽',
  'אפשר! בוא עוד פעם! 🎯',
];

const completionMessages = [
  'שיעור מושלם! אתה אלוף! 🏆',
  'סיימת בסטייל! 💛',
  'מדהים! השתפרת היום! 📈',
  'כל הכבוד! אתה מתקדם מעולה! 🌟',
  'אתה כוכב! 🌠',
];

const streakMessages: Record<number, string> = {
  1: 'יום ראשון! הדרך מתחילה! 🌱',
  2: 'יומיים רצופים! כל הכבוד! 🔥',
  3: 'שלושה ימים! האטריק שלך! 🎩',
  5: 'חמישה ימים! אתה על גל! 🌊',
  7: 'שבוע שלם! אתה מכונה! 💪',
  10: 'עשרה ימים! מדהים! 🏆',
  14: 'שבועיים! אתה אגדה! 👑',
  30: 'חודש שלם! אתה כוכב! ⭐',
};

export const getRandomWelcome = (name: string) => {
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
};

export const getEncouragement = () => {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

export const getAlmostMessage = () => {
  return almostMessages[Math.floor(Math.random() * almostMessages.length)];
};

export const getTryAgainMessage = () => {
  return tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)];
};

export const getCompletionMessage = (score: number) => {
  if (score >= 100) return 'מושלם! 100%! אתה אלוף אמיתי! 👑🏆';
  if (score >= 80) return completionMessages[Math.floor(Math.random() * completionMessages.length)];
  return 'כל הכבוד שהתאמנת! כל תרגול מחזק אותך! 💪';
};

export const getStreakMessage = (days: number) => {
  const milestones = Object.keys(streakMessages).map(Number).sort((a, b) => b - a);
  for (const milestone of milestones) {
    if (days >= milestone) return streakMessages[milestone];
  }
  return null;
};

export const getDailyTip = () => {
  const tips = [
    '💡 טיפ: תגיד את המילים בקול רם! זה עוזר לזכור',
    '💡 טיפ: תנסה להשתמש במילה חדשה כל יום',
    '💡 טיפ: תלמד עם חבר! ביחד יותר כיף',
    '💡 טיפ: תקשיב לשיר באנגלית ותנסה להבין מילים',
    '💡 טיפ: אל תפחד לטעות - ככה לומדים!',
    '💡 טיפ: תאמן 5 דקות כל יום - זה הסוד!',
    '💡 טיפ: תדמיין שאתה מדבר עם חבר מאמריקה',
    '💡 טיפ: כל מילה שאתה לומד פותחת דלת חדשה בעולם',
    '💡 טיפ: תנסה לחשוב על מילים באנגלית כשאתה משחק',
    '💡 טיפ: אפילו 3 מילים ביום = 1000 מילים בשנה!',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};
