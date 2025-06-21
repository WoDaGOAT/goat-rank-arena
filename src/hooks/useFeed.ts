
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
    staleTime: 30 * 1000, // 30 seconds - reduced to see updates faster
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: true, // Enable refetch on focus to see new data
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
    staleTime: 5 * 60 * 1000, // 5 minutes for infinite scroll
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
