'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'yellow' | 'pink' | 'blue' | 'orange' | 'purple' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  green: 'bg-pastel-green text-white hover:bg-pastel-green-dark shadow-md hover:shadow-lg focus-visible:ring-pastel-green',
  yellow: 'bg-pastel-yellow text-dark hover:brightness-95 shadow-md hover:shadow-lg focus-visible:ring-pastel-yellow',
  pink: 'bg-pastel-pink text-dark hover:brightness-95 shadow-md hover:shadow-lg focus-visible:ring-pastel-pink',
  blue: 'bg-pastel-blue text-dark hover:brightness-95 shadow-md hover:shadow-lg focus-visible:ring-pastel-blue',
  orange: 'bg-pastel-orange text-dark hover:brightness-95 shadow-md hover:shadow-lg focus-visible:ring-pastel-orange',
  purple: 'bg-pastel-purple text-white hover:brightness-95 shadow-md hover:shadow-lg focus-visible:ring-pastel-purple',
  ghost: 'bg-white/30 text-dark hover:bg-white/50 border border-white/50 focus-visible:ring-white',
  outline: 'bg-transparent text-dark border-2 border-dark/20 hover:border-dark/40 hover:bg-white/20 focus-visible:ring-dark',
};

const sizeClasses: Record<string, string> = {
  sm: 'min-h-[36px] px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'min-h-[48px] px-6 py-3 text-base rounded-2xl gap-2',
  lg: 'min-h-[56px] px-8 py-4 text-lg rounded-2xl gap-3',
};

export function Button({
  children,
  variant = 'green',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`
        inline-flex items-center justify-center 
        font-heading font-semibold 
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
}
