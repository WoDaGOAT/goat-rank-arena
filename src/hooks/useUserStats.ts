
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserStats {
  total_quizzes: number;
  total_score: number;
  accuracy_percentage: number;
  current_streak: number;
  perfect_scores: number;
}

export const useUserStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async (): Promise<UserStats | null> => {
      if (!user?.id) {
        return null;
      }

      console.log('Fetching user stats for user:', user.id);
      
      // Use optimized query with the new indexes
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          total_quizzes: 0,
          total_score: 0,
          accuracy_percentage: 0,
          current_streak: 0,
          perfect_scores: 0
        };
      }

      // Calculate stats client-side for better performance
      const totalQuizzes = data.length;
      const totalScore = data.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const perfectScores = data.filter(attempt => attempt.score === 5).length;
      const accuracyPercentage = totalQuizzes > 0 ? (totalScore / (totalQuizzes * 5)) * 100 : 0;
      
      // Simple streak calculation (can be optimized further if needed)
      let currentStreak = 0;
      const today = new Date().toDateString();
      const hasQuizToday = data.some(attempt => 
        new Date(attempt.completed_at).toDateString() === today
      );
      
      if (hasQuizToday) {
        currentStreak = 1; // Simplified streak logic
      }

      const stats = {
        total_quizzes: totalQuizzes,
        total_score: totalScore,
        accuracy_percentage: Math.round(accuracyPercentage * 100) / 100,
        current_streak: currentStreak,
        perfect_scores: perfectScores
      };

      console.log('User stats calculated:', stats);
      return stats;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats change when user takes quizzes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for public user stats (for viewing other users' profiles)
export const usePublicUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['public-user-stats', userId],
    queryFn: async (): Promise<UserStats | null> => {
      if (!userId) {
        return null;
      }

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching public user stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          total_quizzes: 0,
          total_score: 0,
          accuracy_percentage: 0,
          current_streak: 0,
          perfect_scores: 0
        };
      }

      const totalQuizzes = data.length;
      const totalScore = data.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      const perfectScores = data.filter(attempt => attempt.score === 5).length;
      const accuracyPercentage = totalQuizzes > 0 ? (totalScore / (totalQuizzes * 5)) * 100 : 0;
      
      return {
        total_quizzes: totalQuizzes,
        total_score: totalScore,
        accuracy_percentage: Math.round(accuracyPercentage * 100) / 100,
        current_streak: 0, // Simplified for public view
        perfect_scores: perfectScores
      };
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes for public stats
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};
