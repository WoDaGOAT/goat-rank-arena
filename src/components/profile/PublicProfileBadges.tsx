
import { Skeleton } from "@/components/ui/skeleton";
import BadgeShowcase from "@/components/quiz/BadgeShowcase";
import { UserBadge } from '@/types/badges';

interface PublicProfileBadgesProps {
  userBadges: UserBadge[];
  isLoading: boolean;
  isOwnProfile: boolean;
}

const PublicProfileBadges = ({ userBadges, isLoading, isOwnProfile }: PublicProfileBadgesProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 bg-white/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (userBadges && userBadges.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Badges & Achievements</h3>
        <BadgeShowcase userBadges={userBadges} />
      </div>
    );
  }

  return (
    <div className="bg-white/5 p-6 rounded-lg border border-gray-700 text-center">
      <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
      <p className="text-gray-400">
        {isOwnProfile ? "Take quizzes to earn your first badge!" : "This user hasn't earned any badges yet."}
      </p>
    </div>
  );
};

export default PublicProfileBadges;
