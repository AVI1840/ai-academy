'use client';

const USE_CASES = [
  {
    icon: '🏷️',
    title: 'ניתוח פניות ושירות לאזרח',
    desc: 'סיווג אוטומטי של פניות, זיהוי דפוסים, עדיפויות שירות — AI כשותף לצוות השירות',
  },
  {
    icon: '📄',
    title: 'ניתוח מסמכי מדיניות',
    desc: 'סיכום מסמכים ארוכים, חיפוש בחקיקה, השוואת גרסאות — עם RAG וכלי AI זמינים',
  },
  {
    icon: '🗃️',
    title: 'ניהול ידע ארגוני',
    desc: 'חיבור מסמכים, נהלים ופרוטוקולים לכלי AI שיודע לענות על שאלות עובדים',
  },
  {
    icon: '🔄',
    title: 'אוטומציה של תהליכים אדמיניסטרטיביים',
    desc: 'הפחתת עבודה ידנית חוזרת — טפסים, תיוקים, תיאומים — עם כלי no-code זמינים',
  },
  {
    icon: '🤖',
    title: 'עוזר AI לעובד ציבורי',
    desc: 'Copilot אישי שמכיר נהלים, תקנות ונוהלי ארגון — זמין לכל עובד',
  },
  {
    icon: '📊',
    title: 'ניתוח נתונים ודאשבורדים',
    desc: 'הפיכת נתוני Excel ל-insights פעילים, visualizations והמלצות — בלי data scientists',
  },
];

export default function UseCaseAreasSection() {
  return (
    <section className="mb-16" aria-label="אזורי שימוש אפשריים">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-secondary" />
        <span className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
          יישומים ממשלתיים
        </span>
      </div>
      <h2 className="font-heading font-black text-text text-2xl sm:text-3xl mb-2">
        אזורי שימוש אפשריים ל-AI בממשלה
      </h2>
      <p className="text-muted text-base mb-8 max-w-2xl leading-relaxed">
        אלה תרחישי שימוש <strong className="text-text">אפשריים</strong> — שניתן לממש עם
        הידע שנלמד בפלטפורמה. דוגמאות נוספות יתווספו על בסיס ניסיון אמיתי שיצטבר מהקהילה.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {USE_CASES.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl p-5 border border-border/50 bg-surface/30 hover:border-secondary/30 hover:bg-surface/60 transition-all group"
          >
            <span className="text-2xl block mb-3" aria-hidden="true">{icon}</span>
            <h3 className="font-heading font-semibold text-text text-sm mb-2">{title}</h3>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted/60 text-center italic">
        * דוגמאות נוספות יתווספו ככל שהפלטפורמה תצמח ותצבור ניסיון מהשטח
      </p>
    </section>
  );
}
