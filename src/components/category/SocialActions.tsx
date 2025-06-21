
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
  
  // Track user's reactions (in a real app, this would come from the database)
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    'thumbs-up': 2,
    'trophy': 0,
    'flame': 1,
    'frown': 0,
  });

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
    
    // Toggle user's reaction
    const wasReacted = userReactions[reactionType];
    const newUserReactions = { ...userReactions, [reactionType]: !wasReacted };
    setUserReactions(newUserReactions);
    
    // Update counts
    const newCounts = { ...reactionCounts };
    if (wasReacted) {
      newCounts[reactionType] = Math.max(0, newCounts[reactionType] - 1);
    } else {
      newCounts[reactionType] = newCounts[reactionType] + 1;
    }
    setReactionCounts(newCounts);
    
    toast.success(`You ${wasReacted ? 'removed' : 'added'} a ${reactionType} reaction!`);
  };

  const reactions = [
    { icon: ThumbsUp, label: "thumbs-up", tooltip: "Great!", emoji: "👍" },
    { icon: Trophy, label: "trophy", tooltip: "Champion!", emoji: "🏆" },
    { icon: Flame, label: "flame", tooltip: "Fire!", emoji: "🔥" },
    { icon: Frown, label: "frown", tooltip: "Disagree", emoji: "😔" },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* Reaction icons on the left */}
      <div className="flex items-center gap-2 sm:gap-4">
        {reactions.map(({ icon: Icon, label, tooltip, emoji }) => {
          const isReacted = userReactions[label];
          const count = reactionCounts[label];
          
          return (
            <div key={label} className="flex flex-col items-center">
              <button
                onClick={() => handleReactionClick(label)}
                onMouseEnter={() => setHoveredReaction(label)}
                onMouseLeave={() => setHoveredReaction(null)}
                className={`relative group p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isReacted 
                    ? 'bg-white/20 border-2 border-white/40' 
                    : 'bg-white/5 hover:bg-white/15'
                }`}
                title={tooltip}
              >
                <Icon 
                  className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${
                    isReacted
                      ? label === 'thumbs-up' ? 'text-blue-400' 
                        : label === 'trophy' ? 'text-yellow-400'
                        : label === 'flame' ? 'text-orange-400'
                        : 'text-red-400'
                      : hoveredReaction === label 
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
              
              {/* Reaction count */}
              <div className="flex items-center mt-1">
                <span className="text-xs mr-1">{emoji}</span>
                <span className={`text-xs font-medium transition-colors ${
                  isReacted ? 'text-white' : 'text-gray-400'
                }`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments on the right */}
      <div className="flex items-center text-white">
        <span className="mr-2">💬</span>
        <span className="text-sm sm:text-base">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>
    </div>
  );
};
