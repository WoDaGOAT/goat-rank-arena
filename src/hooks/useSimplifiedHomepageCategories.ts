
import { useQuery } from "@tanstack/react-query";
import { HomepageCategoriesData } from "./homepage/fallbackData";
import { getStaticHomepageData } from "./homepage/staticCategoryData";

export const useSimplifiedHomepageCategories = () => {
  return useQuery<HomepageCategoriesData>({
    queryKey: ["simplifiedHomepageCategories"],
    queryFn: async (): Promise<HomepageCategoriesData> => {
      // Return static data immediately - no database calls
      console.log("🏠 Loading static homepage categories");
      const data = getStaticHomepageData();
      console.log("📊 GOAT Footballer leaderboard data:", {
        hasLeaderboard: !!data.goatFootballer?.leaderboard,
        leaderboardLength: data.goatFootballer?.leaderboard?.length || 0,
        firstThreeAthletes: data.goatFootballer?.leaderboard?.slice(0, 3).map(a => a.name) || []
      });
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - static data doesn't change
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: false, // No retries needed for static data
  });
};
