import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface RevenueItem {
  label: string;
  value: string | number;
  color?: string;
}

interface RevenueCardProps {
  title: string;
  items: RevenueItem[];
  className?: string;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  items,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      className={twMerge(
        'bg-cardBg border border-border rounded-xl p-6 shadow-xl flex flex-col justify-between glow-card relative overflow-hidden h-full select-none',
        className
      )}
    >
      <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wider mb-4 border-b border-border pb-2.5">
        {title}
      </h4>
      <div className="flex flex-col gap-3.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondaryText">{item.label}</span>
            <span
              className="text-sm font-bold"
              style={{ color: item.color || '#FFFFFF' }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
export default RevenueCard;
