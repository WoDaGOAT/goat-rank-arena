
import { CommentWithUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { sanitize } from "@/lib/sanitize";

interface CommentItemProps {
  comment: CommentWithUser;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const authorName = sanitize(comment.profiles?.full_name) || "Anonymous";
  const authorAvatar = comment.profiles?.avatar_url;

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={authorAvatar || undefined} alt={authorName} />
        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white">{authorName}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </p>
        </div>
        <p className="text-gray-300 whitespace-pre-wrap">{sanitize(comment.comment)}</p>
      </div>
    </div>
  );
};

export default CommentItem;
