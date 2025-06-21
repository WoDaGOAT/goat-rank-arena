
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import { CommentWithUser } from "@/types";
import { sanitize } from "@/lib/sanitize";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentReplyProps {
  categoryId: string;
  parentCommentId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CommentReply = ({ categoryId, parentCommentId, onCancel, onSuccess }: CommentReplyProps) => {
  const [comment, setComment] = useState("");
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addReply, isPending } = useMutation({
    mutationFn: async (commentText: string): Promise<CommentWithUser> => {
      if (!user) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase.functions.invoke("post-comment", {
        body: {
          categoryId: categoryId,
          commentText: commentText,
          parentCommentId: parentCommentId,
        },
      });

      if (error) {
        if (error instanceof FunctionsHttpError) {
          try {
            const errorJson = await error.context.json();
            throw new Error(errorJson.error || "Failed to post reply.");
          } catch (parseError) {
            throw new Error("Failed to post reply - server error.");
          }
        }
        throw error;
      }

      if (!data) {
        throw new Error("Reply could not be created - no response.");
      }

      return data as CommentWithUser;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["categoryComments", categoryId] });
      toast.success("Reply posted!");
      onSuccess?.();
    },
    onError: (error) => {
      if (error.message !== "User not authenticated") {
        toast.error(error.message || "Failed to post reply. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addReply(sanitize(comment.trim()));
    } else {
      toast.error("Please enter a reply before posting.");
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex gap-3">
        {/* User avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || "You"} />
            <AvatarFallback className="text-xs bg-white/20 text-white">
              {(user?.user_metadata?.full_name || "You").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Reply form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a reply..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isPending}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-gray-400 hover:text-white hover:bg-white/10"
                disabled={isPending}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !comment.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Send className="w-4 h-4 mr-1" />
                {isPending ? "Posting..." : "Reply"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentReply;
