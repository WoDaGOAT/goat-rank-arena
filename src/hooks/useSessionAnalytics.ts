
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export interface SessionAnalytics {
  total_sessions: number;
  avg_session_length: number;
  avg_pages_per_session: number;
}

export const useSessionAnalytics = (startDate: Date, endDate: Date) => {
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

  return { sessionAnalytics };
};
