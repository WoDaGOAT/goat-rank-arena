
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays, format } from 'date-fns';

export interface UserActivityMetrics {
  dau: number;
  wau: number;
  mau: number;
  dau_mau_ratio: number;
  churn_rate: number;
}

export const useUserActivityMetrics = () => {
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

  return { userActivityMetrics };
};
