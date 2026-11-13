import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TRANSLATIONS, CARD_BLESSINGS, Language } from '../utils/translations';
import { getUpcomingRamadans } from '../utils/prayerTimes';
import { loadAssociationLogo, drawHarmoniousLogoCrest } from '../utils/scheduleExporter';
import { Download, Share2, Check, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardGeneratorProps {
  lang: Language;
}

type TemplateId =
  | 'emerald_arch'
  | 'midnight_celestial'
  | 'ivory_manuscript'
  | 'andalus_lantern'
  | 'turquoise_mosaic'
  | 'rose_dawn';

interface TemplateConfig {
  id: TemplateId;
  nameAr: string;
  nameDe: string;
  bgGradient: [string, string, string];
  borderColor: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  swatchColor: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'emerald_arch',
    nameAr: 'محراب الزمرد والفوانيس',
    nameDe: 'Smaragd-Mihrab & Laternen',
    bgGradient: ['#092e22', '#041811', '#020b07'],
    borderColor: '#d4af37',
    accentColor: '#f6e09f',
    textColor: '#ffffff',
    secondaryTextColor: '#cbe4d7',
    swatchColor: '#0e4533'
  },
  {
    id: 'midnight_celestial',
    nameAr: 'ليلة الهلال وأفق المسجد',
    nameDe: 'Mitternacht & Moschee-Silhouette',
    bgGradient: ['#102240', '#060f1f', '#02060d'],
    borderColor: '#93c5fd',
    accentColor: '#fde68a',
    textColor: '#ffffff',
    secondaryTextColor: '#bfdbfe',
    swatchColor: '#16335e'
  },
  {
    id: 'ivory_manuscript',
    nameAr: 'مخطوطة اللؤلؤ والذهب',
    nameDe: 'Elfenbein-Manuskript & Gold',
    bgGradient: ['#fcf9f2', '#f2eadc', '#e6dac5'],
    borderColor: '#b38720',
    accentColor: '#0d4030',
    textColor: '#1b1a17',
    secondaryTextColor: '#48453e',
    swatchColor: '#f2eadc'
  },
  {
    id: 'andalus_lantern',
    nameAr: 'الأندلس والبرونز الدافئ',
    nameDe: 'Andalusische Bronze-Laternen',
    bgGradient: ['#2d1911', '#1a0d08', '#0d0503'],
    borderColor: '#e59252',
    accentColor: '#fcd34d',
    textColor: '#ffffff',
    secondaryTextColor: '#e2cfc4',
    swatchColor: '#5c2d19'
  },
  {
    id: 'turquoise_mosaic',
    nameAr: 'فسيفساء الزبرجد والنجمة',
    nameDe: 'Türkis-Mosaik & Stern',
    bgGradient: ['#0b353c', '#051e24', '#021014'],
    borderColor: '#5eead4',
    accentColor: '#f5d061',
    textColor: '#ffffff',
    secondaryTextColor: '#bae6e0',
    swatchColor: '#0d4a54'
  },
  {
    id: 'rose_dawn',
    nameAr: 'فجر الياقوت والذهب الوردي',
    nameDe: 'Saphir-Pflaume & Roségold',
    bgGradient: ['#2b1326', '#180916', '#0c040b'],
    borderColor: '#eab39a',
    accentColor: '#fce7d6',
    textColor: '#ffffff',
    secondaryTextColor: '#e6cad8',
    swatchColor: '#521f48'
  }
];

