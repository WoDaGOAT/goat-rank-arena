
-- First, let's manually award the badges that should have been earned
-- This will call the badge checking function for all users who have taken quizzes
-- but don't have the badges they should have earned

DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users who have taken quizzes but might be missing badges
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM quiz_attempts 
        WHERE user_id NOT IN (
            SELECT DISTINCT user_id 
            FROM user_badges 
            WHERE badge_id IN ('newcomer', 'first_quiz')
        )
    LOOP
        -- Award badges for each user
        PERFORM check_and_award_badges(user_record.user_id);
        RAISE NOTICE 'Processed badges for user: %', user_record.user_id;
    END LOOP;
END $$;

-- Also run it for users who might have badges but are missing some
-- (like users who have newcomer but not first_quiz despite having completed quizzes)
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT DISTINCT qa.user_id 
        FROM quiz_attempts qa
        LEFT JOIN user_badges ub ON qa.user_id = ub.user_id AND ub.badge_id = 'first_quiz'
        WHERE ub.badge_id IS NULL
        GROUP BY qa.user_id
        HAVING COUNT(qa.id) >= 1
    LOOP
        PERFORM check_and_award_badges(user_record.user_id);
        RAISE NOTICE 'Re-processed badges for user: %', user_record.user_id;
    END LOOP;
END $$;
