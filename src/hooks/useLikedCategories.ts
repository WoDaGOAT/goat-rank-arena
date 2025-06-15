
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLikedCategories = () => {
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ['likedCategories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('category_likes')
        .select(`categories (id, name)`)
        .eq('user_id', user.id);

      if (error) {
        toast.error("Failed to fetch liked leaderboards.");
        console.error('Error fetching liked categories:', error);
        return [];
      }
      if (!data) {
        return [];
      }
      // The relationship might be incorrectly typed as one-to-many, causing a nested array.
      // .flat() will correct this structure if needed.
      return data
        .map(item => item.categories)
        .flat()
        .filter(Boolean) as { id: string, name: string | null }[];
    },
    enabled: !!user && !loading,
  });
};
