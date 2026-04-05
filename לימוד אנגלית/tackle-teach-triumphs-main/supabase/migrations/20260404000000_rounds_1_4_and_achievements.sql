
-- Seed achievements
INSERT INTO public.achievements (key, title_he, description_he, icon_emoji, condition_type, condition_value) VALUES
('first_goal', 'שער ראשון! ⚽', 'השלמת את השיעור הראשון שלך', '⚽', 'lessons_completed', 1),
('perfect_round', 'ביצוע מושלם! 💯', 'קיבלת 100 בשיעור', '💯', 'perfect_score', 1),
('hat_trick', 'האט-טריק! 🎩', 'השלמת 3 שיעורים', '🎩', 'lessons_completed', 3),
('five_star', 'חמישה כוכבים! ⭐', 'השלמת 5 שיעורים', '⭐', 'lessons_completed', 5),
('ten_lessons', 'לוחם אנגלית! 💪', 'השלמת 10 שיעורים', '💪', 'lessons_completed', 10),
('streak_3', 'שלושה ימים ברצף! 🔥', 'למדת 3 ימים ברצף', '🔥', 'streak_days', 3),
('streak_7', 'שבוע שלם! 🏅', 'למדת 7 ימים ברצף', '🏅', 'streak_days', 7),
('word_master', 'מלך המילים! 👑', 'שיננת 10 מילים', '👑', 'words_mastered', 10),
('champion', 'אלוף! 🏆', 'השלמת את כל שמונת הסבבים', '🏆', 'lessons_completed', 32)
ON CONFLICT (key) DO NOTHING;

-- ROUND 1: Greetings & Alphabet A-E
INSERT INTO public.lessons (season, round, order_in_round, type, topic_tag, title_he, content, xp_reward, boots_reward) VALUES

(1, 1, 1, 'words', 'daily_life', 'שלום בעולם!', '{"words":[{"english":"Hello","hebrew":"שלום","emoji":"👋"},{"english":"Goodbye","hebrew":"להתראות","emoji":"👋"},{"english":"Yes","hebrew":"כן","emoji":"✅"},{"english":"No","hebrew":"לא","emoji":"❌"},{"english":"Please","hebrew":"בבקשה","emoji":"🙏"},{"english":"Thank you","hebrew":"תודה","emoji":"❤️"}]}'::jsonb, 50, 10),

(1, 1, 2, 'letters', 'daily_life', 'אותיות A-E', '{"items":[{"letter":"A","word":"Apple","emoji":"🍎","pronunciation":"אֵי"},{"letter":"B","word":"Ball","emoji":"⚽","pronunciation":"בִּי"},{"letter":"C","word":"Cat","emoji":"🐱","pronunciation":"סִי"},{"letter":"D","word":"Dog","emoji":"🐶","pronunciation":"דִּי"},{"letter":"E","word":"Elephant","emoji":"🐘","pronunciation":"אִי"}]}'::jsonb, 50, 10),

(1, 1, 3, 'quiz', 'daily_life', 'חידון ברכות ואותיות', '{"questions":[{"question":"How do you say שלום in English?","options":["Goodbye","Hello","Please","Thank you"],"correct":1,"emoji":"👋","explanation_he":"Hello = שלום! כך מברכים באנגלית!"},{"question":"What letter does Apple start with?","options":["B","C","A","D"],"correct":2,"emoji":"🍎","explanation_he":"Apple מתחיל באות A!"},{"question":"How do you say תודה?","options":["Please","Yes","Hello","Thank you"],"correct":3,"emoji":"❤️","explanation_he":"Thank you = תודה!"},{"question":"What letter does Ball start with?","options":["A","B","C","D"],"correct":1,"emoji":"⚽","explanation_he":"Ball מתחיל באות B!"},{"question":"How do you say להתראות?","options":["Hello","Please","Goodbye","Yes"],"correct":2,"emoji":"👋","explanation_he":"Goodbye = להתראות!"}],"timer_seconds":20,"speed_bonus":false}'::jsonb, 70, 15),

