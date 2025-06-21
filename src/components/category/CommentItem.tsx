
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
  isReply?: boolean;
}

const CommentItem = ({ comment, replies = [], categoryId, isReply = false }: CommentItemProps) => {
  const { user, openLoginDialog } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  
  const authorName = sanitize(comment.profiles?.full_name) || "Anonymous";
  const authorAvatar = comment.profiles?.avatar_url;
  const replyCount = replies.length;

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

  if (isReply) {
    // Render as a nested reply with simpler structure
    return (
      <div className="flex gap-3">
        <Avatar className="w-6 h-6 flex-shrink-0">
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback className="text-xs bg-white/20 text-white">
            {authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-white">
              {authorName}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <div className="text-sm text-gray-200 mb-2 whitespace-pre-wrap break-words leading-relaxed">
            {sanitize(comment.comment)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplyClick}
            className="text-gray-400 hover:text-white h-6 px-2 text-xs font-medium hover:bg-white/10"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Reply
          </Button>

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
    );
  }

  // Render as a top-level comment with full YouTube-style structure
  return (
    <div className="pb-4">
      {/* Main comment */}
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={authorAvatar || undefined} alt={authorName} />
          <AvatarFallback className="text-sm bg-white/20 text-white">
            {authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">
              {authorName}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          {/* Comment content */}
          <div className="text-sm text-gray-200 mb-3 whitespace-pre-wrap break-words leading-relaxed">
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
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mb-4">
              <CommentReply
                categoryId={categoryId}
                parentCommentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={handleReplySuccess}
              />
            </div>
          )}

          {/* Replies section */}
          {replyCount > 0 && (
            <div>
              {/* Show/hide replies button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-400 hover:text-blue-300 h-8 px-0 text-sm font-medium hover:bg-transparent mb-3"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </Button>

              {/* Replies list with visual hierarchy */}
              {showReplies && (
                <div className="ml-8 border-l-2 border-white/10 pl-4 space-y-4">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      replies={[]}
                      categoryId={categoryId}
                      isReply={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
