import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAnalytics } from '@/hooks/useAnalytics';

interface CommentFormProps {
  categoryId: string;
  parentCommentId?: number;
  onSuccess?: () => void;
  placeholder?: string;
}

interface SubmitCommentParams {
  comment: string;
  categoryId: string;
  parentCommentId?: number;
}

const CommentForm = ({ categoryId, parentCommentId, onSuccess, placeholder = "Share your thoughts..." }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { trackCommentPosted } = useAnalytics();

  const submitComment = useMutation({
    mutationFn: async ({ comment, categoryId, parentCommentId }: SubmitCommentParams) => {
      if (!user) {
        throw new Error("You must be logged in to post a comment.");
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          comment,
          category_id: categoryId,
          user_id: user.id,
          parent_comment_id: parentCommentId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Track comment posting
      trackCommentPosted(categoryId);

      return data;
    },
    onSuccess: (data) => {
      toast.success("Comment posted!");
      setComment("");
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast.error("Failed to post comment.", {
        description: error.message,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      await submitComment.mutateAsync({ comment, categoryId, parentCommentId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.user_metadata?.avatar_url || undefined} alt={user?.user_metadata?.full_name as string || 'User'} />
        <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="w-full space-y-2">
        <Textarea
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="resize-none"
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading} size="sm">
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
