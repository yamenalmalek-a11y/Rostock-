import React from 'react';
import { ROSTOCK_MOSQUES, TRANSLATIONS, Language } from '../utils/translations';
import { MapPin, Phone, Mail, Globe, Clock, Utensils, ExternalLink, Moon, Users, CheckCircle2 } from 'lucide-react';

interface MosquesDirectoryProps {
  lang: Language;
}

export const MosquesDirectory: React.FC<MosquesDirectoryProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="mosques" className="py-10 md:py-16 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#0c2a20] text-[#d4af37] text-xs font-semibold mb-3">
            <Moon className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بيوت الله في روستوك' : 'Moscheen in Rostock'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-cairo">
            {t.mosquesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#b4ccc1]">
            {t.mosquesSubtitle}
          </p>
        </div>

        {/* Mosques Grid (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ROSTOCK_MOSQUES.map((mosque, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-gradient-to-b from-[#0a271f] to-[#04140f] border border-[#d4af37]/40 shadow-xl p-5 sm:p-8 flex flex-col justify-between hover:border-[#d4af37] transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                      {idx === 0 ? (lang === 'ar' ? 'المقر الرئيسي' : 'Hauptstandort') : (lang === 'ar' ? 'فرع تويتنفينكل' : 'Standort Toitenwinkel')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-cairo">
                      {lang === 'ar' ? mosque.name : mosque.nameDe}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#123b2f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="space-y-2.5 py-4 border-y border-[#184235] text-xs sm:text-sm text-[#c7ddd3]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{mosque.address}, {mosque.postalCode} {mosque.city}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <a href={`tel:${mosque.phone.replace(/\s+/g, '')}`} dir="ltr" className="font-mono text-xs hover:text-[#f6e09f] transition-colors">
                      {mosque.phone}
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <a href={`mailto:${mosque.email}`} className="text-xs hover:text-[#f6e09f] transition-colors">
                        {mosque.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <a href={mosque.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-[#f6e09f] transition-colors">
                        moschee-rostock.de
                      </a>
                    </div>
                  </div>
                </div>

                {/* Ramadan Schedule Specifics */}
                <div className="my-5 space-y-3 bg-[#061c15] p-4 rounded-xl border border-[#163e30]">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#f6e09f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-xs block mb-0.5">{t.tarawihTimeLabel}</strong>
                      <span className="text-xs text-[#a3c7b8]">{lang === 'ar' ? mosque.tarawihTime : mosque.tarawihTimeDe}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-[#f6e09f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-xs block mb-0.5">{t.jummahTimeLabel}</strong>
                      <span className="text-xs text-[#a3c7b8]">{lang === 'ar' ? mosque.jummahTime : mosque.jummahTimeDe}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-[#f6e09f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-xs block mb-0.5">{t.iftarProgramLabel}</strong>
                      <span className="text-xs text-[#a3c7b8]">{lang === 'ar' ? mosque.iftarDays : mosque.iftarDaysDe}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6 space-y-2">
                  <h4 className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                    {lang === 'ar' ? 'خدمات وبرامج المسجد في رمضان:' : 'Angebote im Ramadan:'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#c5ded2]">
                    {(lang === 'ar' ? mosque.features : mosque.featuresDe).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Get Directions Action Button */}
              <a
                href={mosque.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#103a2e] hover:bg-[#184d3d] text-[#f6e09f] border border-[#d4af37]/40 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{t.getDirections}</span>
              </a>

            </div>
          ))}
        </div>

        {/* Community Welcoming Callout */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0d3428] via-[#09251c] to-[#0d3428] border border-[#d4af37]/30 p-6 text-center max-w-3xl mx-auto shadow-lg">
          <p className="text-sm sm:text-base text-white font-medium font-cairo">
            « {t.communityMessage} »
          </p>
        </div>

      </div>
    </section>
  );
};
