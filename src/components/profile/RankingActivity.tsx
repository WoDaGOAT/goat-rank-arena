
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface LikedCategory {
    id: string;
    name: string | null;
}

interface UserRankingForProfile {
  id: string;
  title: string;
  created_at: string;
  category_id: string;
  categories: { name: string | null } | null;
}

interface RankingActivityProps {
    likedCategories: LikedCategory[] | undefined;
    isLoading: boolean;
    userRankings: UserRankingForProfile[] | undefined;
    isLoadingUserRankings: boolean;
}

const RankingActivity = ({ likedCategories, isLoading, userRankings, isLoadingUserRankings }: RankingActivityProps) => {
    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3">My Recent Rankings</h3>
                 {isLoadingUserRankings ? (
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4 bg-gray-700" />
                        <Skeleton className="h-5 w-1/2 bg-gray-700" />
                        <Skeleton className="h-5 w-2/3 bg-gray-700" />
                    </div>
                ) : userRankings && userRankings.length > 0 ? (
                    <ul className="space-y-3 text-gray-300">
                        {userRankings.map(ranking => (
                            <li key={ranking.id} className="text-sm">
                                <Link to={`/category/${ranking.category_id}`} className="font-semibold text-blue-400 hover:underline">
                                    {ranking.title}
                                </Link>
                                <div className="text-gray-400 text-xs">
                                  in {ranking.categories?.name || 'a category'} &bull; {format(new Date(ranking.created_at), 'MMM d, yyyy')}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm">No rankings submitted yet. Create your first one!</p>
                )}
            </div>
            
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3">Liked Leaderboards</h3>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-1/2 bg-gray-700" />
                        <Skeleton className="h-5 w-1/3 bg-gray-700" />
                    </div>
                ) : likedCategories && likedCategories.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {likedCategories.map(category => category && (
                            <li key={category.id}>
                                <Link to={`/category/${category.id}`} className="text-blue-400 hover:underline">
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No liked leaderboards yet. Go like some!</p>
                )}
            </div>
        </div>
    );
};

export default RankingActivity;
