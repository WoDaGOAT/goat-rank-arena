
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";

export const useLeaderboardData = (categoryId: string) => {
  return useQuery({
    queryKey: ['leaderboardData', categoryId],
    queryFn: async () => {
      console.log(`🔍 DEBUGGING: Fetching leaderboard data for category: ${categoryId}`);

      try {
        // Use the optimized database function
        const { data: leaderboardData, error } = await supabase
          .rpc('get_category_leaderboard', {
            p_category_id: categoryId,
            p_limit: 10
          });

        if (error) {
          console.error("🔍 DEBUGGING: Error fetching leaderboard:", error);
          throw new Error(error.message);
        }

        console.log('🔍 DEBUGGING: Raw leaderboard data from database:', leaderboardData);

        if (!leaderboardData || leaderboardData.length === 0) {
          console.log(`🔍 DEBUGGING: No leaderboard data found for category ${categoryId}`);
          return [];
        }

        console.log(`🔍 DEBUGGING: Processing leaderboard for category ${categoryId}, found ${leaderboardData.length} athletes`);

        // Map the database response to UI format with proper error handling
        const leaderboard: Athlete[] = leaderboardData.map((athlete: any, index: number) => {
          try {
            console.log(`🔍 DEBUGGING: Processing athlete ${index + 1}:`, athlete);
            
            return {
              id: athlete.athlete_id || `athlete-${index}`,
              name: athlete.athlete_name || 'Unknown Athlete',
              profile_picture_url: athlete.profile_picture_url || '/placeholder.svg',
              country_of_origin: athlete.country_of_origin || '',
              points: Number(athlete.total_points) || 0,
              rank: Number(athlete.rank) || index + 1,
              movement: (athlete.movement as "up" | "down" | "neutral") || "neutral"
            };
          } catch (mapError) {
            console.error('🔍 DEBUGGING: Error mapping athlete data:', mapError, athlete);
            return {
              id: `athlete-${index}`,
              name: 'Unknown Athlete',
              profile_picture_url: '/placeholder.svg',
              country_of_origin: '',
              points: 0,
              rank: index + 1,
              movement: "neutral" as const
            };
          }
        });

        console.log(`🔍 DEBUGGING: Final leaderboard for category ${categoryId}:`, leaderboard.length, "athletes");
        console.log('🔍 DEBUGGING: Final leaderboard data:', leaderboard);
        
        return leaderboard;
      } catch (error) {
        console.error('🔍 DEBUGGING: Fatal error in leaderboard fetch:', error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔍 DEBUGGING: Leaderboard fetch retry ${failureCount}:`, error);
      return failureCount < 2;
    },
  });
};
