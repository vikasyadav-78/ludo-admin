import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  description?: string;
  trend?: {
    value: string | number;
    type: 'up' | 'down' | 'neutral';
  };
  color?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  description,
  trend,
  color = '#00D4FF',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={twMerge(
        'bg-cardBg border border-border rounded-xl p-6 shadow-xl flex flex-col justify-between glow-card relative overflow-hidden h-full select-none',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-secondaryText uppercase tracking-wider">{label}</span>
        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{
            background: `rgba(${
              color === '#00D4FF' ? '0, 212, 255' :
              color === '#22C55E' ? '34, 197, 94' :
              color === '#F59E0B' ? '245, 158, 11' :
              color === '#EF4444' ? '239, 68, 68' : '139, 92, 246'
            }, 0.08)`,
            color: color,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-black text-text tracking-wide">{value}</h3>
        {description && (
          <p className="text-[10px] font-semibold text-secondaryText uppercase tracking-wider mt-0.5">
            {description}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
            <span
              className={twMerge(
                trend.type === 'up' && 'text-success',
                trend.type === 'down' && 'text-danger',
                trend.type === 'neutral' && 'text-secondaryText'
              )}
            >
              {trend.type === 'up' && '↑'}
              {trend.type === 'down' && '↓'}
              {trend.value}
            </span>
            <span className="text-secondaryText font-medium">vs last week</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default StatCard;
