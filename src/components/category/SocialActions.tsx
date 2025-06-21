
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Trophy, Flame, Frown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocialActionsProps {
  categoryId?: string;
  rankingId?: string;
}

export const SocialActions = ({ 
  categoryId, 
  rankingId
}: SocialActionsProps) => {
  const { user, openLoginDialog } = useAuth();
  const queryClient = useQueryClient();
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  
  const itemType = categoryId ? 'category' : 'ranking';
  const itemId = categoryId || rankingId;
  
  console.log('SocialActions rendered:', { itemType, itemId, userId: user?.id });
  
  // Fetch user's reactions for this item
  const { data: userReactions = {}, isLoading: userReactionsLoading } = useQuery({
    queryKey: ["userReactions", itemType, itemId, user?.id],
    queryFn: async () => {
      if (!user || !itemId) return {};
      
      console.log('Fetching user reactions for:', { itemType, itemId, userId: user.id });
      
      const tableName = itemType === 'category' ? 'category_reactions' : 'ranking_reactions';
      const { data, error } = await supabase
        .from(tableName)
        .select("reaction_type")
        .eq(itemType === 'category' ? 'category_id' : 'ranking_id', itemId)
        .eq("user_id", user.id);
      
      if (error) {
        console.error('Error fetching user reactions:', error);
        throw error;
      }
      
      const reactions: Record<string, boolean> = {};
      data.forEach(reaction => {
        reactions[reaction.reaction_type] = true;
      });
      
      console.log('User reactions fetched:', reactions);
      return reactions;
    },
    enabled: !!user && !!itemId,
  });

  // Fetch reaction counts for this item
  const { data: reactionCounts = {}, isLoading: countsLoading } = useQuery({
    queryKey: ["reactionCounts", itemType, itemId],
    queryFn: async () => {
      if (!itemId) return {};
      
      console.log('Fetching reaction counts for:', { itemType, itemId });
      
      const tableName = itemType === 'category' ? 'category_reactions' : 'ranking_reactions';
      const { data, error } = await supabase
        .from(tableName)
        .select("reaction_type")
        .eq(itemType === 'category' ? 'category_id' : 'ranking_id', itemId);
      
      if (error) {
        console.error('Error fetching reaction counts:', error);
        throw error;
      }
      
      const counts: Record<string, number> = {
        'thumbs-up': 0,
        'trophy': 0,
        'flame': 0,
        'frown': 0,
      };
      
      data.forEach(reaction => {
        counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
      });
      
      console.log('Reaction counts fetched:', counts);
      return counts;
    },
    enabled: !!itemId,
  });

  // Fetch comment count
  const { data: commentCount = 0 } = useQuery({
    queryKey: [itemType === 'category' ? "categoryCommentCount" : "rankingCommentCount", itemId],
    queryFn: async () => {
      if (!itemId) return 0;
      
      const tableName = itemType === 'category' ? 'category_comments' : 'ranking_comments';
      const { count, error } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true })
        .eq(itemType === 'category' ? 'category_id' : 'ranking_id', itemId);
      
      if (error) {
        console.error('Error fetching comment count:', error);
        throw error;
      }
      return count || 0;
    },
    enabled: !!itemId,
  });

  const { mutate: toggleReaction, isPending } = useMutation({
    mutationFn: async (reactionType: string) => {
      if (!user || !itemId) {
        openLoginDialog();
        throw new Error("User not authenticated");
      }

      console.log('Toggling reaction:', { reactionType, itemType, itemId, userId: user.id });

      const tableName = itemType === 'category' ? 'category_reactions' : 'ranking_reactions';
      const idColumn = itemType === 'category' ? 'category_id' : 'ranking_id';
      const wasReacted = userReactions[reactionType];

      if (wasReacted) {
        console.log('Removing reaction');
        const { error } = await supabase
          .from(tableName)
          .delete()
          .match({ 
            user_id: user.id, 
            [idColumn]: itemId,
            reaction_type: reactionType
          });
        if (error) throw error;
      } else {
        console.log('Adding reaction');
        const { error } = await supabase
          .from(tableName)
          .insert({ 
            user_id: user.id, 
            [idColumn]: itemId,
            reaction_type: reactionType
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('Reaction toggled successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ["userReactions", itemType, itemId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["reactionCounts", itemType, itemId] });
    },
    onError: (error) => {
      console.error('Failed to toggle reaction:', error);
      if (error.message !== "User not authenticated") {
        toast.error("Failed to update reaction. Please try again.");
      }
    },
  });

  const handleReactionClick = (reactionType: string) => {
    if (!user) {
      console.log('User not authenticated, opening login dialog');
      openLoginDialog();
      return;
    }
    
    console.log('Handling reaction click:', reactionType);
    toggleReaction(reactionType);
  };

  const reactions = [
    { icon: ThumbsUp, label: "thumbs-up", tooltip: "Great!", emoji: "👍" },
    { icon: Trophy, label: "trophy", tooltip: "Champion!", emoji: "🏆" },
    { icon: Flame, label: "flame", tooltip: "Fire!", emoji: "🔥" },
    { icon: Frown, label: "frown", tooltip: "Disagree", emoji: "😔" },
  ];

  const isLoading = userReactionsLoading || countsLoading || isPending;

  if (!itemId) {
    console.error('SocialActions: No itemId provided');
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      {/* Reaction icons on the left */}
      <div className="flex items-center gap-3 sm:gap-4">
        {reactions.map(({ icon: Icon, label, tooltip, emoji }) => {
          const isReacted = userReactions[label];
          const count = reactionCounts[label] || 0;
          
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleReactionClick(label)}
                onMouseEnter={() => setHoveredReaction(label)}
                onMouseLeave={() => setHoveredReaction(null)}
                disabled={isLoading}
                className={`relative group p-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md border ${
                  isReacted 
                    ? 'bg-white/25 border-white/50 shadow-white/20' 
                    : 'bg-white/15 border-white/20 hover:bg-white/25 hover:border-white/40'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={tooltip}
              >
                <Icon 
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
                    isReacted
                      ? label === 'thumbs-up' ? 'text-blue-300' 
                        : label === 'trophy' ? 'text-yellow-300'
                        : label === 'flame' ? 'text-orange-300'
                        : 'text-red-300'
                      : hoveredReaction === label 
                        ? label === 'thumbs-up' ? 'text-blue-200' 
                          : label === 'trophy' ? 'text-yellow-200'
                          : label === 'flame' ? 'text-orange-200'
                          : 'text-red-200'
                        : 'text-gray-200 hover:text-white'
                  }`} 
                />
                
                {/* Tooltip */}
                <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-10 ${
                  hoveredReaction === label ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  {tooltip}
                </div>
              </button>
              
              {/* Reaction count - always show, even if 0 */}
              <div className="flex items-center gap-1 min-h-[20px]">
                <span className="text-sm">{emoji}</span>
                <span className={`text-sm font-semibold transition-colors ${
                  isReacted ? 'text-white' : count > 0 ? 'text-gray-200' : 'text-gray-400'
                }`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments on the right */}
      <div className="flex items-center gap-2 text-gray-200 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
        <span className="text-lg">💬</span>
        <span className="text-sm sm:text-base font-medium">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>
    </div>
  );
};
