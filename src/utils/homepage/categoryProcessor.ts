
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

interface CategoryWithCounts {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string;
}

export const processCategoriesWithLeaderboards = async (
  categoriesWithCounts: CategoryWithCounts[],
  rankingCountMap: Record<string, number>,
  athletesData: any[]
): Promise<Category[]> => {
  // Priority categories for tiebreaking
  const priorityCategories = ["GOAT Attacker", "GOAT Skills", "Current GOAT"];

  // Sort categories by ranking count and priority
  const sortedCategories = categoriesWithCounts.sort((a, b) => {
    const aCount = rankingCountMap[a.id] || 0;
    const bCount = rankingCountMap[b.id] || 0;

    // Primary sort: ranking count (descending)
    if (aCount !== bCount) {
      return bCount - aCount;
    }

    // Secondary sort: priority categories for tiebreakers
    const aPriority = priorityCategories.indexOf(a.name);
    const bPriority = priorityCategories.indexOf(b.name);

    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority; // Both are priority, use order in array
    }
    if (aPriority !== -1) return -1; // a is priority, b is not
    if (bPriority !== -1) return 1;  // b is priority, a is not

    // Tertiary sort: alphabetical by name
    return a.name.localeCompare(b.name);
  });

  console.log("Sorted categories:", sortedCategories.map(c => ({ name: c.name, count: rankingCountMap[c.id] || 0 })));

  // Process categories and calculate leaderboards
  const categoriesWithLeaderboards = await Promise.all(
    sortedCategories.map(async (c) => {
      const rankingCount = rankingCountMap[c.id] || 0;

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
        .eq("category_id", c.id);

      let leaderboard: Athlete[] = [];

      if (!rankingsError && athleteRankings && athleteRankings.length > 0 && athletesData) {
        console.log(`Processing leaderboard for ${c.name}, found ${athleteRankings.length} rankings`);
        
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

        console.log(`Found ${Object.keys(athleteScores).length} athletes with scores for ${c.name}`);

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

        // Show full top 10 for GOAT Footballer, top 3 for others
        const maxAthletes = c.name === "GOAT Footballer" ? 10 : 3;
        leaderboard = athleteObjects
          .sort((a, b) => b.points - a.points)
          .slice(0, maxAthletes)
          .map((athlete, index) => ({
            ...athlete,
            rank: index + 1
          }));

        console.log(`Final leaderboard for ${c.name}:`, leaderboard.length, "athletes");
      } else {
        console.log(`No rankings found for ${c.name}`);
      }

      return {
        id: c.id,
        name: c.name,
        description: c.description || "No description provided.",
        imageUrl: c.image_url || undefined,
        userRankingCount: rankingCount,
        leaderboard: leaderboard
      };
    })
  );

  return categoriesWithLeaderboards;
};
