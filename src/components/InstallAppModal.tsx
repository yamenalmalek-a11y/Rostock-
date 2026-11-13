import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../utils/translations';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  Copy,
  Check,
  WifiOff,
  CheckCircle2,
  Compass,
  MessageCircle,
  QrCode
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

function getBaseOriginPath(): string {
  if (typeof window === 'undefined') return '';
  const { protocol, host, pathname } = window.location;
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
  return `${protocol}//${host}${cleanPath}`;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose, lang }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [installFeedback, setInstallFeedback] = useState<'idle' | 'accepted' | 'dismissed'>('idle');
  const [customBaseUrl, setCustomBaseUrl] = useState(() => getBaseOriginPath());
  const isDevPreview = typeof window !== 'undefined' && window.location.hostname.startsWith('ais-dev-');

  useEffect(() => {
    if (isOpen && !customBaseUrl) {
      setCustomBaseUrl(getBaseOriginPath());
    }
  }, [isOpen, customBaseUrl]);

  const installLink = useMemo(() => {
    const base = (customBaseUrl.trim() || getBaseOriginPath()).replace(/\/+$/, '');
    const params = new URLSearchParams();
    params.set('install', '1');
    if (lang !== 'ar') params.set('lang', lang);
    return `${base}/?${params.toString()}`;
  }, [customBaseUrl, lang]);

  useEffect(() => {
    if (!isOpen || !installLink) return;
    QRCode.toDataURL(installLink, {
      width: 280,
      margin: 2,
      color: { dark: '#063222', light: '#fcf8ee' }
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [isOpen, installLink]);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') {
      setInstallFeedback('accepted');
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#10b981', '#f6e09f']
      });
    } else if (outcome === 'dismissed') {
      setInstallFeedback('dismissed');
    }
  };

  const handleCopyInstallLink = async () => {
    try {
      await navigator.clipboard.writeText(installLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const whatsappInstallHref = `https://wa.me/?text=${encodeURIComponent(
    lang === 'ar'
      ? `📲 رابط تثبيت تطبيق الرابطة الإسلامية في روستوك (مواقيت الصلاة لـ 10 سنوات وإمساكية رمضان وبطاقات التهنئة) على أندرويد وآيفون مجاناً وبدون متجر:\n${installLink}`
      : `📲 App-Installationslink des Islamischen Bundes Rostock e.V. (10-Jahres-Gebetszeiten, Imsakiya & Grußkarten) für Android & iPhone:\n${installLink}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#081e17] border border-[#d4af37]/50 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1b4335]">
          <div className="flex items-center gap-3.5">
            <img
              src="/pwa-192x192.png"
              alt="IB Rostock App Icon"
              className="w-14 h-14 rounded-2xl border border-[#d4af37]/70 shadow-lg shrink-0 object-cover"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-cairo">
                {lang === 'ar'
                  ? 'تثبيت تطبيق الرابطة الإسلامية روستوك'
                  : 'App installieren (Android & iPhone)'}
              </h3>
              <p className="text-xs text-[#9bbbae] mt-0.5">
                {lang === 'ar'
                  ? 'يعمل على شاشة الهاتف الرئيسية مع المواقيت بدون إنترنت (PWA)'
                  : 'Direkt auf dem Homescreen speichern – Gebetszeiten auch offline verfügbar'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0d2e23] hover:bg-[#164636] text-[#c7ddd3] hover:text-white shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Already Installed State */}
        {(isInstalled || installFeedback === 'accepted') && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/50 flex items-center gap-3 text-emerald-100 text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'التطبيق مثبت بالفعل ويعمل بوضع التطبيق الكامل على جهازك!'
                : 'Die App ist bereits installiert und läuft im Vollbildmodus auf Ihrem Gerät!'}
            </span>
          </div>
        )}

        {/* Dev preview notice */}
        {isDevPreview && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#1f291c] border border-[#d4af37]/60 text-xs text-[#f3ead0] leading-relaxed space-y-2">
            <div className="font-bold text-[#f6e09f]">
              {lang === 'ar' ? '⚠️ تنبيه لتجنب خطأ 403 عند فتح الرابط على الهاتف:' : '⚠️ Wichtiger Hinweis gegen Fehler 403:'}
            </div>
            <p>
              {lang === 'ar'
                ? 'لا ترسل رابط aistudio.google.com/app/... أو رابط المعاينة ais-dev-... للآخرين لأنها محمية بحسابك الشخصي وتعطي خطأ 403. انشر التطبيق أولاً عبر Deploy (Cloud Run بالوصول العام) أو ارفعه على Netlify/Vercel، ثم الصق الرابط المنشور في الحقل أدناه لتوليد رابط التثبيت الصحيح:'
                : 'Senden Sie nicht den Editor-Link (aistudio.google.com/app/...) oder ais-dev-.... Veröffentlichen Sie die App zuerst (Cloud Run öffentlich / Netlify / Vercel) und tragen Sie die URL hier ein:'}
            </p>
            <input
              type="url"
              dir="ltr"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="https://your-public-site.netlify.app"
              className="w-full px-3 py-1.5 rounded-lg bg-[#04120d] border border-[#d4af37]/40 text-xs font-mono text-[#f6e09f] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        )}

        {/* Direct Shareable Install Link & QR */}
        <div className="mt-5 p-4 rounded-xl bg-[#05140f] border border-[#1a4335] space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#f6e09f] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <span>
                {lang === 'ar'
                  ? 'رابط التنزيل والتثبيت المباشر للهاتف (Android & iPhone):'
                  : 'Direkter App-Installationslink für Android & iPhone:'}
              </span>
            </span>
            <a
              href={whatsappInstallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#113d2e] hover:bg-[#17523e] border border-emerald-500/35 text-emerald-300 text-[11px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إرسال عبر واتساب' : 'Per WhatsApp senden'}</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={installLink}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              dir="ltr"
              className="flex-1 px-3 py-2 rounded-xl bg-[#030d09] border border-[#d4af37]/35 text-xs font-mono text-[#f6e09f] focus:outline-none select-all"
            />
            <button
              onClick={handleCopyInstallLink}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all whitespace-nowrap ${
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

        {/* Platform Guides: Android + iPhone */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Android Card */}
          <div className={`p-4 rounded-xl border transition-colors flex flex-col justify-between ${
            isAndroid
              ? 'bg-[#0c2d22] border-[#d4af37]/70 shadow-lg shadow-[#d4af37]/10'
              : 'bg-[#071913] border-[#193d30]'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-white flex items-center gap-2 font-cairo">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Android (أندرويد)</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-300">Chrome / Edge</span>
              </div>

              {isInstallable && !isInstalled ? (
                <button
                  onClick={handleDirectInstall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] hover:brightness-110 text-[#061510] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تثبيت التطبيق الآن (ضغطة واحدة)' : 'Jetzt auf Android installieren'}</span>
                </button>
              ) : null}

              <ol className="text-xs text-[#cde0d8] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#133b2d] text-[#f6e09f] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span>
                    {lang === 'ar'
                      ? 'افتح الرابط في متصفح Chrome على هاتف الأندرويد.'
                      : 'Öffnen Sie den Link in Google Chrome auf Android.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#133b2d] text-[#f6e09f] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span className="flex flex-wrap items-center gap-1">
                    {lang === 'ar' ? (
                      <>
                        <span>اضغط زر القائمة</span>
                        <MoreVertical className="w-3.5 h-3.5 text-[#d4af37] inline" />
                        <span>أعلى الشاشة ثم اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة للشاشة الرئيسية»</strong>.</span>
                      </>
                    ) : (
                      <>
                        <span>Tippen Sie oben auf</span>
                        <MoreVertical className="w-3.5 h-3.5 text-[#d4af37] inline" />
                        <span>und wählen Sie <strong>„App installieren“</strong>.</span>
                      </>
                    )}
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* iPhone / iPad Card */}
          <div className={`p-4 rounded-xl border transition-colors ${
            isIOS
              ? 'bg-[#0c2d22] border-[#d4af37]/70 shadow-lg shadow-[#d4af37]/10'
              : 'bg-[#071913] border-[#193d30]'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-white flex items-center gap-2 font-cairo">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span>iPhone & iPad (آيفون)</span>
                </span>
                <span className="text-[11px] font-medium text-sky-300">Safari</span>
              </div>

              <ol className="text-xs text-[#cde0d8] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#133b2d] text-[#f6e09f] font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <span className="flex flex-wrap items-center gap-1">
                    {lang === 'ar' ? (
                      <>
                        <span>افتح الرابط في متصفح <strong>Safari</strong></span>
                        <Compass className="w-3.5 h-3.5 text-sky-400 inline" />
                        <span>على الآيفون.</span>
                      </>
                    ) : (
                      <>
                        <span>Öffnen Sie den Link in <strong>Safari</strong></span>
                        <Compass className="w-3.5 h-3.5 text-sky-400 inline" />
                        <span>auf dem iPhone.</span>
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#133b2d] text-[#f6e09f] font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <span className="flex flex-wrap items-center gap-1">
                    {lang === 'ar' ? (
                      <>
                        <span>اضغط زر المشاركة</span>
                        <Share className="w-3.5 h-3.5 text-sky-400 inline" />
                        <span>في الشريط السفلي.</span>
                      </>
                    ) : (
                      <>
                        <span>Tippen Sie unten auf <strong>Teilen</strong></span>
                        <Share className="w-3.5 h-3.5 text-sky-400 inline" />
                        <span>.</span>
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#133b2d] text-[#f6e09f] font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <span className="flex flex-wrap items-center gap-1">
                    {lang === 'ar' ? (
                      <>
                        <span>مرر واختر</span>
                        <PlusSquare className="w-3.5 h-3.5 text-[#d4af37] inline" />
                        <span><strong>«إضافة إلى الشاشة الرئيسية»</strong> ثم «إضافة».</span>
                      </>
                    ) : (
                      <>
                        <span>Wählen Sie</span>
                        <PlusSquare className="w-3.5 h-3.5 text-[#d4af37] inline" />
                        <span><strong>„Zum Home-Bildschirm“</strong> → „Hinzufügen“.</span>
                      </>
                    )}
                  </span>
                </li>
              </ol>
            </div>
          </div>

        </div>

        {/* QR Code for Instant Phone Camera Scan */}
        {qrDataUrl && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#05140f] border border-[#1a4335] flex items-center gap-4">
            <div className="p-1.5 rounded-xl bg-[#fcf8ee] border border-[#d4af37]/60 shrink-0">
              <img src={qrDataUrl} alt="Install QR" className="w-20 h-20 rounded" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-[#f6e09f] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'ar' ? 'مسح سريع بكاميرا الهاتف للتثبيت' : 'Mit Handykamera scannen & installieren'}</span>
              </div>
              <p className="text-[11px] text-[#9ec2b4] leading-relaxed">
                {lang === 'ar'
                  ? 'امسح الرمز بكاميرا الآيفون أو الأندرويد لفتح صفحة التثبيت المباشر فوراً وإضافة أيقونة الرابطة الإسلامية لشاشة الهاتف.'
                  : 'Einfach mit der Kamera scannen, um den Installationsbildschirm direkt auf Android oder iPhone zu öffnen.'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

interface PWAInstallButtonProps {
  lang: Language;
  onOpenModal: () => void;
  variant?: 'header' | 'footer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  onOpenModal,
  variant = 'header'
}) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();

  if (isInstalled) return null;

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  if (variant === 'footer') {
    return (
      <button
        onClick={handleClick}
        className="hover:text-[#d4af37] text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{lang === 'ar' ? 'تثبيت التطبيق (Android / iPhone)' : 'App installieren (Android / iOS)'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#0d3326] hover:bg-[#134735] text-emerald-200 hover:text-white border border-emerald-500/40 hover:border-[#d4af37] transition-all text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap"
      title={lang === 'ar' ? 'تثبيت التطبيق على الهاتف' : 'App auf Smartphone installieren'}
    >
      <Download className="w-4 h-4 text-[#d4af37]" />
      <span className="hidden lg:inline">{lang === 'ar' ? 'تثبيت التطبيق' : 'App'}</span>
    </button>
  );
};

export const OfflineIndicator: React.FC<{ lang: Language }> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50 px-4 py-2.5 rounded-xl bg-[#1a221d]/95 border border-amber-400/50 text-amber-100 text-xs font-medium shadow-xl flex items-center gap-2.5 backdrop-blur-md">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        {lang === 'ar'
          ? 'أنت حالياً دون اتصال بالإنترنت — مواقيت الصلاة والبطاقات تعمل محلياً.'
          : 'Offline-Modus aktiv — Gebetszeiten und Grußkarten bleiben verfügbar.'}
      </span>
    </div>
  );
};
