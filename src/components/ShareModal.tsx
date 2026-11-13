import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../utils/translations';
import { AssociationLogo } from './AssociationLogo';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Send,
  Mail,
  QrCode,
  Download,
  UserPlus,
  Link as LinkIcon,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenInstall?: () => void;
}

function getActiveBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  const { protocol, host, pathname } = window.location;
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
  return `${protocol}//${host}${cleanPath}`;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, lang, onOpenInstall }) => {
  const isDevPreview = typeof window !== 'undefined' && window.location.hostname.startsWith('ais-dev-');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(() => getActiveBaseUrl());
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [linkMode, setLinkMode] = useState<'website' | 'app'>('website');
  const [recipientForLink, setRecipientForLink] = useState('');
  const [linkLang, setLinkLang] = useState<Language>(lang);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    setLinkLang(lang);
  }, [lang]);

  useEffect(() => {
    if (isOpen && !customBaseUrl) {
      setCustomBaseUrl(getActiveBaseUrl());
    }
  }, [isOpen, customBaseUrl]);

  const shareUrl = useMemo(() => {
    const rawBase = (customBaseUrl.trim() || getActiveBaseUrl()).replace(/\/+$/, '');
    const params = new URLSearchParams();
    if (linkMode === 'app') {
      params.set('install', '1');
    }
    if (recipientForLink.trim()) {
      params.set('to', recipientForLink.trim());
    }
    if (linkLang !== 'ar') {
      params.set('lang', linkLang);
    }
    const qs = params.toString();
    return qs ? `${rawBase}/?${qs}` : `${rawBase}/`;
  }, [customBaseUrl, linkMode, recipientForLink, linkLang]);

  useEffect(() => {
    if (!isOpen || !shareUrl) return;
    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#063222',
        light: '#fcf8ee'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const shareMessage =
    linkMode === 'app'
      ? linkLang === 'ar'
        ? `${recipientForLink.trim() ? `إلى ${recipientForLink.trim()} 🌙\n` : ''}📲 رابط تنزيل وتثبيت تطبيق الرابطة الإسلامية في روستوك على هاتفك (أندرويد وآيفون) لمتابعة مواقيت الصلاة لـ 10 سنوات وإمساكية رمضان ومولد البطاقات مجاناً وبدون متجر:\n${shareUrl}`
        : `${recipientForLink.trim() ? `Für ${recipientForLink.trim()} 🌙\n` : ''}📲 App-Installationslink (Android & iPhone) des Islamischen Bundes Rostock e.V. mit 10-Jahres-Gebetszeiten, Imsakiya & Grußkarten-Studio:\n${shareUrl}`
      : linkLang === 'ar'
        ? `${recipientForLink.trim() ? `تهنئة خاصة إلى ${recipientForLink.trim()} 🌙\n` : ''}تهنئة بمناسبة حلول شهر رمضان المبارك من الرابطة الإسلامية في مدينة روستوك (مسجد روستوك الكبير ومسجد النور)، مع مواقيت الصلاة لـ 10 سنوات وإمساكية رمضان ومولد بطاقات التهنئة:\n${shareUrl}`
        : `${recipientForLink.trim() ? `Herzliche Grüße an ${recipientForLink.trim()} 🌙\n` : ''}Ramadan-Grußbotschaft des Islamischen Bundes Rostock e.V. (Große Moschee & An-Nur Moschee) mit 10-Jahres-Gebetszeiten, Imsakiya & Grußkarten-Studio:\n${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.55 },
        colors: ['#d4af37', '#10b981', '#f6e09f']
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback select
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lang === 'ar' ? 'رمضان مبارك • الرابطة الإسلامية في روستوك' : 'Ramadan Mubarak • Islamischer Bund Rostock e.V.',
          text: shareMessage,
          url: shareUrl
        });
      } catch {
        // User cancelled native share
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = linkMode === 'app' ? 'IB_Rostock_App_Install_QR.png' : 'Ramadan_Rostock_QR.png';
    link.href = qrDataUrl;
    link.click();
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    lang === 'ar' ? 'تهنئة شهر رمضان المبارك - الرابطة الإسلامية روستوك' : 'Ramadan Mubarak - Islamischer Bund Rostock e.V.'
  )}&body=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#081e17] border border-[#d4af37]/50 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl my-auto">
        
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1b4335]">
          <div className="flex items-center gap-3">
            <AssociationLogo size="sm" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-cairo">
                {lang === 'ar' ? 'مشاركة الموقع عبر رابط' : 'Website per Link teilen'}
              </h3>
              <p className="text-xs text-[#9bbbae]">
                {lang === 'ar'
                  ? 'أرسل التهنئة ومواقيت روستوك مع عائلتك وأصدقائك عبر رابط مباشر'
                  : 'Teilen Sie die Grußbotschaft & Gebetszeiten für Rostock per Direktlink'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0d2e23] hover:bg-[#164636] text-[#c7ddd3] hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Publishing Tip (Only visible to app owner in AI Studio dev preview) */}
        {isDevPreview && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#1f291c] border border-[#d4af37]/60 text-xs text-[#f3ead0] space-y-2 leading-relaxed">
            <div className="font-bold text-[#f6e09f]">
              {lang === 'ar'
                ? '⚠️ تنبيه مهم لتجنب خطأ 403 (ليس لديك صلاحية الوصول):'
                : '⚠️ Wichtiger Hinweis zur Vermeidung von Fehler 403:'}
            </div>
            <p>
              {lang === 'ar'
                ? 'رابط المتصفح (aistudio.google.com/app/...) ورابط المعاينة الحالي (ais-dev-...) محميان بحسابك الشخصي فقط، ولذلك يظهر خطأ 403 على الهواتف الأخرى. لنشر الموقع للجميع مجاناً وبدون تسجيل دخول: استخدم زر (Deploy to Cloud Run) مع تفعيل الوصول العام، أو حمّل التطبيق/اربطه بـ GitHub وارفعه على Netlify أو Vercel أو Cloudflare Pages، ثم الصق الرابط المنشور هنا.'
                : 'Der Editor-Link (aistudio.google.com/app/...) und die Dev-Vorschau (ais-dev-...) sind privat. Nutzen Sie „Deploy“ (Cloud Run mit öffentlichem Zugriff) oder hosten Sie den Build auf Netlify/Vercel/Cloudflare Pages und tragen Sie die öffentliche URL unten ein.'}
            </p>
            <button
              type="button"
              onClick={() => setShowUrlEditor(!showUrlEditor)}
              className="text-[11px] font-bold text-[#d4af37] underline underline-offset-2 hover:text-white"
            >
              {showUrlEditor
                ? (lang === 'ar' ? 'إخفاء خانة الرابط المنشور' : 'Basis-URL ausblenden')
                : (lang === 'ar' ? 'لصق رابط الموقع المنشور العام هنا (لتوليد الرابط والـ QR الصحيح)' : 'Öffentliche Website-URL hier eintragen')}
            </button>
          </div>
        )}

        {/* Link Mode Switcher: Website Greeting vs Mobile App Install */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 rounded-xl bg-[#04120d] border border-[#1a4335]">
          <button
            type="button"
            onClick={() => setLinkMode('website')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              linkMode === 'website'
                ? 'bg-[#103b2e] text-[#f6e09f] border border-[#d4af37]/60 shadow'
                : 'text-[#8db3a5] hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'رابط الموقع والتهنئة' : 'Website & Grußlink'}</span>
          </button>

          <button
            type="button"
            onClick={() => setLinkMode('app')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              linkMode === 'app'
                ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#103b2e] text-[#f6e09f] border border-[#d4af37]/80 shadow'
                : 'text-[#8db3a5] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{lang === 'ar' ? 'رابط تنزيل التطبيق (Android & iPhone)' : 'App-Link (Android & iPhone)'}</span>
          </button>
        </div>

        {/* Optional Personalization */}
        <div className="mt-4 space-y-4">
          {isDevPreview && showUrlEditor && (
            <div>
              <label className="block text-xs font-semibold text-[#b9d6c9] mb-1.5">
                {lang === 'ar' ? 'رابط الموقع المنشور:' : 'Veröffentlichte Basis-URL:'}
              </label>
              <input
                type="url"
                dir="ltr"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1d4638] text-xs font-mono text-[#cbe0d6] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] mb-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar' ? 'تخصيص الرابط باسم المستلم (اختياري)' : 'Link personalisieren (Optional)'}
                </span>
              </label>
              <input
                type="text"
                value={recipientForLink}
                onChange={(e) => setRecipientForLink(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: عائلة الكرام / أخي محمد' : 'z. B. Familie Ahmad'}
                className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1d4638] text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d4af37] mb-1.5">
                {lang === 'ar' ? 'لغة الفتح' : 'Startsprache'}
              </label>
              <select
                value={linkLang}
                onChange={(e) => setLinkLang(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1d4638] text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="ar">العربية</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          {/* Copy Link Input Box */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#b9d6c9]">
                {linkMode === 'app' ? (
                  <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
                ) : (
                  <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                )}
                <span>
                  {linkMode === 'app'
                    ? (lang === 'ar' ? 'رابط تنزيل التطبيق للهاتف (Android & iPhone):' : 'Direkter App-Installationslink:')
                    : (lang === 'ar' ? 'رابط المشاركة المباشر:' : 'Direktlink zum Teilen:')}
                </span>
              </label>

              {linkMode === 'app' && onOpenInstall && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenInstall();
                  }}
                  className="text-[11px] font-semibold text-[#d4af37] hover:text-white underline underline-offset-2 whitespace-nowrap"
                >
                  {lang === 'ar' ? 'فتح نافذة التثبيت' : 'Installationshilfe öffnen'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                dir="ltr"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#04120d] border border-[#d4af37]/40 text-xs font-mono text-[#f6e09f] focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                  copied
                    ? 'bg-emerald-500 text-[#04150e]'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] hover:brightness-110'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Kopiert!') : (lang === 'ar' ? 'نسخ الرابط' : 'Kopieren')}</span>
              </button>
            </div>
          </div>

          {/* Direct Share Channels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#113d2e] hover:bg-[#17523e] border border-emerald-500/30 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#0f2c42] hover:bg-[#163f5e] border border-sky-400/30 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </a>

            <a
              href={mailHref}
              className="py-2.5 px-3 rounded-xl bg-[#1a2c26] hover:bg-[#233b33] border border-[#d4af37]/30 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#f6e09f]" />
              <span>{lang === 'ar' ? 'بريد' : 'E-Mail'}</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 rounded-xl bg-[#12382c] hover:bg-[#194c3c] border border-[#d4af37]/50 text-[#f6e09f] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'مشاركة أخرى' : 'Mehr...'}</span>
            </button>
          </div>

          {/* QR Code Box for Mosque Posters / Quick Scan */}
          {qrDataUrl && (
            <div className="mt-4 p-4 rounded-xl bg-[#05140f] border border-[#1a4335] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-[#fcf8ee] border border-[#d4af37]/60 shadow-md shrink-0">
                  <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 rounded-md" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#f6e09f]">
                    <QrCode className="w-4 h-4 text-[#d4af37]" />
                    <span>
                      {linkMode === 'app'
                        ? (lang === 'ar' ? 'رمز QR لتثبيت التطبيق على الهاتف' : 'QR-Code für direkte App-Installation')
                        : (lang === 'ar' ? 'رمز QR للطباعة أو المسح السريع' : 'QR-Code zum Scannen & Drucken')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9ec2b4] leading-relaxed">
                    {linkMode === 'app'
                      ? (lang === 'ar'
                        ? 'عند مسح هذا الرمز بكاميرا الآيفون أو الأندرويد، يُفتح دليل تثبيت التطبيق المباشر على شاشة الهاتف.'
                        : 'Mit iPhone oder Android scannen, um die App-Installationsanleitung direkt auf dem Smartphone zu öffnen.')
                      : (lang === 'ar'
                        ? 'يمكنك تنزيل رمز QR وتعليقه في المسجد ليفتح المصلون المواقيت والتهنئة بهواتفهم فوراً.'
                        : 'Ideal zum Aushängen in der Moschee oder für direkte Einladungen.')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadQr}
                className="px-3.5 py-2 rounded-lg bg-[#10382b] hover:bg-[#164b3a] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تنزيل QR' : 'QR laden'}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
