
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

        // Calculate stats
        const totalQuizzes = attempts.length;
        let totalCorrect = 0;
        let totalQuestions = 0;
        let perfectScores = 0;
        
        attempts.forEach(attempt => {
          const questionCount = attempt.quizzes?.quiz_questions?.length || 0;
          totalCorrect += attempt.score;
          totalQuestions += questionCount;
          if (attempt.score === questionCount && questionCount > 0) {
            perfectScores++;
          }
        });

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

// Helper function to calculate streaks
const calculateStreaks = (attempts: any[]) => {
  if (attempts.length === 0) return { current_streak: 0, longest_streak: 0 };

  const attemptDates = attempts.map(a => new Date(a.completed_at).toDateString());
  const uniqueDates = [...new Set(attemptDates)].sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check if today or yesterday is included for current streak
  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    currentStreak = 1;
    
    // Calculate current streak backwards from most recent date
    const startDate = uniqueDates.includes(today) ? today : yesterday;
    let checkDate = new Date(startDate);
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      if (uniqueDates[i] === checkDate.toDateString()) {
        currentStreak = Math.max(currentStreak, uniqueDates.length - i);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
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
