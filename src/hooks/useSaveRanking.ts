
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAnalytics } from './useAnalytics';

const saveRankingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  selectedAthletes: z.array(z.object({
    id: z.string().min(1, "Athlete ID is required"),
    position: z.number().int().min(1, "Position must be at least 1").max(10, "Position must be at most 10"),
    points: z.number().int().min(1, "Points must be at least 1").max(100, "Points must be at most 100")
  })).min(3, "Select at least 3 athletes to rank").max(10, "Maximum 10 athletes allowed")
});

type SaveRankingParams = z.infer<typeof saveRankingSchema>;

interface SelectedAthleteInput {
  id: string;
  userPoints: number;
  error?: string | null;
}

export const useSaveRanking = (options?: { categoryId?: string }) => {
  const { user, openAuthDialog, savePreLoginUrl } = useAuth();
  const navigate = useNavigate();
  const { trackRankingCreated } = useAnalytics();

  const saveRanking = useMutation({
    mutationFn: async ({ title, description, categoryId, selectedAthletes }: SaveRankingParams) => {
      console.log('🔍 useSaveRanking - Saving ranking with data:', { title, description, categoryId, selectedAthletes });
      
      // Check if user is logged in first
      if (!user) {
        // Save current URL for redirect after login/signup
        savePreLoginUrl(window.location.pathname);
        // Open auth dialog with signup as default for new users
        openAuthDialog('signup');
        throw new Error("Authentication required");
      }

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

      console.log('🔍 useSaveRanking - Ranking saved successfully with ID:', rankingData.id);
      return rankingData.id;
    },
    onSuccess: (rankingId) => {
      console.log('🔍 useSaveRanking - Success callback, navigating to ranking:', rankingId);
      toast.success("Ranking saved successfully!");
      
      // Use replace: true to ensure clean navigation
      try {
        navigate(`/ranking/${rankingId}`, { replace: true });
        console.log('🔍 useSaveRanking - Navigation to ranking page initiated');
      } catch (error) {
        console.error('🔍 useSaveRanking - Navigation failed, using window.location fallback:', error);
        window.location.href = `/ranking/${rankingId}`;
      }
    },
    onError: (error: any) => {
      console.error("🔍 useSaveRanking - Failed to save ranking:", error);
      if (error.message !== "Authentication required") {
        toast.error("Failed to save ranking.", { description: error.message });
      }
    }
  });

  return { 
    onSave: (params: { rankingTitle: string, rankingDescription?: string, selectedAthletes: SelectedAthleteInput[] }) => {
      const { rankingTitle, rankingDescription, selectedAthletes } = params;
      
      console.log('🔍 useSaveRanking - Raw selected athletes before transformation:', selectedAthletes);
      
      // Transform the selectedAthletes data to match the expected schema
      const transformedAthletes = selectedAthletes.map((athlete, index) => ({
        id: athlete.id,
        position: index + 1, // Calculate position based on array index
        points: athlete.userPoints // Map userPoints to points
      }));
      
      console.log('🔍 useSaveRanking - Transformed athletes:', transformedAthletes);
      
      return saveRanking.mutate({
        title: rankingTitle,
        description: rankingDescription,
        categoryId: options?.categoryId || '',
        selectedAthletes: transformedAthletes
      });
    },
    isSaving: saveRanking.isPending,
    saveRanking
  };
};
