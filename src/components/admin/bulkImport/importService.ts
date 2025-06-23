
import { supabase } from "@/lib/supabase";
import { ParsedAthlete, ImportResult } from "./types";

export const performBulkImport = async (
  athletes: ParsedAthlete[],
  updateMode: boolean
): Promise<ImportResult> => {
  const athletesData = athletes.map(athlete => ({
    id: crypto.randomUUID(),
    name: athlete.name,
    country_of_origin: athlete.country_of_origin || null,
    nationality: athlete.nationality || null,
    date_of_birth: athlete.date_of_birth || null,
    date_of_death: athlete.date_of_death || null,
    is_active: athlete.is_active !== undefined ? athlete.is_active : true,
    // Ensure positions is always properly formatted as an array or null
    positions: athlete.positions && Array.isArray(athlete.positions) && athlete.positions.length > 0 
      ? athlete.positions.filter(pos => pos && pos.trim() !== '') 
      : null,
    profile_picture_url: athlete.profile_picture_url || null,
  }));

  // Pass athletesData directly without JSON.stringify - Supabase handles JSONB conversion
  const { data, error } = await supabase.rpc("bulk_insert_athletes", {
    p_athletes: athletesData,
    p_update_mode: updateMode
  });

  if (error) throw error;

  return data[0] as ImportResult;
};
