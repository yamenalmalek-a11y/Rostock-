import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TRANSLATIONS, Language } from '../utils/translations';
import { ISLAMIC_OCCASIONS, OccasionId } from '../utils/occasionTemplates';
import { getCurrentPrayers } from '../utils/prayerTimes';
import { loadAssociationLogo, drawHarmoniousLogoCrest } from '../utils/scheduleExporter';
import { Download, Share2, Check, Palette, PenLine, Eraser, Sparkles, CalendarHeart } from 'lucide-react';
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
  | 'rose_dawn'
  | 'kaaba_gold'
  | 'eid_royal'
  | 'damascus_olive';

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
  isLight?: boolean;
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
    id: 'eid_royal',
    nameAr: 'بهجة العيد الملكية',
    nameDe: 'Königliches Festtag-Grün',
    bgGradient: ['#104233', '#07241b', '#03120d'],
    borderColor: '#f3d06b',
    accentColor: '#fff0b8',
    textColor: '#ffffff',
    secondaryTextColor: '#d5ece0',
    swatchColor: '#155440'
  },
  {
    id: 'kaaba_gold',
    nameAr: 'كسوة الكعبة والذهب',
    nameDe: 'Kiswah Schwarz & Gold',
    bgGradient: ['#1c1915', '#0e0c0a', '#050403'],
    borderColor: '#e2b842',
    accentColor: '#fae28c',
    textColor: '#ffffff',
    secondaryTextColor: '#e6dcc5',
    swatchColor: '#1f1b15'
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
    swatchColor: '#f2eadc',
    isLight: true
  },
  {
    id: 'midnight_celestial',
    nameAr: 'ليلة الهلال وأفق المسجد',
    nameDe: 'Mitternacht & Moschee',
    bgGradient: ['#102240', '#060f1f', '#02060d'],
    borderColor: '#93c5fd',
    accentColor: '#fde68a',
    textColor: '#ffffff',
    secondaryTextColor: '#bfdbfe',
    swatchColor: '#16335e'
  },
  {
    id: 'andalus_lantern',
    nameAr: 'الأندلس والبرونز الدافئ',
    nameDe: 'Andalusische Bronze',
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
    id: 'damascus_olive',
    nameAr: 'الزيتون والذهب الدمشقي',
    nameDe: 'Damaszener Oliv & Gold',
    bgGradient: ['#202b1b', '#11180e', '#070b05'],
    borderColor: '#d4af37',
    accentColor: '#f7e5a8',
    textColor: '#ffffff',
    secondaryTextColor: '#d2dcc9',
    swatchColor: '#2d3d25'
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

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -100);
  ctx.lineTo(0, 0);
  ctx.stroke();

  const glow = ctx.createRadialGradient(0, 38, 4, 0, 38, 65);
  glow.addColorStop(0, `${glowColor}66`);
  glow.addColorStop(1, `${glowColor}00`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 38, 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-14, 16);
  ctx.quadraticCurveTo(0, -4, 14, 16);
  ctx.closePath();
  ctx.fill();

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

  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(0, 56);
  ctx.stroke();

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

// Wrap multiline text respecting explicit line breaks and max width
function wrapMultiLineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxLineWidth: number
): string[] {
  const paragraphs = text.split(/\r?\n/);
  const result: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }
    const words = trimmed.split(/\s+/);
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const candidate = current ? `${current} ${words[i]}` : words[i];
      if (ctx.measureText(candidate).width > maxLineWidth && current) {
        result.push(current);
        current = words[i];
      } else {
        current = candidate;
      }
    }
    if (current) result.push(current);
  }
  return result;
}

