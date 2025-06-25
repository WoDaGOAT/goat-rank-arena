
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
      console.log("🏠 Homepage categories query starting...");
      
      try {
        // Test basic connectivity first
        console.log("🔍 Testing Supabase connectivity...");
        const { data: connectivityTest, error: connectivityError } = await supabase
          .from("categories")
          .select("count")
          .limit(1);
        
        if (connectivityError) {
          console.error("❌ Supabase connectivity test failed:", connectivityError);
          throw new Error(`Database connectivity failed: ${connectivityError.message}`);
        }
        
        console.log("✅ Supabase connectivity confirmed");

        // First, fetch all athletes data directly
        console.log("🏃 Fetching athletes data...");
        const { data: athletesData, error: athletesError } = await supabase
          .from("athletes")
          .select("*")
          .order("name");

        if (athletesError) {
          console.error("❌ Error fetching athletes:", athletesError);
          toast.error("Failed to load athlete data.");
          throw new Error(`Athletes fetch failed: ${athletesError.message}`);
        }

        console.log(`✅ Athletes fetched successfully: ${athletesData?.length || 0} athletes`);

        // Get both parent category IDs
        console.log("📂 Fetching parent categories...");
        const { data: parentCategories, error: parentError } = await supabase
          .from("categories")
          .select("id, name")
          .in("name", ["GOAT", "Current GOAT"])
          .is("parent_id", null);

        if (parentError) {
          console.error("❌ Error fetching parent categories:", parentError);
          toast.error("Failed to load featured categories.");
          throw new Error(`Parent categories fetch failed: ${parentError.message}`);
        }

        if (!parentCategories || parentCategories.length === 0) {
          console.error("❌ No parent categories found");
          toast.error("Featured categories not found in database.");
          throw new Error("Parent categories not found");
        }

        console.log(`✅ Parent categories found: ${parentCategories.length}`, parentCategories);

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
        console.log("🔍 Parent IDs to search:", parentIds);

        // Fetch all featured categories from both parent categories
        console.log("📋 Fetching featured categories...");
        const { data: categoriesRaw, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .in("parent_id", parentIds)
          .in("name", featuredCategories)
          .order("name")
          .limit(10);

        if (categoriesError) {
          console.error("❌ Error fetching categories:", categoriesError);
          toast.error("Failed to load categories.");
          throw new Error(`Categories fetch failed: ${categoriesError.message}`);
        }

        console.log(`✅ Featured categories fetched: ${categoriesRaw?.length || 0}`, categoriesRaw?.map(c => c.name));

        if (!categoriesRaw || categoriesRaw.length === 0) {
          console.warn("⚠️ No featured categories found, but continuing...");
        }

        // Process categories and calculate leaderboards
        console.log("🏆 Processing categories and calculating leaderboards...");
        const categoriesWithLeaderboards = await Promise.all(
          (categoriesRaw || []).map(async (c) => {
            console.log(`📊 Processing category: ${c.name}`);
            
            // Get the actual count of user rankings for this category
            const { count: rankingCount, error: countError } = await supabase
              .from("user_rankings")
              .select("*", { count: "exact", head: true })
              .eq("category_id", c.id);

            if (countError) {
              console.error(`❌ Error fetching ranking count for category ${c.name}:`, countError);
            } else {
              console.log(`📈 Category ${c.name} has ${rankingCount || 0} rankings`);
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
              console.log(`🔢 Processing leaderboard for ${c.name}, found ${athleteRankings.length} rankings`);
              
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

              console.log(`🏅 Found ${Object.keys(athleteScores).length} athletes with scores for ${c.name}`);

              // Convert to leaderboard format and sort by total score
              const athleteObjects = Object.entries(athleteScores)
                .map(([athleteId, { totalScore }]) => {
                  const athleteData = athletesData.find(athlete => athlete.id === athleteId);
                  
                  if (!athleteData) {
                    console.warn(`⚠️ Athlete data not found for ID: ${athleteId}`);
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

              console.log(`🎖️ Final leaderboard for ${c.name}: ${leaderboard.length} athletes`);
            } else {
              console.log(`📭 No rankings found for ${c.name}`);
              if (rankingsError) {
                console.error(`❌ Rankings error for ${c.name}:`, rankingsError);
              }
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

        console.log(`🏆 GOAT Footballer leaderboard: ${goatFootballer?.leaderboard?.length || 0} athletes`);
        console.log(`📊 Other categories found: ${otherCategories.length}`);
        console.log("✅ Homepage categories query completed successfully");

        return {
          goatFootballer,
          otherCategories
        };
      } catch (error) {
        console.error("💥 Homepage categories query failed:", error);
        
        // Create more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('connectivity')) {
            toast.error("Unable to connect to the database. Please check your internet connection.");
          } else if (error.message.includes('Athletes fetch')) {
            toast.error("Failed to load athlete data. Please try refreshing the page.");
          } else if (error.message.includes('Parent categories')) {
            toast.error("Failed to load category structure. Please contact support.");
          } else {
            toast.error("An unexpected error occurred while loading the homepage.");
          }
        }
        
        throw error;
      }
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for homepage categories`);
      return failureCount < 2; // Only retry twice
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff with max 5s
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
    meta: {
      errorBoundary: false, // Don't crash the entire app on error
    },
  });
};
