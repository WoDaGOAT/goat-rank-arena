
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface PublicUserRanking {
  id: string;
  title: string;
  created_at: string;
  category_id: string;
  categories: { name: string | null } | null;
}

export const usePublicUserRankings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['publicUserRankings', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_rankings')
        .select(`
          id,
          title,
          created_at,
          category_id,
          categories ( name )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching public user rankings:', error);
        return [];
      }
      
      if (!data) return [];
      
      return data.map((ranking) => ({
        ...ranking,
        categories: Array.isArray(ranking.categories) ? (ranking.categories[0] || null) : (ranking.categories || null),
      })) as PublicUserRanking[];
    },
    enabled: !!userId,
  });
};
