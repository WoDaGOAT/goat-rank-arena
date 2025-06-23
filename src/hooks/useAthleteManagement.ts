
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AthleteData {
  id?: string;
  name: string;
  country_of_origin?: string;
  nationality?: string;
  date_of_birth?: string;
  date_of_death?: string;
  is_active: boolean;
  positions?: string[];
  profile_picture_url?: string;
}

export const useAthleteManagement = () => {
  const queryClient = useQueryClient();

  const createAthlete = useMutation({
    mutationFn: async (athleteData: AthleteData) => {
      const { data, error } = await supabase
        .from("athletes")
        .insert([{
          id: athleteData.id || crypto.randomUUID(),
          name: athleteData.name,
          country_of_origin: athleteData.country_of_origin || null,
          nationality: athleteData.nationality || null,
          date_of_birth: athleteData.date_of_birth || null,
          date_of_death: athleteData.date_of_death || null,
          is_active: athleteData.is_active,
          positions: athleteData.positions || null,
          profile_picture_url: athleteData.profile_picture_url || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Athlete created successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create athlete");
    },
  });

  const updateAthlete = useMutation({
    mutationFn: async ({ id, athleteData }: { id: string; athleteData: Partial<AthleteData> }) => {
      const { data, error } = await supabase
        .from("athletes")
        .update({
          name: athleteData.name,
          country_of_origin: athleteData.country_of_origin || null,
          nationality: athleteData.nationality || null,
          date_of_birth: athleteData.date_of_birth || null,
          date_of_death: athleteData.date_of_death || null,
          is_active: athleteData.is_active,
          positions: athleteData.positions || null,
          profile_picture_url: athleteData.profile_picture_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Athlete updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update athlete");
    },
  });

  const deleteAthlete = useMutation({
    mutationFn: async (id: string) => {
      // First check if athlete is used in rankings
      const { data: rankings, error: rankingError } = await supabase
        .from("ranking_athletes")
        .select("id")
        .eq("athlete_id", id)
        .limit(1);

      if (rankingError) throw rankingError;

      if (rankings && rankings.length > 0) {
        throw new Error("Cannot delete athlete: They are used in existing rankings");
      }

      const { error } = await supabase
        .from("athletes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Athlete deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      queryClient.invalidateQueries({ queryKey: ["athletesAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["athleteStats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete athlete");
    },
  });

  return {
    createAthlete,
    updateAthlete,
    deleteAthlete,
  };
};
