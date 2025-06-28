
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useCategoriesWithRankings = (parentIds: string[]) => {
  return useQuery({
    queryKey: ["categoriesWithRankings", parentIds],
    queryFn: async () => {
      // Fetch all categories from parent categories
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

      return { categoriesWithCounts, rankingCountMap };
    },
    enabled: parentIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
