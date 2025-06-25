
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { toast } from "sonner";
import { mapDatabaseAthleteToUIAthlete } from "@/utils/athleteDataMapper";

// Detect if we're in Lovable preview environment
const isPreviewEnvironment = () => {
  return window.location.hostname.includes('lovableproject.com') || 
         window.location.hostname.includes('localhost') ||
         process.env.NODE_ENV === 'development';
};

// Simple fallback data for preview environment
const getFallbackData = () => {
  return {
    goatFootballer: {
      id: 'fallback-goat-footballer',
      name: 'GOAT Footballer',
      description: 'Greatest footballer of all time',
      userRankingCount: 0,
      leaderboard: []
    },
    otherCategories: [
      {
        id: 'fallback-goalkeeper',
        name: 'GOAT Goalkeeper',
        description: 'Greatest goalkeeper of all time',
        userRankingCount: 0,
        leaderboard: []
      },
      {
        id: 'fallback-defender',
        name: 'GOAT Defender', 
        description: 'Greatest defender of all time',
        userRankingCount: 0,
        leaderboard: []
      }
    ]
  };
};

export const useHomepageCategories = () => {
  const isPreview = isPreviewEnvironment();
  
  return useQuery<{
    goatFootballer: Category | null;
    otherCategories: Category[];
  }>({
    queryKey: ["homepageCategories", "v6", isPreview ? "preview" : "production"],
    queryFn: async () => {
      console.log("🏠 Homepage categories query starting...", { isPreview });
      
      // Use timeout for preview environment
      const queryTimeout = isPreview ? 5000 : 30000; // 5s for preview, 30s for production
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), queryTimeout);
      });
      
      const queryPromise = async () => {
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

          // Simplified approach: Get categories first without complex leaderboards
          const featuredCategories = [
            "GOAT Footballer",
            "GOAT Goalkeeper", 
            "GOAT Defender",
            "GOAT Midfielder",
            "GOAT Attacker",
            "GOAT Free-Kick Taker",
            "Current GOAT Footballer",
          ];

          // Get parent category IDs - simplified query
          console.log("📂 Fetching parent categories...");
          const { data: parentCategories, error: parentError } = await supabase
            .from("categories")
            .select("id, name")
            .in("name", ["GOAT", "Current GOAT"])
            .is("parent_id", null)
            .limit(3); // Limit for performance

          if (parentError || !parentCategories || parentCategories.length === 0) {
            console.error("❌ Parent categories error:", parentError);
            if (isPreview) {
              console.log("🔄 Using fallback data for preview");
              return getFallbackData();
            }
            throw new Error(parentError?.message || "Parent categories not found");
          }

          console.log(`✅ Parent categories found: ${parentCategories.length}`);

          const parentIds = parentCategories.map(p => p.id);

          // Fetch categories with simplified query
          console.log("📋 Fetching featured categories...");
          const { data: categoriesRaw, error: categoriesError } = await supabase
            .from("categories")
            .select("id, name, description, image_url")
            .in("parent_id", parentIds)
            .in("name", featuredCategories)
            .order("name")
            .limit(isPreview ? 5 : 10); // Reduced limit for preview

          if (categoriesError) {
            console.error("❌ Categories error:", categoriesError);
            if (isPreview) {
              console.log("🔄 Using fallback data for preview");
              return getFallbackData();
            }
            throw new Error(categoriesError.message);
          }

          console.log(`✅ Categories fetched: ${categoriesRaw?.length || 0}`);

          if (!categoriesRaw || categoriesRaw.length === 0) {
            if (isPreview) {
              console.log("🔄 Using fallback data for preview");
              return getFallbackData();
            }
            throw new Error("No categories found");
          }

          // Simplified leaderboard calculation - no complex nested queries for preview
          const categoriesWithLeaderboards = await Promise.all(
            categoriesRaw.map(async (c) => {
              console.log(`📊 Processing category: ${c.name}`);
              
              let leaderboard: Athlete[] = [];
              let userRankingCount = 0;

              if (!isPreview) {
                // Only do complex queries in production
                try {
                  // Get ranking count
                  const { count, error: countError } = await supabase
                    .from("user_rankings")
                    .select("*", { count: "exact", head: true })
                    .eq("category_id", c.id);

                  userRankingCount = count || 0;

                  // Simple leaderboard query - get top athletes directly
                  const { data: athleteRankings, error: rankingsError } = await supabase
                    .from("ranking_athletes")
                    .select(`
                      athlete_id,
                      points,
                      athletes(name, country_of_origin, profile_picture_url)
                    `)
                    .eq("ranking_id", "in", `(SELECT id FROM user_rankings WHERE category_id = '${c.id}')`)
                    .order("points", { ascending: false })
                    .limit(c.name === "GOAT Footballer" ? 10 : 3);

                  if (!rankingsError && athleteRankings) {
                    leaderboard = athleteRankings
                      .slice(0, c.name === "GOAT Footballer" ? 10 : 3)
                      .map((ranking: any, index) => ({
                        id: ranking.athlete_id,
                        name: ranking.athletes?.name || "Unknown",
                        country: ranking.athletes?.country_of_origin || "",
                        imageUrl: ranking.athletes?.profile_picture_url || "",
                        rank: index + 1,
                        points: ranking.points || 0
                      }));
                  }
                } catch (error) {
                  console.warn(`⚠️ Leaderboard error for ${c.name}:`, error);
                  // Continue with empty leaderboard
                }
              }

              console.log(`✅ Processed ${c.name}: ${leaderboard.length} athletes`);

              return {
                id: c.id,
                name: c.name,
                description: c.description || "No description provided.",
                imageUrl: c.image_url || undefined,
                userRankingCount,
                leaderboard
              };
            })
          );

          // Separate GOAT Footballer from others
          const goatFootballer = categoriesWithLeaderboards.find(c => c.name === "GOAT Footballer") || null;
          const otherCategories = categoriesWithLeaderboards.filter(c => c.name !== "GOAT Footballer");

          console.log(`✅ Homepage categories query completed successfully`);
          console.log(`🏆 GOAT Footballer: ${goatFootballer ? 'found' : 'not found'}`);
          console.log(`📊 Other categories: ${otherCategories.length}`);

          return {
            goatFootballer,
            otherCategories
          };

        } catch (error) {
          console.error("💥 Homepage categories query failed:", error);
          
          // In preview, always return fallback data on error
          if (isPreview) {
            console.log("🔄 Using fallback data due to error in preview");
            return getFallbackData();
          }
          
          // Create specific error messages for production
          if (error instanceof Error) {
            if (error.message.includes('connectivity')) {
              toast.error("Unable to connect to the database. Please check your internet connection.");
            } else if (error.message.includes('timeout')) {
              toast.error("Request timed out. Please try again.");
            } else {
              toast.error("An unexpected error occurred while loading the homepage.");
            }
          }
          
          throw error;
        }
      };

      // Race the query against the timeout
      return Promise.race([queryPromise(), timeoutPromise]);
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for homepage categories`);
      // More aggressive retry for preview
      return failureCount < (isPreview ? 1 : 2);
    },
    retryDelay: (attemptIndex) => {
      // Faster retries for preview
      const baseDelay = isPreview ? 500 : 1000;
      return Math.min(baseDelay * 2 ** attemptIndex, isPreview ? 2000 : 5000);
    },
    staleTime: isPreview ? 1000 * 30 : 1000 * 60 * 5, // 30s for preview, 5min for production
    gcTime: isPreview ? 1000 * 60 : 1000 * 60 * 10, // 1min for preview, 10min for production
    meta: {
      errorBoundary: false,
    },
  });
};
