
import { useBasicAnalytics } from './useBasicAnalytics';
import { useUserActivityMetrics } from './useUserActivityMetrics';
import { useSessionAnalytics } from './useSessionAnalytics';
import { useFlowAnalytics } from './useFlowAnalytics';
import { useBounceRates } from './useBounceRates';

// Re-export types for backward compatibility
export type { RegistrationFlowData, RankingFlowData } from './useFlowAnalytics';
export type { BounceRateData } from './useBounceRates';
export type { UserActivityMetrics } from './useUserActivityMetrics';
export type { SessionAnalytics } from './useSessionAnalytics';

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
  const {
    analyticsData,
    conversionData,
    totalUsers,
    activeUsersToday,
    draftRankings,
    topCategories,
    isLoading: basicLoading,
    error: basicError,
  } = useBasicAnalytics(startDate, endDate);

  const { userActivityMetrics } = useUserActivityMetrics();
  const { sessionAnalytics } = useSessionAnalytics(startDate, endDate);
  const { registrationFlow, rankingFlow } = useFlowAnalytics(startDate, endDate);
  const { bounceRates } = useBounceRates(startDate, endDate);

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
    isLoading: basicLoading,
    error: basicError,
  };
};
