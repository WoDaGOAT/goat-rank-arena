
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";

export const useLeaderboardData = (categoryId: string) => {
  return useQuery({
    queryKey: ['leaderboardData', categoryId],
    queryFn: async () => {
      console.log(`🔍 ENHANCED: Fetching leaderboard data for category: ${categoryId}`);

      try {
        // Use the optimized database function with enhanced error handling
        const { data: leaderboardData, error } = await supabase
          .rpc('get_category_leaderboard', {
            p_category_id: categoryId,
            p_limit: 10
          });

        if (error) {
          console.error("🚨 ENHANCED: Error fetching leaderboard:", error);
          // Don't throw immediately for certain types of errors
          if (error.message?.includes('function get_category_leaderboard does not exist')) {
            console.warn("⚠️ Database function missing, returning empty array");
            return [];
          }
          throw new Error(`Leaderboard fetch failed: ${error.message}`);
        }

        console.log('✅ ENHANCED: Raw leaderboard data from database:', {
          categoryId,
          dataLength: leaderboardData?.length || 0,
          data: leaderboardData
        });

        if (!leaderboardData || leaderboardData.length === 0) {
          console.log(`📊 ENHANCED: No leaderboard data found for category ${categoryId} - this is normal for categories with few rankings`);
          return [];
        }

        console.log(`🔄 ENHANCED: Processing leaderboard for category ${categoryId}, found ${leaderboardData.length} athletes`);

        // Map the database response to UI format with enhanced error handling
        const leaderboard: Athlete[] = leaderboardData.map((athlete: any, index: number) => {
          try {
            console.log(`👤 ENHANCED: Processing athlete ${index + 1}:`, athlete);
            
            const mappedAthlete = {
              id: athlete.athlete_id || `athlete-${index}`,
              name: athlete.athlete_name || 'Unknown Athlete',
              imageUrl: athlete.profile_picture_url || '/placeholder.svg', // Fix: Map to imageUrl instead of profile_picture_url
              countryOfOrigin: athlete.country_of_origin || '',
              points: Number(athlete.total_points) || 0,
              rank: Number(athlete.rank) || index + 1,
              movement: (athlete.movement as "up" | "down" | "neutral") || "neutral",
              // Add other required fields for Athlete interface consistency
              dateOfBirth: athlete.year_of_birth ? athlete.year_of_birth.toString() : "",
              dateOfDeath: athlete.date_of_death || undefined,
              isActive: athlete.is_active !== false, // Default to true if not specified
              clubs: [],
              competitions: [],
              positions: athlete.positions || [],
              nationality: athlete.nationality || "",
              careerStartYear: athlete.career_start_year || undefined,
              careerEndYear: athlete.career_end_year || undefined,
            };
            
            console.log(`✨ ENHANCED: Mapped athlete:`, mappedAthlete);
            return mappedAthlete;
          } catch (mapError) {
            console.error('🚨 ENHANCED: Error mapping athlete data:', mapError, athlete);
            return {
              id: `athlete-${index}`,
              name: 'Unknown Athlete',
              imageUrl: '/placeholder.svg', // Use imageUrl for consistency
              countryOfOrigin: '',
              points: 0,
              rank: index + 1,
              movement: "neutral" as const,
              dateOfBirth: "",
              isActive: true,
              clubs: [],
              competitions: [],
              positions: [],
              nationality: "",
            };
          }
        });

        console.log(`🎯 ENHANCED: Final leaderboard for category ${categoryId}:`, {
          athleteCount: leaderboard.length,
          athletes: leaderboard
        });
        
        return leaderboard;
      } catch (error) {
        console.error('🚨 ENHANCED: Fatal error in leaderboard fetch:', {
          categoryId,
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Return empty array instead of throwing to prevent UI crashes
        // This allows the "Not Enough Rankings Yet" message to display properly
        return [];
      }
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 ENHANCED: Leaderboard fetch retry ${failureCount} for category ${categoryId}:`, error);
      
      // Don't retry for certain errors
      if (error?.message?.includes('function get_category_leaderboard does not exist')) {
        return false;
      }
      
      return failureCount < 2;
    },
  });
};
