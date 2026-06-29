import React from 'react';
import { Layers } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no active records matching your filters or search query.',
  icon: Icon = Layers,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col items-center justify-center p-8 text-center bg-cardBg/30 border border-dashed border-border rounded-xl', className)}>
      <div className="p-3 bg-secondaryBg rounded-lg text-secondaryText mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-text uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-secondaryText mt-1 max-w-sm leading-relaxed">{description}</p>
    </div>
  );
};
export default EmptyState;
