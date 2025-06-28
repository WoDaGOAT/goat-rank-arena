
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays, format } from 'date-fns';

export interface AnalyticsData {
  metric_type: string;
  date_data: Record<string, number>;
  total_value: number;
  breakdown_data?: Record<string, any>;
}

export interface ConversionFunnelData {
  traffic_source: string;
  total_sessions: number;
  signups: number;
  conversion_rate: number;
}

export const useAnalyticsDashboard = (startDate: Date, endDate: Date) => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['analytics-dashboard', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<AnalyticsData[]> => {
      const { data, error } = await supabase.rpc('get_analytics_dashboard', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });

  const { data: conversionData, isLoading: conversionLoading, error: conversionError } = useQuery({
    queryKey: ['conversion-funnel', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<ConversionFunnelData[]> => {
      const { data, error } = await supabase.rpc('get_conversion_funnel', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });

  // Additional queries for real-time metrics
  const { data: totalUsers } = useQuery({
    queryKey: ['total-users'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeUsersToday } = useQuery({
    queryKey: ['active-users-today'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('analytics_events')
        .select('user_id')
        .gte('created_at', `${today}T00:00:00Z`)
        .not('user_id', 'is', null);
      
      if (error) throw error;
      
      // Count unique users
      const uniqueUsers = new Set(data?.map(event => event.user_id) || []);
      return uniqueUsers.size;
    },
  });

  // New query for draft rankings
  const { data: draftRankings } = useQuery({
    queryKey: ['draft-rankings', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_rankings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', format(startDate, 'yyyy-MM-dd'))
        .lte('created_at', format(endDate, 'yyyy-MM-dd'))
        .is('description', null); // Assuming drafts have no description or we can add a status field
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: topCategories } = useQuery({
    queryKey: ['top-categories', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_rankings')
        .select(`
          category_id,
          categories!inner(name)
        `)
        .gte('created_at', format(startDate, 'yyyy-MM-dd'))
        .lte('created_at', format(endDate, 'yyyy-MM-dd'));
      
      if (error) throw error;
      
      // Count rankings per category
      const categoryCount: Record<string, number> = {};
      data?.forEach(ranking => {
        const categoryName = (ranking.categories as any)?.name;
        if (categoryName) {
          categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
        }
      });
      
      return Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });

  return {
    analyticsData,
    conversionData,
    totalUsers,
    activeUsersToday,
    draftRankings,
    topCategories,
    isLoading: analyticsLoading || conversionLoading,
    error: analyticsError || conversionError,
  };
};
