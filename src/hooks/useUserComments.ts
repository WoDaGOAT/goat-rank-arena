
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserComment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useUserComments = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['userComments', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('category_comments')
                .select(`
                    id,
                    comment,
                    created_at,
                    category_id,
                    categories ( name )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                toast.error("Failed to fetch your comments.");
                console.error('Error fetching user comments:', error);
                return [] as UserComment[];
            }
            
            if (!data) {
                return [];
            }

            const formattedData = data.map((comment) => ({
                ...comment,
                categories: Array.isArray(comment.categories) ? (comment.categories[0] || null) : (comment.categories || null),
            }));

            return formattedData as UserComment[];
        },
        enabled: !!user,
      });
}
