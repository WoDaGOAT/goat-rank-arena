
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import footballPlayers from '@/data/footballPlayers';
import { RankedAthlete } from '@/components/feed/items/NewRankingFeedItem';

export interface UserRankingDetails {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    user_id: string;
    category_id: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
    categories: {
        name: string | null;
    } | null;
    athletes: RankedAthlete[];
}

export const useUserRanking = (rankingId?: string) => {
  return useQuery({
    queryKey: ['userRankingDetails', rankingId],
    queryFn: async (): Promise<UserRankingDetails | null> => {
      if (!rankingId) return null;

      // 1. Fetch the core ranking data
      const { data: rankingData, error: rankingError } = await supabase
        .from('user_rankings')
        .select('*')
        .eq('id', rankingId)
        .maybeSingle();

      if (rankingError) {
        console.error("Error fetching ranking:", rankingError);
        throw rankingError;
      }
      
      if (!rankingData) {
        console.warn(`No ranking found for ID ${rankingId}`);
        return null;
      }

      // 2. Fetch related data in separate queries
      const [
        { data: profileData, error: profileError },
        { data: categoryData, error: categoryError },
        { data: athletesData, error: athletesError }
      ] = await Promise.all([
        supabase.from('profiles').select('full_name, avatar_url').eq('id', rankingData.user_id).maybeSingle(),
        supabase.from('categories').select('name').eq('id', rankingData.category_id).maybeSingle(),
        supabase.from('ranking_athletes').select('athlete_id, position, points').eq('ranking_id', rankingId).order('position', { ascending: true })
      ]);

      if (profileError) console.error(`Error fetching profile for user ${rankingData.user_id}:`, profileError);
      if (categoryError) console.error(`Error fetching category ${rankingData.category_id}:`, categoryError);
      if (athletesError) {
          console.error("Error fetching ranking athletes:", athletesError);
          throw athletesError;
      }
      
      // 3. Get all unique athlete IDs from the ranking
      const athleteIds = (athletesData || []).map(athlete => athlete.athlete_id);
      
      // 4. Fetch athlete data from database
      const { data: dbAthletes, error: dbAthletesError } = await supabase
        .from('athletes')
        .select('id, name, profile_picture_url')
        .in('id', athleteIds);
      
      if (dbAthletesError) {
        console.error("Error fetching database athletes:", dbAthletesError);
      }
      
      // 5. Hydrate athlete data with database first, then fallback to footballPlayers
      const hydratedAthletes: RankedAthlete[] = (athletesData || []).map(athlete => {
        // First try to find athlete in database
        const dbAthlete = dbAthletes?.find(db => db.id === athlete.athlete_id);
        
        if (dbAthlete) {
          return {
            id: athlete.athlete_id,
            name: dbAthlete.name,
            imageUrl: dbAthlete.profile_picture_url || "/placeholder.svg",
            position: athlete.position,
            points: athlete.points
          };
        }
        
        // Fallback to footballPlayers array for backward compatibility
        const footballPlayer = footballPlayers.find(p => String(p.id) === athlete.athlete_id);
        
        if (footballPlayer) {
          return {
            id: athlete.athlete_id,
            name: footballPlayer.name,
            imageUrl: footballPlayer.imageUrl,
            position: athlete.position,
            points: athlete.points
          };
        }
        
        // Last resort - return with unknown athlete info
        return {
          id: athlete.athlete_id,
          name: 'Unknown Athlete',
          imageUrl: "/placeholder.svg",
          position: athlete.position,
          points: athlete.points
        };
      });
      
      // 6. Combine all data into a single object
      const finalRanking = {
          ...rankingData,
          profiles: profileData,
          categories: categoryData,
          athletes: hydratedAthletes,
      }

      return finalRanking as UserRankingDetails;
    },
    enabled: !!rankingId,
  });
};
