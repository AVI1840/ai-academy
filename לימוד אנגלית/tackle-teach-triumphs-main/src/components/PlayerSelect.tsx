import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/lib/types';

interface Props {
  onSelect: (userId: string) => void;
}

const playerColors = [
  'from-primary/20 to-pitch-light/30',
  'from-secondary/20 to-gold-light/30',
  'from-sky/20 to-sky-light/30',
  'from-purple-500/20 to-pink-400/30',
];

const playerBorders = [
  'border-primary/40 hover:border-primary',
  'border-secondary/40 hover:border-secondary',
  'border-sky/40 hover:border-sky',
  'border-purple-400/40 hover:border-purple-400',
];

const AVATAR_OPTIONS = ['⚽', '🦁', '🐯', '🦊', '🐼', '🦅', '🚀', '⭐', '🎯', '🔥', '👑', '🏆'];

const PlayerSelect = ({ onSelect }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚽');
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from('users').select('*');
    if (err) {
      setError('לא ניתן להתחבר לשרת. בדוק חיבור אינטרנט.');
    } else {
      setUsers((data as User[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const { data, error: err } = await supabase
      .from('users')
      .insert({ name: newName.trim(), avatar_emoji: selectedAvatar })
      .select()
      .single();
    setCreating(false);
    if (err || !data) {
      setError('שגיאה ביצירת שחקן. נסה שוב.');
      return;
    }
    setShowCreate(false);
    setNewName('');
    onSelect((data as any).id);
  };

  return (
    <div className="min-h-screen stadium-bg flex flex-col items-center justify-center p-6 relative">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-15 pointer-events-none"
          style={{ left: `${5 + (i * 8) % 90}%`, top: `${5 + (i * 13) % 85}%` }}
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >✨</motion.div>
      ))}

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center mb-10 relative z-10"
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >⚽</motion.div>
        <h1 className="text-kid-3xl font-rubik font-black text-primary-foreground mb-3 drop-shadow-lg">
          English Football Academy
        </h1>
        <motion.p
          className="text-kid-lg font-rubik text-primary-foreground/90 drop-shadow-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >⭐ ?מי מתאמן היום</motion.p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-500/80 text-white rounded-2xl px-6 py-3 font-rubik text-center relative z-10"
        >
          {error}
          <button onClick={fetchUsers} className="mr-3 underline text-white/80 text-sm">נסה שוב</button>
        </motion.div>
      )}

      {loading ? (
        <motion.div className="text-5xl relative z-10" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          ⚽
        </motion.div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-2xl relative z-10 flex-wrap justify-center">
          {users.map((user, i) => (
            <motion.button
              key={user.id}
              initial={{ scale: 0, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 180 }}
              whileHover={{ scale: 1.08, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(user.id)}
              className={`flex-1 min-w-[140px] max-w-[200px] rounded-3xl p-8 flex flex-col items-center gap-4 cursor-pointer
                bg-gradient-to-br ${playerColors[i % 4]}
                backdrop-blur-lg border-2 ${playerBorders[i % 4]}
                shadow-xl transition-all duration-300 hover:shadow-2xl`}
            >
              <motion.span
                className="text-8xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              >{user.avatar_emoji}</motion.span>
              <span className="text-kid-xl font-rubik font-bold text-primary-foreground drop-shadow-sm">{user.name}</span>
              <motion.span
                className="text-sm font-rubik text-primary-foreground/70 bg-primary-foreground/10 rounded-full px-4 py-1.5"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >🚀 !בוא נתחיל</motion.span>
            </motion.button>
          ))}

          {users.length < 4 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + users.length * 0.15, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreate(true)}
              className="flex-1 min-w-[140px] max-w-[200px] rounded-3xl p-8 flex flex-col items-center gap-4 cursor-pointer
                bg-white/10 backdrop-blur-lg border-2 border-dashed border-white/40 hover:border-white/70
                shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <span className="text-7xl">➕</span>
              <span className="text-kid-xl font-rubik font-bold text-primary-foreground drop-shadow-sm">שחקן חדש</span>
            </motion.button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              className="bg-card rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-kid-xl font-rubik font-bold text-center mb-6">שחקן חדש ⚽</h2>

              <input
                type="text"
                placeholder="שם השחקן"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                className="w-full rounded-2xl border-2 border-border bg-background px-5 py-4 text-kid font-rubik text-right mb-6 focus:outline-none focus:border-primary"
                autoFocus
              />

              <p className="font-rubik text-center text-muted-foreground mb-3">בחר אווטר</p>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`text-3xl p-2 rounded-xl transition-all ${selectedAvatar === emoji ? 'bg-primary/20 scale-110 ring-2 ring-primary' : 'hover:bg-muted'}`}
                  >{emoji}</button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="flex-1 bg-primary text-primary-foreground font-rubik font-bold rounded-2xl py-4 text-kid disabled:opacity-50"
                >
                  {creating ? '...' : 'בוא נתחיל! 🚀'}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-5 bg-muted rounded-2xl font-rubik text-muted-foreground"
                >ביטול</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerSelect;
