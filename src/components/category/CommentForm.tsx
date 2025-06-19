
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { CommentWithUser } from "@/types";
import { sanitize } from "@/lib/sanitize";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface CommentFormProps {
  categoryId: string;
  onSuccess?: () => void;
}

const CommentForm = ({ categoryId, onSuccess }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async (commentText: string): Promise<CommentWithUser> => {
      if (!user) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase.functions.invoke("post-comment", {
        body: {
          categoryId: categoryId,
          commentText: commentText,
        },
      });

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorJson = await error.context.json();
          throw new Error(errorJson.error || "Failed to post comment.");
        }
        throw error;
      }

      if (!data) throw new Error("Comment could not be created.");

      return data as CommentWithUser;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["categoryComments", categoryId] });
      toast.success("Comment posted!");
      onSuccess?.();
    },
    onError: (error) => {
      if (error.message !== "User not authenticated") {
        toast.error(error.message || "Failed to post comment. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(sanitize(comment.trim()));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={user ? "Write a comment..." : "Log in to post a comment"}
        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
        rows={3}
        disabled={isPending || !user}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !comment.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Send className="w-4 h-4 mr-2" />
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
