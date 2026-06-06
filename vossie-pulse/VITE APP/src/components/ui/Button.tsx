import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-purple-600 text-white hover:bg-purple-700 shadow-lg': variant === 'primary',
            'bg-purple-100 text-purple-900 hover:bg-purple-200': variant === 'secondary',
            'border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-800': variant === 'outline',
            'hover:bg-gray-100 text-gray-700': variant === 'ghost',
            'h-9 px-4 text-xs': size === 'sm',
            'h-12 px-6 text-sm': size === 'md',
            'h-14 px-8 text-base w-full': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
