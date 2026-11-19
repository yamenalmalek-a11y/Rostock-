import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import {
  HERO_OCCASION_PRESETS,
  HeroProclamationConfig,
  loadHeroConfig,
  saveHeroConfig,
  resetHeroConfig
} from '../utils/heroProclamation';
import { AssociationLogo } from './AssociationLogo';
import {
  Sparkles,
  Volume2,
  Share2,
  Calendar,
  PenLine,
  Pin,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

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
  const [config, setConfig] = useState<HeroProclamationConfig>(() => loadHeroConfig());
  const [isEditing, setIsEditing] = useState(false);
  const [editLangTab, setEditLangTab] = useState<Language>(lang);
  const [pinSavedToast, setPinSavedToast] = useState(false);

  useEffect(() => {
    setEditLangTab(lang);
  }, [lang]);

  const updateField = <K extends keyof HeroProclamationConfig>(
    key: K,
    value: HeroProclamationConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      presetId: 'custom',
      [key]: value
    }));
  };

  const handleSelectPreset = (presetId: (typeof HERO_OCCASION_PRESETS)[number]['id']) => {
    const found = HERO_OCCASION_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    const nextConfig = found.buildConfig();
    setConfig(nextConfig);
  };

  const handlePinAndSave = () => {
    const pinnedConfig: HeroProclamationConfig = { ...config, pinned: true };
    setConfig(pinnedConfig);
    saveHeroConfig(pinnedConfig);
    setPinSavedToast(true);
    setTimeout(() => {
      setPinSavedToast(false);
      setIsEditing(false);
    }, 1100);
  };

  const handleResetDefault = () => {
    const def = resetHeroConfig();
    setConfig(def);
    setPinSavedToast(false);
  };

  const isAr = lang === 'ar';
  const activeBadge = isAr ? config.badgeAr : config.badgeDe;
  const activeHeadline = isAr ? config.headlineAr : config.headlineDe;
  const activeSubtitle = isAr ? config.subtitleAr : config.subtitleDe;
  const activeAyahIntro = isAr ? config.ayahIntroAr : config.ayahIntroDe;
  const activeAyahText = isAr ? config.ayahTextAr : config.ayahTextDe;
  const activeAyahRef = isAr ? config.ayahRefAr : config.ayahRefDe;
  const activePreamble = isAr ? config.preambleAr : config.preambleDe;
  const activeMosques = isAr ? config.mosquesMentionedAr : config.mosquesMentionedDe;
  const activeBody = isAr ? config.bodyAr : config.bodyDe;
  const activeDua = isAr ? config.duaAr : config.duaDe;

  return (
    <section id="proclamation" className="scroll-mt-20 relative py-7 sm:py-12 md:py-16 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#d4af37]/15 via-[#0e3b2e]/30 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Curatorial Header Stamp & Harmonious Official Logo Crest */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <AssociationLogo size="lg" className="mb-4 sm:mb-5" />

          {personalizedRecipient && (
            <div className="mb-3 sm:mb-4 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#144736]/90 via-[#1b5a45]/95 to-[#144736]/90 border border-[#d4af37]/60 text-[#f6e09f] text-xs sm:text-base font-bold shadow-lg font-cairo">
              {isAr
                ? `إهداء وتهنئة خاصة إلى: ${personalizedRecipient} 🌙`
                : `Persönliche Grüße an: ${personalizedRecipient} 🌙`}
            </div>
          )}

          {/* Top Badge + Customize/Pin Control Button */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#09251c]/90 text-[#f6e09f] text-[11px] sm:text-xs font-semibold tracking-wide shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>{activeBadge}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold transition-all shadow-sm ${
                isEditing
                  ? 'bg-[#d4af37] text-[#061510] border-[#d4af37]'
                  : config.pinned
                  ? 'bg-[#123d2f] text-[#f6e09f] border-[#d4af37]/60 hover:bg-[#195240]'
                  : 'bg-[#082118] text-[#cbe3d8] border-[#1f4d3d] hover:border-[#d4af37]/60 hover:text-[#f6e09f]'
              }`}
              title={isAr ? 'تحرير وتثبيت نص الواجهة حسب المناسبة' : 'Start-Bekanntmachung bearbeiten & anheften'}
            >
              {config.pinned && !isEditing ? (
                <Pin className="w-3 h-3 text-[#d4af37]" />
              ) : (
                <PenLine className="w-3 h-3" />
              )}
              <span>
                {isEditing
                  ? (isAr ? 'إغلاق المحرر' : 'Editor schließen')
                  : config.pinned
                  ? (isAr ? 'مُثبّت ✓ • تعديل التهنئة' : 'Angeheftet ✓ • Bearbeiten')
                  : (isAr ? 'تخصيص وتثبيت المناسبة' : 'Anlass bearbeiten & fixieren')}
              </span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 sm:mb-3 font-cairo">
            <span className="text-gold-gradient">{activeHeadline}</span>
          </h1>
          <p className="text-xs sm:text-base text-[#c5dacd] max-w-2xl font-normal px-2">
            {activeSubtitle}
          </p>
        </div>

        {/* Collapsible Live Customizer & Pin Studio */}
        {isEditing && (
          <div className="mb-6 sm:mb-8 rounded-2xl bg-[#071f17] border-2 border-[#d4af37]/60 shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#194536]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#f6e09f] font-cairo flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    {isAr
                      ? 'تحرير وتثبيت التهنئة الرسمية في بداية التطبيق'
                      : 'Startseiten-Grußbotschaft bearbeiten & dauerhaft fixieren'}
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#9dc0b2] mt-0.5">
                  {isAr
                    ? 'اختر المناسبة أو اكتب وعدّل أي عبارة يدوياً ثم اضغط «حفظ وتثبيت» لتبقى ظاهرة دائماً.'
                    : 'Wählen Sie einen Anlass oder passen Sie alle Texte manuell an und klicken Sie auf „Speichern & Fixieren“.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-[#0c2d22] text-[#a7c7b9] hover:text-white border border-[#1f4d3d]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Quick Occasion Presets */}
            <div>
              <label className="block text-xs font-bold text-[#d4af37] mb-2">
                {isAr ? 'قوالب جاهزة حسب المناسبة (تتحدث المعاينة فوراً):' : 'Schnellvorlagen nach Anlass:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HERO_OCCASION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition-all text-center ${
                      config.presetId === preset.id
                        ? 'bg-[#d4af37] text-[#061510] border-[#d4af37] shadow-md'
                        : 'bg-[#04140e] text-[#cfe4da] border-[#194234] hover:border-[#d4af37]/60'
                    }`}
                  >
                    {isAr ? preset.labelAr : preset.labelDe}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Language Edit Switcher (Edit Arabic or German smoothly) */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#04130d] px-3 py-2 rounded-xl border border-[#173d30]">
              <span className="text-xs font-semibold text-[#b8d4c8]">
                {isAr ? 'لغة الحقول التي تعدّلها الآن:' : 'Aktive Bearbeitungssprache:'}
              </span>
              <div className="inline-flex rounded-lg bg-[#082219] p-1 border border-[#1b4637]">
                <button
                  type="button"
                  onClick={() => setEditLangTab('ar')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    editLangTab === 'ar' ? 'bg-[#d4af37] text-[#061510]' : 'text-[#9ec2b4] hover:text-white'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setEditLangTab('de')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    editLangTab === 'de' ? 'bg-[#d4af37] text-[#061510]' : 'text-[#9ec2b4] hover:text-white'
                  }`}
                >
                  Deutsch
                </button>
              </div>
            </div>

            {/* 3. Manual Editable Fields for Active Language Tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir={editLangTab === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'العنوان الكبير في الأعلى (مثل: رمضان مبارك / عيد سعيد)' : 'Große Hauptüberschrift'}
                </label>
                <input
                  type="text"
                  value={editLangTab === 'ar' ? config.headlineAr : config.headlineDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'headlineAr' : 'headlineDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-white text-sm font-bold focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'الشارة العلوية (فوق العنوان)' : 'Oberes Hinweis-Abzeichen'}
                </label>
                <input
                  type="text"
                  value={editLangTab === 'ar' ? config.badgeAr : config.badgeDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'badgeAr' : 'badgeDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'الوصف الفرعي أسفل العنوان' : 'Untertitel unter der Überschrift'}
                </label>
                <input
                  type="text"
                  value={editLangTab === 'ar' ? config.subtitleAr : config.subtitleDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'subtitleAr' : 'subtitleDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'مقدمة الجهة المُعلِنة' : 'Einleitung des Absenders'}
                </label>
                <input
                  type="text"
                  value={editLangTab === 'ar' ? config.preambleAr : config.preambleDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'preambleAr' : 'preambleDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'اسم المساجد أو الجهة المُعلِنة' : 'Moscheen / Unterzeichner'}
                </label>
                <input
                  type="text"
                  value={editLangTab === 'ar' ? config.mosquesMentionedAr : config.mosquesMentionedDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'mosquesMentionedAr' : 'mosquesMentionedDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-[#f6e09f] text-xs sm:text-sm font-bold focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'نص التهنئة أو البيان الرئيسي' : 'Haupttext der Bekanntmachung / Grüße'}
                </label>
                <textarea
                  rows={2}
                  value={editLangTab === 'ar' ? config.bodyAr : config.bodyDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'bodyAr' : 'bodyDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-[#f6e09f] mb-1">
                  {editLangTab === 'ar' ? 'الدعاء الختامي أسفل البيان' : 'Abschließendes Bittgebet (Dua)'}
                </label>
                <textarea
                  rows={2}
                  value={editLangTab === 'ar' ? config.duaAr : config.duaDe}
                  onChange={(e) =>
                    updateField(editLangTab === 'ar' ? 'duaAr' : 'duaDe', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4a3a] text-[#d5ebdf] text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] leading-relaxed"
                />
              </div>

              {/* Ayah Section Controls */}
              <div className="md:col-span-2 bg-[#04130d] p-3 rounded-xl border border-[#173d30] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#f6e09f]">
                    <input
                      type="checkbox"
                      checked={config.showAyah}
                      onChange={(e) => updateField('showAyah', e.target.checked)}
                      className="accent-[#d4af37] w-4 h-4 rounded"
                    />
                    <span>{editLangTab === 'ar' ? 'إظهار مربع الآية القرآنية أو الذكر' : 'Koranvers-Bereich anzeigen'}</span>
                  </label>

                  {config.showAyah && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9ec2b4]">
                      <input
                        type="checkbox"
                        checked={config.showAyahAudio}
                        onChange={(e) => updateField('showAyahAudio', e.target.checked)}
                        className="accent-[#d4af37] w-4 h-4 rounded"
                      />
                      <span>{editLangTab === 'ar' ? 'إظهار زر تلاوة آية رمضان (البقرة 185)' : 'Audio-Schaltfläche (Sure 2:185)'}</span>
                    </label>
                  )}
                </div>

                {config.showAyah && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-[#9ec2b4] mb-1">
                        {editLangTab === 'ar' ? 'عبارة تقديم الآية / الحديث' : 'Einleitung zum Vers'}
                      </label>
                      <input
                        type="text"
                        value={editLangTab === 'ar' ? config.ayahIntroAr : config.ayahIntroDe}
                        onChange={(e) =>
                          updateField(editLangTab === 'ar' ? 'ayahIntroAr' : 'ayahIntroDe', e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#071c15] border border-[#194234] text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9ec2b4] mb-1">
                        {editLangTab === 'ar' ? 'اسم السورة أو المصدر' : 'Sure / Quellenangabe'}
                      </label>
                      <input
                        type="text"
                        value={editLangTab === 'ar' ? config.ayahRefAr : config.ayahRefDe}
                        onChange={(e) =>
                          updateField(editLangTab === 'ar' ? 'ayahRefAr' : 'ayahRefDe', e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#071c15] border border-[#194234] text-[#f6e09f] text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] text-[#9ec2b4] mb-1">
                        {editLangTab === 'ar' ? 'نص الآية الكريمة أو الذكر' : 'Vers- oder Textinhalt'}
                      </label>
                      <textarea
                        rows={2}
                        value={editLangTab === 'ar' ? config.ayahTextAr : config.ayahTextDe}
                        onChange={(e) =>
                          updateField(editLangTab === 'ar' ? 'ayahTextAr' : 'ayahTextDe', e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#071c15] border border-[#194234] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Editor Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#194536]">
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-4 py-2.5 rounded-xl bg-[#0b2a20] hover:bg-[#123d2e] text-[#b4d4c6] border border-[#1d4c3b] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'استعادة الافتراضي (رمضان)' : 'Auf Ramadan-Standard zurücksetzen'}</span>
              </button>

              <button
                type="button"
                onClick={handlePinAndSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/25 flex items-center gap-2 transition-all"
              >
                {pinSavedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'تم التثبيت والحفظ بنجاح!' : 'Erfolgreich gespeichert & fixiert!'}</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-4 h-4" />
                    <span>{isAr ? 'حفظ وتثبيت في التطبيق' : 'Speichern & dauerhaft fixieren'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* The Grand Proclamation Card with Ornate Arch Framing */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#0a2920] to-[#051711] border border-[#d4af37]/40 shadow-2xl overflow-hidden p-5 sm:p-10 md:p-12">
          {/* Ornate Corner Arabesques (SVG) */}
          <div className="absolute top-3 left-3 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-40 text-[#d4af37]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-x-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-y-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-40 text-[#d4af37] -scale-x-100 -scale-y-100">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 L100,0 C70,10 30,30 20,60 C10,90 0,100 0,100 Z" />
              <circle cx="25" cy="25" r="5" fill="#d4af37" />
            </svg>
          </div>

          {/* Central Quranic Verse / Quote Section */}
          {config.showAyah && (
            <div className="relative z-10 text-center max-w-4xl mx-auto mb-7 sm:mb-10 pb-6 sm:pb-8 border-b border-[#d4af37]/20">
              <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#124234] border border-[#d4af37]/60 text-[#f6e09f] mb-4 shadow-lg">
                <span className="font-amiri text-xl sm:text-2xl font-bold">﷽</span>
              </div>

              {activeAyahIntro && (
                <div className="text-[11px] sm:text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-3">
                  {activeAyahIntro}
                </div>
              )}

              <blockquote className="text-lg sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose text-[#fffaf0] font-amiri font-normal px-1 sm:px-6 my-3 sm:my-4 select-text">
                « {activeAyahText} »
              </blockquote>

              {activeAyahRef && (
                <div className="inline-block mt-2 sm:mt-3 px-4 py-1 rounded bg-[#092119] border border-[#d4af37]/30 text-xs sm:text-sm text-[#f6e09f] font-medium font-cairo">
                  ۞ {activeAyahRef} ۞
                </div>
              )}

              {config.showAyahAudio && (
                <div className="mt-5 flex items-center justify-center">
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
              )}
            </div>
          )}

          {/* Official Association & Mosques Announcement Text */}
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
            {(activePreamble || activeMosques) && (
              <div className="bg-[#082218]/90 rounded-xl p-4 sm:p-5 border border-[#d4af37]/30">
                {activePreamble && (
                  <p className="text-xs sm:text-base text-[#d8eae0] font-medium leading-relaxed font-cairo">
                    {activePreamble}
                  </p>
                )}
                {activeMosques && (
                  <h2 className="text-base sm:text-2xl font-bold text-[#f6e09f] mt-1 font-cairo tracking-wide">
                    {activeMosques}
                  </h2>
                )}
              </div>
            )}

            {activeBody && (
              <p className="text-sm sm:text-xl text-white font-medium leading-relaxed px-1 sm:px-4 font-cairo whitespace-pre-line">
                {activeBody}
              </p>
            )}

            {activeDua && (
              <div className="text-xs sm:text-base text-[#c2dfd1] leading-relaxed italic bg-emerald-950/30 rounded-xl p-3.5 sm:p-4 border border-emerald-800/30 whitespace-pre-line">
                « {activeDua} »
              </div>
            )}

            {/* Call to Actions */}
            <div className="pt-2 grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              <button
                onClick={onOpenPrayerTimes}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isAr ? 'مواقيت الصلاة والأذان في روستوك' : 'Gebetszeiten & Adhan für Rostock'}</span>
              </button>

              <button
                onClick={onOpenCardStudio}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0e3b2e] hover:bg-[#144f3e] text-[#f6e09f] border border-[#d4af37]/40 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? 'بطاقات التهنئة (جميع المناسبات الدينية)' : 'Grußkarten (Alle Anlässe)'}</span>
              </button>

              <button
                onClick={onOpenShare}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0a2b21] hover:bg-[#124234] text-white border border-[#d4af37]/40 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>{isAr ? 'مشاركة الموقع / التطبيق' : 'Website / App teilen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
