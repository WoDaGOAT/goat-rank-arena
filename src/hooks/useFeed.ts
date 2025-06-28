
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeedItem {
  id: string;
  type: string;
  data: any;
  created_at: string;
}

interface UseFeedOptions {
  limit?: number;
  offset?: number;
}

export const useFeed = (options: UseFeedOptions = {}) => {
  const { limit = 20, offset = 0 } = options;

  return useQuery({
    queryKey: ['feed', limit, offset],
    queryFn: async (): Promise<FeedItem[]> => {
      console.log(`Fetching feed with limit: ${limit}, offset: ${offset}`);
      
      // Use the new index for optimized pagination
      const { data, error } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching feed:', error);
        throw error;
      }

      console.log(`Feed items fetched: ${data?.length || 0}`);
      console.log('Feed data preview:', data?.slice(0, 3));
      return data || [];
    },
    staleTime: 10 * 1000, // 10 seconds - reduced to see new rankings faster
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on focus to see new data
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to catch new rankings
  });
};

// Hook for infinite scroll feed
export const useInfiniteFeed = () => {
  return useQuery({
    queryKey: ['feed-infinite'],
    queryFn: async (): Promise<FeedItem[]> => {
      // Start with first 50 items for infinite scroll
      const { data, error } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching infinite feed:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};
