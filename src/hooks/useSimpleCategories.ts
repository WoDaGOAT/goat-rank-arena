
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface SimpleCategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: SimpleCategory[];
}

// Static fallback categories for when database fails
const FALLBACK_CATEGORIES: SimpleCategory[] = [
  {
    id: 'fallback-goat',
    name: 'GOAT',
    description: 'Greatest of All Time rankings',
    parent_id: null,
    children: [
      { id: 'fallback-goat-footballer', name: 'GOAT Footballer', description: 'Greatest footballer of all time', parent_id: 'fallback-goat' },
      { id: 'fallback-goat-goalkeeper', name: 'GOAT Goalkeeper', description: 'Greatest goalkeeper of all time', parent_id: 'fallback-goat' }
    ]
  },
  {
    id: 'fallback-current',
    name: 'Current GOAT',
    description: 'Current generation rankings',
    parent_id: null,
    children: [
      { id: 'fallback-current-footballer', name: 'Current GOAT Footballer', description: 'Best active footballer', parent_id: 'fallback-current' }
    ]
  }
];

export const useSimpleCategories = () => {
  return useQuery({
    queryKey: ['simple-categories'],
    queryFn: async () => {
      console.log("📋 Fetching categories with simplified approach...");
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, description, parent_id')
          .order('name');
        
        if (error) {
          console.error("📋 Database error, using fallback categories:", error);
          return FALLBACK_CATEGORIES;
        }
        
        if (!data || data.length === 0) {
          console.warn("📋 No categories found, using fallback categories");
          return FALLBACK_CATEGORIES;
        }
        
        // Build proper hierarchical structure
        const categoriesById = new Map(data.map(c => [c.id, { ...c, children: [] as SimpleCategory[] }]));
        const rootCategories: SimpleCategory[] = [];
        
        data.forEach(category => {
          if (category.parent_id) {
            const parent = categoriesById.get(category.parent_id);
            if (parent) {
              parent.children!.push(categoriesById.get(category.id)!);
            }
          } else {
            rootCategories.push(categoriesById.get(category.id)!);
          }
        });
        
        console.log("📋 Categories structured successfully:", rootCategories.length);
        return rootCategories;
        
      } catch (error) {
        console.error("📋 Fetch error, using fallback categories:", error);
        return FALLBACK_CATEGORIES;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: 1000,
    throwOnError: false,
  });
};
