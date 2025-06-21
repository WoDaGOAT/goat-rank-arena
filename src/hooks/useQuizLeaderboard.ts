
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface QuizLeaderboardUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  total_score: number;
  quizzes_completed: number;
  highest_badge_id: string | null;
  highest_badge_name: string | null;
  highest_badge_rarity: string | null;
}

interface UseQuizLeaderboardOptions {
  limit?: number;
  offset?: number;
}

export const useQuizLeaderboard = (options: UseQuizLeaderboardOptions = {}) => {
  const { limit = 50, offset = 0 } = options;
  
  return useQuery({
    queryKey: ['quiz-leaderboard', limit, offset],
    queryFn: async (): Promise<QuizLeaderboardUser[]> => {
      console.log(`Fetching quiz leaderboard with limit: ${limit}, offset: ${offset}`);
      
      const { data, error } = await supabase.rpc('get_quiz_leaderboard', {
        p_limit: limit,
        p_offset: offset
      });

      if (error) {
        console.error('Error fetching quiz leaderboard:', error);
        throw error;
      }

      console.log(`Quiz leaderboard data:`, data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - leaderboard doesn't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
  });
};

// Hook for infinite pagination
export const useInfiniteQuizLeaderboard = () => {
  return useQuery({
    queryKey: ['quiz-leaderboard-infinite'],
    queryFn: async (): Promise<QuizLeaderboardUser[]> => {
      // Start with first 100 users for infinite scroll
      const { data, error } = await supabase.rpc('get_quiz_leaderboard', {
        p_limit: 100,
        p_offset: 0
      });

      if (error) {
        console.error('Error fetching quiz leaderboard:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for infinite scroll
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};
