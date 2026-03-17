'use client';

const CAPABILITY_LAYERS = [
  {
    level: '01',
    name: 'אוריינות AI',
    color: '#6a9bcc',
    icon: '🧠',
    desc: 'הבנת LLM, יכולות וגבולות, חשיבה ביקורתית על AI',
    units: ['יחידה 1–2'],
    tag: 'Foundation',
  },
  {
    level: '02',
    name: 'הנדסת Prompt',
    color: '#9b6acc',
    icon: '✍️',
    desc: 'יצירת פקודות אפקטיביות, תבניות ממשלתיות, שיפור תוצרים',
    units: ['יחידה 3–4'],
    tag: 'Applied',
  },
  {
    level: '03',
    name: 'אוטומציות',
    color: '#cc9b6a',
    icon: '⚙️',
    desc: 'תהליכי עבודה חכמים, Make / Zapier / Power Automate',
    units: ['יחידה 5–7'],
    tag: 'Applied',
  },
  {
    level: '04',
    name: 'RAG ו-AI Agents',
    color: '#d97753',
    icon: '🏗️',
    desc: 'חיבור ידע ארגוני, סוכנים אוטונומיים, NotebookLM',
    units: ['יחידה 8–11'],
    tag: 'Advanced',
  },
  {
    level: '05',
    name: 'ענן וסביבות AI',
    color: '#5cad7a',
    icon: '☁️',
    desc: 'Azure / AWS / GCP, תשתיות AI ממשלתיות, עלויות ואבטחה',
    units: ['יחידה 12–14'],
    tag: 'Advanced',
  },
  {
    level: '06',
    name: 'ממשל AI',
    color: '#cc6a7e',
    icon: '⚖️',
    desc: 'אתיקה, רגולציה, מדיניות AI, ניהול סיכונים ממשלתיים',
    units: ['יחידה 15–16'],
    tag: 'Strategic',
  },
];

const TAG_COLORS: Record<string, string> = {
  Foundation: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
  Applied: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20',
  Advanced: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
  Strategic: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20',
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
