
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface CommentFormProps {
  categoryId: string;
}

const CommentForm = ({ categoryId }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: async (commentText: string) => {
      if (!user) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }
      const { error } = await supabase
        .from("category_comments")
        .insert({ user_id: user.id, category_id: categoryId, comment: commentText });
      if (error) throw error;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["categoryComments", categoryId] });
      toast.success("Comment posted!");
    },
    onError: (error) => {
      if (error.message !== "User not authenticated") {
        toast.error("Failed to post comment. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(comment.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
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
