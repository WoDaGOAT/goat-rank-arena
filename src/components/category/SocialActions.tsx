
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocialActionsProps {
  categoryId: string;
  initialLikes: number;
  isLiked: boolean;
  categoryName: string;
}

export const SocialActions = ({ categoryId, initialLikes, isLiked, categoryName }: SocialActionsProps) => {
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comment count
  const { data: commentCount = 0 } = useQuery({
    queryKey: ["categoryCommentCount", categoryId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("category_comments")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!categoryId,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      if (!user) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }

      if (isLiked) {
        const { error } = await supabase
          .from("category_likes")
          .delete()
          .match({ user_id: user.id, category_id: categoryId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("category_likes")
          .insert({ user_id: user.id, category_id: categoryId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryLikes", categoryId] });
    },
    onError: (error) => {
      if (error.message !== "User not authenticated") {
        toast.error("Failed to update like status. Please try again.");
      }
    },
  });

  return (
    <div className="flex items-center justify-center gap-6">
      <Button
        variant="outline"
        className="border-white/20 bg-white/10 text-white hover:bg-white/20"
        onClick={() => toggleLike()}
      >
        <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        {initialLikes} {initialLikes === 1 ? 'Like' : 'Likes'}
      </Button>
      
      <div className="flex items-center text-white">
        <span className="mr-2">💬</span>
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>
    </div>
  );
};
