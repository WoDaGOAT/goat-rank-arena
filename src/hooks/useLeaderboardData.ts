
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

export const useLeaderboardData = (categoryId: string) => {
  return useQuery({
    queryKey: ['leaderboardData', categoryId],
    queryFn: async () => {
      console.log(`Fetching leaderboard data for category: ${categoryId}`);

      // Use the new optimized database function
      const { data: leaderboardData, error } = await supabase
        .rpc('get_category_leaderboard', {
          p_category_id: categoryId,
          p_limit: 10
        });

      if (error) {
        console.error("Error fetching leaderboard:", error);
        throw new Error(error.message);
      }

      if (!leaderboardData || leaderboardData.length === 0) {
        console.log(`No leaderboard data found for category ${categoryId}`);
        return [];
      }

      console.log(`Processing leaderboard for category ${categoryId}, found ${leaderboardData.length} athletes`);

      // Map the optimized database response to UI format
      const leaderboard: Athlete[] = leaderboardData.map((athlete: any) => ({
        id: athlete.athlete_id,
        name: athlete.athlete_name,
        profile_picture_url: athlete.profile_picture_url || '/placeholder.svg',
        country_of_origin: athlete.country_of_origin,
        points: Number(athlete.total_points),
        rank: Number(athlete.rank),
        movement: athlete.movement as "up" | "down" | "neutral"
      }));

      console.log(`Final leaderboard for category ${categoryId}:`, leaderboard.length, "athletes");
      return leaderboard;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
