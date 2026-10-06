'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'solid' | 'colored';
  color?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  animate?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6 md:p-8',
};

export function GlassCard({
  children,
  variant = 'default',
  color,
  padding = 'md',
  hover = false,
  animate = true,
  className = '',
  ...motionProps
}: GlassCardProps) {
  const baseClasses = variant === 'solid' ? 'glass-card-solid' : 'glass-card';

  const hoverClasses = hover
    ? 'cursor-pointer hover:shadow-glass-lg hover:scale-[1.02] transition-all duration-300'
    : '';

  const colorStyle = color
    ? {
        background: `linear-gradient(135deg, ${color}15 0%, rgba(255,255,255,0.35) 100%)`,
        borderColor: `${color}30`,
      }
    : {};

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
      }
    : {};

  return (
    <motion.div
      className={`${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      style={colorStyle}
      {...animationProps}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
