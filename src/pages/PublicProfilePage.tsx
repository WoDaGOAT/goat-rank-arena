
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserQuizAttemptForProfile } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import PublicProfileContent from '@/components/profile/PublicProfileContent';

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  // Scroll to top when component mounts or userId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') {
            console.error('Error fetching public profile:', error);
            toast.error('Failed to load profile.');
        }
        return null;
      }
      return data;
    },
    enabled: !!userId,
  });

  const { data: quizAttempts, isLoading: isLoadingQuizAttempts } = useQuery({
    queryKey: ['userQuizAttempts', userId],
    queryFn: async () => {
      if (!userId) return [];

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
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching user quiz attempts:', error);
        return [];
      }
      
      const attempts = data?.map(attempt => ({
        ...attempt,
        quizzes: Array.isArray(attempt.quizzes) ? attempt.quizzes[0] : attempt.quizzes
      }))

      return (attempts as UserQuizAttemptForProfile[]) || [];
    },
    enabled: !!userId,
  });

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return {
          totalQuizzes: 0,
          totalScore: 0,
          averageScore: 0,
          perfectScores: 0,
          accuracy: 0
        };
      }

      const totalQuizzes = data.length;
      const totalScore = data.reduce((sum, attempt) => sum + attempt.score, 0);
      const perfectScores = data.filter(attempt => attempt.score === 5).length;
      const averageScore = totalScore / totalQuizzes;
      const accuracy = (totalScore / (totalQuizzes * 5)) * 100;

      return {
        totalQuizzes,
        totalScore,
        averageScore: Math.round(averageScore * 10) / 10,
        perfectScores,
        accuracy: Math.round(accuracy * 10) / 10
      };
    },
    enabled: !!userId,
  });

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto bg-white/5 text-white border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isOwnProfile ? "My Profile" : "User Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PublicProfileContent
            profile={profile}
            isLoading={isLoading}
            isOwnProfile={isOwnProfile}
            userId={userId}
            quizAttempts={quizAttempts || []}
            isLoadingQuizAttempts={isLoadingQuizAttempts}
            userStats={userStats}
            isLoadingStats={isLoadingStats}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfilePage;
