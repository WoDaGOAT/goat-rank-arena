
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { usePublicUserRankings, PublicUserRanking } from "@/hooks/usePublicUserRankings";
import { Trophy } from "lucide-react";

interface PublicRankingActivityProps {
  userId: string;
  isOwnProfile: boolean;
}

const PublicRankingActivity = ({ userId, isOwnProfile }: PublicRankingActivityProps) => {
  const { data: userRankings, isLoading } = usePublicUserRankings(userId);

  console.log('PublicRankingActivity - userRankings:', userRankings);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        {isOwnProfile ? "My Recent Rankings" : "Recent Rankings"}
      </h3>
      
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-white/10" />
          <Skeleton className="h-5 w-1/2 bg-white/10" />
          <Skeleton className="h-5 w-2/3 bg-white/10" />
        </div>
      ) : userRankings && userRankings.length > 0 ? (
        <ul className="space-y-3 text-gray-300">
          {userRankings.map(ranking => {
            console.log('Rendering ranking:', ranking.id, ranking.title);
            return (
              <li key={ranking.id} className="text-sm">
                <Link 
                  to={`/ranking/${ranking.id}`} 
                  className="font-semibold text-blue-400 hover:underline"
                  onClick={() => console.log('Clicked ranking link:', ranking.id)}
                >
                  {ranking.title}
                </Link>
                <div className="text-gray-400 text-xs">
                  in {ranking.categories?.name || 'a category'} • {format(new Date(ranking.created_at), 'MMM d, yyyy')}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">
          {isOwnProfile ? "No rankings submitted yet. Create your first one!" : "This user hasn't created any rankings yet."}
        </p>
      )}
    </div>
  );
};

export default PublicRankingActivity;
