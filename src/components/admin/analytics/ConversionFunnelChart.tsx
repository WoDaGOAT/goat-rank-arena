
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ConversionFunnelData } from '@/hooks/useAnalyticsDashboard';

interface ConversionFunnelChartProps {
  data: ConversionFunnelData[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const ConversionFunnelChart = ({ data }: ConversionFunnelChartProps) => {
  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="traffic_source" 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'conversion_rate') {
                return [`${value}%`, 'Conversion Rate'];
              }
              return [value, name === 'total_sessions' ? 'Total Sessions' : 'Signups'];
            }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Bar dataKey="total_sessions" name="total_sessions" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Conversion rates below the chart */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {data.map((item, index) => (
          <div key={item.traffic_source} className="text-center p-2 rounded-lg border">
            <div className="text-xs text-muted-foreground">{item.traffic_source}</div>
            <div className="text-lg font-semibold" style={{ color: COLORS[index % COLORS.length] }}>
              {item.conversion_rate}%
            </div>
            <div className="text-xs text-muted-foreground">
              {item.signups}/{item.total_sessions}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnelChart;
