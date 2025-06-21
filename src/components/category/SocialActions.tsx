
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { CommentDialog } from "./CommentDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocialActionsProps {
  categoryId: string;
  initialLikes: number;
  isLiked: boolean;
  categoryName: string;
}

export const SocialActions = ({ categoryId, initialLikes, isLiked, categoryName }: SocialActionsProps) => {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();

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

  const handleCommentClick = () => {
    if (!user) {
      openLoginDialog();
      return;
    }
    setShowCommentDialog(true);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          onClick={() => toggleLike()}
        >
          <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          {initialLikes} {initialLikes === 1 ? 'Like' : 'Likes'}
        </Button>
        
        <Button
          variant="outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          onClick={handleCommentClick}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Comment
        </Button>
      </div>
      
      <CommentDialog
        open={showCommentDialog}
        onOpenChange={setShowCommentDialog}
        categoryId={categoryId}
      />
    </>
  );
};
