
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Athlete } from "@/types";

interface HomepageLeaderboard {
  category_id: string;
  category_name: string;
  category_description: string;
  category_image_url: string;
  ranking_count: number;
  leaderboard: Athlete[];
}

export const useHomepageLeaderboards = () => {
  return useQuery({
    queryKey: ['homepageLeaderboards'],
    queryFn: async (): Promise<HomepageLeaderboard[]> => {
      console.log('Fetching homepage leaderboards from materialized view');

      const { data, error } = await supabase
        .from('homepage_leaderboards')
        .select('*')
        .order('ranking_count', { ascending: false });

      if (error) {
        console.error("Error fetching homepage leaderboards:", error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        console.log('No homepage leaderboards found');
        return [];
      }

      // Transform the data to match our UI expectations
      const leaderboards: HomepageLeaderboard[] = data.map((item: any) => ({
        category_id: item.category_id,
        category_name: item.category_name,
        category_description: item.category_description,
        category_image_url: item.category_image_url,
        ranking_count: item.ranking_count,
        leaderboard: Array.isArray(item.leaderboard) ? item.leaderboard.map((athlete: any) => ({
          id: athlete.id,
          name: athlete.name,
          profile_picture_url: athlete.profile_picture_url || '/placeholder.svg',
          country_of_origin: athlete.country_of_origin,
          points: Number(athlete.points),
          rank: Number(athlete.rank),
          movement: athlete.movement as "up" | "down" | "neutral"
        })) : []
      }));

      console.log(`Found ${leaderboards.length} homepage leaderboards`);
      return leaderboards;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (longer cache for materialized view)
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};
