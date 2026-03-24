'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'btl-feedback-hamakpetza';
const APP_NAME = 'המקפצה';
const NAME_KEY = 'btl-feedback-user-name';
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbwD8CMFoP5XoOwRLwK_OxMMOFKF8fS2CRpbJkNdOHjbnJIepkOLzlGrg3GQNGRqbwB6bA/exec';

type TabMode = 'feedback' | 'collab';

interface FeedbackEntry {
  id: string;
  name: string;
  tab: TabMode;
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
        category: entry.tab === 'collab' ? '🤝 שת"פ ותמיכה' : (entry.category || 'כללי'),
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

const CATEGORIES = ['🐛 באג', '💡 שיפור', '📊 נתונים', '🎨 עיצוב'];
const SEVERITIES = ['קריטי', 'שיפור', 'קטן'];

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabMode>('feedback');
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

  const resetForm = () => {
    setText('');
    setCollab('');
    setSeverity(SEVERITIES[1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = tab === 'feedback' ? text.trim() : collab.trim() || text.trim();
    if (!hasContent) return;

    setStatus('sending');
    try { localStorage.setItem(NAME_KEY, name); } catch {}

    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      name: name.trim() || 'אנונימי',
      tab,
      category: tab === 'feedback' ? category : '🤝 שת"פ ותמיכה',
      severity: tab === 'feedback' ? severity : '—',
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
    resetForm();
    setTimeout(() => setStatus('idle'), 3500);
  };

  const isDisabled =
    status === 'sending' ||
    (tab === 'feedback' && !text.trim()) ||
    (tab === 'collab' && !collab.trim() && !text.trim());

  const switchTab = (next: TabMode) => {
    setTab(next);
    setStatus('idle');
    resetForm();
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-6 z-50 flex items-center gap-2 px-4 py-2.5
          rounded-full bg-accent text-white text-sm font-heading font-semibold
          shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/50 hover:scale-105
          transition-all duration-200"
        aria-label="פתח טופס משוב ושיתוף פעולה"
      >
        💬 <span>משוב ושת"פ</span>
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm
            flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Modal */}
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl bg-surface border border-border
              text-text font-body overflow-hidden"
            dir="rtl"
          >

            {/* ── Top bar ── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <span className="text-xs text-muted">המקפצה — אקדמיית AI</span>
              <div className="flex items-center gap-3">
                {!showHistory && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="text-xs text-muted hover:text-accent transition-colors"
                  >
                    היסטוריה ({history.length})
                  </button>
                )}
                {showHistory && (
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    ← חזרה
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted hover:text-text transition-colors text-base leading-none"
                  aria-label="סגור"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Tabs ── */}
            {!showHistory && (
              <div className="flex mx-5 mb-0 rounded-xl bg-surface-2 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => switchTab('feedback')}
                  className={`flex-1 py-2 rounded-lg text-sm font-heading font-semibold
                    transition-all duration-200
                    ${tab === 'feedback'
                      ? 'bg-surface shadow text-text'
                      : 'text-muted hover:text-text'}`}
                >
                  💬 משוב לשיפור
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('collab')}
                  className={`flex-1 py-2 rounded-lg text-sm font-heading font-semibold
                    transition-all duration-200
                    ${tab === 'collab'
                      ? 'bg-accent text-white shadow'
                      : 'text-muted hover:text-text'}`}
                >
                  🤝 שת"פ ותמיכה
                </button>
              </div>
            )}

            {/* ── Divider ── */}
            <div className="h-px bg-border mx-5 mt-3" />

            {/* ══════════════════════════════════
                HISTORY VIEW
            ══════════════════════════════════ */}
            {showHistory ? (
              <div className="px-5 py-4 max-h-[65vh] overflow-y-auto space-y-3">
                {history.length === 0 ? (
                  <p className="text-muted text-sm text-center py-10">אין משובים עדיין</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-surface-2 border border-border p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.tab === 'collab' ? '🤝' : '💬'}</span>
                          <span className="font-semibold text-text text-xs truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-muted text-xs shrink-0">{item.timestamp}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-muted text-xs bg-surface px-2 py-0.5 rounded-full border border-border">
                          {item.category}
                        </span>
                        {item.tab === 'feedback' && (
                          <span className="text-muted text-xs bg-surface px-2 py-0.5 rounded-full border border-border">
                            {item.severity}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          ${item.sent
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                          {item.sent ? '✅ נשלח' : '⏳ מקומי'}
                        </span>
                      </div>
                      {item.collab && (
                        <p className="text-accent/90 text-xs mb-1.5 leading-relaxed
                          border-r-2 border-accent/40 pr-2">
                          {item.collab}
                        </p>
                      )}
                      {item.text && (
                        <p className="text-text/70 text-xs leading-relaxed">{item.text}</p>
                      )}
                    </div>
                  ))
                )}
              </div>

            /* ══════════════════════════════════
               FEEDBACK FORM
            ══════════════════════════════════ */
            ) : tab === 'feedback' ? (
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs text-muted mb-1.5" htmlFor="fb-name">
                    שם (אופציונלי)
                  </label>
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
                  <label className="block text-xs text-muted mb-1.5">קטגוריה</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                          ${category === cat
                            ? 'bg-accent/15 border-accent text-accent font-semibold'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-xs text-muted mb-1.5">חומרה</label>
                  <div className="flex gap-2">
                    {SEVERITIES.map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                          ${severity === sev
                            ? 'bg-accent/15 border-accent text-accent font-semibold'
                            : 'bg-surface-2 border-border text-muted hover:border-accent/50'}`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <label className="block text-xs text-muted mb-1.5" htmlFor="fb-text">
                    תיאור
                  </label>
                  <textarea
                    id="fb-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    required
                    placeholder="תאר/י את הבאג, ההצעה, או ההערה..."
                    className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                      px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                      transition-colors resize-none"
                  />
                </div>

                {status === 'sent' && (
                  <p className="text-sm text-green-500 font-medium">✅ נשלח בהצלחה — תודה!</p>
                )}
                {status === 'local' && (
                  <p className="text-sm text-yellow-500 font-medium">⏳ נשמר מקומית</p>
                )}

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-heading font-semibold
                    text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {status === 'sending' ? 'שולח...' : 'שלח משוב'}
                </button>
              </form>

            /* ══════════════════════════════════
               COLLAB FORM
            ══════════════════════════════════ */
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Intro card */}
                <div className="rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
                  <p className="text-sm text-text/80 leading-relaxed">
                    רוצה לשתף פעולה, לתמוך במיזם, לחבר בין ארגונים, להציע משאבים או להיות שותף?
                  </p>
                  <p className="text-sm text-accent font-medium mt-1">
                    נשמח לשמוע — כתוב/י בחופשיות ✍️
                  </p>
                </div>

                {/* Name + Role */}
                <div>
                  <label className="block text-xs text-muted mb-1.5" htmlFor="fb-collab-name">
                    שם, תפקיד וארגון
                  </label>
                  <input
                    id="fb-collab-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="למשל: ד&quot;ר חנה לוי, מנהלת הכשרות, משרד החינוך"
                    className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                      px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                      transition-colors"
                  />
                </div>

                {/* Collab — main open field */}
                <div>
                  <label className="block text-xs text-muted mb-1.5" htmlFor="fb-collab">
                    הצעה לשיתוף פעולה / תמיכה
                  </label>
                  <textarea
                    id="fb-collab"
                    value={collab}
                    onChange={(e) => setCollab(e.target.value)}
                    rows={5}
                    placeholder={`מה אתה/את מביא/ה? למשל:\n• ארגון שלי רוצה לאמץ את המקפצה\n• יש לי קשר לגוף מממן / פילנתרופי\n• אוכל לסייע בתוכן, הדרכה, פיתוח\n• יש לי רעיון לשותפות אסטרטגית`}
                    className="w-full rounded-lg bg-surface-2 border border-accent/30 text-text text-sm
                      px-3 py-2.5 placeholder:text-muted/60 focus:outline-none focus:border-accent
                      transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-xs text-muted mb-1.5" htmlFor="fb-contact">
                    דרכי יצירת קשר (אופציונלי)
                  </label>
                  <input
                    id="fb-contact"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="מייל, טלפון, LinkedIn..."
                    className="w-full rounded-lg bg-surface-2 border border-border text-text text-sm
                      px-3 py-2 placeholder:text-muted focus:outline-none focus:border-accent
                      transition-colors"
                  />
                </div>

                {status === 'sent' && (
                  <p className="text-sm text-green-500 font-medium">
                    ✅ נשלח — נחזור אליך בהקדם!
                  </p>
                )}
                {status === 'local' && (
                  <p className="text-sm text-yellow-500 font-medium">⏳ נשמר מקומית</p>
                )}

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-heading font-semibold
                    text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  {status === 'sending' ? 'שולח...' : '🤝 שלח הצעה לשיתוף פעולה'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
