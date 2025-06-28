
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

export const useLeaderboardData = (categoryId: string) => {
  return useQuery({
    queryKey: ['leaderboardData', categoryId],
    queryFn: async () => {
      console.log(`Fetching leaderboard data for category: ${categoryId}`);

      // Fetch all athletes from the database
      const { data: athletesData, error: athletesError } = await supabase
        .from("athletes")
        .select("*")
        .order("name");

      if (athletesError) {
        console.error("Error fetching athletes:", athletesError);
        throw new Error(athletesError.message);
      }

      // Fetch athlete scores for this category
      const { data: athleteRankings, error: rankingsError } = await supabase
        .from("user_rankings")
        .select(`
          ranking_athletes(
            athlete_id,
            position,
            points
          )
        `)
        .eq("category_id", categoryId);

      let leaderboard: Athlete[] = [];

      if (!rankingsError && athleteRankings && athleteRankings.length > 0 && athletesData) {
        console.log(`Processing leaderboard for category ${categoryId}, found ${athleteRankings.length} rankings`);
        
        // Calculate athlete scores from all rankings
        const athleteScores: Record<string, { totalScore: number; appearances: number }> = {};
        
        athleteRankings.forEach((ranking) => {
          if (ranking.ranking_athletes && Array.isArray(ranking.ranking_athletes)) {
            ranking.ranking_athletes.forEach((athleteRanking: any) => {
              const athleteId = athleteRanking.athlete_id;
              const points = athleteRanking.points;
              
              if (athleteId && points) {
                if (!athleteScores[athleteId]) {
                  athleteScores[athleteId] = {
                    totalScore: 0,
                    appearances: 0
                  };
                }
                
                athleteScores[athleteId].totalScore += points;
                athleteScores[athleteId].appearances += 1;
              }
            });
          }
        });

        console.log(`Found ${Object.keys(athleteScores).length} athletes with scores for category ${categoryId}`);

        // Convert to leaderboard format and sort by total score
        const athleteObjects = Object.entries(athleteScores)
          .map(([athleteId, { totalScore }]) => {
            const athleteData = athletesData.find(athlete => athlete.id === athleteId);
            
            if (!athleteData) {
              console.warn(`Athlete data not found for ID: ${athleteId}`);
              return null;
            }

            const athlete = mapDatabaseAthleteToUIAthlete(athleteData, 0, totalScore);
            return athlete;
          })
          .filter((athlete): athlete is Athlete => athlete !== null);

        // Sort by points and add ranking
        leaderboard = athleteObjects
          .sort((a, b) => b.points - a.points)
          .slice(0, 10)
          .map((athlete, index) => ({
            ...athlete,
            rank: index + 1
          }));

        console.log(`Final leaderboard for category ${categoryId}:`, leaderboard.length, "athletes");
      } else {
        console.log(`No rankings found for category ${categoryId}`);
      }

      return leaderboard;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
