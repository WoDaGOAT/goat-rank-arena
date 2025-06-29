
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BounceRateData } from '@/hooks/useAnalyticsDashboard';

interface BounceRateCardProps {
  data: BounceRateData[];
}

const BounceRateCard = ({ data }: BounceRateCardProps) => {
  const chartData = data.map(item => ({
    page: item.page_url === '/' ? 'Home' : item.page_url.replace('/', ''),
    bounceRate: item.bounce_rate,
    totalSessions: item.total_sessions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bounce Rates by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Bounce Rate']}
                labelFormatter={(label) => `Page: ${label}`}
              />
              <Bar dataKey="bounceRate" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BounceRateCard;
