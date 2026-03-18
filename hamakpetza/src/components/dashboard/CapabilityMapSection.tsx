'use client';

const CAPABILITY_LAYERS = [
  {
    level: '01',
    name: 'אוריינות AI',
    color: '#6a9bcc',
    icon: '🧠',
    desc: 'הבנת LLM, יכולות וגבולות, השוואת מודלים וחשיבה ביקורתית על AI',
    units: ['יחידות 1, 2'],
    tag: 'Foundation',
  },
  {
    level: '02',
    name: 'הנדסת פרומפט ויצירת תוכן',
    color: '#9b6acc',
    icon: '✍️',
    desc: 'כתיבת הנחיות אפקטיביות, תבניות ממשלתיות, AI לכתיבה ותקשורת',
    units: ['יחידות 3, 4'],
    tag: 'Applied',
  },
  {
    level: '03',
    name: 'יישומי AI בעבודה הממשלתית',
    color: '#cc9b6a',
    icon: '💼',
    desc: 'ניתוח נתונים, חיפוש ומחקר, חשיבה אסטרטגית, שירות לאזרח ואוטומציה',
    units: ['יחידות 5, 6, 7, 9, 10'],
    tag: 'Applied',
  },
  {
    level: '04',
    name: 'תשתיות ידע — RAG ו-NotebookLM',
    color: '#d97753',
    icon: '🏗️',
    desc: 'חיבור AI למאגרי ידע ארגוניים, ניהול ידע ומחקר מבוסס מסמכים',
    units: ['יחידות 11, 15'],
    tag: 'Advanced',
  },
  {
    level: '05',
    name: 'ענן, פיתוח וסוכני AI',
    color: '#5cad7a',
    icon: '☁️',
    desc: 'ענן ממשלתי (AWS, GCP, נימבוס), פיתוח תוכנה עם AI וסוכנים אוטונומיים',
    units: ['יחידות 12, 13, 16'],
    tag: 'Advanced',
  },
  {
    level: '06',
    name: 'אתיקה, מדיניות ו-AI גלובלי',
    color: '#cc6a7e',
    icon: '⚖️',
    desc: 'עקרונות אתיים, רגולציה, ניהול סיכונים ולקחים מממשלות בעולם',
    units: ['יחידות 8, 14'],
    tag: 'Strategic',
  },
];

const TAG_COLORS: Record<string, string> = {
  Foundation: 'text-secondary bg-secondary-light',
  Applied: 'text-accent bg-accent-light',
  Advanced: 'text-accent bg-accent-light',
  Strategic: 'text-secondary bg-secondary-light',
};

export default function CapabilityMapSection() {
  return (
    <section className="mb-16" aria-label="מפת יכולות AI לממשלה">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-accent" />
        <span className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
          מסגרת יכולות
        </span>
      </div>
      <h2 className="font-heading font-black text-text text-2xl sm:text-3xl mb-2">
        מפת יכולות ה-AI לממשלה
      </h2>
      <p className="text-muted text-base mb-8 max-w-2xl leading-relaxed">
        ממשלה מוכנת ל-AI לא בנויה על כלי אחד — היא בנויה על שכבות יכולת. כל שכבה מאפשרת
        לארגון ממשלתי לפעול ברמה גבוהה יותר.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAPABILITY_LAYERS.map(({ level, name, color, icon, desc, units, tag }) => (
          <div
            key={level}
            className="relative rounded-2xl p-5 border border-border/50 bg-surface/30 hover:border-border hover:bg-surface/60 transition-all group overflow-hidden"
          >
            {/* Color bar */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ background: color }}
            />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-heading font-black opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ color }}
                >
                  {level}
                </span>
                <span className="text-xl" aria-hidden="true">{icon}</span>
              </div>
              <span
                className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}
              >
                {tag}
              </span>
            </div>

            <h3 className="font-heading font-bold text-text text-base mb-1.5">{name}</h3>
            <p className="text-sm text-muted leading-relaxed mb-3">{desc}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-xs text-muted/60">{units.join(', ')} בפלטפורמה</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
