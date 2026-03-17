'use client';

const GLOBAL_EXAMPLES = [
  {
    country: '🇸🇬',
    name: 'סינגפור',
    org: 'GovTech Singapore',
    desc: 'תכנית AI Adoption Framework לכל עובדי המדינה, כולל הכשרה פרקטית לכל הדרגים',
  },
  {
    country: '🇬🇧',
    name: 'בריטניה',
    org: 'Government AI Playbook',
    desc: 'מסמך מדיניות לאומי לשילוב AI בשירות הציבורי — כולל עקרונות אתיקה, כלים ויישומים',
  },
  {
    country: '🇪🇪',
    name: 'אסטוניה',
    org: 'Digital Government',
    desc: 'מדינה דיגיטלית לחלוטין — 99% שירותים ממשלתיים מקוונים, עם שילוב AI פעיל בשירות האזרחי',
  },
  {
    country: '🌐',
    name: 'OECD',
    org: 'AI Policy Framework',
    desc: '42 מדינות חתמו על עקרונות AI לממשל — מדגישות חיוניות בניית יכולת לאומית',
  },
];

export default function NationalContextSection() {
  return (
    <section
      className="mb-16 relative overflow-hidden rounded-3xl"
      aria-label="ההקשר הלאומי"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(106,155,204,.08) 0%, transparent 70%)',
        border: '1px solid rgba(106,155,204,.15)',
      }}
    >
      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 rounded-full bg-secondary" />
          <span className="text-xs font-heading font-bold text-secondary uppercase tracking-widest">
            ההקשר הלאומי והגלובלי
          </span>
        </div>
        <h2 className="font-heading font-black text-text text-2xl sm:text-3xl mb-3 leading-snug">
          ממשלות בעולם משקיעות ב-AI.<br />
          <span className="text-secondary">ישראל לא יכולה להישאר מאחור.</span>
        </h2>
        <p className="text-muted text-base max-w-2xl mb-10 leading-relaxed">
          מדינות מובילות לא מחכות שה-AI "ייכנס" לממשל — הן בונות תשתיות יכולת, מכשירות עובדים,
          ומייצרות מסגרות לאימוץ מהיר. ישראל, עם בסיס חדשנות חזק, נמצאת בנקודת זמן קריטית.
        </p>

        {/* Global examples */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {GLOBAL_EXAMPLES.map(({ country, name, org, desc }) => (
            <div
              key={name}
              className="rounded-2xl p-5 bg-surface/40 border border-border/50 hover:border-secondary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{country}</span>
                <div>
                  <p className="font-heading font-bold text-text text-sm">{name}</p>
                  <p className="text-xs text-secondary font-heading">{org}</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Israel call-out */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{
            background:
              'linear-gradient(135deg, rgba(217,119,87,.08) 0%, rgba(106,155,204,.08) 100%)',
            border: '1px solid rgba(217,119,87,.2)',
          }}
        >
          <span className="text-4xl flex-shrink-0">🇮🇱</span>
          <div>
            <p className="font-heading font-bold text-text text-base mb-1">
              ישראל — פוטנציאל גדול, פער יכולת אמיתי
            </p>
            <p className="text-sm text-muted leading-relaxed">
              למגזר הציבורי הישראלי יש כוח אדם מוכשר, מנדט לחדשנות ותשתיות דיגיטליות בצמיחה —
              אך חסרה פלטפורמת ידע מעשית ומרכזית שתבנה יכולות AI לכל הדרגים.
              <strong className="text-accent"> זו הסיבה שבנינו את המקפצה.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
