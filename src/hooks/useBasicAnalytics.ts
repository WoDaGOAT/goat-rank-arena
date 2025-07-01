
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export const useBasicAnalytics = (startDate: Date, endDate: Date) => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['analytics-dashboard', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_analytics_dashboard', {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
        });
        
        if (error) {
          console.warn('Analytics dashboard query failed:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.warn('Analytics dashboard error:', error);
        return [];
      }
    },
    enabled: !!startDate && !!endDate,
    retry: 1, // Only retry once
    retryDelay: 1000,
  });

  const { data: conversionData, isLoading: conversionLoading, error: conversionError } = useQuery({
    queryKey: ['conversion-funnel', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_conversion_funnel', {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
        });
        
        if (error) {
          console.warn('Conversion funnel query failed:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.warn('Conversion funnel error:', error);
        return [];
      }
    },
    enabled: !!startDate && !!endDate,
    retry: 1,
    retryDelay: 1000,
  });

  const { data: totalUsers } = useQuery({
    queryKey: ['total-users'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.warn('Total users query failed:', error);
          return 0;
        }
        return count || 0;
      } catch (error) {
        console.warn('Total users error:', error);
        return 0;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const { data: activeUsersToday } = useQuery({
    queryKey: ['active-users-today'],
    queryFn: async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('analytics_events')
          .select('user_id')
          .gte('created_at', `${today}T00:00:00Z`)
          .not('user_id', 'is', null);
        
        if (error) {
          console.warn('Active users today query failed:', error);
          return 0;
        }
        
        const uniqueUsers = new Set(data?.map(event => event.user_id) || []);
        return uniqueUsers.size;
      } catch (error) {
        console.warn('Active users today error:', error);
        return 0;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const { data: draftRankings } = useQuery({
    queryKey: ['draft-rankings', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('user_rankings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', format(startDate, 'yyyy-MM-dd'))
          .lte('created_at', format(endDate, 'yyyy-MM-dd'))
          .is('description', null);
        
        if (error) {
          console.warn('Draft rankings query failed:', error);
          return 0;
        }
        return count || 0;
      } catch (error) {
        console.warn('Draft rankings error:', error);
        return 0;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const { data: topCategories } = useQuery({
    queryKey: ['top-categories', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_rankings')
          .select(`
            category_id,
            categories!inner(name)
          `)
          .gte('created_at', format(startDate, 'yyyy-MM-dd'))
          .lte('created_at', format(endDate, 'yyyy-MM-dd'));
        
        if (error) {
          console.warn('Top categories query failed:', error);
          return [];
        }
        
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
      } catch (error) {
        console.warn('Top categories error:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
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
