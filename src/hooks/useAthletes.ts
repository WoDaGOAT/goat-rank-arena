
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface DatabaseAthlete {
  id: string;
  name: string;
  profile_picture_url: string | null;
  date_of_birth: string | null;
  date_of_death: string | null;
  is_active: boolean;
  country_of_origin: string | null;
  nationality: string | null;
  positions: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useAthletes = () => {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: async (): Promise<DatabaseAthlete[]> => {
      const { data, error } = await supabase
        .from("athletes")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching athletes:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};

export const useAthlete = (athleteId: string) => {
  return useQuery({
    queryKey: ["athlete", athleteId],
    queryFn: async (): Promise<DatabaseAthlete | null> => {
      const { data, error } = await supabase
        .from("athletes")
        .select("*")
        .eq("id", athleteId)
        .single();

      if (error) {
        console.error("Error fetching athlete:", error);
        return null;
      }

      return data;
    },
    enabled: !!athleteId,
  });
};
