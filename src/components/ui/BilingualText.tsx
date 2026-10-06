'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BilingualTextProps {
  en: string;
  ur: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  classNameEn?: string;
  classNameUr?: string;
  className?: string;
  showBothOverride?: boolean;
}

export function BilingualText({
  en,
  ur,
  as: Tag = 'span',
  classNameEn = '',
  classNameUr = '',
  className = '',
  showBothOverride,
}: BilingualTextProps) {
  const { language, showBoth } = useLanguage();

  const shouldShowBoth = showBothOverride !== undefined ? showBothOverride : showBoth;

  if (shouldShowBoth) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <Tag className={`font-body ${classNameEn}`}>{en}</Tag>
        <Tag className={`font-urdu urdu-text text-dark-light ${classNameUr}`} dir="rtl">
          {ur}
        </Tag>
      </div>
    );
  }

  if (language === 'ur') {
    return (
      <Tag className={`font-urdu urdu-text ${classNameUr} ${className}`} dir="rtl">
        {ur}
      </Tag>
    );
  }

  return (
    <Tag className={`font-body ${classNameEn} ${className}`}>
      {en}
    </Tag>
  );
}

// Heading variant for section titles
export function BilingualHeading({
  en,
  ur,
  level = 2,
  className = '',
}: {
  en: string;
  ur: string;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const sizeClasses: Record<number, string> = {
    1: 'text-3xl md:text-4xl lg:text-5xl',
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
  };

  return (
    <BilingualText
      en={en}
      ur={ur}
      as={`h${level}` as 'h1' | 'h2' | 'h3' | 'h4'}
      classNameEn={`font-heading font-bold ${sizeClasses[level]}`}
      classNameUr={`font-urdu text-lg md:text-xl`}
      className={className}
    />
  );
}
