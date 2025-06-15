
CREATE OR REPLACE FUNCTION create_quiz(
    p_title TEXT,
    p_topic TEXT,
    p_active_date DATE,
    p_questions JSONB
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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
