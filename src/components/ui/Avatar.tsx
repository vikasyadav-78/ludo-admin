import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Admin',
  size = 'md',
  className = '',
}) => {
  const [error, setError] = useState(false);

  const getAvatarUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('/uploads')) {
      return `https://ludo-backend-production-72bc.up.railway.app${url}`;
    }
    return url;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (n: string) => {
    return n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  const resolvedSrc = getAvatarUrl(src);

  return (
    <div className={twMerge(
      'relative flex items-center justify-center rounded-full overflow-hidden bg-accent/10 border border-accent/20 text-accent font-bold select-none shrink-0',
      sizeClasses[size],
      className
    )}>
      {resolvedSrc && !error ? (
        <img
          src={resolvedSrc}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
export default Avatar;
