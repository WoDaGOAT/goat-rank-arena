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

export interface SessionAnalytics {
  total_sessions: number;
  avg_session_length: number;
  avg_pages_per_session: number;
}

export interface UserActivityMetrics {
  dau: number;
  wau: number;
  mau: number;
  dau_mau_ratio: number;
  churn_rate: number;
}

export interface BounceRateData {
  page_url: string;
  total_sessions: number;
  bounced_sessions: number;
  bounce_rate: number;
}

export interface RegistrationFlowData {
  step_name: string;
  started_count: number;
  completed_count: number;
  conversion_rate: number;
  avg_time_seconds: number;
}

export interface RankingFlowData {
  step_name: string;
  started_count: number;
  completed_count: number;
  conversion_rate: number;
  avg_completion_time_seconds: number;
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

  // New query for user activity metrics (DAU, WAU, MAU, DAU/MAU, Churn)
  const { data: userActivityMetrics } = useQuery({
    queryKey: ['user-activity-metrics', format(new Date(), 'yyyy-MM-dd')],
    queryFn: async (): Promise<UserActivityMetrics> => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      const oneWeekAgo = addDays(today, -7);
      const oneMonthAgo = addDays(today, -30);
      const twoMonthsAgo = addDays(today, -60);

      // Daily Active Users (yesterday to avoid incomplete data for today)
      const { data: dauData, error: dauError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('created_at', format(yesterday, 'yyyy-MM-dd'))
        .lt('created_at', format(today, 'yyyy-MM-dd'))
        .not('user_id', 'is', null);
      
      if (dauError) throw dauError;
      const dau = new Set(dauData?.map(s => s.user_id) || []).size;

      // Weekly Active Users
      const { data: wauData, error: wauError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('created_at', format(oneWeekAgo, 'yyyy-MM-dd'))
        .not('user_id', 'is', null);
      
      if (wauError) throw wauError;
      const wau = new Set(wauData?.map(s => s.user_id) || []).size;

      // Monthly Active Users
      const { data: mauData, error: mauError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('created_at', format(oneMonthAgo, 'yyyy-MM-dd'))
        .not('user_id', 'is', null);
      
      if (mauError) throw mauError;
      const mau = new Set(mauData?.map(s => s.user_id) || []).size;

      // DAU/MAU ratio
      const dau_mau_ratio = mau > 0 ? (dau / mau) * 100 : 0;

      // Churn rate: users who were active 30-60 days ago but not in last 30 days
      const { data: oldActiveUsers, error: oldActiveError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('created_at', format(twoMonthsAgo, 'yyyy-MM-dd'))
        .lt('created_at', format(oneMonthAgo, 'yyyy-MM-dd'))
        .not('user_id', 'is', null);
      
      if (oldActiveError) throw oldActiveError;
      const oldActiveUserIds = new Set(oldActiveUsers?.map(s => s.user_id) || []);
      const currentActiveUserIds = new Set(mauData?.map(s => s.user_id) || []);
      
      const churnedUsers = [...oldActiveUserIds].filter(id => !currentActiveUserIds.has(id));
      const churn_rate = oldActiveUserIds.size > 0 ? (churnedUsers.length / oldActiveUserIds.size) * 100 : 0;

      return {
        dau,
        wau,
        mau,
        dau_mau_ratio: Math.round(dau_mau_ratio * 100) / 100,
        churn_rate: Math.round(churn_rate * 100) / 100,
      };
    },
  });

  // Session analytics
  const { data: sessionAnalytics } = useQuery({
    queryKey: ['session-analytics', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<SessionAnalytics> => {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('time_on_site, page_views')
        .gte('created_at', format(startDate, 'yyyy-MM-dd'))
        .lte('created_at', format(endDate, 'yyyy-MM-dd'))
        .not('time_on_site', 'is', null)
        .not('page_views', 'is', null);
      
      if (error) throw error;

      const sessions = data || [];
      const total_sessions = sessions.length;
      
      if (total_sessions === 0) {
        return {
          total_sessions: 0,
          avg_session_length: 0,
          avg_pages_per_session: 0,
        };
      }

      const total_time = sessions.reduce((sum, session) => sum + (session.time_on_site || 0), 0);
      const total_page_views = sessions.reduce((sum, session) => sum + (session.page_views || 0), 0);

      return {
        total_sessions,
        avg_session_length: Math.round(total_time / total_sessions),
        avg_pages_per_session: Math.round((total_page_views / total_sessions) * 100) / 100,
      };
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

  // New queries for bounce rates
  const { data: bounceRates } = useQuery({
    queryKey: ['bounce-rates', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<BounceRateData[]> => {
      const { data, error } = await supabase.rpc('get_bounce_rates', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });

  // Registration flow analytics
  const { data: registrationFlow } = useQuery({
    queryKey: ['registration-flow', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<RegistrationFlowData[]> => {
      const { data, error } = await supabase.rpc('get_registration_flow_analytics', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });

  // Ranking creation flow analytics
  const { data: rankingFlow } = useQuery({
    queryKey: ['ranking-flow', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<RankingFlowData[]> => {
      const { data, error } = await supabase.rpc('get_ranking_flow_analytics', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startDate && !!endDate,
  });

  return {
    analyticsData,
    conversionData,
    totalUsers,
    activeUsersToday,
    userActivityMetrics,
    sessionAnalytics,
    draftRankings,
    topCategories,
    bounceRates,
    registrationFlow,
    rankingFlow,
    isLoading: analyticsLoading || conversionLoading,
    error: analyticsError || conversionError,
  };
};
