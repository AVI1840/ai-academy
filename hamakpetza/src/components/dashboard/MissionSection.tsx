'use client';

const PILLARS = [
  {
    icon: '⚡',
    title: 'האצה ×10',
    desc: 'ידע מעשי שמאיץ עובדי ציבור מ"שמעתי על AI" לכלי עבודה יומיומי — בלי רקע טכני מוקדם',
  },
  {
    icon: '🤝',
    title: 'יחד, לא לבד',
    desc: 'מקפצה בנויה על שיתוף ידע בין מובילים — כי כל פריצת דרך של עמית מרימה את כולם',
  },
  {
    icon: '🏛️',
    title: 'ממשלתי ממש',
    desc: 'דוגמאות, תרחישים ויישומים שנלקחו מהמציאות הממשלתית — לא מעולם ה-startup',
  },
  {
    icon: '🔓',
    title: 'פתוח לחלוטין',
    desc: 'קוד פתוח, חינם, ללא הרשמה. תשתית ידע שנבנית בשקיפות ומוזמנת לשכפול ושיפור',
  },
];

export default function MissionSection() {
  return (
    <section
      className="mb-16 text-center relative"
      aria-label="המשימה"
    >
      {/* Big mission statement */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-accent text-xs font-heading font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
          המשימה שלנו
        </div>
        <h2
          className="font-heading font-black text-text leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          להאיץ פי&nbsp;
          <span
            style={{
              background: 'linear-gradient(135deg, #d97753, #6a9bcc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ×10
          </span>
          &nbsp;את יכולות ה-AI<br />
          במגזר הציבורי
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          באמצעות ידע מעשי, כלים ומתודולוגיות — שמאפשרים לכל עובד ציבור להפוך מ"משתמש"
          ל<strong className="text-text">מוביל AI</strong> בארגון שלו.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
        {PILLARS.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="glass-card rounded-2xl p-6 border border-border/50 hover:border-accent/20 transition-all hover:-translate-y-0.5"
          >
            <span className="text-3xl block mb-3" aria-hidden="true">{icon}</span>
            <h3 className="font-heading font-bold text-text text-base mb-2">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
