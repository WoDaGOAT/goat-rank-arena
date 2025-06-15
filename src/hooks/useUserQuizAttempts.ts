
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { UserQuizAttemptForProfile } from '@/types/quiz';

export const useUserQuizAttempts = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['userQuizAttempts', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('quiz_attempts')
                .select(`
                    id,
                    score,
                    completed_at,
                    quizzes (
                        title,
                        quiz_questions ( id )
                    )
                `)
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false })
                .limit(10);

            if (error) {
                toast.error("Failed to fetch your quiz history.");
                console.error('Error fetching user quiz attempts:', error);
                return [];
            }
            
            // The select query with the join on quizzes can return a single object or an array.
            // Supabase client might type it as single object, so we need to handle both cases.
            const attempts = data?.map(attempt => ({
                ...attempt,
                quizzes: Array.isArray(attempt.quizzes) ? attempt.quizzes[0] : attempt.quizzes
            }))

            return (attempts as UserQuizAttemptForProfile[]) || [];
        },
        enabled: !!user,
      });
}