export const CardGenerator: React.FC<CardGeneratorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const initialOccasion = ISLAMIC_OCCASIONS[0];

  const [selectedOccasionId, setSelectedOccasionId] = useState<OccasionId>('ramadan');
  const [recipientName, setRecipientName] = useState(
    lang === 'ar' ? 'الأهل والأصدقاء الكرام' : 'Familie und Freunde'
  );
  const [senderName, setSenderName] = useState(
    lang === 'ar' ? 'الرابطة الإسلامية في مدينة روستوك' : 'Islamischer Bund Rostock e.V.'
  );
  const [cardHeadline, setCardHeadline] = useState(initialOccasion.defaultHeadlineAr);
  const [cardSubheadline, setCardSubheadline] = useState(initialOccasion.defaultSubheadline);
  const [ayahText, setAyahText] = useState(initialOccasion.ayahOrQuoteAr);
  const [messageText, setMessageText] = useState(() =>
    lang === 'ar' ? initialOccasion.blessings[0].ar : initialOccasion.blessings[0].de
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('emerald_arch');
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeAyah, setIncludeAyah] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentDates = useMemo(() => getCurrentPrayers(), []);
  const activeOccasion = useMemo(
    () => ISLAMIC_OCCASIONS.find((o) => o.id === selectedOccasionId) || ISLAMIC_OCCASIONS[0],
    [selectedOccasionId]
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSelectOccasion = (occId: OccasionId) => {
    const occ = ISLAMIC_OCCASIONS.find((o) => o.id === occId);
    if (!occ) return;
    setSelectedOccasionId(occId);
    setCardHeadline(occ.defaultHeadlineAr);
    setCardSubheadline(occ.defaultSubheadline);
    setAyahText(occ.ayahOrQuoteAr);
    setMessageText(lang === 'ar' ? occ.blessings[0].ar : occ.blessings[0].de);
    setSelectedTemplate(occ.recommendedTemplate);
  };

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

    // 2. Design-specific artwork
    if (tmpl.id === 'emerald_arch') {
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
    } else if (tmpl.id === 'eid_royal') {
      // Celebratory golden starbursts and dual festoon arches
      for (let i = 0; i < 42; i++) {
        const ang = (i * Math.PI * 2) / 42;
        const rad = i % 2 === 0 ? 495 : 465;
        const px = 600 + Math.cos(ang) * rad;
        const py = 590 + Math.sin(ang) * rad;
        ctx.fillStyle = `${tmpl.accentColor}40`;
        ctx.beginPath();
        ctx.arc(px, py, i % 2 === 0 ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      drawEightPointStar(ctx, 185, 185, 44, `${tmpl.borderColor}66`);
      drawEightPointStar(ctx, 1015, 185, 44, `${tmpl.borderColor}66`);
      drawEightPointStar(ctx, 185, 1015, 44, `${tmpl.borderColor}66`);
      drawEightPointStar(ctx, 1015, 1015, 44, `${tmpl.borderColor}66`);
      drawLantern(ctx, 210, 165, 1.0, tmpl.borderColor, tmpl.accentColor);
      drawLantern(ctx, 990, 165, 1.0, tmpl.borderColor, tmpl.accentColor);
    } else if (tmpl.id === 'kaaba_gold') {
      // Kiswah ornamental vertical gold trim & geometric diamond band
      ctx.save();
      ctx.strokeStyle = `${tmpl.borderColor}40`;
      ctx.lineWidth = 2;
      ctx.strokeRect(105, 105, width - 210, height - 210);

      for (let x = 140; x <= width - 140; x += 64) {
        drawEightPointStar(ctx, x, 118, 12, `${tmpl.borderColor}55`);
        drawEightPointStar(ctx, x, height - 118, 12, `${tmpl.borderColor}55`);
      }
      drawEightPointStar(ctx, 600, 585, 360, `${tmpl.borderColor}18`);
      ctx.restore();
    } else if (tmpl.id === 'midnight_celestial') {
      for (let i = 0; i < 85; i++) {
        const sx = ((i * 317) % (width - 140)) + 70;
        const sy = ((i * 193) % 720) + 70;
        const sr = (i % 3) + 1;
        ctx.fillStyle = i % 4 === 0 ? `${tmpl.accentColor}aa` : `${tmpl.borderColor}55`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
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
    } else if (tmpl.id === 'ivory_manuscript' || tmpl.id === 'damascus_olive') {
      ctx.save();
      ctx.translate(600, 600);
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.strokeStyle = `${tmpl.borderColor}24`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 210, 75, 190, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else if (tmpl.id === 'andalus_lantern') {
      drawEightPointStar(ctx, 210, 210, 65, `${tmpl.borderColor}44`);
      drawEightPointStar(ctx, 990, 210, 65, `${tmpl.borderColor}44`);
      drawLantern(ctx, 195, 175, 1.15, tmpl.borderColor, tmpl.accentColor);
      drawLantern(ctx, 1005, 175, 1.15, tmpl.borderColor, tmpl.accentColor);
    } else if (tmpl.id === 'turquoise_mosaic') {
      drawEightPointStar(ctx, 600, 560, 390, `${tmpl.borderColor}1e`);
      drawEightPointStar(ctx, 600, 560, 340, `${tmpl.accentColor}22`);
      drawEightPointStar(ctx, 175, 175, 42, `${tmpl.borderColor}55`);
      drawEightPointStar(ctx, 1025, 175, 42, `${tmpl.borderColor}55`);
    } else if (tmpl.id === 'rose_dawn') {
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

    // 3. Outer Frame & Corners
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

    // 4. Top Emblem
    if (includeLogo && logoImg) {
      drawHarmoniousLogoCrest(
        ctx,
        logoImg,
        width / 2,
        152,
        66,
        tmpl.borderColor,
        Boolean(tmpl.isLight)
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

    // 5. Editable Headline & Subheadline
    ctx.textAlign = 'center';
    ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    const headline = cardHeadline.trim() || activeOccasion.defaultHeadlineAr;
    const headlineSize = headline.length > 26 ? 50 : headline.length > 18 ? 58 : headline.length > 13 ? 66 : 74;
    ctx.fillStyle = tmpl.accentColor;
    ctx.font = `bold ${headlineSize}px "Amiri", "Cinzel", serif`;
    ctx.fillText(headline, width / 2, 298);

    if (cardSubheadline.trim()) {
      ctx.direction = 'ltr';
      ctx.font = '600 24px "Cinzel", "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = tmpl.borderColor;
      ctx.fillText(cardSubheadline.trim(), width / 2, 346);
      ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    }

    // Divider with Islamic star
    ctx.strokeStyle = `${tmpl.borderColor}88`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(360, 380);
    ctx.lineTo(560, 380);
    ctx.moveTo(640, 380);
    ctx.lineTo(840, 380);
    ctx.stroke();

    ctx.fillStyle = tmpl.accentColor;
    ctx.font = '24px serif';
    ctx.fillText('۞', width / 2, 388);

    // 6. Recipient Name Box
    let bodyStartY = 470;
    if (recipientName.trim()) {
      ctx.fillStyle = tmpl.isLight ? '#ffffffdd' : `${tmpl.bgGradient[0]}dd`;
      ctx.strokeStyle = `${tmpl.borderColor}99`;
      ctx.lineWidth = 2;
      const boxW = Math.min(860, Math.max(500, recipientName.length * 26 + 130));
      ctx.beginPath();
      ctx.roundRect((width - boxW) / 2, 424, boxW, 82, 16);
      ctx.fill();
      ctx.stroke();

      const recFontSize = recipientName.length > 30 ? 30 : 36;
      ctx.font = `bold ${recFontSize}px "Cairo", "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = tmpl.textColor;
      ctx.fillText(recipientName.trim(), width / 2, 478);
      bodyStartY = 572;
    }

    // 7. Custom Greeting Message
    const activeMessage = messageText.trim();
    if (activeMessage) {
      const maxLineW = 860;
      const maxBottomY = includeAyah && ayahText.trim() ? 825 : 885;
      let fontSize = 33;
      let lineHeight = 52;
      let lines: string[] = [];

      for (const sizeCandidate of [33, 29, 26, 23]) {
        fontSize = sizeCandidate;
        lineHeight = Math.round(sizeCandidate * 1.56);
        ctx.font = `normal ${fontSize}px "Amiri", "Cairo", "Plus Jakarta Sans", serif`;
        lines = wrapMultiLineText(ctx, activeMessage, maxLineW);
        if (bodyStartY + lines.length * lineHeight <= maxBottomY) {
          break;
        }
      }

      const totalTextH = lines.length * lineHeight;
      const availableMidY = (bodyStartY + maxBottomY) / 2;
      let cursorY = Math.max(bodyStartY, availableMidY - totalTextH / 2 + lineHeight * 0.45);

      ctx.fillStyle = tmpl.secondaryTextColor;
      for (const lineStr of lines) {
        if (cursorY > maxBottomY) break;
        if (lineStr) {
          ctx.fillText(lineStr, width / 2, cursorY);
        }
        cursorY += lineHeight;
      }
    }

    // 8. Optional Occasion Ayah / Dhikr Reference
    if (includeAyah && ayahText.trim()) {
      const qTxt = ayahText.trim();
      const qSize = qTxt.length > 68 ? 20 : 24;
      ctx.font = `italic ${qSize}px "Amiri", "Plus Jakarta Sans", serif`;
      ctx.fillStyle = tmpl.borderColor;
      ctx.fillText(qTxt, width / 2, 870);
    }

    // 9. Sender & Mosques Attribution
    ctx.strokeStyle = `${tmpl.borderColor}66`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(280, 916);
    ctx.lineTo(920, 916);
    ctx.stroke();

    if (senderName.trim()) {
      ctx.font = 'bold 26px "Cairo", "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = tmpl.accentColor;
      ctx.fillText(senderName.trim(), width / 2, 968);
    }

    ctx.font = '500 20px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.secondaryTextColor;
    ctx.fillText(
      lang === 'ar'
        ? 'مسجد روستوك الكبير • مسجد النور • روستوك، ألمانيا'
        : 'Große Moschee Rostock & Al-Nour Moschee • Rostock, Deutschland',
      width / 2,
      1008
    );

    ctx.direction = 'ltr';
    ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = tmpl.borderColor;
    ctx.fillText(
      `${activeOccasion.footerTag} • ${currentDates.todayHijri.year} AH / ${currentDates.rostockNow.year} • Islamischer Bund Rostock e.V.`,
      width / 2,
      1052
    );
  }, [
    recipientName,
    senderName,
    cardHeadline,
    cardSubheadline,
    ayahText,
    messageText,
    selectedTemplate,
    includeLogo,
    includeAyah,
    lang,
    activeOccasion,
    currentDates
  ]);

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
    link.download = `${activeOccasion.id}_Rostock_${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyOrShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'greeting.png', { type: 'image/png' })] })) {
          const file = new File([blob], `${activeOccasion.id}_Rostock.png`, { type: 'image/png' });
          await navigator.share({
            title: activeOccasion.footerTag,
            text: `${recipientName} - تهنئة من الرابطة الإسلامية في مدينة روستوك`,
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
    <section id="card-studio" className="scroll-mt-20 py-10 md:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#0c2a20] text-[#d4af37] text-xs font-semibold mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? '8 مناسبات دينية • 9 تصاميم إسلامية • كتابة حرة'
                : '8 Anlässe • 9 Designs • Freier Text'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-cairo">
            {t.cardGeneratorTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#b4ccc1]">
            {t.cardGeneratorSubtitle}
          </p>
        </div>

        {/* Occasions Quick Bar across full width */}
        <div className="mb-6 bg-[#081e17] rounded-2xl p-3.5 sm:p-4 border border-[#d4af37]/30 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] mb-2.5">
            <CalendarHeart className="w-4 h-4" />
            <span>
              {lang === 'ar'
                ? 'اختر المناسبة الدينية (لتحميل نماذجها وآياتها وتصاميمها):'
                : 'Islamischen Anlass auswählen (Texte & Designs laden):'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ISLAMIC_OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleSelectOccasion(occ.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                  selectedOccasionId === occ.id
                    ? 'bg-[#d4af37] text-[#061510] border-[#d4af37] shadow-md'
                    : 'bg-[#04120d] text-[#cbe2d7] border-[#193f32] hover:border-[#d4af37]/60 hover:text-white'
                }`}
              >
                {lang === 'ar' ? occ.labelAr : occ.labelDe}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Preview-First Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Live Canvas Preview (First on Mobile, Right/Left on Desktop) */}
          <div className="lg:col-span-7 lg:order-2 flex flex-col items-center">
            <div className="w-full max-w-[360px] sm:max-w-[460px] lg:max-w-[540px] aspect-square rounded-2xl shadow-2xl border-2 border-[#d4af37]/50 p-1.5 sm:p-2 bg-[#04100c] relative group overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-xl object-contain shadow-inner"
              />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#f6e09f]">
                {lang === 'ar' ? 'معاينة مباشرة 1200×1200' : 'Live-Vorschau 1200×1200px'}
              </div>
            </div>

            {/* Quick Mobile Action Strip directly beneath preview */}
            <div className="mt-4 w-full max-w-[360px] sm:max-w-[460px] lg:hidden grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f22] text-[#061510] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحميل البطاقة' : 'Herunterladen'}</span>
              </button>
              <button
                onClick={handleCopyOrShare}
                className="py-3 px-3 rounded-xl bg-[#0d3125] text-[#f6e09f] border border-[#d4af37]/50 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#d4af37]" />}
                <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Kopiert!') : (lang === 'ar' ? 'مشاركة' : 'Teilen')}</span>
              </button>
            </div>

            <p className="text-xs text-[#82a496] mt-3 sm:mt-4 text-center max-w-md hidden sm:block">
              {lang === 'ar'
                ? 'البطاقة جاهزة للتحميل بجودة عالية مع شعار الرابطة ومناسبة للإرسال عبر واتساب وإنستغرام وللطباعة.'
                : 'Die Grußkarte wird in hoher Auflösung inkl. Vereinslogo erstellt und eignet sich für WhatsApp, Instagram & Druck.'}
            </p>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-5 lg:order-1 bg-[#081e17] rounded-2xl p-4 sm:p-6 border border-[#d4af37]/30 shadow-xl space-y-5">
            
            {/* 1. Headline & Subtitle (Editable + Occasion Presets) */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'العنوان الرئيسي للبطاقة (قابل للتعديل):' : 'Hauptüberschrift (frei anpassbar):'}</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {activeOccasion.headlinePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCardHeadline(preset.ar);
                      setCardSubheadline(preset.de);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                      cardHeadline === preset.ar
                        ? 'bg-[#144334] border-[#d4af37] text-[#f6e09f]'
                        : 'bg-[#04120d] border-[#193f32] text-[#a7c6b9] hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? preset.ar : preset.de}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardHeadline}
                  onChange={(e) => setCardHeadline(e.target.value)}
                  placeholder={lang === 'ar' ? 'العنوان الكبير' : 'Haupttitel'}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
                <input
                  type="text"
                  value={cardSubheadline}
                  onChange={(e) => setCardSubheadline(e.target.value)}
                  placeholder={lang === 'ar' ? 'سطر فرعي اختياري' : 'Untertitel (optional)'}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-[#f6e09f] text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* 2. Recipient Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] mb-1.5">
                {lang === 'ar' ? 'اسم المستلم أو العائلة المهداة لها (أو اتركه فارغاً)' : 'Name des Empfängers / der Familie (optional)'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t.recipientNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            {/* 3. Free-Form Custom Message Editor + Occasion Blessing Snippets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37]">
                  <PenLine className="w-3.5 h-3.5" />
                  <span>{t.selectBlessing}</span>
                </label>

                {messageText && (
                  <button
                    type="button"
                    onClick={() => setMessageText('')}
                    className="text-[11px] text-[#9bbbae] hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Eraser className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'مسح لكتابة رسالة جديدة' : 'Text leeren'}</span>
                  </button>
                )}
              </div>

              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'اكتب رسالتك الخاصة بحرية تامة هنا (يدعم الأسطر المتعددة عند الضغط على Enter)...'
                    : 'Schreiben Sie hier Ihren persönlichen Wunschtext (mehrzeilig möglich)...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#04120d] border border-[#d4af37]/45 text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#d4af37]"
              />

              {/* Quick Occasion Templates */}
              <div>
                <div className="text-[11px] text-[#8db2a3] mb-1.5">
                  {lang === 'ar'
                    ? `نماذج مقترحة لمناسبة «${activeOccasion.labelAr}» (اضغط للتعبئة ثم عدّل بحرية):`
                    : `Vorlagen für „${activeOccasion.labelDe}“ (klicken & frei anpassen):`}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {activeOccasion.blessings.map((blessing, idx) => {
                    const txt = lang === 'ar' ? blessing.ar : blessing.de;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMessageText(txt)}
                        className={`p-2 rounded-lg text-start text-[11px] line-clamp-2 transition-all border ${
                          messageText === txt
                            ? 'border-[#d4af37] bg-[#113a2d] text-white'
                            : 'border-[#173e31] bg-[#05140f] text-[#a1c2b4] hover:bg-[#0c2a20]'
                        }`}
                      >
                        {txt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. 9 Template Designs */}
            <div>
              <label className="block text-xs font-semibold text-[#d4af37] mb-2">
                {t.selectTemplate} ({TEMPLATES.length} {lang === 'ar' ? 'تصاميم' : 'Designs'})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-2 rounded-xl border text-start transition-all flex items-center justify-between gap-2 ${
                      selectedTemplate === tmpl.id
                        ? 'border-[#d4af37] bg-[#12382c] shadow-md shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'border-[#1b4335] bg-[#051510] hover:border-[#2b6452]'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-white leading-snug">
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

            {/* 5. Sender & Editable Ayah/Dhikr */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] mb-1.5">
                  {lang === 'ar' ? 'جهة الإهداء (المرسل)' : 'Absender'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسمك أو اسم العائلة أو المسجد' : 'Ihr Name oder Ihre Familie'}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#04120d] border border-[#1b4335] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {includeAyah && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#9ec2b4] mb-1">
                    {lang === 'ar' ? 'الآية أو الذكر أسفل البطاقة (قابل للتعديل):' : 'Koranvers / Bittspruch auf der Karte:'}
                  </label>
                  <input
                    type="text"
                    value={ayahText}
                    onChange={(e) => setAyahText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#04120d] border border-[#173e31] text-[#f6e09f] text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#cde3d8] bg-[#04120d] px-3 py-2.5 rounded-xl border border-[#173e31]">
                  <input
                    type="checkbox"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4 rounded shrink-0"
                  />
                  <span>{lang === 'ar' ? 'تضمين شعار الرابطة' : 'Vereinslogo einbinden'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#cde3d8] bg-[#04120d] px-3 py-2.5 rounded-xl border border-[#173e31]">
                  <input
                    type="checkbox"
                    checked={includeAyah}
                    onChange={(e) => setIncludeAyah(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4 rounded shrink-0"
                  />
                  <span>{lang === 'ar' ? 'تضمين آية / ذكر المناسبة' : 'Koranvers anzeigen'}</span>
                </label>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="pt-1 space-y-2.5">
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

        </div>

      </div>
    </section>
  );
};
