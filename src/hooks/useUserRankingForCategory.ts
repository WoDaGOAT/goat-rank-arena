
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRankingForCategory = (categoryId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userRanking', user?.id, categoryId],
    queryFn: async () => {
      if (!user || !categoryId) {
        console.log('useUserRankingForCategory - Missing user or categoryId:', { userId: user?.id, categoryId });
        return null;
      }

      console.log('useUserRankingForCategory - Checking ranking for user:', user.id, 'category:', categoryId);

      const { data, error } = await supabase
        .from('user_rankings')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .maybeSingle();

      if (error) {
        console.error('useUserRankingForCategory - Error:', error);
        throw error;
      }

      console.log('useUserRankingForCategory - Result:', data);
      return data;
    },
    enabled: !!user && !!categoryId,
  });
};
