
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
  
  // Fetch user's reaction for this item (should be only one)
  const { data: userReaction = null, isLoading: userReactionLoading } = useQuery({
    queryKey: ["userReaction", itemType, itemId, user?.id],
    queryFn: async () => {
      if (!user || !itemId) return null;
      
      console.log('Fetching user reaction for:', { itemType, itemId, userId: user.id });
      
      const tableName = itemType === 'category' ? 'category_reactions' : 'ranking_reactions';
      const { data, error } = await supabase
        .from(tableName)
        .select("reaction_type")
        .eq(itemType === 'category' ? 'category_id' : 'ranking_id', itemId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user reaction:', error);
        throw error;
      }
      
      console.log('User reaction fetched:', data?.reaction_type || 'none');
      return data?.reaction_type || null;
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

      console.log('Toggling reaction:', { reactionType, itemType, itemId, userId: user.id, currentReaction: userReaction });

      const tableName = itemType === 'category' ? 'category_reactions' : 'ranking_reactions';
      const idColumn = itemType === 'category' ? 'category_id' : 'ranking_id';

      // If clicking the same reaction, remove it
      if (userReaction === reactionType) {
        console.log('Removing current reaction');
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
        // Remove any existing reaction first, then add the new one
        if (userReaction) {
          console.log('Removing existing reaction:', userReaction);
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .match({ 
              user_id: user.id, 
              [idColumn]: itemId,
              reaction_type: userReaction
            });
          if (deleteError) throw deleteError;
        }
        
        console.log('Adding new reaction:', reactionType);
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
      queryClient.invalidateQueries({ queryKey: ["userReaction", itemType, itemId, user?.id] });
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

  const isLoading = userReactionLoading || countsLoading || isPending;

  if (!itemId) {
    console.error('SocialActions: No itemId provided');
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-black/20 rounded-lg p-3 border border-white/10">
      {/* Reaction icons */}
      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
        {reactions.map(({ icon: Icon, label, tooltip, emoji }) => {
          const isReacted = userReaction === label;
          const count = reactionCounts[label] || 0;
          
          return (
            <div key={label} className="flex items-center gap-1">
              <button
                onClick={() => handleReactionClick(label)}
                onMouseEnter={() => setHoveredReaction(label)}
                onMouseLeave={() => setHoveredReaction(null)}
                disabled={isLoading}
                className={`relative group p-2 rounded-lg transition-all duration-200 hover:scale-110 border-2 touch-manipulation ${
                  isReacted 
                    ? label === 'thumbs-up' ? 'bg-blue-500/30 border-blue-400 text-blue-300' 
                      : label === 'trophy' ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300'
                      : label === 'flame' ? 'bg-orange-500/30 border-orange-400 text-orange-300'
                      : 'bg-red-500/30 border-red-400 text-red-300'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/40 hover:text-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={tooltip}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                
                {/* Tooltip */}
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-10 ${
                  hoveredReaction === label ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  {tooltip}
                </div>
              </button>
              
              {/* Show count only if > 0 */}
              {count > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-lg">{emoji}</span>
                  <span className={`text-xs sm:text-sm font-bold ${
                    isReacted ? 'text-white' : 'text-gray-300'
                  }`}>
                    {count}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comments */}
      <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-200 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
        <span className="text-sm sm:text-lg">💬</span>
        <span className="text-xs sm:text-sm font-medium">{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>
    </div>
  );
};
