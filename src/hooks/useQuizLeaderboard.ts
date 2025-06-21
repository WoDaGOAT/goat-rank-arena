
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface QuizLeaderboardUser {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    total_score: number;
    quizzes_completed: number;
    highest_badge_id: string | null;
    highest_badge_name: string | null;
    highest_badge_rarity: string | null;
}

const fetchQuizLeaderboard = async (): Promise<QuizLeaderboardUser[]> => {
    console.log('Fetching quiz leaderboard...');
    const { data, error } = await supabase.rpc('get_quiz_leaderboard');

    if (error) {
        console.error('Error fetching quiz leaderboard:', error);
        toast.error('Could not fetch quiz leaderboard.');
        throw new Error('Could not fetch quiz leaderboard');
    }

    console.log('Raw leaderboard data from database:', data);
    
    // Log each user's badge data
    if (data && Array.isArray(data)) {
        data.forEach((user, index) => {
            console.log(`Leaderboard user ${index + 1}:`, {
                user_id: user.user_id,
                full_name: user.full_name,
                highest_badge_id: user.highest_badge_id,
                highest_badge_name: user.highest_badge_name,
                highest_badge_rarity: user.highest_badge_rarity,
                data_types: {
                    badge_id_type: typeof user.highest_badge_id,
                    badge_name_type: typeof user.highest_badge_name,
                    badge_rarity_type: typeof user.highest_badge_rarity
                }
            });
        });
    }

    return (data as QuizLeaderboardUser[]) || [];
};

export const useQuizLeaderboard = () => {
    return useQuery({
        queryKey: ['quizLeaderboard'],
        queryFn: fetchQuizLeaderboard,
    });
};
