
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export interface BounceRateData {
  page_url: string;
  total_sessions: number;
  bounced_sessions: number;
  bounce_rate: number;
}

export const useBounceRates = (startDate: Date, endDate: Date) => {
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

  return { bounceRates };
};
