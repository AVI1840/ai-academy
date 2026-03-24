'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'btl-feedback-hamakpetza';
const APP_NAME = 'המקפצה';
const NAME_KEY = 'btl-feedback-user-name';
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwD8CMFoP5XoOwRLwK_OxMMOFKF8fS2CRpbJkNdOHjbnJIepkOLzlGrg3GQNGRqbwB6bA/exec';

interface FeedbackEntry {
  id: string;
  name: string;
  category: string;
  severity: string;
  text: string;
  collab: string;
  page: string;
  timestamp: string;
  sent: boolean;
}

async function sendToSheet(entry: FeedbackEntry): Promise<boolean> {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: APP_NAME,
        name: entry.name || 'אנונימי',
        category: entry.category || 'כללי',
        severity: entry.severity || '—',
        text: entry.text,
        collab: entry.collab || '',
        page: window.location.pathname,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

function loadHistory(): FeedbackEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(entries: FeedbackEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const CATEGORIES = ['🐛 באג', '💡 שיפור', '📊 נתונים', '🎨 עיצוב', '🤝 שת"פ ותמיכה'];
const COLLAB_CATEGORY = '🤝 שת"פ ותמיכה';
const SEVERITIES = ['קריטי', 'שיפור', 'קטן'];

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [severity, setSeverity] = useState(SEVERITIES[1]);
  const [text, setText] = useState('');
  const [collab, setCollab] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'local'>('idle');
  const [history, setHistory] = useState<FeedbackEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (open) {
      setHistory(loadHistory());
      try {
        setName(localStorage.getItem(NAME_KEY) || '');
      } catch {}
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus('sending');

    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {}

    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      name: name.trim() || 'אנונימי',
      category,
      severity,
      text: text.trim(),
      collab: collab.trim(),
      page: window.location.pathname,
      timestamp: new Date().toLocaleString('he-IL'),
      sent: false,
    };

    const sent = await sendToSheet(entry);
    entry.sent = sent;

    const updated = [entry, ...loadHistory()];
    saveHistory(updated);
    setHistory(updated);

    setStatus(sent ? 'sent' : 'local');
    setText('');
    setCollab('');
    setSeverity(SEVERITIES[1]);

    setTimeout(() => setStatus('idle'), 3500);
  };

  return (
    <>
      {/* Floating trigger button — above ScrollToTop */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-6 z-50 flex items-center gap-2 px-4 py-2
          rounded-full bg-surface border border-border text-muted text-sm font-body
          shadow-[var(--shadow-card)] hover:border-accent hover:text-accent
          transition-all duration-200 backdrop-blur-md"
        aria-label="פתח טופס משוב לשיפור"
      >
        💬 <span>משוב ושת"פ</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Modal */}
          <div
            className="w-full max-w-md rounded-xl shadow-xl bg-surface border border-border
              text-text font-body overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-base">
              {category === COLLAB_CATEGORY ? '🤝 שת"פ ותמיכה במיזם' : '💬 משוב לשיפור'}
            </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHistory(h => !h)}
                  className="text-xs text-muted hover:text-accent transition-colors"
                  aria-label="היסטוריית משובים"
                >
                  {showHistory ? 'טופס' : `היסטוריה (${history.length})`}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted hover:text-text transition-colors text-lg leading-none"
                  aria-label="סגור"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            {showHistory ? (
              <div className="px-5 py-4 max-h-[60vh] overflow-y-auto space-y-3">
                {history.length === 0 ? (
                  <p className="text-muted text-sm text-center py-6">אין משובים עדיין</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="rounded-lg bg-surface-2 border border-border p-3 text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-text truncate">{item.name}</span>
                        <span className="text-muted text-xs shrink-0">{item.timestamp}</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <span className="text-muted text-xs">{item.category}</span>
                        <span className="text-muted text-xs">·</span>
                        <span className="text-muted text-xs">{item.severity}</span>
                        <span className="text-muted text-xs">·</span>
                        <span className={`text-xs ${item.sent ? 'text-green-500' : 'text-yellow-500'}`}>
                          {item.sent ? '✅ נשלח' : '⏳ מקומי'}
                        </span>
                      </div>
                      {item.collab && (
                        <p className="text-accent/80 text-xs mb-1 leading-relaxed">
                          🤝 {item.collab}
                        </p>
                      )}
                      <p className="text-text/80 leading-relaxed">{item.text}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-muted mb-1" htmlFor="fb-name">שם (אופציונלי)</label>
                  <input
                    id="fb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="שם או כינוי"
                    className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                      px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                      transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-muted mb-1">קטגוריה</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                          ${category === cat
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/60'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm text-muted mb-1">חומרה</label>
                  <div className="flex gap-2">
                    {SEVERITIES.map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                          ${severity === sev
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/60'
                          }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collab section — shown only when שת"פ category is selected */}
                {category === COLLAB_CATEGORY && (
                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
                    <p className="text-sm text-muted leading-relaxed">
                      רוצה לשתף פעולה, לתמוך במיזם, לחבר בין ארגונים, או להציע משאבים?
                      נשמח לשמוע — כתוב/י בחופשיות.
                    </p>
                    <div>
                      <label className="block text-sm text-muted mb-1" htmlFor="fb-collab">
                        הצעה לשיתוף פעולה / תמיכה
                      </label>
                      <textarea
                        id="fb-collab"
                        value={collab}
                        onChange={(e) => setCollab(e.target.value)}
                        rows={3}
                        placeholder="למשל: ארגון שלי מעוניין לאמץ את המקפצה, יש לי קשר למוסד חינוכי, יכול לסייע בתוכן..."
                        className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                          px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                          transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Text */}
                <div>
                  <label className="block text-sm text-muted mb-1" htmlFor="fb-text">
                    {category === COLLAB_CATEGORY ? 'פרטים נוספים (אופציונלי)' : 'תיאור'}
                  </label>
                  <textarea
                    id="fb-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={category === COLLAB_CATEGORY ? 2 : 4}
                    required={category !== COLLAB_CATEGORY}
                    placeholder={
                      category === COLLAB_CATEGORY
                        ? 'שם, תפקיד, ארגון, דרכי יצירת קשר..."'
                        : 'תאר/י את הבאג, ההצעה או ההערה...'
                    }
                    className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                      px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                      transition-colors resize-none"
                  />
                </div>

                {/* Status message */}
                {status === 'sent' && (
                  <p className="text-sm text-green-500 font-medium">✅ נשלח בהצלחה — תודה!</p>
                )}
                {status === 'local' && (
                  <p className="text-sm text-yellow-500 font-medium">⏳ נשמר מקומית (שליחה נכשלה)</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    status === 'sending' ||
                    (category !== COLLAB_CATEGORY && !text.trim()) ||
                    (category === COLLAB_CATEGORY && !collab.trim() && !text.trim())
                  }
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-heading font-semibold
                    text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {status === 'sending'
                    ? 'שולח...'
                    : category === COLLAB_CATEGORY
                    ? 'שלח הצעה לשיתוף פעולה'
                    : 'שלח משוב'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
