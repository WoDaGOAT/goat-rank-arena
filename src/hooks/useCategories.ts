
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
    queryKey: ['categories', 'v2'], // Updated cache key to force fresh fetch
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
  });
};
