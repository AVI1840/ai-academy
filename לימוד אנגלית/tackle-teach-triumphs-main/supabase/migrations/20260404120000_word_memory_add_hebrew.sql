-- Add hebrew and emoji columns to word_memory so review screen can teach, not just test
ALTER TABLE public.word_memory
  ADD COLUMN IF NOT EXISTS hebrew TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS emoji TEXT NOT NULL DEFAULT '';
