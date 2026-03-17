'use client';

const ECOSYSTEM_PLAYERS = [
  {
    icon: '🏛️',
    title: 'יחידות דיגיטל ממשלתיות',
    desc: 'יחידות ICT, מטות חדשנות, ממשל דיגיטלי — המנוע הפנימי לאימוץ AI',
  },
  {
    icon: '🎓',
    title: 'מוסדות אקדמיים',
    desc: 'חוקרים ומרצים המפתחים ידע ב-AI ממשלתי, אתיקה ומדיניות ציבורית',
  },
  {
    icon: '🚀',
    title: 'GovTech Startups',
    desc: 'חברות טכנולוגיה שבונות פתרונות ייעודיים למגזר הציבורי',
  },
  {
    icon: '👥',
    title: 'קהילות מקצועיות',
    desc: 'רשתות של מובילי AI, מנהלי פרויקטים ומומחי מדיניות — שיתוף ידע ברמה גבוהה',
  },
  {
    icon: '🤝',
    title: 'ארגונים בינלאומיים',
    desc: 'OECD, UN eGov, ממשלות שכנות — ניסיון גלובלי שניתן להתאים לישראל',
  },
  {
    icon: '⚖️',
    title: 'רגולטורים ומדיניות',
    desc: 'ILITA, משרד המשפטים, מחלקות משפט — מסגרת רגולטורית שמאפשרת שימוש אחראי',
  },
];

export default function EcosystemSection() {
  return (
    <section
      className="mb-16 rounded-3xl p-8 sm:p-10 relative overflow-hidden"
      aria-label="אקו-סיסטם"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(106,155,204,.06) 0%, transparent 70%)',
        border: '1px solid rgba(106,155,204,.12)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-secondary" />
        <span className="text-xs font-heading font-bold text-secondary uppercase tracking-widest">
          הסביבה הרחבה
        </span>
      </div>
      <h2 className="font-heading font-black text-text text-2xl sm:text-3xl mb-3">
        המקפצה כתשתית ידע לאקו-סיסטם
      </h2>
      <p className="text-muted text-base mb-8 max-w-2xl leading-relaxed">
        האצת AI בממשלה היא מאמץ משותף — לא פרויקט של גוף אחד. המקפצה מתאימה להיות
        תשתית ידע משותפת שמשרתת את כלל שחקני המערכת.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ECOSYSTEM_PLAYERS.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl p-5 bg-surface/30 border border-border/40 hover:border-secondary/30 transition-all"
          >
            <span className="text-xl block mb-2" aria-hidden="true">{icon}</span>
            <h3 className="font-heading font-semibold text-text text-sm mb-1.5">{title}</h3>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Community + Contribute combined */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Community */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: 'linear-gradient(135deg, rgba(217,119,87,.06), rgba(217,119,87,.02))',
            borderColor: 'rgba(217,119,87,.2)',
          }}
        >
          <span className="text-3xl block mb-3">🔥</span>
          <h3 className="font-heading font-bold text-text text-lg mb-2">
            קהילת מאיצי AI במגזר הציבורי
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3">
            המטרה היא לאפשר לאנשי מקצוע מכל הממשלה ללמוד, להתנסות ולשתף פרקטיקות.
            כל פריצת דרך של עמית — מרימה את כולם.
          </p>
          <p className="text-xs text-accent font-heading font-semibold">
            מוזמנים לשתף את הפלטפורמה עם קולגות 👇
          </p>
        </div>

        {/* Contribute */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: 'linear-gradient(135deg, rgba(106,155,204,.06), rgba(106,155,204,.02))',
            borderColor: 'rgba(106,155,204,.2)',
          }}
        >
          <span className="text-3xl block mb-3">💡</span>
          <h3 className="font-heading font-bold text-text text-lg mb-2">
            יש לכם ידע לתרום?
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3">
            יש לכם מקרה שימוש, כלי או מתודולוגיה ממשלתית שעובדת?
            הפלטפורמה מתוכננת להתפתח עם הידע שהקהילה צוברת בשטח.
          </p>
          <a
            href="https://www.linkedin.com/in/aviad-yitzhaki/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-secondary font-heading font-semibold hover:underline"
          >
            צרו קשר דרך LinkedIn
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
