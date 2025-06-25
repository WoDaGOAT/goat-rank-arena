
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories', 'v4'], // Incremented cache key
    queryFn: async () => {
      console.log("📋 Fetching categories from database...");
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("📋 Error fetching categories:", error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }
      
      console.log("📋 Categories fetched successfully:", {
        count: data?.length || 0,
        categories: data?.map(c => ({ id: c.id, name: c.name, parent_id: c.parent_id })) || []
      });
      
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
