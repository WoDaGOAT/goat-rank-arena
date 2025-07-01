import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/sanitize";
import EnhancedCommentForm from "./EnhancedCommentForm";
import { useSecurity } from "@/contexts/SecurityContext";

interface CommentSectionProps {
  categoryId: string;
}

interface CommentWithUserData extends Comment {
  user_full_name: string | null;
  user_avatar_url: string | null;
}

const CommentSection = ({ categoryId }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentWithUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const { checkRateLimit, reportSuspiciousActivity } = useSecurity();

  const { refetch } = useQuery({
    queryKey: ['comments', categoryId],
    queryFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('category_comments')
          .select('*, user_profiles(full_name, avatar_url)')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching comments:", error);
          setError(error.message);
          reportSuspiciousActivity('comment_fetch_failed', {
            category_id: categoryId,
            error_message: error.message
          });
          throw error;
        }

        const enrichedComments = data.map(comment => ({
          ...comment,
          user_full_name: comment.user_profiles?.full_name || 'Anonymous',
          user_avatar_url: comment.user_profiles?.avatar_url || null,
        })) as CommentWithUserData[];

        setComments(enrichedComments);
        return enrichedComments;
      } catch (err: any) {
        setError(err.message || "Failed to load comments.");
        reportSuspiciousActivity('comment_fetch_error', {
          category_id: categoryId,
          error_message: err.message
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    retry: 1,
  });

  useEffect(() => {
    refetch();
  }, [categoryId, refetch]);

  const handleCommentAdded = () => {
    if (!checkRateLimit('comment')) {
      return; // Rate limit exceeded, don't refresh
    }
    refetch();
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Comments</h2>
      </div>

      {loading && <p className="text-gray-400">Loading comments...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {comments.length === 0 && !loading && (
        <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarImage src={comment.user_full_name || undefined} />
                <AvatarFallback>{comment.user_full_name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{sanitizeHtml(comment.user_full_name || 'Anonymous')}</div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {sanitizeHtml(comment.comment)}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => startReply(comment.id)}>
                    Reply
                  </Button>
                </div>
                {replyingTo === comment.id && (
                  <div className="mt-4">
                    <EnhancedCommentForm
                      categoryId={categoryId}
                      onCommentAdded={handleCommentAdded}
                      parentCommentId={comment.id}
                      placeholder="Write your reply..."
                    />
                    <Button variant="secondary" size="sm" onClick={cancelReply} className="mt-2">
                      Cancel Reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="mt-6">
        <EnhancedCommentForm
          categoryId={categoryId}
          onCommentAdded={handleCommentAdded}
          placeholder="Share your thoughts about this ranking..."
        />
      </div>
    </div>
  );
};

export default CommentSection;
