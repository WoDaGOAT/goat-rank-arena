
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
      if (!rankingId) {
        console.warn('useUserRanking: No ranking ID provided');
        return null;
      }

      console.log('useUserRanking: Starting fetch for ranking ID:', rankingId);

      try {
        // 1. Fetch the core ranking data
        console.log('useUserRanking: Step 1 - Fetching core ranking data');
        const { data: rankingData, error: rankingError } = await supabase
          .from('user_rankings')
          .select('*')
          .eq('id', rankingId)
          .maybeSingle();

        if (rankingError) {
          console.error("useUserRanking: Error fetching ranking:", rankingError);
          throw new Error(`Failed to fetch ranking: ${rankingError.message}`);
        }
        
        if (!rankingData) {
          console.warn(`useUserRanking: No ranking found for ID ${rankingId}`);
          return null;
        }

        console.log('useUserRanking: Step 1 SUCCESS - Found ranking data:', rankingData);

        // 2. Fetch related data in separate queries with individual error handling
        console.log('useUserRanking: Step 2 - Fetching related data');
        
        let profileData = null;
        let categoryData = null;
        let athletesData = null;

        try {
          console.log('useUserRanking: Step 2a - Fetching profile data for user:', rankingData.user_id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', rankingData.user_id)
            .maybeSingle();
          
          if (profileError) {
            console.error(`useUserRanking: Profile error for user ${rankingData.user_id}:`, profileError);
          } else {
            profileData = profile;
            console.log('useUserRanking: Step 2a SUCCESS - Profile data:', profileData);
          }
        } catch (error) {
          console.error('useUserRanking: Profile fetch failed:', error);
        }

        try {
          console.log('useUserRanking: Step 2b - Fetching category data for category:', rankingData.category_id);
          const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('name')
            .eq('id', rankingData.category_id)
            .maybeSingle();
          
          if (categoryError) {
            console.error(`useUserRanking: Category error for category ${rankingData.category_id}:`, categoryError);
          } else {
            categoryData = category;
            console.log('useUserRanking: Step 2b SUCCESS - Category data:', categoryData);
          }
        } catch (error) {
          console.error('useUserRanking: Category fetch failed:', error);
        }

        try {
          console.log('useUserRanking: Step 2c - Fetching athletes data for ranking:', rankingId);
          const { data: athletes, error: athletesError } = await supabase
            .from('ranking_athletes')
            .select('athlete_id, position, points')
            .eq('ranking_id', rankingId)
            .order('position', { ascending: true });
          
          if (athletesError) {
            console.error("useUserRanking: Athletes error:", athletesError);
            throw new Error(`Failed to fetch ranking athletes: ${athletesError.message}`);
          } else {
            athletesData = athletes;
            console.log('useUserRanking: Step 2c SUCCESS - Athletes data:', athletesData);
          }
        } catch (error) {
          console.error('useUserRanking: Athletes fetch failed:', error);
          throw error; // Re-throw athletes error as it's critical
        }
        
        // 3. Get all unique athlete IDs from the ranking
        console.log('useUserRanking: Step 3 - Processing athlete IDs');
        const athleteIds = (athletesData || []).map(athlete => athlete.athlete_id);
        console.log('useUserRanking: Step 3 - Athlete IDs to fetch:', athleteIds);
        
        if (athleteIds.length === 0) {
          console.warn('useUserRanking: No athletes found for this ranking');
          // Return ranking data even without athletes
          const finalRanking = {
            ...rankingData,
            profiles: profileData,
            categories: categoryData,
            athletes: [],
          };
          console.log('useUserRanking: Returning ranking with no athletes:', finalRanking);
          return finalRanking as UserRankingDetails;
        }
        
        // 4. Fetch athlete data from database
        console.log('useUserRanking: Step 4 - Fetching athlete details from database');
        let dbAthletes = null;
        try {
          const { data: athletes, error: dbAthletesError } = await supabase
            .from('athletes')
            .select('id, name, profile_picture_url')
            .in('id', athleteIds);
          
          if (dbAthletesError) {
            console.error("useUserRanking: Database athletes error:", dbAthletesError);
          } else {
            dbAthletes = athletes;
            console.log('useUserRanking: Step 4 SUCCESS - Database athletes:', dbAthletes);
          }
        } catch (error) {
          console.error('useUserRanking: Database athletes fetch failed:', error);
        }
        
        // 5. Hydrate athlete data with database first, then fallback to footballPlayers
        console.log('useUserRanking: Step 5 - Hydrating athlete data');
        const hydratedAthletes: RankedAthlete[] = (athletesData || []).map(athlete => {
          console.log('useUserRanking: Processing athlete:', athlete.athlete_id);
          
          // First try to find athlete in database
          const dbAthlete = dbAthletes?.find(db => db.id === athlete.athlete_id);
          
          if (dbAthlete) {
            console.log('useUserRanking: Found athlete in database:', dbAthlete.name);
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
            console.log('useUserRanking: Found athlete in footballPlayers:', footballPlayer.name);
            return {
              id: athlete.athlete_id,
              name: footballPlayer.name,
              imageUrl: footballPlayer.imageUrl,
              position: athlete.position,
              points: athlete.points
            };
          }
          
          // Last resort - return with unknown athlete info
          console.warn('useUserRanking: Unknown athlete:', athlete.athlete_id);
          return {
            id: athlete.athlete_id,
            name: 'Unknown Athlete',
            imageUrl: "/placeholder.svg",
            position: athlete.position,
            points: athlete.points
          };
        });
        
        console.log('useUserRanking: Step 5 SUCCESS - Hydrated athletes:', hydratedAthletes);
        
        // 6. Combine all data into a single object
        console.log('useUserRanking: Step 6 - Combining final data');
        const finalRanking = {
            ...rankingData,
            profiles: profileData,
            categories: categoryData,
            athletes: hydratedAthletes,
        }

        console.log('useUserRanking: Step 6 SUCCESS - Final ranking with all data:', finalRanking);
        return finalRanking as UserRankingDetails;
        
      } catch (error) {
        console.error('useUserRanking: Complete failure:', error);
        throw error;
      }
    },
    enabled: !!rankingId,
    retry: (failureCount, error) => {
      console.error(`useUserRanking: Query failed (attempt ${failureCount + 1}):`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });
};
