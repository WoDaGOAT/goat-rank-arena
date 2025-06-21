
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserStats } from '@/types/badges';

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all quiz attempts for the user
        const { data: attempts, error } = await supabase
          .from('quiz_attempts')
          .select('score, completed_at, quizzes(quiz_questions(id))')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });

        if (error) throw error;

        if (!attempts || attempts.length === 0) {
          setStats({
            total_quizzes: 0,
            current_streak: 0,
            longest_streak: 0,
            perfect_scores: 0,
            total_correct: 0,
            total_questions: 0,
            accuracy_percentage: 0
          });
          setLoading(false);
          return;
        }

        // Calculate stats with 5-question standardization
        const totalQuizzes = attempts.length;
        let totalCorrect = 0;
        let perfectScores = 0;
        
        attempts.forEach(attempt => {
          totalCorrect += attempt.score;
          // Perfect score is now 5/5 for all daily quizzes
          if (attempt.score === 5) {
            perfectScores++;
          }
        });

        // All daily quizzes now have exactly 5 questions
        const totalQuestions = totalQuizzes * 5;

        // Calculate streaks
        const { current_streak, longest_streak } = calculateStreaks(attempts);

        const accuracyPercentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        setStats({
          total_quizzes: totalQuizzes,
          current_streak,
          longest_streak,
          perfect_scores: perfectScores,
          total_correct: totalCorrect,
          total_questions: totalQuestions,
          accuracy_percentage: accuracyPercentage
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return { stats, loading };
};

// Helper function to calculate streaks based on consecutive days
const calculateStreaks = (attempts: any[]) => {
  if (attempts.length === 0) return { current_streak: 0, longest_streak: 0 };

  // Get unique dates when user took quizzes
  const attemptDates = attempts
    .map(a => new Date(a.completed_at).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (attemptDates.length === 0) return { current_streak: 0, longest_streak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check if user has taken quiz today or yesterday for current streak
  const lastAttemptDate = attemptDates[attemptDates.length - 1];
  
  if (lastAttemptDate === today || lastAttemptDate === yesterday) {
    currentStreak = 1;
    
    // Calculate current streak backwards from most recent date
    for (let i = attemptDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(attemptDates[i]);
      const currDate = new Date(attemptDates[i + 1]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < attemptDates.length; i++) {
    const prevDate = new Date(attemptDates[i - 1]);
    const currDate = new Date(attemptDates[i]);
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current_streak: currentStreak, longest_streak: longestStreak };
};
