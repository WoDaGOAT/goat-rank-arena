
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";

export const useLeaderboardData = (categoryId: string) => {
  return useQuery({
    queryKey: ['leaderboardData', categoryId],
    queryFn: async () => {
      console.log(`Fetching leaderboard data for category: ${categoryId}`);

      try {
        // Use the optimized database function
        const { data: leaderboardData, error } = await supabase
          .rpc('get_category_leaderboard', {
            p_category_id: categoryId,
            p_limit: 10
          });

        if (error) {
          console.error("Error fetching leaderboard:", error);
          throw new Error(error.message);
        }

        console.log('Raw leaderboard data from database:', leaderboardData);

        if (!leaderboardData || leaderboardData.length === 0) {
          console.log(`No leaderboard data found for category ${categoryId}`);
          return [];
        }

        console.log(`Processing leaderboard for category ${categoryId}, found ${leaderboardData.length} athletes`);

        // Map the database response to UI format with proper error handling
        const leaderboard: Athlete[] = leaderboardData.map((athlete: any, index: number) => {
          try {
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
            console.error('Error mapping athlete data:', mapError, athlete);
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

        console.log(`Final leaderboard for category ${categoryId}:`, leaderboard.length, "athletes");
        console.log('Final leaderboard data:', leaderboard);
        
        return leaderboard;
      } catch (error) {
        console.error('Fatal error in leaderboard fetch:', error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`Leaderboard fetch retry ${failureCount}:`, error);
      return failureCount < 2;
    },
  });
};