(1, 1, 4, 'conversation', 'daily_life', 'פגישה ראשונה', '{"dialogue":[{"speaker":"coach","text":"Hello! What is your name?","hebrew":"שלום! מה שמך?","emoji":"👋"},{"speaker":"child","hebrew":"ענה לו שלום!","options":["Hello! My name is David!","Goodbye","I dont know"],"correct":0},{"speaker":"coach","text":"Nice to meet you, David!","hebrew":"נעים להכיר, דוד!","emoji":"😊"},{"speaker":"child","hebrew":"גם לך נעים להכיר!","options":["Nice to meet you too!","OK","Whatever"],"correct":0},{"speaker":"coach","text":"Are you ready to learn English?","hebrew":"אתה מוכן ללמוד אנגלית?","emoji":"📚"},{"speaker":"child","hebrew":"כמובן שכן!","options":["Yes! I am ready!","No","Maybe"],"correct":0}]}'::jsonb, 70, 15),

-- ROUND 2: Numbers & Colors
(1, 2, 1, 'words', 'daily_life', 'מספרים 1-10', '{"words":[{"english":"One","hebrew":"אחד","emoji":"1️⃣"},{"english":"Two","hebrew":"שניים","emoji":"2️⃣"},{"english":"Three","hebrew":"שלושה","emoji":"3️⃣"},{"english":"Five","hebrew":"חמישה","emoji":"5️⃣"},{"english":"Ten","hebrew":"עשרה","emoji":"🔟"}]}'::jsonb, 50, 10),

(1, 2, 2, 'words', 'daily_life', 'צבעים', '{"words":[{"english":"Red","hebrew":"אדום","emoji":"🔴"},{"english":"Blue","hebrew":"כחול","emoji":"🔵"},{"english":"Green","hebrew":"ירוק","emoji":"🟢"},{"english":"Yellow","hebrew":"צהוב","emoji":"🟡"},{"english":"White","hebrew":"לבן","emoji":"⬜"}]}'::jsonb, 50, 10),

(1, 2, 3, 'quiz', 'daily_life', 'חידון מספרים וצבעים', '{"questions":[{"question":"How do you say שניים in English?","options":["One","Three","Two","Five"],"correct":2,"emoji":"2️⃣","explanation_he":"Two = שניים!"},{"question":"What color is the football grass?","options":["Red","Blue","Yellow","Green"],"correct":3,"emoji":"🌿","explanation_he":"Green = ירוק! כמו הדשא במגרש!"},{"question":"How do you say אדום?","options":["Blue","Red","Green","Yellow"],"correct":1,"emoji":"🔴","explanation_he":"Red = אדום!"},{"question":"How many legs does a dog have?","options":["Two","Three","Four","Five"],"correct":2,"emoji":"🐕","explanation_he":"Four = ארבע! לכלב יש 4 רגליים!"},{"question":"What color is the sky?","options":["Green","Red","Blue","Yellow"],"correct":2,"emoji":"☁️","explanation_he":"Blue = כחול! השמיים כחולים!"}],"timer_seconds":20,"speed_bonus":false}'::jsonb, 70, 15),

(1, 2, 4, 'picture_match', 'daily_life', 'התאם צבעים ומספרים', '{"picture_items":[{"word":"Red","hebrew":"אדום","emoji":"🔴"},{"word":"Blue","hebrew":"כחול","emoji":"🔵"},{"word":"Green","hebrew":"ירוק","emoji":"🟢"},{"word":"Yellow","hebrew":"צהוב","emoji":"🟡"},{"word":"One","hebrew":"אחד","emoji":"1️⃣"},{"word":"Two","hebrew":"שניים","emoji":"2️⃣"}]}'::jsonb, 70, 15),

-- ROUND 3: Animals & Nature
(1, 3, 1, 'words', 'daily_life', 'חיות אהובות', '{"words":[{"english":"Dog","hebrew":"כלב","emoji":"🐶"},{"english":"Cat","hebrew":"חתול","emoji":"🐱"},{"english":"Bird","hebrew":"ציפור","emoji":"🐦"},{"english":"Fish","hebrew":"דג","emoji":"🐟"},{"english":"Lion","hebrew":"אריה","emoji":"🦁"}]}'::jsonb, 55, 12),

