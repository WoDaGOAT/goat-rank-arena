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

      const { data: rankingData, error: rankingError } = await supabase
        .from('user_rankings')
        .select(`
          id,
          created_at,
          title,
          description,
          user_id,
          category_id,
          categories (name)
        `)
        .eq('id', rankingId)
        .maybeSingle();

      if (rankingError) {
        console.error("Error fetching ranking:", rankingError);
        throw rankingError;
      }
      
      if (!rankingData) return null;

      let profileData = null;
      if (rankingData.user_id) {
          const { data, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', rankingData.user_id)
              .maybeSingle();
          
          if (profileError) {
              console.error(`Error fetching profile for user ${rankingData.user_id}:`, profileError);
          }
          profileData = data;
      }

      const { data: athletesData, error: athletesError } = await supabase
        .from('ranking_athletes')
        .select('athlete_id, position, points')
        .eq('ranking_id', rankingId)
        .order('position', { ascending: true });

      if (athletesError) {
        console.error("Error fetching ranking athletes:", athletesError);
        throw athletesError;
      }
      
      const hydratedAthletes: RankedAthlete[] = athletesData.map(athlete => {
        const fullAthlete = footballPlayers.find(p => String(p.id) === athlete.athlete_id);
        return {
          id: athlete.athlete_id,
          name: fullAthlete?.name || 'Unknown Athlete',
          imageUrl: fullAthlete?.imageUrl,
          position: athlete.position,
          points: athlete.points
        };
      });
      
      const rankingWithAthletes = {
          ...rankingData,
          profiles: profileData,
          categories: Array.isArray(rankingData.categories) ? rankingData.categories[0] : rankingData.categories,
          athletes: hydratedAthletes,
      }

      return rankingWithAthletes as UserRankingDetails;
    },
    enabled: !!rankingId,
  });
};
