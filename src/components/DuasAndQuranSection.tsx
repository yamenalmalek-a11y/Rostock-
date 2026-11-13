import React, { useState } from 'react';
import { RAMADAN_DUAS, TRANSLATIONS, Language } from '../utils/translations';
import { BookOpen, Copy, Check, Volume2, Sparkles } from 'lucide-react';

interface DuasAndQuranSectionProps {
  lang: Language;
}

export const DuasAndQuranSection: React.FC<DuasAndQuranSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="duas" className="scroll-mt-20 py-10 md:py-16 relative bg-[#04120d]/60 border-t border-[#143b2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#0c2a20] text-[#d4af37] text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'زاد الصائم الروحي' : 'Spirituelle Nahrung des Fastenden'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-cairo">
            {t.duasTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#b4ccc1]">
            {t.duasSubtitle}
          </p>
        </div>

        {/* Duas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {RAMADAN_DUAS.map((dua, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#081e17] border border-[#1b4636] p-5 sm:p-6 shadow-xl hover:border-[#d4af37]/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Title & Copy Bar */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#14392c]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#12382c] border border-[#d4af37]/40 flex items-center justify-center text-xs text-[#d4af37] font-mono font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-[#f6e09f] font-cairo">
                      {lang === 'ar' ? dua.titleAr : dua.titleDe}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(`${dua.arabic}\n\n${dua.translationDe}`, idx)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0e3125] hover:bg-[#164736] text-[#b3d4c5] hover:text-white transition-colors text-xs flex items-center gap-1 shrink-0"
                    title={lang === 'ar' ? 'نسخ الدعاء' : 'Dua kopieren'}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">{lang === 'ar' ? 'تم النسخ' : 'Kopiert'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{lang === 'ar' ? 'نسخ' : 'Kopieren'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Arabic Text (Amiri Font with Vowelization) */}
                <p className="text-lg sm:text-xl md:text-2xl text-white font-amiri leading-loose text-center py-2 select-text">
                  « {dua.arabic} »
                </p>

                {/* Transliteration */}
                <p className="text-xs text-[#8ab2a2] italic font-sans text-center mt-2 mb-3">
                  {dua.transliteration}
                </p>

                {/* German Translation */}
                <div className="mt-3 p-3 rounded-xl bg-[#04130e] border border-[#163a2d] text-xs text-[#d8eae1] leading-relaxed">
                  <strong className="text-[#d4af37] block mb-1">
                    {lang === 'ar' ? 'الترجمة باللغة الألمانية:' : 'Deutsche Übersetzung:'}
                  </strong>
                  {dua.translationDe}
                </div>
              </div>

              {/* Reference */}
              <div className="mt-4 pt-3 border-t border-[#14392c] flex items-center justify-between text-[11px] text-[#719687]">
                <span>{dua.reference}</span>
                <span className="text-[#d4af37]/80">
                  {dua.reference.includes('رواه')
                    ? (lang === 'ar' ? '۞ حديث صحيح ۞' : '۞ Authentischer Hadith ۞')
                    : (lang === 'ar' ? '۞ دعاء مأثور ۞' : '۞ Überliefertes Bittgebet ۞')}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
