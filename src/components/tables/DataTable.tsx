import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TableSkeleton } from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle,
  emptyDescription,
  className = '',
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={twMerge('w-full bg-cardBg border border-border rounded-xl shadow-xl overflow-hidden', className)}>
      <div className="overflow-x-auto w-full scrollbar-thin">
        <table className="w-full border-collapse text-left text-xs font-semibold text-text select-none">
          <thead>
            <tr className="border-b border-border bg-secondaryBg/50 text-[10px] text-secondaryText uppercase tracking-wider sticky top-0 z-10 select-none">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={twMerge('px-6 py-4 font-bold border-none select-none whitespace-nowrap', col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="border-b border-border/40 hover:bg-secondaryBg/20 transition-all select-none"
              >
                {columns.map((col, colIdx) => {
                  const content = typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={colIdx}
                      className={twMerge('px-6 py-4.5 font-medium border-none align-middle whitespace-nowrap', col.className)}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DataTable;
