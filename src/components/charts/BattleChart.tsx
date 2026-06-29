import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface BattleChartProps {
  data: any[];
}

export const BattleChart: React.FC<BattleChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        />
        <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
        <Bar dataKey="created" fill="#00D4FF" radius={[4, 4, 0, 0]} name="Created Battles" />
        <Bar dataKey="settled" fill="#22C55E" radius={[4, 4, 0, 0]} name="Settled Battles" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default BattleChart;
