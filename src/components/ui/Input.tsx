import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  wrapperClassName = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className={twMerge('flex flex-col gap-1.5 w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-secondaryText uppercase tracking-wider select-none">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={twMerge(
          clsx(
            'w-full px-4 py-2.5 bg-primaryBg border rounded-lg text-text outline-none text-sm transition-all duration-200 focus:ring-1 focus:ring-accent focus:border-accent',
            error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border'
          ),
          className
        )}
        onWheel={(e) => {
          if (type === 'number') {
            e.currentTarget.blur();
          }
          if (props.onWheel) {
            props.onWheel(e);
          }
        }}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
