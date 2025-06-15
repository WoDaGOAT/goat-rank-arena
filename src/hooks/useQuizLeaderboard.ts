
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface QuizLeaderboardUser {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    total_score: number;
    quizzes_completed: number;
}

const fetchQuizLeaderboard = async (): Promise<QuizLeaderboardUser[]> => {
    const { data, error } = await supabase.rpc('get_quiz_leaderboard');

    if (error) {
        toast.error('Could not fetch quiz leaderboard.');
        console.error('Error fetching quiz leaderboard:', error);
        throw new Error('Could not fetch quiz leaderboard');
    }

    return (data as QuizLeaderboardUser[]) || [];
};

export const useQuizLeaderboard = () => {
    return useQuery({
        queryKey: ['quizLeaderboard'],
        queryFn: fetchQuizLeaderboard,
    });
};
