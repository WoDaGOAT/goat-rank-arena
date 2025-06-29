
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
  format?: 'number' | 'percentage';
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = 'up',
  format = 'number' 
}: MetricCardProps) => {
  const formatValue = (val: number) => {
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trendDirection === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trend}
            </span>
            <span className="ml-1">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
