
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface LikedCategory {
    id: string;
    name: string | null;
}

interface RankingActivityProps {
    likedCategories: LikedCategory[] | undefined;
    isLoading: boolean;
}

const RankingActivity = ({ likedCategories, isLoading }: RankingActivityProps) => {
    return (
        <div className="space-y-6 pt-4">
            <div>
                <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3">Ranking Stats</h3>
                <div className="text-gray-400 space-y-1">
                    <p>Total Rankings Submitted: 0</p>
                    <p>Categories Voted In: None</p>
                    <p>Last Ranking Submitted: N/A</p>
                    <p className="text-sm mt-2 italic">(Ranking features are coming soon!)</p>
                </div>
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
