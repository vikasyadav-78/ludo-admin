import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.005 }}
      className={twMerge(
        'bg-cardBg border border-border rounded-xl p-6 shadow-xl flex flex-col glow-card select-none h-full',
        className
      )}
    >
      <div className="flex flex-col mb-4">
        <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wider">{title}</h4>
        {subtitle && (
          <span className="text-[10px] text-secondaryText/60 mt-0.5 tracking-wider uppercase font-medium">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </motion.div>
  );
};
export default ChartCard;
