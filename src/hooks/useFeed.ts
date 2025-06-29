
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
  const { limit = 15, offset = 0 } = options; // Reduced default limit for better performance

  return useQuery({
    queryKey: ['feed', limit, offset],
    queryFn: async (): Promise<FeedItem[]> => {
      console.log(`Fetching feed with limit: ${limit}, offset: ${offset}`);
      
      // Use optimized query with the new indexes
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
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - increased for better caching
    gcTime: 10 * 60 * 1000, // 10 minutes - increased cache time
    refetchOnWindowFocus: false, // Disable automatic refetch on focus
    refetchInterval: false, // Disable automatic refetch interval
    refetchOnMount: true, // Only refetch on mount
  });
};

// Optimized hook for infinite scroll feed (if needed later)
export const useInfiniteFeed = () => {
  return useQuery({
    queryKey: ['feed-infinite'],
    queryFn: async (): Promise<FeedItem[]> => {
      // Fetch only 20 items for infinite scroll to reduce load
      const { data, error } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching infinite feed:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
};
