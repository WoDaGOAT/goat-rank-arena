import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useRouter } from "react-router-dom";
import { z } from "zod";
import { useAnalytics } from './useAnalytics';

const saveRankingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  selectedAthletes: z.array(z.object({
    id: z.string(),
    position: z.number().min(1),
    points: z.number().min(1)
  })).min(3, "Select at least 3 athletes to rank")
});

type SaveRankingParams = z.infer<typeof saveRankingSchema>;

export const useSaveRanking = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { trackRankingCreated } = useAnalytics();

  const saveRanking = useMutation({
    mutationFn: async ({ title, description, categoryId, selectedAthletes }: SaveRankingParams) => {
      // Validate the input
      const validatedData = saveRankingSchema.parse({ title, description, categoryId, selectedAthletes });

      if (!user) {
        throw new Error("You must be logged in to save a ranking.");
      }

      // Create the ranking
      const { data: rankingData, error: rankingError } = await supabase
        .from('user_rankings')
        .insert({
          user_id: user!.id,
          category_id: categoryId,
          title,
          description: description || null,
        })
        .select()
        .single();

      if (rankingError) throw rankingError;

      // Insert the athletes
      const rankingAthletes = selectedAthletes.map(athlete => ({
        ranking_id: rankingData.id,
        athlete_id: athlete.id,
        position: athlete.position,
        points: athlete.points
      }));

      const { error: athletesError } = await supabase
        .from('ranking_athletes')
        .insert(rankingAthletes);

      if (athletesError) throw athletesError;

      // Track ranking creation
      const category = await supabase
        .from('categories')
        .select('name')
        .eq('id', categoryId)
        .single();
      
      trackRankingCreated(categoryId, category.data?.name || 'Unknown');

      return rankingData.id;
    },
    onSuccess: (rankingId) => {
      toast.success("Ranking saved successfully!");
      router(`/ranking/${rankingId}`);
    },
    onError: (error: any) => {
      toast.error("Failed to save ranking.", { description: error.message });
    }
  });

  return { saveRanking };
};
