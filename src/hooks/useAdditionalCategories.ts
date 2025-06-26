
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { toast } from "sonner";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

export const useAdditionalCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["additionalCategories", "v2"],
    queryFn: async () => {
      console.log("Starting additional categories query...");
      
      // First, fetch all athletes data directly
      const { data: athletesData, error: athletesError } = await supabase
        .from("athletes")
        .select("*")
        .order("name");

      if (athletesError) {
        console.error("Error fetching athletes:", athletesError);
        toast.error("Failed to load athlete data.");
        throw new Error(athletesError.message);
      }

      // Get all three parent category IDs including Competitions
      const { data: parentCategories, error: parentError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", ["GOAT", "Current GOAT", "Competitions"])
        .is("parent_id", null);

      if (parentError || !parentCategories || parentCategories.length === 0) {
        toast.error("Failed to load additional categories.");
        console.error("Error fetching parent categories:", parentError);
        throw new Error(parentError?.message || "Parent categories not found");
      }

      // Categories that are NOT featured on homepage
      const featuredCategories = [
        "GOAT Footballer",
        "GOAT Goalkeeper", 
        "GOAT Defender",
        "GOAT Midfielder",
        "GOAT Attacker",
        "GOAT Free-Kick Taker",
        "Current GOAT Footballer",
      ];

      // Get parent IDs
      const parentIds = parentCategories.map(p => p.id);

      // Fetch all categories that are NOT in the featured list
      const { data: categoriesRaw, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .in("parent_id", parentIds)
        .not("name", "in", `(${featuredCategories.map(c => `"${c}"`).join(',')})`)
        .order("name")
        .limit(9); // Limit to 9 additional categories as requested

      if (categoriesError) {
        toast.error("Failed to load additional categories.");
        console.error("Error fetching additional categories:", categoriesError);
        throw new Error(categoriesError.message);
      }

      // Process categories and calculate leaderboards
      const categoriesWithLeaderboards = await Promise.all(
        categoriesRaw.map(async (c) => {
          // Get the actual count of user rankings for this category
          const { count: rankingCount, error: countError } = await supabase
            .from("user_rankings")
            .select("*", { count: "exact", head: true })
            .eq("category_id", c.id);

          if (countError) {
            console.error("Error fetching ranking count for category:", c.name, countError);
          }

          const actualRankingCount = rankingCount || 0;
          let leaderboard: Athlete[] = [];

          // Only calculate leaderboard if we have sufficient rankings (3 or more)
          if (actualRankingCount >= 3 && athletesData) {
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

            if (!rankingsError && athleteRankings && athleteRankings.length > 0) {
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

              leaderboard = athleteObjects
                .sort((a, b) => b.points - a.points)
                .slice(0, 3) // Top 3 for additional categories
                .map((athlete, index) => ({
                  ...athlete,
                  rank: index + 1
                }));

              console.log(`Final leaderboard for ${c.name}:`, leaderboard.length, "athletes");
            } else {
              console.log(`No rankings found for ${c.name}`);
            }
          } else {
            console.log(`Insufficient rankings for ${c.name} (${actualRankingCount} rankings)`);
          }

          return {
            id: c.id,
            name: c.name,
            description: c.description || "No description provided.",
            imageUrl: c.image_url || undefined,
            userRankingCount: actualRankingCount,
            leaderboard: leaderboard
          };
        })
      );

      console.log("Additional categories found:", categoriesWithLeaderboards.length);

      return categoriesWithLeaderboards;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: false, // Don't fetch automatically - only when requested
  });
};
