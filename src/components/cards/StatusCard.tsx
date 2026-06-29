import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface StatusItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<any>;
}

interface StatusCardProps {
  title: string;
  items: StatusItem[];
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  items,
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
      <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wider mb-4 border-b border-border pb-2.5">
        {title}
      </h4>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-secondaryText">
                {Icon && <Icon size={14} className="shrink-0" />}
                <span>{item.label}</span>
              </div>
              <div className="text-sm font-bold text-text">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
export default StatusCard;
