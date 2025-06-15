
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface UserRankingForProfile {
    id: string;
    title: string;
    created_at: string;
    category_id: string;
    categories: { name: string | null } | null;
}

export const useUserRankings = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['userRankings', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('user_rankings')
                .select(`
                    id,
                    title,
                    created_at,
                    category_id,
                    categories ( name )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                toast.error("Failed to fetch your rankings.");
                console.error('Error fetching user rankings:', error);
                return [];
            }
            
            if (!data) {
                return [];
            }
            
            const typedData = data.map((ranking) => ({
                ...ranking,
                categories: Array.isArray(ranking.categories) ? (ranking.categories[0] || null) : (ranking.categories || null),
            })) as UserRankingForProfile[];

            return typedData;
        },
        enabled: !!user,
      });
}
