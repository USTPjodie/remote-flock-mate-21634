import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { day: 'Mon', mortality: 4, feed: 285, weight: 2.1 },
  { day: 'Tue', mortality: 3, feed: 292, weight: 2.2 },
  { day: 'Wed', mortality: 5, feed: 278, weight: 2.1 },
  { day: 'Thu', mortality: 2, feed: 301, weight: 2.3 },
  { day: 'Fri', mortality: 3, feed: 295, weight: 2.4 },
  { day: 'Sat', mortality: 4, feed: 288, weight: 2.3 },
  { day: 'Sun', mortality: 2, feed: 307, weight: 2.5 },
];

export const MetricsChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
          />
          <Legend />
          <Bar 
            dataKey="mortality" 
            fill="hsl(var(--destructive))" 
            name="Mortality"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="feed" 
            fill="hsl(var(--primary))" 
            name="Feed (kg)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};