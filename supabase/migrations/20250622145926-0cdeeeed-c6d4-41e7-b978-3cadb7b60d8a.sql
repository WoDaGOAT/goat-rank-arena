
-- Add new columns to the quizzes table for scheduling
ALTER TABLE public.quizzes 
ADD COLUMN publication_datetime TIMESTAMP WITH TIME ZONE,
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
ADD COLUMN timezone TEXT DEFAULT 'UTC';

-- Remove the unique constraint on active_date to allow multiple quizzes per day
ALTER TABLE public.quizzes DROP CONSTRAINT IF EXISTS quizzes_active_date_key;

-- Update existing quizzes to have a publication_datetime based on active_date
UPDATE public.quizzes 
SET publication_datetime = active_date::timestamp AT TIME ZONE 'UTC',
    status = 'published'
WHERE publication_datetime IS NULL;

-- Make publication_datetime required for new quizzes
ALTER TABLE public.quizzes ALTER COLUMN publication_datetime SET NOT NULL;

-- Create index for efficient querying by publication time and status
CREATE INDEX IF NOT EXISTS idx_quizzes_publication_datetime ON public.quizzes(publication_datetime);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quizzes_status_publication ON public.quizzes(status, publication_datetime);

-- Create function to get today's active quiz (published and within date)
CREATE OR REPLACE FUNCTION get_todays_quiz()
RETURNS TABLE(
  quiz_id UUID,
  title TEXT,
  topic TEXT,
  active_date DATE,
  publication_datetime TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id as quiz_id,
    q.title,
    q.topic,
    q.active_date,
    q.publication_datetime
  FROM public.quizzes q
  WHERE q.status = 'published'
    AND q.publication_datetime <= NOW()
    AND q.active_date = CURRENT_DATE
  ORDER BY q.publication_datetime DESC
  LIMIT 1;
END;
$$;

-- Create function to get scheduled quizzes for admin
CREATE OR REPLACE FUNCTION get_admin_quizzes(p_status TEXT DEFAULT NULL)
RETURNS TABLE(
  quiz_id UUID,
  title TEXT,
  topic TEXT,
  active_date DATE,
  publication_datetime TIMESTAMP WITH TIME ZONE,
  status TEXT,
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  question_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin (you may need to adjust this based on your auth system)
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    q.id as quiz_id,
    q.title,
    q.topic,
    q.active_date,
    q.publication_datetime,
    q.status,
    q.timezone,
    q.created_at,
    COUNT(qq.id) as question_count
  FROM public.quizzes q
  LEFT JOIN public.quiz_questions qq ON q.id = qq.quiz_id
  WHERE (p_status IS NULL OR q.status = p_status)
  GROUP BY q.id, q.title, q.topic, q.active_date, q.publication_datetime, q.status, q.timezone, q.created_at
  ORDER BY q.publication_datetime DESC;
END;
$$;

-- Update the create_quiz function to support new scheduling fields (fixed parameter order)
CREATE OR REPLACE FUNCTION create_quiz(
    p_title TEXT,
    p_topic TEXT,
    p_active_date DATE,
    p_questions JSONB,
    p_publication_datetime TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_status TEXT DEFAULT 'draft',
    p_timezone TEXT DEFAULT 'UTC'
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
    final_publication_datetime TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Validate that exactly 5 questions are provided
    SELECT jsonb_array_length(p_questions) INTO question_count;
    
    IF question_count != 5 THEN
        RAISE EXCEPTION 'Daily quizzes must have exactly 5 questions. Provided: %', question_count;
    END IF;

    -- Validate status
    IF p_status NOT IN ('draft', 'scheduled', 'published', 'archived') THEN
        RAISE EXCEPTION 'Invalid status. Must be one of: draft, scheduled, published, archived';
    END IF;

    -- Set default publication datetime if not provided
    IF p_publication_datetime IS NULL THEN
        final_publication_datetime := p_active_date::timestamp AT TIME ZONE p_timezone;
    ELSE
        final_publication_datetime := p_publication_datetime;
    END IF;

    -- Insert the new quiz with scheduling information
    INSERT INTO public.quizzes (title, topic, active_date, publication_datetime, status, timezone)
    VALUES (p_title, p_topic, p_active_date, final_publication_datetime, p_status, p_timezone)
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
