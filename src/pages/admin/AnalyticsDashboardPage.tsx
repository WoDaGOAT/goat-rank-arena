
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Calendar, TrendingUp, Users, MousePointer, MessageCircle, FileQuestion, Trophy, FileText, Activity, Clock, Eye, UserX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import ConversionFunnelChart from '@/components/admin/analytics/ConversionFunnelChart';
import MetricCard from '@/components/admin/analytics/MetricCard';
import TrafficSourceBreakdown from '@/components/admin/analytics/TrafficSourceBreakdown';

const AnalyticsDashboardPage = () => {
  const { isAdmin, loading } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const {
    analyticsData,
    conversionData,
    totalUsers,
    activeUsersToday,
    userActivityMetrics,
    sessionAnalytics,
    draftRankings,
    topCategories,
    isLoading,
    error,
  } = useAnalyticsDashboard(dateRange.from, dateRange.to);

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const getMetricData = (metricType: string) => {
    return analyticsData?.find(data => data.metric_type === metricType);
  };

  if (loading) {
    return (
      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-background text-foreground flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to view this page. Administrator access is required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex-grow flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor user engagement, traffic sources, and conversion rates
              </p>
            </div>
            
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                  ) : (
                    'Select date range'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      handleDateRangeChange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Loading Analytics</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
            <MetricCard
              title="Total Users"
              value={totalUsers || 0}
              icon={Users}
              trend="+12%"
              trendDirection="up"
            />
            <MetricCard
              title="Active Today"
              value={activeUsersToday || 0}
              icon={TrendingUp}
              trend="+8%"
              trendDirection="up"
            />
            <MetricCard
              title="Page Views"
              value={getMetricData('page_views')?.total_value || 0}
              icon={MousePointer}
              trend="+15%"
              trendDirection="up"
            />
            <MetricCard
              title="Signups"
              value={getMetricData('signups')?.total_value || 0}
              icon={Users}
              trend="+23%"
              trendDirection="up"
            />
            <MetricCard
              title="Draft Rankings"
              value={draftRankings || 0}
              icon={FileText}
              trend="+5%"
              trendDirection="up"
            />
          </div>

          {/* User Activity Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
            <MetricCard
              title="Daily Active Users"
              value={userActivityMetrics?.dau || 0}
              icon={Activity}
              trend="+7%"
              trendDirection="up"
            />
            <MetricCard
              title="Weekly Active Users"
              value={userActivityMetrics?.wau || 0}
              icon={Users}
              trend="+12%"
              trendDirection="up"
            />
            <MetricCard
              title="Monthly Active Users"
              value={userActivityMetrics?.mau || 0}
              icon={Users}
              trend="+18%"
              trendDirection="up"
            />
            <MetricCard
              title="DAU/MAU Ratio"
              value={userActivityMetrics?.dau_mau_ratio || 0}
              icon={TrendingUp}
              format="percentage"
              trend="+2%"
              trendDirection="up"
            />
            <MetricCard
              title="Churn Rate"
              value={userActivityMetrics?.churn_rate || 0}
              icon={UserX}
              format="percentage"
              trend="-3%"
              trendDirection="down"
            />
          </div>

          {/* Session Analytics */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <MetricCard
              title="Total Sessions"
              value={sessionAnalytics?.total_sessions || 0}
              icon={Activity}
              trend="+15%"
              trendDirection="up"
            />
            <MetricCard
              title="Avg Session Length"
              value={sessionAnalytics?.avg_session_length || 0}
              icon={Clock}
              trend="+8%"
              trendDirection="up"
            />
            <MetricCard
              title="Pages per Session"
              value={sessionAnalytics?.avg_pages_per_session || 0}
              icon={Eye}
              trend="+5%"
              trendDirection="up"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 mb-8">
            {/* Page Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Page Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <AnalyticsChart 
                    data={getMetricData('page_views')?.date_data || {}}
                    title="Page Views"
                    color="#3b82f6"
                  />
                )}
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel by Traffic Source</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ConversionFunnelChart data={conversionData || []} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Signups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <AnalyticsChart 
                    data={getMetricData('signups')?.date_data || {}}
                    title="Signups"
                    color="#10b981"
                  />
                )}
              </CardContent>
            </Card>

            {/* Rankings Created */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Rankings Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <AnalyticsChart 
                    data={getMetricData('rankings_created')?.date_data || {}}
                    title="Rankings"
                    color="#f59e0b"
                  />
                )}
              </CardContent>
            </Card>

            {/* Comments Posted */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments Posted
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <AnalyticsChart 
                    data={getMetricData('comments_posted')?.date_data || {}}
                    title="Comments"
                    color="#8b5cf6"
                  />
                )}
              </CardContent>
            </Card>

            {/* Quiz Attempts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5" />
                  Quiz Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <AnalyticsChart 
                    data={getMetricData('quiz_attempts')?.date_data || {}}
                    title="Quiz Attempts"
                    color="#ef4444"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Traffic Source Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <TrafficSourceBreakdown 
                    data={getMetricData('page_views')?.breakdown_data?.by_source || {}}
                  />
                )}
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topCategories?.slice(0, 5).map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {category.count} rankings
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
