import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed select-none px-4 py-2.5 text-sm cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-accent to-blue-600 text-primaryBg hover:shadow-lg hover:shadow-accent/20 border border-transparent',
    secondary: 'bg-cardBg hover:bg-secondaryBg/80 text-text border border-border',
    outline: 'bg-transparent border border-accent text-accent hover:bg-accent/10',
    danger: 'bg-gradient-to-r from-danger to-red-600 text-text hover:shadow-lg hover:shadow-danger/25 border border-transparent',
  };

  const MotionButton = motion.button as any;

  return (
    <MotionButton
      whileHover={disabled || isLoading ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </MotionButton>
  );
};
export default Button;
