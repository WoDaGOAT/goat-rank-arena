
-- This script fixes the "Function Search Path Mutable" warnings for the remaining functions.

-- Fix for create_quiz
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
BEGIN
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


-- Fix for delete_app_user
CREATE OR REPLACE FUNCTION public.delete_app_user(p_user_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    IF auth.uid() = p_user_id THEN
        RAISE EXCEPTION 'Admins cannot delete their own account.';
    END IF;

    DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;


-- Fix for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;
