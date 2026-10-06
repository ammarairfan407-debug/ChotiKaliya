'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LoadingBud({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeMap = { sm: 40, md: 64, lg: 96 };
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/images/logo/kali-mascot.jpg"
          alt="Loading..."
          width={s}
          height={s}
          className="rounded-full"
          priority
        />
      </motion.div>
      {text && (
        <p className="font-heading text-dark-light text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
}
