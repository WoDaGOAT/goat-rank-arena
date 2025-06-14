
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
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
  const [showShareDialog, setShowShareDialog] = useState(false);
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

  return (
    <>
      <div className="flex items-center gap-2">
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
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={window.location.href}
        text={`Check out the leaderboard for ${categoryName} on RankPulse!`}
      />
    </>
  );
};
