
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
  isTopLevel?: boolean;
}

const CommentItem = ({ comment, replies = [], categoryId, isTopLevel = false }: CommentItemProps) => {
  const { user, openLoginDialog } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true); // Default to show replies
  
  const authorName = sanitize(comment.profiles?.full_name) || "Anonymous";
  const authorAvatar = comment.profiles?.avatar_url;
  const hasReplies = replies.length > 0;

  const handleReplyClick = () => {
    if (!user) {
      openLoginDialog();
      return;
    }
    setShowReplyForm(true);
  };

  const handleReplySuccess = () => {
    setShowReplies(true);
    setShowReplyForm(false);
  };

  return (
    <div className={`${isTopLevel ? 'border-b border-white/10 pb-6' : ''}`}>
      {/* Main comment container */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className={`${isTopLevel ? 'w-10 h-10' : 'w-8 h-8'}`}>
            <AvatarImage src={authorAvatar || undefined} alt={authorName} />
            <AvatarFallback className={`${isTopLevel ? 'text-sm' : 'text-xs'} bg-white/20 text-white`}>
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          {/* Header with username and timestamp */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold text-white ${isTopLevel ? 'text-sm' : 'text-xs'}`}>
              {authorName}
            </span>
            <span className={`text-gray-400 ${isTopLevel ? 'text-xs' : 'text-xs'}`}>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Comment text */}
          <div className={`text-gray-200 ${isTopLevel ? 'text-sm' : 'text-sm'} mb-2 whitespace-pre-wrap break-words leading-relaxed`}>
            {sanitize(comment.comment)}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="text-gray-400 hover:text-white h-8 px-3 text-xs font-medium hover:bg-white/10"
            >
              <MessageSquare className="w-3 h-3 mr-1.5" />
              Reply
            </Button>
            
            {/* Show/hide replies toggle for top-level comments */}
            {hasReplies && isTopLevel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-400 hover:text-white h-8 px-3 text-xs font-medium hover:bg-white/10"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1.5" />
                    Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1.5" />
                    Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentReply
                categoryId={categoryId}
                parentCommentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={handleReplySuccess}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies with proper indentation and threading line */}
      {showReplies && hasReplies && isTopLevel && (
        <div className="mt-4 ml-12 relative">
          {/* Threading line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20"></div>
          
          <div className="space-y-4 pl-4">
            {replies.map((reply, index) => (
              <div key={reply.id} className="relative">
                {/* Individual reply */}
                <CommentItem
                  comment={reply}
                  replies={[]}
                  categoryId={categoryId}
                  isTopLevel={false}
                />
                {/* Separator between replies */}
                {index < replies.length - 1 && (
                  <div className="mt-4 border-b border-white/5"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
