
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface QuizLeaderboardUser {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  total_score: number;
  quizzes_completed: number;
  highest_badge_id: string | null;
  highest_badge_name: string | null;
  highest_badge_rarity: string | null;
}

export const useQuizLeaderboard = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ['quizLeaderboard', limit, offset],
    queryFn: async (): Promise<QuizLeaderboardUser[]> => {
      console.log(`Fetching quiz leaderboard with limit: ${limit}, offset: ${offset}`);

      // Use the new optimized function
      const { data, error } = await supabase
        .rpc('get_quiz_leaderboard_optimized', {
          p_limit: limit,
          p_offset: offset
        });

      if (error) {
        console.error("Error fetching quiz leaderboard:", error);
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      // Transform data to match our interface
      const leaderboard: QuizLeaderboardUser[] = data.map((user: any) => ({
        user_id: user.user_id,
        full_name: user.full_name || 'Anonymous',
        avatar_url: user.avatar_url,
        total_score: Number(user.total_score),
        quizzes_completed: Number(user.quizzes_completed),
        highest_badge_id: user.highest_badge_id,
        highest_badge_name: user.highest_badge_name,
        highest_badge_rarity: user.highest_badge_rarity
      }));

      console.log(`Quiz leaderboard fetched: ${leaderboard.length} users`);
      return leaderboard;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