function drawLantern(ctx: CanvasRenderingContext2D, x: number, topY: number, scale: number, color: string, glowColor: string) {
  ctx.save();
  ctx.translate(x, topY);
  ctx.scale(scale, scale);

  // Hanging chain
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -100);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // Warm lantern glow
  const glow = ctx.createRadialGradient(0, 38, 4, 0, 38, 65);
  glow.addColorStop(0, `${glowColor}66`);
  glow.addColorStop(1, `${glowColor}00`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 38, 65, 0, Math.PI * 2);
  ctx.fill();

  // Cap dome
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-14, 16);
  ctx.quadraticCurveTo(0, -4, 14, 16);
  ctx.closePath();
  ctx.fill();

  // Body hexagon
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = `${glowColor}33`;
  ctx.beginPath();
  ctx.moveTo(-18, 16);
  ctx.lineTo(18, 16);
  ctx.lineTo(14, 56);
  ctx.lineTo(-14, 56);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner glass lines
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(0, 56);
  ctx.stroke();

  // Bottom tip
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-10, 56);
  ctx.lineTo(10, 56);
  ctx.lineTo(0, 70);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawEightPointStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let r = 0; r < 2; r++) {
    ctx.save();
    ctx.rotate((r * Math.PI) / 4);
    ctx.strokeRect(-radius / Math.SQRT2, -radius / Math.SQRT2, (radius * 2) / Math.SQRT2, (radius * 2) / Math.SQRT2);
    ctx.restore();
  }
  ctx.restore();
}

