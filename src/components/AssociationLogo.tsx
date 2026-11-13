import React from 'react';
import { ASSOCIATION_LOGO_PATH } from '../utils/scheduleExporter';

interface AssociationLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AssociationLogo: React.FC<AssociationLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions =
    size === 'sm'
      ? 'w-11 h-11 p-1'
      : size === 'lg'
      ? 'w-28 h-28 sm:w-32 sm:h-32 p-2.5'
      : 'w-12 h-12 p-1';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Soft warm golden halo behind crest */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-45 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.65) 0%, transparent 72%)' }}
      />

      {/* Champagne-parchment satin medallion with double gold inlay */}
      <div
        className={`relative rounded-full flex items-center justify-center overflow-hidden border-2 border-[#d4af37] shadow-lg ${dimensions}`}
        style={{
          background: 'radial-gradient(circle at 32% 28%, #fcf8ee 0%, #f1e3c3 62%, #d9be82 100%)',
          boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.65), 0 4px 18px rgba(0,0,0,0.45)'
        }}
      >
        {/* Subtle inner hairline ring */}
        <div className="absolute inset-1 rounded-full border border-[#b48926]/35 pointer-events-none" />

        {/* mix-blend-multiply makes the uniform light PNG studio background dissolve cleanly into the warm satin crest */}
        <img
          src={ASSOCIATION_LOGO_PATH}
          alt="Islamischer Bund Rostock e.V."
          className="relative z-10 w-full h-full object-contain mix-blend-multiply scale-[1.03]"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
