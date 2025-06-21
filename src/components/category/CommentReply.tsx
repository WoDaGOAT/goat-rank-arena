
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
      onCancel();
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
    <form onSubmit={handleSubmit} className="space-y-3 mt-3 pl-12">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a reply..."
        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 text-sm"
        rows={2}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !comment.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="w-4 h-4 mr-1" />
          {isPending ? "Posting..." : "Reply"}
        </Button>
      </div>
    </form>
  );
};

export default CommentReply;