export const CardGenerator: React.FC<CardGeneratorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [recipientName, setRecipientName] = useState(lang === 'ar' ? 'الأهل والأصدقاء الكرام' : 'Familie und Freunde');
  const [senderName, setSenderName] = useState(lang === 'ar' ? 'الرابطة الإسلامية في مدينة روستوك' : 'Islamischer Bund Rostock e.V.');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('emerald_arch');
  const [selectedBlessingIndex, setSelectedBlessingIndex] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [copied, setCopied] = useState(false);
  const nextRamadan = useMemo(() => getUpcomingRamadans().currentOrNext, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const logoImg = includeLogo ? await loadAssociationLogo() : null;

    const width = 1200;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    const tmpl = TEMPLATES.find((item) => item.id === selectedTemplate) || TEMPLATES[0];

    // 1. Background gradient
    const grad = ctx.createRadialGradient(width / 2, height * 0.34, 40, width / 2, height / 2, width * 0.72);
    grad.addColorStop(0, tmpl.bgGradient[0]);
    grad.addColorStop(0.55, tmpl.bgGradient[1]);
    grad.addColorStop(1, tmpl.bgGradient[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Design-specific background artwork
    if (tmpl.id === 'emerald_arch') {
      // Grand pointed Mihrab arch behind content
      ctx.save();
      ctx.strokeStyle = `${tmpl.borderColor}88`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, 1120);
      ctx.lineTo(150, 420);
      ctx.bezierCurveTo(150, 210, 420, 120, 600, 82);
      ctx.bezierCurveTo(780, 120, 1050, 210, 1050, 420);
      ctx.lineTo(1050, 1120);
      ctx.stroke();

      ctx.strokeStyle = `${tmpl.borderColor}35`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(175, 1105);
      ctx.lineTo(175, 430);
      ctx.bezierCurveTo(175, 235, 430, 145, 600, 108);
      ctx.bezierCurveTo(770, 145, 1025, 235, 1025, 430);
      ctx.lineTo(1025, 1105);
      ctx.stroke();
      ctx.restore();

      drawLantern(ctx, 240, 150, 1.05, tmpl.borderColor, tmpl.accentColor);
      drawLantern(ctx, 960, 150, 1.05, tmpl.borderColor, tmpl.accentColor);
    } else if (tmpl.id === 'midnight_celestial') {
      // Twinkling stars
      for (let i = 0; i < 85; i++) {
        const sx = ((i * 317) % (width - 140)) + 70;
        const sy = ((i * 193) % 720) + 70;
        const sr = (i % 3) + 1;
        ctx.fillStyle = i % 4 === 0 ? `${tmpl.accentColor}aa` : `${tmpl.borderColor}55`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      // Subtle mosque dome & minaret silhouette along bottom
      ctx.save();
      ctx.fillStyle = '#030812';
      ctx.beginPath();
      ctx.moveTo(60, 1140);
      ctx.lineTo(60, 1045);
      ctx.lineTo(180, 1045);
      ctx.lineTo(180, 960);
      ctx.lineTo(205, 920);
      ctx.lineTo(230, 960);
      ctx.lineTo(230, 1045);
      ctx.lineTo(440, 1045);
      ctx.quadraticCurveTo(600, 900, 760, 1045);
      ctx.lineTo(970, 1045);
      ctx.lineTo(970, 960);
      ctx.lineTo(995, 920);
      ctx.lineTo(1020, 960);
      ctx.lineTo(1020, 1045);
      ctx.lineTo(1140, 1045);
      ctx.lineTo(1140, 1140);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (tmpl.id === 'ivory_manuscript') {
      // Ottoman Shamsa geometric rosette watermark behind header
      ctx.save();
      ctx.translate(600, 600);
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.strokeStyle = `${tmpl.borderColor}20`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 210, 75, 190, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (tmpl.id === 'andalus_lantern') {
      // Geometric star medallions + twin glowing lanterns
      drawEightPointStar(ctx, 210, 210, 65, `${tmpl.borderColor}44`);
      drawEightPointStar(ctx, 990, 210, 65, `${tmpl.borderColor}44`);
      drawLantern(ctx, 195, 175, 1.15, tmpl.borderColor, tmpl.accentColor);
      drawLantern(ctx, 1005, 175, 1.15, tmpl.borderColor, tmpl.accentColor);
    } else if (tmpl.id === 'turquoise_mosaic') {
      // Large central 8-pointed mosaic star lattice
      drawEightPointStar(ctx, 600, 560, 390, `${tmpl.borderColor}1e`);
      drawEightPointStar(ctx, 600, 560, 340, `${tmpl.accentColor}22`);
      drawEightPointStar(ctx, 175, 175, 42, `${tmpl.borderColor}55`);
      drawEightPointStar(ctx, 1025, 175, 42, `${tmpl.borderColor}55`);
    } else if (tmpl.id === 'rose_dawn') {
      // Soft concentric golden wreath circles
      ctx.save();
      ctx.strokeStyle = `${tmpl.borderColor}33`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(600, 575, 455, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `${tmpl.accentColor}25`;
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.arc(600, 575, 435, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Outer Luxury Frame & Corners
    ctx.lineWidth = 4;
    ctx.strokeStyle = tmpl.borderColor;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `${tmpl.borderColor}66`;
    ctx.strokeRect(58, 58, width - 116, height - 116);

    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = tmpl.borderColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 44);
      ctx.lineTo(0, 0);
      ctx.lineTo(44, 0);
      ctx.stroke();

      ctx.fillStyle = tmpl.accentColor;
      ctx.beginPath();
      ctx.arc(16, 16, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(58, 58, 0);
    drawCorner(width - 58, 58, Math.PI / 2);
    drawCorner(width - 58, height - 58, Math.PI);
    drawCorner(58, height - 58, -Math.PI / 2);

    // 4. Top Emblem: Harmoniously blended Association Logo Seal or Crescent Motif
    if (includeLogo && logoImg) {
      drawHarmoniousLogoCrest(
        ctx,
        logoImg,
        width / 2,
        152,
        66,
        tmpl.borderColor,
        tmpl.id === 'ivory_manuscript'
      );
    } else {
      ctx.save();
      ctx.fillStyle = tmpl.accentColor;
      ctx.beginPath();
      ctx.arc(600, 140, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tmpl.bgGradient[0];
      ctx.beginPath();
      ctx.arc(609, 134, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Header Calligraphy "رمضان مبارك"
    ctx.textAlign = 'center';
    ctx.fillStyle = tmpl.accentColor;
    ctx.font = 'bold 76px "Amiri", "Cinzel", serif';
    ctx.fillText('رَمَضَانُ مُبَارَك', width / 2, 300);

    ctx.font = '600 26px "Cinzel", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.borderColor;
    ctx.fillText('RAMADAN MUBARAK', width / 2, 348);

    // Divider with Islamic star
    ctx.strokeStyle = `${tmpl.borderColor}88`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(360, 382);
    ctx.lineTo(560, 382);
    ctx.moveTo(640, 382);
    ctx.lineTo(840, 382);
    ctx.stroke();

    ctx.fillStyle = tmpl.accentColor;
    ctx.font = '24px serif';
    ctx.fillText('۞', width / 2, 390);

    // 6. Recipient Name Box
    if (recipientName.trim()) {
      ctx.fillStyle = tmpl.id === 'ivory_manuscript' ? '#ffffffdd' : `${tmpl.bgGradient[0]}dd`;
      ctx.strokeStyle = `${tmpl.borderColor}99`;
      ctx.lineWidth = 2;
      const boxW = Math.min(860, Math.max(520, recipientName.length * 28 + 130));
      ctx.beginPath();
      ctx.roundRect((width - boxW) / 2, 430, boxW, 86, 16);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 38px "Cairo", "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = tmpl.textColor;
      ctx.fillText(recipientName, width / 2, 488);
    }

    // 7. Blessing Message (Multi-line wrap)
    const activeBlessing = customMessage.trim()
      ? customMessage
      : (lang === 'ar'
          ? CARD_BLESSINGS[selectedBlessingIndex].ar
          : CARD_BLESSINGS[selectedBlessingIndex].de);

    ctx.font = 'normal 33px "Amiri", "Plus Jakarta Sans", serif';
    ctx.fillStyle = tmpl.secondaryTextColor;

    const words = activeBlessing.split(' ');
    let line = '';
    const maxLineW = 840;
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxLineW && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let startY = 585;
    for (const l of lines) {
      ctx.fillText(l.trim(), width / 2, startY);
      startY += 52;
    }

    // 8. Quran Ayah Reference Footer inside Card
    ctx.font = 'italic 24px "Amiri", "Plus Jakarta Sans", serif';
    ctx.fillStyle = tmpl.borderColor;
    ctx.fillText('« شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ »', width / 2, 865);

    // 9. Sender & Mosques Attribution
    ctx.strokeStyle = `${tmpl.borderColor}66`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(280, 915);
    ctx.lineTo(920, 915);
    ctx.stroke();

    ctx.font = 'bold 26px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.accentColor;
    ctx.fillText(senderName, width / 2, 968);

    ctx.font = '500 20px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.secondaryTextColor;
    ctx.fillText(
      lang === 'ar' ? 'مسجد روستوك الكبير • مسجد النور • روستوك، ألمانيا' : 'Große Moschee Rostock & An-Nur • Rostock, Deutschland',
      width / 2,
      1008
    );

    ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.borderColor;
    ctx.fillText(`Ramadan ${nextRamadan.hijriYear} AH / ${nextRamadan.gregorianYear} • Islamischer Bund Rostock e.V.`, width / 2, 1052);
  }, [recipientName, senderName, selectedTemplate, selectedBlessingIndex, customMessage, includeLogo, lang, nextRamadan]);

  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#10b981', '#f6e09f', '#ffffff']
    });

    const link = document.createElement('a');
    const safeName = recipientName.replace(/\s+/g, '_').slice(0, 20) || 'Greeting';
    link.download = `Ramadan_Mubarak_Rostock_${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyOrShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'ramadan.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'Ramadan_Mubarak_Rostock.png', { type: 'image/png' });
          await navigator.share({
            title: 'Ramadan Mubarak Rostock',
            text: `${recipientName} - تهنئة شهر رمضان المبارك من الرابطة الإسلامية في مدينة روستوك`,
            files: [file]
          });
        } else if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  return (
    <section id="card-studio" className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#0c2a20] text-[#d4af37] text-xs font-semibold mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '6 تصاميم إسلامية فاخرة • دقة عالية' : '6 Luxus-Designs • Hohe Auflösung'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-cairo">
            {t.cardGeneratorTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#b4ccc1]">
            {t.cardGeneratorSubtitle}
          </p>
        </div>

        {/* 2-Column Split: Controls & Live Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#081e17] rounded-2xl p-6 border border-[#d4af37]/30 shadow-xl space-y-5">
            
            {/* Recipient Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                {lang === 'ar' ? 'اسم المستلم أو العائلة المهداة لها' : 'Name des Empfängers / der Familie'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t.recipientNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            {/* 6 Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                {t.selectTemplate} (6 {lang === 'ar' ? 'تصاميم' : 'Designs'})
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between gap-2 ${
                      selectedTemplate === tmpl.id
                        ? 'border-[#d4af37] bg-[#12382c] shadow-md shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'border-[#1b4335] bg-[#051510] hover:border-[#2b6452]'
                    }`}
                  >
                    <span className="text-xs font-bold text-white leading-snug">
                      {lang === 'ar' ? tmpl.nameAr : tmpl.nameDe}
                    </span>
                    <div
                      className="w-4 h-4 rounded-full border shrink-0"
                      style={{ backgroundColor: tmpl.swatchColor, borderColor: tmpl.borderColor }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Blessings Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-2">
                {t.selectBlessing}
              </label>
              <div className="space-y-2">
                {CARD_BLESSINGS.map((blessing, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedBlessingIndex(idx);
                      setCustomMessage('');
                    }}
                    className={`w-full p-2.5 rounded-xl text-start text-xs transition-all border ${
                      selectedBlessingIndex === idx && !customMessage
                        ? 'border-[#d4af37] bg-[#113a2d] text-white'
                        : 'border-[#173e31] bg-[#05140f] text-[#a1c2b4] hover:bg-[#0c2a20]'
                    }`}
                  >
                    {lang === 'ar' ? blessing.ar : blessing.de}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={lang === 'ar' ? 'أو اكتب تهنئة مخصصة بخط يدك...' : 'Oder eigene persönliche Grußbotschaft schreiben...'}
                className="mt-2.5 w-full px-3 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Sender & Official Logo Toggle */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1.5">
                  {lang === 'ar' ? 'جهة الإهداء (المرسل)' : 'Absender'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#cde3d8] bg-[#04120d] px-3.5 py-2.5 rounded-xl border border-[#173e31]">
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="accent-[#d4af37] w-4 h-4 rounded"
                />
                <span>
                  {lang === 'ar'
                    ? 'تضمين شعار الرابطة الإسلامية في روستوك على البطاقة'
                    : 'Offizielles Logo „Islamischer Bund Rostock e.V.“ einbinden'}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 space-y-3">
              <button
                onClick={handleDownload}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadCard}</span>
              </button>

              <button
                onClick={handleCopyOrShare}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0d3125] hover:bg-[#134232] text-[#f6e09f] border border-[#d4af37]/40 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#d4af37]" />}
                <span>{copied ? t.cardCopied : t.shareCard}</span>
              </button>
            </div>

          </div>

          {/* Canvas Live Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-[540px] aspect-square rounded-2xl shadow-2xl border-2 border-[#d4af37]/50 p-2 bg-[#04100c] relative group overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-xl object-contain shadow-inner"
              />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-3 py-1 rounded text-[11px] text-[#f6e09f]">
                {lang === 'ar' ? 'معاينة مباشرة بدقة 1200×1200' : 'Live-Vorschau 1200x1200px'}
              </div>
            </div>

            <p className="text-xs text-[#82a496] mt-4 text-center max-w-md">
              {lang === 'ar'
                ? 'البطاقة جاهزة للتحميل بجودة Retina العالية مع شعار الرابطة ومناسبة للإرسال عبر واتساب وإنستغرام وللطباعة.'
                : 'Die Grußkarte wird in hoher Auflösung inkl. Vereinslogo erstellt und eignet sich für WhatsApp, Instagram & Druck.'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
