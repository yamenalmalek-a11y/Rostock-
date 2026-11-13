import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { AssociationLogo } from './AssociationLogo';
import { PWAInstallButton } from './InstallAppModal';
import { Volume2, VolumeX, Globe, Menu, X, Share2, Smartphone } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  nextPrayerName: string;
  timeRemainingStr: string;
  onOpenShare: () => void;
  onOpenInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isPlayingAudio,
  onToggleAudio,
  nextPrayerName,
  timeRemainingStr,
  onOpenShare,
  onOpenInstall
}) => {
  const t = TRANSLATIONS[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#061510]/95 backdrop-blur-md border-b border-[#d4af37]/25 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Wordmark & Harmonious Official Crest */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <AssociationLogo size="md" className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-[#f3efe6] tracking-tight whitespace-nowrap font-cairo">
                {lang === 'ar' ? 'الرابطة الإسلامية في روستوك' : 'Islamischer Bund Rostock e.V.'}
              </span>
              <span className="text-xs text-[#d4af37]/90 font-medium whitespace-nowrap">
                {lang === 'ar' ? 'مسجد روستوك الكبير • مسجد النور' : 'Große Moschee Rostock & An-Nur'}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Single-Line, clean typography) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#c4d6ce]">
            <a href="#proclamation" className="hover:text-[#d4af37] transition-colors whitespace-nowrap py-1">
              {lang === 'ar' ? 'التهنئة الرسمية' : 'Offizielle Grußbotschaft'}
            </a>
            <a href="#prayer-times" className="hover:text-[#d4af37] transition-colors whitespace-nowrap py-1 flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'مواقيت الصلاة والإمساكية' : 'Gebetszeiten & Imsakiya'}</span>
              {nextPrayerName && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#103b2f] text-[#d4af37] border border-[#d4af37]/30">
                  {nextPrayerName} {timeRemainingStr}
                </span>
              )}
            </a>
            <a href="#card-studio" className="hover:text-[#d4af37] transition-colors whitespace-nowrap py-1">
              {lang === 'ar' ? 'صانع بطاقات التهنئة' : 'Grußkarten-Studio'}
            </a>
            <a href="#mosques" className="hover:text-[#d4af37] transition-colors whitespace-nowrap py-1">
              {lang === 'ar' ? 'مساجد روستوك' : 'Moscheen & Tarawih'}
            </a>
            <a href="#duas" className="hover:text-[#d4af37] transition-colors whitespace-nowrap py-1">
              {lang === 'ar' ? 'أدعية رمضان' : 'Bittgebete'}
            </a>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-2 ${
                isPlayingAudio
                  ? 'bg-[#d4af37] text-[#061510] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                  : 'bg-[#0a231b] text-[#c4d6ce] border-[#1f4a3b] hover:border-[#d4af37]/60 hover:text-[#d4af37]'
              }`}
              title={isPlayingAudio ? t.pauseAudio : t.listenAyah}
              aria-label={isPlayingAudio ? t.pauseAudio : t.listenAyah}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span className="hidden xl:inline whitespace-nowrap">{t.pauseAudio}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden xl:inline whitespace-nowrap">{t.listenAyah}</span>
                </>
              )}
            </button>

            {/* Install App Button (auto-hides when installed) */}
            <PWAInstallButton lang={lang} onOpenModal={onOpenInstall} variant="header" />

            {/* Share Link Button */}
            <button
              onClick={onOpenShare}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b38f22] hover:brightness-110 text-[#061510] font-bold text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap shadow-md transition-all"
              title={lang === 'ar' ? 'مشاركة الموقع عبر رابط' : 'Website teilen'}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'مشاركة' : 'Teilen'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-3 py-2 rounded-lg bg-[#0e3327] hover:bg-[#144534] text-[#f3efe6] border border-[#d4af37]/40 hover:border-[#d4af37] transition-all text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>{t.toggleLanguage}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-[#c4d6ce] hover:text-white bg-[#0e3327] border border-[#1f4a3b]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#061510] border-b border-[#d4af37]/30 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#proclamation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#f3efe6] hover:bg-[#0e3327]"
          >
            {lang === 'ar' ? 'التهنئة الرسمية' : 'Offizielle Grußbotschaft'}
          </a>
          <a
            href="#prayer-times"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#f3efe6] hover:bg-[#0e3327]"
          >
            {lang === 'ar' ? 'مواقيت الصلاة والإمساكية' : 'Gebetszeiten & Imsakiya'}
          </a>
          <a
            href="#card-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#f3efe6] hover:bg-[#0e3327]"
          >
            {lang === 'ar' ? 'صانع بطاقات التهنئة' : 'Grußkarten-Studio'}
          </a>
          <a
            href="#mosques"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#f3efe6] hover:bg-[#0e3327]"
          >
            {lang === 'ar' ? 'مساجد روستوك' : 'Moscheen & Tarawih'}
          </a>
          <a
            href="#duas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#f3efe6] hover:bg-[#0e3327]"
          >
            {lang === 'ar' ? 'أدعية رمضان' : 'Bittgebete'}
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInstall();
            }}
            className="w-full text-start px-3 py-2 rounded-md text-sm font-semibold text-emerald-300 hover:bg-[#0e3327] flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-[#d4af37]" />
            <span>{lang === 'ar' ? 'تثبيت التطبيق (Android / iPhone)' : 'App installieren (Android / iOS)'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
