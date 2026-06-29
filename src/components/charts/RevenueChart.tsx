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

interface RevenueChartProps {
  data: any[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
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
          itemStyle={{ color: '#00D4FF' }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Commissions (₹)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default RevenueChart;
