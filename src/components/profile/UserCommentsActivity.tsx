
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { UserComment } from "@/types";
import { Link } from "react-router-dom";
import { sanitize } from "@/lib/sanitize";
import { MessageSquare } from "lucide-react";

interface UserCommentsActivityProps {
  userComments: UserComment[] | undefined;
  isLoading: boolean;
}

const UserCommentsActivity = ({ userComments, isLoading }: UserCommentsActivityProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Comments</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!userComments || userComments.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Comments</h3>
        <div className="bg-white/5 p-4 rounded-lg border border-gray-700 text-center">
          <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400">No comments yet. Start engaging with the community!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Comments</h3>
      <div className="space-y-3">
        {userComments.map((comment) => (
          <div key={comment.id} className="bg-white/5 p-4 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <Link 
                to={`/category/${comment.category_id}`}
                className="text-blue-300 hover:text-blue-200 font-medium text-sm hover:underline"
              >
                {comment.categories?.name ? sanitize(comment.categories.name) : 'Unknown Category'}
              </Link>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-200 text-sm line-clamp-2">
              {sanitize(comment.comment)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCommentsActivity;
