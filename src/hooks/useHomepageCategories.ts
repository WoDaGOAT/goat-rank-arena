
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
    queryKey: ["homepageCategories", "v3"],
    queryFn: async () => {
      console.log("Starting homepage categories query...");
      
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

      // Then, get the ID of the 'GOAT' parent category
      const { data: parentCategory, error: parentError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "GOAT")
        .is("parent_id", null)
        .single();

      if (parentError || !parentCategory) {
        toast.error("Failed to load featured categories.");
        console.error("Error fetching parent category for homepage:", parentError);
        throw new Error(parentError?.message || "Parent category not found");
      }

      const featuredCategories = [
        "GOAT Footballer",
        "GOAT Goalkeeper",
        "GOAT Defender",
        "GOAT Midfielder",
        "GOAT Attacker",
        "GOAT Free-Kick Taker",
      ];

      // Fetch all featured categories
      const { data: categoriesRaw, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", parentCategory.id)
        .in("name", featuredCategories)
        .order("name")
        .limit(9);

      if (categoriesError) {
        toast.error("Failed to load categories.");
        console.error("Error fetching categories:", categoriesError);
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
            userRankingCount: rankingCount || 0,
            leaderboard: leaderboard
          };
        })
      );

      // Separate GOAT Footballer from other categories
      const goatFootballer = categoriesWithLeaderboards.find(c => c.name === "GOAT Footballer") || null;
      const otherCategories = categoriesWithLeaderboards.filter(c => c.name !== "GOAT Footballer");

      console.log("GOAT Footballer leaderboard:", goatFootballer?.leaderboard?.length || 0, "athletes");

      return {
        goatFootballer,
        otherCategories
      };
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
