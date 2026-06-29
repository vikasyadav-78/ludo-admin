import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 select-none shrink-0', className)}>
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-text tracking-wide uppercase">{title}</h2>
        {subtitle && (
          <p className="text-xs text-secondaryText mt-1 tracking-wider uppercase font-medium">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 self-start md:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
export default PageHeader;
