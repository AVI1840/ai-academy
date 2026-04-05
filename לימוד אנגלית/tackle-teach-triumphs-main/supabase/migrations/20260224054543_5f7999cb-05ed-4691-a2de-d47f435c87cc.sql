
-- Users table (no auth needed - kids select their profile)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL DEFAULT '⚽',
  total_points INTEGER NOT NULL DEFAULT 0,
  golden_boots INTEGER NOT NULL DEFAULT 0,
  current_season INTEGER NOT NULL DEFAULT 1,
  current_round INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Public read/write since kids don't have accounts
CREATE POLICY "Anyone can read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season INTEGER NOT NULL DEFAULT 1,
  round INTEGER NOT NULL DEFAULT 1,
  order_in_round INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  title_he TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 50,
  boots_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);

-- Progress table
CREATE TABLE public.progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read progress" ON public.progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert progress" ON public.progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update progress" ON public.progress FOR UPDATE USING (true);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title_he TEXT NOT NULL,
  description_he TEXT NOT NULL,
  icon_emoji TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read user_achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can insert user_achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Leaderboard weekly
CREATE TABLE public.leaderboard_weekly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.leaderboard_weekly ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard_weekly FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON public.leaderboard_weekly FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update leaderboard" ON public.leaderboard_weekly FOR UPDATE USING (true);

-- Word memory (spaced repetition)
CREATE TABLE public.word_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  mastery_level INTEGER NOT NULL DEFAULT 0,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, word)
);

ALTER TABLE public.word_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read word_memory" ON public.word_memory FOR SELECT USING (true);
CREATE POLICY "Anyone can insert word_memory" ON public.word_memory FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update word_memory" ON public.word_memory FOR UPDATE USING (true);

-- Lesson flags
CREATE TABLE public.lesson_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  needs_review BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read lesson_flags" ON public.lesson_flags FOR SELECT USING (true);
CREATE POLICY "Anyone can insert lesson_flags" ON public.lesson_flags FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update lesson_flags" ON public.lesson_flags FOR UPDATE USING (true);
