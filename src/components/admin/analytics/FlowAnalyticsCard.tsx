
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RegistrationFlowData, RankingFlowData } from '@/hooks/useAnalyticsDashboard';

interface FlowAnalyticsCardProps {
  title: string;
  data: RegistrationFlowData[] | RankingFlowData[];
}

const FlowAnalyticsCard = ({ title, data }: FlowAnalyticsCardProps) => {
  const chartData = data.map(item => ({
    step: item.step_name,
    conversionRate: item.conversion_rate,
    started: item.started_count,
    completed: item.completed_count,
    avgTime: 'avg_time_seconds' in item ? item.avg_time_seconds : 
             'avg_completion_time_seconds' in item ? item.avg_completion_time_seconds : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate'];
                  if (name === 'avgTime') return [`${value}s`, 'Avg Time'];
                  return [value, name];
                }}
              />
              <Bar dataKey="conversionRate" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.step_name}</span>
              <div className="flex gap-4 text-muted-foreground">
                <span>Started: {item.started_count}</span>
                <span>Completed: {item.completed_count}</span>
                <span>Rate: {item.conversion_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowAnalyticsCard;
