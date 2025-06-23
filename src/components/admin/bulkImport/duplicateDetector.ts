
import { supabase } from "@/lib/supabase";
import { ParsedAthlete, DuplicateInfo } from "./types";

export const detectDuplicates = async (
  athletes: ParsedAthlete[],
  updateMode: boolean
): Promise<DuplicateInfo[]> => {
  const athleteNames = athletes.map(a => a.name);
  const { data: existingAthletes, error } = await supabase
    .from("athletes")
    .select("name")
    .in("name", athleteNames);

  if (error) throw error;

  const existingNames = new Set(existingAthletes?.map(a => a.name) || []);
  return athletes
    .filter(athlete => existingNames.has(athlete.name))
    .map(athlete => ({
      name: athlete.name,
      willBeUpdated: updateMode
    }));
};
