
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

      // Fetch athlete scores for this category with timestamps for trend calculation
      const { data: athleteRankings, error: rankingsError } = await supabase
        .from("user_rankings")
        .select(`
          created_at,
          ranking_athletes(
            athlete_id,
            position,
            points
          )
        `)
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      let leaderboard: Athlete[] = [];

      if (!rankingsError && athleteRankings && athleteRankings.length > 0 && athletesData) {
        console.log(`Processing leaderboard for category ${categoryId}, found ${athleteRankings.length} rankings`);
        
        // Calculate athlete scores from all rankings for overall leaderboard
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

        // Calculate trend movements by comparing recent vs older rankings
        const calculateTrendMovement = (athleteId: string): "up" | "down" | "neutral" => {
          if (athleteRankings.length < 4) {
            return "neutral"; // Not enough data for trend analysis
          }

          // Get recent rankings (last 25% of rankings) vs older rankings (previous 25%)
          const totalRankings = athleteRankings.length;
          const recentCount = Math.max(1, Math.floor(totalRankings * 0.25));
          const olderStartIndex = Math.floor(totalRankings * 0.5);
          const olderEndIndex = olderStartIndex + recentCount;

          const recentRankings = athleteRankings.slice(0, recentCount);
          const olderRankings = athleteRankings.slice(olderStartIndex, olderEndIndex);

          // Calculate average position in recent vs older rankings
          let recentPositions: number[] = [];
          let olderPositions: number[] = [];

          recentRankings.forEach((ranking) => {
            if (ranking.ranking_athletes && Array.isArray(ranking.ranking_athletes)) {
              const athleteRanking = ranking.ranking_athletes.find((ar: any) => ar.athlete_id === athleteId);
              if (athleteRanking) {
                recentPositions.push(athleteRanking.position);
              }
            }
          });

          olderRankings.forEach((ranking) => {
            if (ranking.ranking_athletes && Array.isArray(ranking.ranking_athletes)) {
              const athleteRanking = ranking.ranking_athletes.find((ar: any) => ar.athlete_id === athleteId);
              if (athleteRanking) {
                olderPositions.push(athleteRanking.position);
              }
            }
          });

          if (recentPositions.length === 0 || olderPositions.length === 0) {
            return "neutral";
          }

          const recentAvgPosition = recentPositions.reduce((a, b) => a + b, 0) / recentPositions.length;
          const olderAvgPosition = olderPositions.reduce((a, b) => a + b, 0) / olderPositions.length;

          // Lower position number = better rank, so if recent < older, athlete moved up
          const positionDifference = olderAvgPosition - recentAvgPosition;
          
          if (positionDifference > 1) {
            return "up";
          } else if (positionDifference < -1) {
            return "down";
          } else {
            return "neutral";
          }
        };

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

        // Sort by points and add ranking with real trend indicators
        leaderboard = athleteObjects
          .sort((a, b) => b.points - a.points)
          .slice(0, 10)
          .map((athlete, index) => {
            const movement = calculateTrendMovement(athlete.id);

            return {
              ...athlete,
              rank: index + 1,
              movement
            };
          });

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
