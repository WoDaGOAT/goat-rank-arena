
import { supabase } from "@/lib/supabase";
import { Category, Athlete } from "@/types";
import { HomepageCategoriesData, getFallbackData } from "./fallbackData";
import { isPreviewEnvironment } from "./environmentUtils";

export const fetchHomepageCategories = async (): Promise<HomepageCategoriesData> => {
  const isPreview = isPreviewEnvironment();
  console.log("🏠 Homepage categories query starting...", { isPreview });
  
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

    // Simplified approach for preview: Get categories without complex leaderboards
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
      .limit(3);

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
      .limit(isPreview ? 5 : 10);

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

    // Process categories with simplified leaderboards for preview
    const categoriesWithLeaderboards = await processLeaderboards(categoriesRaw, isPreview);

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
    
    throw error;
  }
};

const processLeaderboards = async (categoriesRaw: any[], isPreview: boolean): Promise<Category[]> => {
  return Promise.all(
    categoriesRaw.map(async (c) => {
      console.log(`📊 Processing category: ${c.name}`);
      
      let leaderboard: Athlete[] = [];
      let userRankingCount = 0;

      // For preview environment, skip complex queries and use empty leaderboards
      if (!isPreview) {
        try {
          // Get ranking count for production only
          const { count, error: countError } = await supabase
            .from("user_rankings")
            .select("*", { count: "exact", head: true })
            .eq("category_id", c.id);

          if (!countError) {
            userRankingCount = count || 0;
          }

          // For production, try to get actual leaderboard data
          // Note: We need to fix the leaderboard query to use proper data structure
          // For now, we'll use empty leaderboards until proper aggregation is implemented
          
        } catch (error) {
          console.warn(`⚠️ Leaderboard error for ${c.name}:`, error);
          // Continue with empty leaderboard
        }
      }

      console.log(`✅ Processed ${c.name}: ${leaderboard.length} athletes, ${userRankingCount} rankings`);

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
};
