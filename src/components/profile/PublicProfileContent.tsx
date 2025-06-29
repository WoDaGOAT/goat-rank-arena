
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import QuizActivity from "@/components/profile/QuizActivity";
import { UserQuizAttemptForProfile } from '@/types/quiz';
import { usePublicUserBadges } from '@/hooks/usePublicUserBadges';
import EnhancedProfileHeader from '@/components/profile/EnhancedProfileHeader';
import PublicRankingActivity from '@/components/profile/PublicRankingActivity';
import PublicFriendsList from '@/components/profile/PublicFriendsList';
import PublicProfileStats from './PublicProfileStats';
import PublicProfileBadges from './PublicProfileBadges';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  favorite_sports: string[] | null;
}

interface UserStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  perfectScores: number;
  accuracy: number;
}

interface PublicProfileContentProps {
  profile: Profile | null;
  isLoading: boolean;
  isOwnProfile: boolean;
  userId?: string;
  quizAttempts: UserQuizAttemptForProfile[];
  isLoadingQuizAttempts: boolean;
  userStats: UserStats | null;
  isLoadingStats: boolean;
}

const PublicProfileContent = ({
  profile,
  isLoading,
  isOwnProfile,
  userId,
  quizAttempts,
  isLoadingQuizAttempts,
  userStats,
  isLoadingStats
}: PublicProfileContentProps) => {
  const { data: userBadges = [], isLoading: isBadgesLoading } = usePublicUserBadges(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 bg-white/10 rounded-lg" />
          ))}
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
    <div className="space-y-8">
      {/* Enhanced Profile Header */}
      <EnhancedProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      {/* Statistics Cards */}
      <PublicProfileStats userStats={userStats} isLoading={isLoadingStats} />

      {/* Badges Section */}
      <PublicProfileBadges 
        userBadges={userBadges} 
        isLoading={isBadgesLoading} 
        isOwnProfile={isOwnProfile} 
      />

      {/* Rankings Activity */}
      {userId && (
        <PublicRankingActivity userId={userId} isOwnProfile={isOwnProfile} />
      )}

      {/* Friends List */}
      {userId && (
        <PublicFriendsList userId={userId} isOwnProfile={isOwnProfile} />
      )}

      {/* Quiz Activity Component */}
      <QuizActivity 
        quizAttempts={quizAttempts}
        isLoading={isLoadingQuizAttempts}
      />
    </div>
  );
};

export default PublicProfileContent;
