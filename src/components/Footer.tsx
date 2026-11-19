import React, { useMemo } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { getUpcomingRamadans } from '../utils/prayerTimes';
import { AssociationLogo } from './AssociationLogo';
import { PWAInstallButton } from './InstallAppModal';
import { Share2 } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onOpenShare: () => void;
  onOpenInstall: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenShare, onOpenInstall }) => {
  const t = TRANSLATIONS[lang];
  const nextRamadan = useMemo(() => getUpcomingRamadans().currentOrNext, []);

  return (
    <footer className="bg-[#030d09] border-t border-[#13372b] pt-10 pb-24 md:py-12 text-[#9bbbae] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#0f2d23]">
          
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <AssociationLogo size="sm" />
            <div>
              <span className="font-bold text-sm text-white block font-cairo">
                {t.appTitle}
              </span>
              <span className="text-[11px] text-[#719687]">
                {lang === 'ar' ? 'مسجد روستوك الكبير ومسجد النور • روستوك، ألمانيا' : 'Große Moschee Rostock & Al-Nour Moschee • Rostock, Deutschland'}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#b8d4c8]">
            <a href="#proclamation" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'البيان الرسمي' : 'Grußbotschaft'}
            </a>
            <a href="#prayer-times" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'مواقيت الصلاة' : 'Gebetszeiten'}
            </a>
            <a href="#card-studio" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'صانع البطاقات' : 'Grußkarten'}
            </a>
            <a href="#janazah-notice" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'كليشة النعوة' : 'Janazah-Vorlage'}
            </a>
            <a href="#mosques" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'المساجد' : 'Moscheen'}
            </a>
            <a href="#duas" className="hover:text-[#d4af37] transition-colors">
              {lang === 'ar' ? 'الأدعية' : 'Bittgebete'}
            </a>
            <PWAInstallButton lang={lang} onOpenModal={onOpenInstall} variant="footer" />
            <button
              onClick={onOpenShare}
              className="hover:text-[#d4af37] text-[#f6e09f] font-semibold transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مشاركة الرابط' : 'Link teilen'}</span>
            </button>
          </div>

        </div>

        {/* Copyright & Islamic Blessing */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[#6f8f81] text-[11px]">
          <div>
            {t.copyright}
          </div>
          <div className="flex items-center gap-1.5 text-[#d4af37]/90 font-medium">
            <span>{lang === 'ar' ? 'تقبل الله منا ومنكم الصيام والقيام' : 'Möge Allah unser aller Fasten annehmen'}</span>
            <span>•</span>
            <span>{lang === 'ar' ? `رمضان ${nextRamadan.hijriYear} هـ` : `Ramadan ${nextRamadan.hijriYear} n.H.`}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
