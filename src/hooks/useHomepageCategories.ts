
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { toast } from "sonner";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

export const useHomepageCategories = () => {
  return useQuery<{
    goatFootballer: Category | null;
    otherCategories: Category[];
  }>({
    queryKey: ["homepageCategories", "v5"],
    queryFn: async () => {
      console.log("Starting homepage categories query with dynamic selection...");
      
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

      console.log("Athletes fetched:", athletesData?.length || 0);

      // Get parent category IDs
      const { data: parentCategories, error: parentError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", ["GOAT", "Current GOAT", "Competitions"])
        .is("parent_id", null);

      if (parentError || !parentCategories || parentCategories.length === 0) {
        toast.error("Failed to load parent categories.");
        console.error("Error fetching parent categories for homepage:", parentError);
        throw new Error(parentError?.message || "Parent categories not found");
      }

      const parentIds = parentCategories.map(p => p.id);

      // Fetch all categories from parent categories with their ranking counts
      const { data: categoriesWithCounts, error: categoriesError } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          description,
          image_url,
          parent_id
        `)
        .in("parent_id", parentIds)
        .order("name");

      if (categoriesError) {
        toast.error("Failed to load categories.");
        console.error("Error fetching categories:", categoriesError);
        throw new Error(categoriesError.message);
      }

      // Get ranking counts for all categories
      const categoryIds = categoriesWithCounts.map(c => c.id);
      const { data: rankingCounts, error: countError } = await supabase
        .from("user_rankings")
        .select("category_id")
        .in("category_id", categoryIds);

      if (countError) {
        console.error("Error fetching ranking counts:", countError);
      }

      // Count rankings per category
      const rankingCountMap: Record<string, number> = {};
      if (rankingCounts) {
        rankingCounts.forEach(ranking => {
          const categoryId = ranking.category_id;
          rankingCountMap[categoryId] = (rankingCountMap[categoryId] || 0) + 1;
        });
      }

      console.log("Ranking counts by category:", rankingCountMap);

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

            const maxAthletes = c.name === "GOAT Footballer" ? 10 : 3; // Top 10 for featured, top 3 for others
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

      // Separate GOAT Footballer from other categories
      const goatFootballer = categoriesWithLeaderboards.find(c => c.name === "GOAT Footballer") || null;
      const otherCategories = categoriesWithLeaderboards
        .filter(c => c.name !== "GOAT Footballer")
        .slice(0, 8); // Take top 8 categories for homepage display

      console.log("GOAT Footballer leaderboard:", goatFootballer?.leaderboard?.length || 0, "athletes");
      console.log("Other categories selected:", otherCategories.map(c => ({ name: c.name, count: c.userRankingCount })));

      return {
        goatFootballer,
        otherCategories
      };
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
