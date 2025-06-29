
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

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

export const useFlowAnalytics = (startDate: Date, endDate: Date) => {
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
    registrationFlow,
    rankingFlow,
  };
};
