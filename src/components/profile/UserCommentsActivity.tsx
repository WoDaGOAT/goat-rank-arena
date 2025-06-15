import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { UserComment } from "@/types";

interface UserCommentsActivityProps {
    userComments: UserComment[] | undefined;
    isLoading: boolean;
}

const UserCommentsActivity = ({ userComments, isLoading }: UserCommentsActivityProps) => {
    return (
        <div className="pt-4">
            <h3 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-300" />
                Recent Comments
            </h3>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full bg-gray-700" />
                    <Skeleton className="h-16 w-full bg-gray-700" />
                </div>
            ) : userComments && userComments.length > 0 ? (
                <div className="space-y-4">
                    {userComments.map(comment => (
                        <div key={comment.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-gray-300 italic whitespace-pre-wrap">"{comment.comment}"</p>
                            <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                                <span>
                                    on <Link to={`/category/${comment.category_id}`} className="text-blue-400 hover:underline">{comment.categories?.name || 'a category'}</Link>
                                </span>
                                <span>
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No comments posted yet.</p>
            )}
        </div>
    );
};

export default UserCommentsActivity;
