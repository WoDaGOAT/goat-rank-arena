
-- Update the create_quiz function to enforce exactly 5 questions
CREATE OR REPLACE FUNCTION public.create_quiz(
    p_title TEXT,
    p_topic TEXT,
    p_active_date DATE,
    p_questions JSONB
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_quiz_id uuid;
    question jsonb;
    new_question_id uuid;
    answer jsonb;
    question_count integer;
BEGIN
    -- Validate that exactly 5 questions are provided
    SELECT jsonb_array_length(p_questions) INTO question_count;
    
    IF question_count != 5 THEN
        RAISE EXCEPTION 'Daily quizzes must have exactly 5 questions. Provided: %', question_count;
    END IF;

    -- Insert the new quiz
    INSERT INTO public.quizzes (title, topic, active_date)
    VALUES (p_title, p_topic, p_active_date)
    RETURNING id INTO new_quiz_id;

    -- Loop through questions
    FOR question IN SELECT * FROM jsonb_array_elements(p_questions)
    LOOP
        INSERT INTO public.quiz_questions (quiz_id, question_text, "order")
        VALUES (new_quiz_id, question->>'question_text', (question->>'order')::integer)
        RETURNING id INTO new_question_id;

        -- Loop through answers for the current question
        FOR answer IN SELECT * FROM jsonb_array_elements(question->'answers')
        LOOP
            INSERT INTO public.quiz_answers (question_id, answer_text, is_correct)
            VALUES (new_question_id, answer->>'answer_text', (answer->>'is_correct')::boolean);
        END LOOP;
    END LOOP;

    RETURN new_quiz_id;
END;
$$;

-- Update the badge checking function to work with 5-question format
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  user_stats RECORD;
  total_quizzes INTEGER;
  current_streak INTEGER;
  perfect_scores INTEGER;
  accuracy_percentage DECIMAL;
BEGIN
  -- Get user quiz statistics (now standardized to 5 questions per quiz)
  SELECT 
    COUNT(*) as quiz_count,
    COALESCE(SUM(score), 0) as total_correct,
    COUNT(*) * 5 as total_questions, -- Each quiz now has exactly 5 questions
    COUNT(CASE WHEN score = 5 THEN 1 END) as perfect_count -- Perfect score is now 5/5
  INTO user_stats
  FROM quiz_attempts qa
  WHERE qa.user_id = p_user_id;

  total_quizzes := user_stats.quiz_count;
  perfect_scores := user_stats.perfect_count;
  
  -- Calculate accuracy based on 5-question format
  IF user_stats.total_questions > 0 THEN
    accuracy_percentage := (user_stats.total_correct::DECIMAL / user_stats.total_questions::DECIMAL) * 100;
  ELSE
    accuracy_percentage := 0;
  END IF;

  -- Calculate current streak (simplified - just check if user has taken quiz today and yesterday)
  SELECT CASE 
    WHEN EXISTS (
      SELECT 1 FROM quiz_attempts qa2 
      JOIN quizzes q ON qa2.quiz_id = q.id 
      WHERE qa2.user_id = p_user_id 
      AND q.active_date = CURRENT_DATE
    ) THEN 1
    ELSE 0
  END INTO current_streak;

  -- Award badges based on criteria (updated for 5-question format)
  
  -- First Quiz badge
  IF total_quizzes >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'first_quiz') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Perfect Score badge (now 5/5)
  IF perfect_scores >= 1 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'perfect_score') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- 3 Perfect Scores badge
  IF perfect_scores >= 3 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'triple_perfect') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Accuracy-based badges (same thresholds, but now based on 5-question format)
  IF accuracy_percentage >= 90 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'goat') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 75 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'legend') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 60 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'expert') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  ELSIF accuracy_percentage >= 45 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'foot_lover') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- 3-Day Streak badge
  IF current_streak >= 3 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'streak_3') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- 10-Day Streak badge
  IF current_streak >= 10 THEN
    INSERT INTO user_badges (user_id, badge_id) 
    VALUES (p_user_id, 'streak_10') 
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

END;
$$;
