
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import { toast } from "sonner";
import { useParentCategories } from "./homepage/useParentCategories";
import { useCategoriesWithRankings } from "./homepage/useCategoriesWithRankings";
import { processCategoriesWithLeaderboards } from "@/utils/homepage/categoryProcessor";

export const useHomepageCategories = () => {
  const { data: parentIds, isLoading: parentLoading, error: parentError } = useParentCategories();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategoriesWithRankings(parentIds || []);

  return useQuery<{
    goatFootballer: Category | null;
    otherCategories: Category[];
  }>({
    queryKey: ["homepageCategories", "v6", parentIds, categoriesData],
    queryFn: async () => {
      console.log("Starting homepage categories query with dynamic selection...");
      
      if (!parentIds || !categoriesData) {
        throw new Error("Missing parent categories or categories data");
      }

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

      const { categoriesWithCounts, rankingCountMap } = categoriesData;

      const categoriesWithLeaderboards = await processCategoriesWithLeaderboards(
        categoriesWithCounts,
        rankingCountMap,
        athletesData
      );

      // Separate GOAT Footballer from other categories
      const goatFootballer = categoriesWithLeaderboards.find(c => c.name === "GOAT Footballer") || null;
      const otherCategories = categoriesWithLeaderboards
        .filter(c => c.name !== "GOAT Footballer")
        .slice(0, 5); // Limit to 5 categories for single line display

      console.log("GOAT Footballer leaderboard:", goatFootballer?.leaderboard?.length || 0, "athletes");
      console.log("Other categories selected:", otherCategories.map(c => ({ name: c.name, count: c.userRankingCount })));

      return {
        goatFootballer,
        otherCategories
      };
    },
    enabled: !parentLoading && !categoriesLoading && !!parentIds && !!categoriesData,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
