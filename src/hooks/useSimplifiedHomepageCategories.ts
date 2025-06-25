
import { useQuery } from "@tanstack/react-query";
import { HomepageCategoriesData } from "./homepage/fallbackData";
import { getStaticHomepageData } from "./homepage/staticCategoryData";

export const useSimplifiedHomepageCategories = () => {
  return useQuery<HomepageCategoriesData>({
    queryKey: ["simplifiedHomepageCategories"],
    queryFn: async (): Promise<HomepageCategoriesData> => {
      // Return static data immediately - no database calls
      console.log("🏠 Loading static homepage categories");
      return getStaticHomepageData();
    },
    staleTime: 1000 * 60 * 60, // 1 hour - static data doesn't change
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: false, // No retries needed for static data
  });
};
