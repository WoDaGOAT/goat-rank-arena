
import { useState } from "react";
import { CommentWithUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { sanitize } from "@/lib/sanitize";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CommentReply from "./CommentReply";

interface CommentItemProps {
  comment: CommentWithUser;
  replies?: CommentWithUser[];
  categoryId: string;
}

const CommentItem = ({ comment, replies = [], categoryId }: CommentItemProps) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const authorName = sanitize(comment.profiles?.full_name) || "Anonymous";
  const authorAvatar = comment.profiles?.avatar_url;
  const hasReplies = replies.length > 0;

  const handleReplyClick = () => {
    if (!user) {
      // Auth context will handle opening login dialog
      return;
    }
    setShowReplyForm(true);
  };

  const handleReplySuccess = () => {
    setShowReplies(true);
  };

  return (
    <div className="space-y-3">
      {/* Main comment */}
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback className="text-xs">{authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-white text-sm">{authorName}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
            {sanitize(comment.comment)}
          </p>
          
          {/* Reply button */}
          <div className="mt-2 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="text-gray-400 hover:text-white h-6 px-2 text-xs"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Reply
            </Button>
            
            {/* Show/hide replies toggle */}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-400 hover:text-white h-6 px-2 text-xs"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <CommentReply
          categoryId={categoryId}
          parentCommentId={comment.id}
          onCancel={() => setShowReplyForm(false)}
          onSuccess={handleReplySuccess}
        />
      )}

      {/* Nested replies */}
      {showReplies && hasReplies && (
        <div className="ml-8 space-y-3 border-l-2 border-white/10 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-3">
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarImage src={reply.profiles?.avatar_url || undefined} alt={sanitize(reply.profiles?.full_name) || "Anonymous"} />
                <AvatarFallback className="text-xs">
                  {(sanitize(reply.profiles?.full_name) || "Anonymous").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white text-sm">
                    {sanitize(reply.profiles?.full_name) || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                  {sanitize(reply.comment)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
