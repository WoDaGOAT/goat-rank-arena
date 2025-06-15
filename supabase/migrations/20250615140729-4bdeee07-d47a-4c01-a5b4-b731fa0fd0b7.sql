
CREATE OR REPLACE FUNCTION get_quiz_leaderboard()
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_score BIGINT,
  quizzes_completed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.full_name,
    p.avatar_url,
    sum(qa.score)::BIGINT as total_score,
    count(qa.id)::BIGINT as quizzes_completed
  FROM
    public.quiz_attempts as qa
  JOIN
    public.profiles as p ON qa.user_id = p.id
  GROUP BY
    p.id
  ORDER BY
    total_score DESC, quizzes_completed DESC;
END;
$$ LANGUAGE plpgsql security definer;
