
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Trophy, Flame, Frown } from "lucide-react";
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
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

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

  const handleReactionClick = (reactionType: string) => {
    if (!user) {
      openLoginDialog();
      return;
    }
    // For now, just show a toast - this could be extended to save reactions to database
    toast.success(`You reacted with ${reactionType}!`);
  };

  const reactions = [
    { icon: ThumbsUp, label: "thumbs-up", tooltip: "Great!" },
    { icon: Trophy, label: "trophy", tooltip: "Champion!" },
    { icon: Flame, label: "flame", tooltip: "Fire!" },
    { icon: Frown, label: "frown", tooltip: "Disagree" },
  ];

  return (
    <div className="space-y-4">
      {/* Main actions row */}
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

      {/* Reaction icons row */}
      <div className="flex items-center justify-center gap-3">
        {reactions.map(({ icon: Icon, label, tooltip }) => (
          <button
            key={label}
            onClick={() => handleReactionClick(tooltip)}
            onMouseEnter={() => setHoveredReaction(label)}
            onMouseLeave={() => setHoveredReaction(null)}
            className="relative group p-2 rounded-full bg-white/5 hover:bg-white/15 transition-all duration-200 hover:scale-110"
            title={tooltip}
          >
            <Icon 
              className={`h-5 w-5 transition-colors duration-200 ${
                hoveredReaction === label 
                  ? label === 'thumbs-up' ? 'text-blue-400' 
                    : label === 'trophy' ? 'text-yellow-400'
                    : label === 'flame' ? 'text-orange-400'
                    : 'text-red-400'
                  : 'text-gray-300 hover:text-white'
              }`} 
            />
            
            {/* Tooltip */}
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 ${
              hoveredReaction === label ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              {tooltip}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
