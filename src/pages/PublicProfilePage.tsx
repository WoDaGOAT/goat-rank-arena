import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import QuizActivity from '@/components/profile/QuizActivity';
import { UserQuizAttemptForProfile } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import { usePublicUserBadges } from '@/hooks/usePublicUserBadges';
import BadgeShowcase from '@/components/quiz/BadgeShowcase';

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { data: userBadges = [], isLoading: isBadgesLoading } = usePublicUserBadges(userId);

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
        if (error.code !== 'PGRST116') { // Ignore "no rows found" error
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
      const accuracy = (totalScore / (totalQuizzes * 5)) * 100; // Based on 5 questions per quiz

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
          <div>
            <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-lg text-gray-400 mb-4">The user profile you are looking for does not exist.</p>
            <Link to="/feed" className="text-blue-400 hover:text-blue-300 underline">
            Return to Feed
            </Link>
        </div>
      );
    }

    return (
       <div className="space-y-6">
         {/* Profile Header */}
         <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous User'}</h2>
              {profile.country && <p className="text-gray-400">{profile.country}</p>}
              {profile.favorite_sports && profile.favorite_sports.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.favorite_sports.map((sport: string) => (
                    <Badge key={sport} variant="secondary" className="text-xs">
                      {sport}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Badges Section */}
          {isBadgesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 bg-white/10 rounded-lg" />
                ))}
              </div>
            </div>
          ) : userBadges && userBadges.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Badges & Achievements</h3>
              <BadgeShowcase userBadges={userBadges} />
            </div>
          ) : (
            <div className="bg-white/5 p-6 rounded-lg border border-gray-700 text-center">
              <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
              <p className="text-gray-400">
                {isOwnProfile ? "Take quizzes to earn your first badge!" : "This user hasn't earned any badges yet."}
              </p>
            </div>
          )}

          {/* Quiz Statistics */}
          {isLoadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 bg-white/10 rounded-lg" />
              ))}
            </div>
          ) : userStats && userStats.totalQuizzes > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Quiz Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{userStats.totalQuizzes}</div>
                  <div className="text-sm text-gray-400">Quizzes Taken</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{userStats.totalScore}</div>
                  <div className="text-sm text-gray-400">Total Score</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{userStats.averageScore}/5</div>
                  <div className="text-sm text-gray-400">Average Score</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{userStats.accuracy}%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Quiz Activity Component */}
          <QuizActivity 
            quizAttempts={quizAttempts}
            isLoading={isLoadingQuizAttempts}
          />
       </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
    >
      <main className="container mx-auto px-4 py-12 flex-grow">
        <Card className="max-w-4xl mx-auto bg-white/5 text-white border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isOwnProfile ? "My Profile" : "User Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PublicProfilePage;
