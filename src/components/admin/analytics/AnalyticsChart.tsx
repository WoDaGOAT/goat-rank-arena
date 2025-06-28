
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { format, parseISO } from 'date-fns';

interface AnalyticsChartProps {
  data: Record<string, number>;
  title: string;
  color: string;
}

const AnalyticsChart = ({ data, title, color }: AnalyticsChartProps) => {
  // Convert data object to array format for recharts
  const chartData = Object.entries(data).map(([date, value]) => ({
    date,
    value,
    formattedDate: format(parseISO(date), 'MMM dd'),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            labelFormatter={(value, payload) => {
              const entry = payload?.[0]?.payload;
              return entry ? format(parseISO(entry.date), 'MMM dd, yyyy') : value;
            }}
            formatter={(value) => [value, title]}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
