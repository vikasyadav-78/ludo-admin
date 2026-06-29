import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Fetching Failed',
  description = 'An error occurred while loading this section. Please check your network connection.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col items-center justify-center p-8 text-center bg-danger/5 border border-danger/20 rounded-xl', className)}>
      <div className="p-3 bg-danger/10 rounded-lg text-danger mb-3">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-sm font-bold text-danger uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-secondaryText mt-1 max-w-sm leading-relaxed mb-4">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-danger text-danger hover:bg-danger/10 py-1.5 cursor-pointer">
          <RefreshCw size={14} className="mr-2" /> Retry
        </Button>
      )}
    </div>
  );
};
export default ErrorState;
