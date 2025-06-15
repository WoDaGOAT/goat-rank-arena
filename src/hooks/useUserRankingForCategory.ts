
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRankingForCategory = (categoryId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRanking', user?.id, categoryId],
    queryFn: async () => {
      if (!user || !categoryId) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_rankings')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user && !!categoryId,
  });
};
