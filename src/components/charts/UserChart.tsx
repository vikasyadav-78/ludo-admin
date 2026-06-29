import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface UserChartProps {
  data: any[];
}

export const UserChart: React.FC<UserChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
        <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
        <Tooltip
          contentStyle={{
            background: '#1A2235',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#8B5CF6' }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
        />
        <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Registered Users" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default UserChart;
