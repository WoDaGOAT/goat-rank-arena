
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { SelectedAthlete } from "./useRankingManager";

interface SaveRankingParams {
  rankingTitle: string;
  rankingDescription: string;
  selectedAthletes: SelectedAthlete[];
}

export const useSaveRanking = ({ categoryId }: { categoryId: string }) => {
  const { user, openLoginDialog } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async ({ rankingTitle, rankingDescription, selectedAthletes }: SaveRankingParams) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (selectedAthletes.length !== 10) {
        toast.error("You must have exactly 10 athletes in your ranking.");
        throw new Error("Incorrect number of athletes");
      }

      const { data: rankingData, error: rankingError } = await supabase
        .from('user_rankings')
        .insert({
          user_id: user.id,
          category_id: categoryId!,
          title: rankingTitle.trim(),
          description: rankingDescription.trim(),
        })
        .select('id')
        .single();

      if (rankingError) throw rankingError;
      const rankingId = rankingData.id;

      const rankingAthletes = selectedAthletes.map((athlete, index) => ({
        ranking_id: rankingId,
        athlete_id: athlete.id,
        position: index + 1,
        points: athlete.userPoints,
      }));

      const { error: athletesError } = await supabase
        .from('ranking_athletes')
        .insert(rankingAthletes);

      if (athletesError) {
        await supabase.from('user_rankings').delete().match({ id: rankingId });
        throw athletesError;
      }

      const feedAthletes = selectedAthletes.map((athlete, index) => ({
        id: athlete.id,
        name: athlete.name,
        imageUrl: athlete.imageUrl,
        points: athlete.userPoints,
        position: index + 1
      }));

      const { error: rpcError } = await supabase.rpc('create_new_ranking_feed_item', {
        p_ranking_id: rankingId,
        p_athletes: feedAthletes,
      });

      if (rpcError) {
        // Not a critical error, just log it. The ranking is saved.
        console.error('Failed to create feed item:', rpcError);
      }

      return rankingId;
    },
    onSuccess: (rankingId) => {
      toast.success("Ranking saved successfully!");
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['feedItems'] });
      queryClient.invalidateQueries({ queryKey: ['userRankings', user?.id] });
      navigate(`/category/${categoryId}`);
    },
    onError: (error: Error) => {
      if (error.message !== "User not authenticated" && error.message !== "Incorrect number of athletes") {
         toast.error(error.message || "Failed to save ranking. Please try again.");
      }
    }
  });

  const handleSaveRanking = (params: SaveRankingParams) => {
    if (!user) {
      openLoginDialog();
      toast.info("Please log in or sign up to save your ranking.");
    } else {
      saveMutation.mutate(params);
    }
  };

  return {
    onSave: handleSaveRanking,
    isSaving: saveMutation.isPending,
  };
};
