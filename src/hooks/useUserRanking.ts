
import { useQuery } from '@tanstack/react-query';
import { UserRankingDetails } from '@/types/userRanking';
import {
  fetchRankingData,
  fetchProfileData,
  fetchCategoryData,
  fetchRankingAthletes,
  fetchDatabaseAthletes
} from '@/services/userRankingService';
import { hydrateAthleteData } from '@/utils/athleteDataProcessor';

export const useUserRanking = (rankingId?: string) => {
  return useQuery({
    queryKey: ['userRankingDetails', rankingId],
    queryFn: async (): Promise<UserRankingDetails | null> => {
      if (!rankingId || rankingId.trim() === '') {
        console.warn('useUserRanking: No valid ranking ID provided');
        return null;
      }

      console.log('useUserRanking: Starting fetch for ranking ID:', rankingId);

      try {
        // 1. Fetch the core ranking data
        const rankingData = await fetchRankingData(rankingId);
        if (!rankingData) return null;

        // 2. Fetch related data in parallel for better performance
        console.log('useUserRanking: Fetching related data');
        const [profileData, categoryData, athletesData] = await Promise.all([
          fetchProfileData(rankingData.user_id),
          fetchCategoryData(rankingData.category_id),
          fetchRankingAthletes(rankingId)
        ]);
        
        // 3. Get all unique athlete IDs from the ranking
        console.log('useUserRanking: Processing athlete IDs');
        const athleteIds = athletesData.map(athlete => athlete.athlete_id);
        console.log('useUserRanking: Athlete IDs to fetch:', athleteIds);
        
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
        console.log('useUserRanking: Fetching athlete data from database');
        const dbAthletes = await fetchDatabaseAthletes(athleteIds);
        
        // 5. Hydrate athlete data with fallback logic
        console.log('useUserRanking: Hydrating athlete data');
        const hydratedAthletes = hydrateAthleteData(athletesData, dbAthletes);
        
        // 6. Combine all data into a single object
        console.log('useUserRanking: Combining final data');
        const finalRanking = {
          ...rankingData,
          profiles: profileData,
          categories: categoryData,
          athletes: hydratedAthletes,
        };

        console.log('useUserRanking: SUCCESS - Final ranking with all data:', {
          id: finalRanking.id,
          title: finalRanking.title,
          athleteCount: finalRanking.athletes.length,
          hasProfile: !!finalRanking.profiles,
          hasCategory: !!finalRanking.categories
        });
        return finalRanking as UserRankingDetails;
        
      } catch (error) {
        console.error('useUserRanking: Complete failure:', error);
        throw error;
      }
    },
    enabled: !!rankingId && rankingId.trim() !== '',
    retry: (failureCount, error) => {
      console.error(`useUserRanking: Query failed (attempt ${failureCount + 1}):`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });
};