(1, 3, 2, 'letters', 'daily_life', 'אותיות F-J', '{"items":[{"letter":"F","word":"Football","emoji":"⚽","pronunciation":"אֶף"},{"letter":"G","word":"Goal","emoji":"🥅","pronunciation":"גִּ׳י"},{"letter":"H","word":"Hero","emoji":"🦸","pronunciation":"אֵיי'ץ"},{"letter":"I","word":"Israel","emoji":"🇮🇱","pronunciation":"אַי"},{"letter":"J","word":"Jump","emoji":"🤸","pronunciation":"גֵ׳יי"}]}'::jsonb, 55, 12),

(1, 3, 3, 'quiz', 'daily_life', 'חידון חיות', '{"questions":[{"question":"How do you say כלב in English?","options":["Cat","Bird","Dog","Fish"],"correct":2,"emoji":"🐶","explanation_he":"Dog = כלב!"},{"question":"What letter does Goal start with?","options":["H","F","J","G"],"correct":3,"emoji":"🥅","explanation_he":"Goal מתחיל באות G!"},{"question":"How do you say ציפור?","options":["Dog","Bird","Fish","Cat"],"correct":1,"emoji":"🐦","explanation_he":"Bird = ציפור!"},{"question":"What letter does Football start with?","options":["G","H","F","J"],"correct":2,"emoji":"⚽","explanation_he":"Football מתחיל באות F!"},{"question":"The king of animals is the...","options":["Dog","Cat","Fish","Lion"],"correct":3,"emoji":"🦁","explanation_he":"Lion = אריה! מלך החיות!"}],"timer_seconds":20,"speed_bonus":true}'::jsonb, 75, 18),

(1, 3, 4, 'spelling', 'daily_life', 'כתיב חיות', '{"spelling_items":[{"word":"DOG","hebrew":"כלב","hint":"מסתיים ב-G","emoji":"🐶"},{"word":"CAT","hebrew":"חתול","hint":"שלוש אותיות","emoji":"🐱"},{"word":"BIRD","hebrew":"ציפור","hint":"מתחיל ב-B","emoji":"🐦"},{"word":"FISH","hebrew":"דג","hint":"מתחיל ב-F","emoji":"🐟"},{"word":"LION","hebrew":"אריה","hint":"מלך החיות","emoji":"🦁"}]}'::jsonb, 75, 18),

-- ROUND 4: Basic Football
(1, 4, 1, 'words', 'football', 'כדורגל — מילים בסיסיות', '{"words":[{"english":"Ball","hebrew":"כדור","emoji":"⚽"},{"english":"Goal","hebrew":"שער","emoji":"🥅"},{"english":"Team","hebrew":"קבוצה","emoji":"👥"},{"english":"Player","hebrew":"שחקן","emoji":"🏃"},{"english":"Coach","hebrew":"מאמן","emoji":"📋"}]}'::jsonb, 60, 15),

(1, 4, 2, 'words', 'football', 'עוד מילות כדורגל', '{"words":[{"english":"Win","hebrew":"לנצח","emoji":"🏆"},{"english":"Kick","hebrew":"לבעוט","emoji":"🦵"},{"english":"Run","hebrew":"לרוץ","emoji":"🏃"},{"english":"Pass","hebrew":"מסירה","emoji":"➡️"},{"english":"Field","hebrew":"מגרש","emoji":"🟩"}]}'::jsonb, 60, 15),

(1, 4, 3, 'sentence_builder', 'football', 'בנה משפטי כדורגל', '{"sentence_items":[{"sentence":"I kick the ball","hebrew":"אני בועט בכדור","words":["I","kick","the","ball","run","cat"],"emoji":"⚽"},{"sentence":"The team wins the game","hebrew":"הקבוצה מנצחת במשחק","words":["The","team","wins","the","game","fish"],"emoji":"🏆"},{"sentence":"The coach runs fast","hebrew":"המאמן רץ מהר","words":["The","coach","runs","fast","blue","cat"],"emoji":"📋"},{"sentence":"I love football","hebrew":"אני אוהב כדורגל","words":["I","love","football","dog","green","run"],"emoji":"❤️"}]}'::jsonb, 80, 20),

(1, 4, 4, 'conversation', 'football', 'לפני המשחק', '{"dialogue":[{"speaker":"coach","text":"Are you on the team?","hebrew":"אתה בקבוצה?","emoji":"👥"},{"speaker":"child","hebrew":"כן, אני שחקן!","options":["Yes, I am a player!","No thanks","I am the coach"],"correct":0},{"speaker":"coach","text":"Great! Do you want to kick the ball?","hebrew":"מעולה! אתה רוצה לבעוט בכדור?","emoji":"⚽"},{"speaker":"child","hebrew":"כמובן!","options":["Yes, I want to kick!","No, I want to run","I want to sleep"],"correct":0},{"speaker":"coach","text":"Excellent! Let us win this game!","hebrew":"מצוין! בואו ננצח!","emoji":"🏆"},{"speaker":"child","hebrew":"יאללה ננצח!","options":["Let us win together!","OK","I am tired"],"correct":0}]}'::jsonb, 80, 20);
