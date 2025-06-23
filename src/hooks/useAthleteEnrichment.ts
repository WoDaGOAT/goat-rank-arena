
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface EnrichmentOptions {
  athleteId?: string;
  athleteIds?: string[];
}

export const useAthleteEnrichment = () => {
  const [isEnriching, setIsEnriching] = useState(false);

  const enrichAthlete = async (options: EnrichmentOptions = {}) => {
    setIsEnriching(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to perform this action");
        return null;
      }

      const body = options.athleteId 
        ? { single_athlete_id: options.athleteId }
        : options.athleteIds 
        ? { athlete_ids: options.athleteIds }
        : { athlete_ids: null }; // Process all with missing data

      const { data, error } = await supabase.functions.invoke('enrich-athlete-data', {
        body,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Enrichment error:', error);
        toast.error(`Enrichment failed: ${error.message}`);
        return null;
      }

      return data;

    } catch (error) {
      console.error('Error during enrichment:', error);
      toast.error("Failed to enrich athlete data");
      return null;
    } finally {
      setIsEnriching(false);
    }
  };

  return {
    enrichAthlete,
    isEnriching,
  };
};
