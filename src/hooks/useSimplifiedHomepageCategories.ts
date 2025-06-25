
import { useQuery } from "@tanstack/react-query";
import { HomepageCategoriesData } from "./homepage/fallbackData";
import { getStaticHomepageData } from "./homepage/staticCategoryData";

export const useSimplifiedHomepageCategories = () => {
  return useQuery<HomepageCategoriesData>({
    queryKey: ["simplifiedHomepageCategories"],
    queryFn: async (): Promise<HomepageCategoriesData> => {
      console.log("🏠 Loading static homepage categories");
      
      try {
        const data = getStaticHomepageData();
        
        console.log("📊 Homepage data loaded:", {
          hasGoatFootballer: !!data.goatFootballer,
          goatFootballerLeaderboard: data.goatFootballer?.leaderboard?.length || 0,
          otherCategoriesCount: data.otherCategories?.length || 0,
          firstThreeAthletes: data.goatFootballer?.leaderboard?.slice(0, 3).map(a => a.name) || []
        });
        
        return data;
      } catch (error) {
        console.error("❌ Error loading static homepage data:", error);
        
        // Return absolute minimal fallback
        return {
          goatFootballer: {
            id: 'emergency-fallback',
            name: 'GOAT Footballer',
            description: 'Greatest footballer of all time',
            userRankingCount: 0,
            leaderboard: []
          },
          otherCategories: []
        };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour - static data doesn't change
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: false, // No retries needed for static data
    throwOnError: false, // Prevent throwing, always return fallback
  });
};
