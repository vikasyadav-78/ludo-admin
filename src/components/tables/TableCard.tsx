import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TableCardProps {
  title?: string;
  subtitle?: string;
  searchBar?: React.ReactNode;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const TableCard: React.FC<TableCardProps> = ({
  title,
  subtitle,
  searchBar,
  actions,
  filters,
  pagination,
  children,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col gap-4 select-none', className)}>
      {(title || searchBar || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            {title && <h3 className="text-sm font-bold text-text uppercase tracking-wider">{title}</h3>}
            {subtitle && <span className="text-[10px] text-secondaryText mt-0.5 uppercase tracking-wide">{subtitle}</span>}
          </div>
          <div className="flex items-center gap-3.5 self-stretch sm:self-auto justify-end">
            {searchBar}
            {actions}
          </div>
        </div>
      )}

      {filters && (
        <div className="flex flex-wrap items-center gap-3 bg-cardBg/30 border border-border p-3 rounded-lg">
          {filters}
        </div>
      )}

      <div className="w-full">
        {children}
      </div>

      {pagination && (
        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-2">
          {pagination}
        </div>
      )}
    </div>
  );
};
export default TableCard;
