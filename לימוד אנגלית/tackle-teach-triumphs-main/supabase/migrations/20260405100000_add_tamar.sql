-- Add Tamar as a user starting at round 5 (rounds 1-4 already completed)
DO $$
DECLARE
  tamar_id UUID := gen_random_uuid();
BEGIN

  INSERT INTO public.users (id, name, avatar_emoji, total_points, golden_boots, current_season, current_round, streak_days)
  VALUES (tamar_id, 'תמר', '🦁', 460, 104, 1, 5, 3);

  -- Mark all 16 lessons from rounds 1-4 as completed with good scores
  INSERT INTO public.progress (user_id, lesson_id, score, completed, attempts, completed_at)
  SELECT
    tamar_id,
    l.id,
    CASE
      WHEN l.type = 'quiz'             THEN 90
      WHEN l.type = 'spelling'         THEN 85
      WHEN l.type = 'sentence_builder' THEN 88
      WHEN l.type = 'conversation'     THEN 92
      WHEN l.type = 'picture_match'    THEN 95
      ELSE 88
    END,
    true,
    1,
    now() - (interval '1 day' * (l.round * 2))
  FROM public.lessons l
  WHERE l.season = 1 AND l.round BETWEEN 1 AND 4;

  -- Add word memory for words learned in rounds 1-4
  INSERT INTO public.word_memory (user_id, word, hebrew, emoji, mastery_level, next_review_date)
  VALUES
    (tamar_id, 'Hello',     'שלום',      '👋', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Goodbye',   'להתראות',   '👋', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Please',    'בבקשה',     '🙏', 3, (now() + interval '3 days')::date),
    (tamar_id, 'Thank you', 'תודה',      '❤️', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Red',       'אדום',      '🔴', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Blue',      'כחול',      '🔵', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Green',     'ירוק',      '🟢', 3, (now() + interval '3 days')::date),
    (tamar_id, 'Dog',       'כלב',       '🐶', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Cat',       'חתול',      '🐱', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Bird',      'ציפור',     '🐦', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Ball',      'כדור',      '⚽', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Goal',      'שער',       '🥅', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Team',      'קבוצה',     '👥', 4, (now() + interval '7 days')::date),
    (tamar_id, 'Win',       'לנצח',      '🏆', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Run',       'לרוץ',      '🏃', 4, (now() + interval '7 days')::date),
    (tamar_id, 'One',       'אחד',       '1️⃣', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Two',       'שניים',     '2️⃣', 5, (now() + interval '30 days')::date),
    (tamar_id, 'Lion',      'אריה',      '🦁', 5, (now() + interval '30 days')::date);

  -- Achievement: first_goal, hat_trick, five_star, ten_lessons, streak_3
  INSERT INTO public.user_achievements (user_id, achievement_id)
  SELECT tamar_id, a.id
  FROM public.achievements a
  WHERE a.key IN ('first_goal', 'hat_trick', 'five_star', 'ten_lessons', 'streak_3')
  ON CONFLICT DO NOTHING;

END $$;
