import React, { useMemo } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { getUpcomingRamadans } from '../utils/prayerTimes';
import { AssociationLogo } from './AssociationLogo';
import { Sparkles, Volume2, Share2, Calendar } from 'lucide-react';

interface HeroAnnouncementProps {
  lang: Language;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onOpenCardStudio: () => void;
  onOpenPrayerTimes: () => void;
  onOpenShare: () => void;
  personalizedRecipient?: string;
}

export const HeroAnnouncement: React.FC<HeroAnnouncementProps> = ({
  lang,
  isPlayingAudio,
  onToggleAudio,
  onOpenCardStudio,
  onOpenPrayerTimes,
  onOpenShare,
  personalizedRecipient
}) => {
  const t = TRANSLATIONS[lang];
  const nextRamadan = useMemo(() => getUpcomingRamadans().currentOrNext, []);

  return (
    <section id="proclamation" className="relative py-12 md:py-20 overflow-hidden">
      {/* Decorative background glow & subtle Islamic geometric ambient stars */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#d4af37]/15 via-[#0e3b2e]/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Curatorial Header Stamp & Harmonious Official Logo Crest */}
        <div className="flex flex-col items-center text-center mb-8">
          <AssociationLogo size="lg" className="mb-5" />

          {personalizedRecipient && (
            <div className="mb-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#144736]/90 via-[#1b5a45]/95 to-[#144736]/90 border border-[#d4af37]/60 text-[#f6e09f] text-sm sm:text-base font-bold shadow-lg font-cairo">
              {lang === 'ar'
                ? `إهداء وتهنئة خاصة إلى: ${personalizedRecipient} 🌙`
                : `Persönliche Ramadan-Grüße an: ${personalizedRecipient} 🌙`}
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#09251c]/90 text-[#f6e09f] text-xs font-semibold tracking-wide shadow-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>
              {lang === 'ar'
                ? `بيان رسمي مبارك • رمضان ${nextRamadan.hijriYear} هـ (${nextRamadan.startGregorianFormatted})`
                : `Offizielle Bekanntmachung • Ramadan ${nextRamadan.hijriYear} n.H. (ab ${nextRamadan.startGregorianFormatted})`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 font-cairo">
            <span className="text-gold-gradient">
              {lang === 'ar' ? 'رَمَضَانُ مُبَارَك' : 'Ramadan Mubarak'}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#c5dacd] max-w-2xl font-normal">
            {t.appSubtitle}
          </p>
        </div>

        {/* The Grand Proclamation Card with Ornate Arch Framing */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#0a2920] to-[#051711] border border-[#d4af37]/40 shadow-2xl overflow-hidden p-6 sm:p-10 md:p-12">
          
          {/* Ornate Corner Arabesques (SVG) */}
          <div className="absolute top-3 left-3 w-16 h-16 pointer-events-none opacity-40 text-[#d4af37]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute top-3 right-3 w-16 h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-x-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 w-16 h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-y-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-16 h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-x-100 -scale-y-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>

          {/* Central Quranic Verse Section */}
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-10 pb-8 border-b border-[#d4af37]/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#124234] border border-[#d4af37]/60 text-[#f6e09f] mb-5 shadow-lg">
              <span className="font-amiri text-2xl font-bold">﷽</span>
            </div>

            <div className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-4">
              {lang === 'ar' ? 'قال الله تعالى في محكم التنزيل :' : 'Im Namen Allahs, des Allerbarmers, des Barmherzigen:'}
            </div>

            {/* Quran Verse (Amiri Calligraphy) */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose text-[#fffaf0] font-amiri font-normal px-2 sm:px-6 my-4 select-text">
              « {t.quranAyah} »
            </blockquote>

            <div className="inline-block mt-3 px-4 py-1 rounded bg-[#092119] border border-[#d4af37]/30 text-xs sm:text-sm text-[#f6e09f] font-medium font-cairo">
              ۞ {t.quranSurah} ۞
            </div>

            {/* Ayah Audio Recitation Button */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={onToggleAudio}
                className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 shadow-md ${
                  isPlayingAudio
                    ? 'bg-[#d4af37] text-[#061510] border-[#d4af37] shadow-lg shadow-[#d4af37]/30'
                    : 'bg-[#0f382c] text-[#f6e09f] border-[#d4af37]/40 hover:bg-[#164d3c] hover:border-[#d4af37]'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-[#061510]' : 'text-[#d4af37]'}`} />
                <span>{isPlayingAudio ? t.pauseAudio : t.listenAyah}</span>
              </button>
            </div>
          </div>

          {/* Official Association & Mosques Announcement Text */}
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            {/* Leadership Signoff Banner */}
            <div className="bg-[#082218]/90 rounded-xl p-4 sm:p-5 border border-[#d4af37]/30">
              <p className="text-sm sm:text-base text-[#d8eae0] font-medium leading-relaxed font-cairo">
                {t.announcementPreamble}
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-[#f6e09f] mt-1 font-cairo tracking-wide">
                {t.mosquesMentioned}
              </h2>
            </div>

            {/* Main Greeting Statement */}
            <p className="text-base sm:text-xl text-white font-medium leading-relaxed px-2 sm:px-4 font-cairo">
              {t.announcementBody}
            </p>

            {/* Supplication */}
            <div className="pt-2 pb-4 text-sm sm:text-base text-[#c2dfd1] leading-relaxed italic bg-emerald-950/30 rounded-xl p-4 border border-emerald-800/30">
              « {t.announcementDua} »
            </div>

            {/* Call to Actions (Interactive Hub) */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onOpenCardStudio}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-sm sm:text-base hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'صمم بطاقة تهنئة فاخرة باسمك' : 'Grußkarte personalisieren'}</span>
              </button>

              <button
                onClick={onOpenPrayerTimes}
                className="px-6 py-3 rounded-xl bg-[#0e3b2e] hover:bg-[#144f3e] text-[#f6e09f] border border-[#d4af37]/40 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'مواقيت الصلاة في روستوك' : 'Gebetszeiten für Rostock'}</span>
              </button>

              <button
                onClick={onOpenShare}
                className="px-6 py-3 rounded-xl bg-[#0a2b21] hover:bg-[#124234] text-white border border-[#d4af37]/40 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'مشاركة الموقع عبر رابط' : 'Website teilen'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
