import { DaySchedule } from './prayerTimes';
import { Language } from './translations';

export const ASSOCIATION_LOGO_PATH = '/logo-official.png';

export type PosterThemeId =
  | 'emerald'
  | 'ivory'
  | 'midnight'
  | 'ottoman'
  | 'andalus'
  | 'turquoise';

export type PosterLayoutId = 'classic' | 'arch_lanterns' | 'ramadan_imsakiya';

export interface PosterLayoutOption {
  id: PosterLayoutId;
  nameAr: string;
  nameDe: string;
  descAr: string;
  descDe: string;
}

export const POSTER_LAYOUTS: PosterLayoutOption[] = [
  {
    id: 'classic',
    nameAr: 'النمط الرسمي الأنيق',
    nameDe: 'Klassisch Offiziell',
    descAr: 'جدول رسمي واضح بإطار مزدوج وشعار الرابطة',
    descDe: 'Klares offizielles Tabellen-Layout mit Doppelrahmen'
  },
  {
    id: 'arch_lanterns',
    nameAr: 'نمط المحراب والفوانيس',
    nameDe: 'Mihrab & Laternen',
    descAr: 'قوس إسلامي مزخرف وفوانيس مضيئة في الأعلى',
    descDe: 'Ornamentaler Bogen mit leuchtenden Laternen'
  },
  {
    id: 'ramadan_imsakiya',
    nameAr: 'نموذج إمساكية رمضان الشامل',
    nameDe: 'Ramadan-Imsakiya Modell',
    descAr: 'تصميم مخصص لإمساكية رمضان مع دعاء الصيام والإفطار وإبراز الإمساك والمغرب',
    descDe: 'Spezial-Imsakiya mit Fasten-Bittgebeten & hervorgehobenem Imsak/Iftar'
  }
];

export interface PosterTheme {
  id: PosterThemeId;
  nameAr: string;
  nameDe: string;
  isLight?: boolean;
  bgTop: string;
  bgBottom: string;
  cardBg: string;
  headerBg: string;
  rowEven: string;
  rowOdd: string;
  rowHighlight: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  maghribBg: string;
  maghribText: string;
  imsakBg: string;
  imsakText: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  {
    id: 'emerald',
    nameAr: 'الزمرد الملكي والذهب',
    nameDe: 'Königliches Smaragd & Gold',
    bgTop: '#072219',
    bgBottom: '#03100b',
    cardBg: '#09271d',
    headerBg: '#103e2f',
    rowEven: '#072017',
    rowOdd: '#0a291f',
    rowHighlight: '#1b4b38',
    border: '#d4af37',
    accent: '#f6e09f',
    textPrimary: '#ffffff',
    textSecondary: '#b7d4c6',
    maghribBg: '#154634',
    maghribText: '#f6e09f',
    imsakBg: '#0c3328',
    imsakText: '#9ee7cf'
  },
  {
    id: 'ivory',
    nameAr: 'اللؤلؤ الفاخر (للطباعة)',
    nameDe: 'Elfenbein (Druckfreundlich)',
    isLight: true,
    bgTop: '#fcfaf5',
    bgBottom: '#f2ece1',
    cardBg: '#ffffff',
    headerBg: '#0d3d2e',
    rowEven: '#ffffff',
    rowOdd: '#f7f3eb',
    rowHighlight: '#efe4c4',
    border: '#b08926',
    accent: '#0d3d2e',
    textPrimary: '#1a1a18',
    textSecondary: '#4d524c',
    maghribBg: '#f6ebd0',
    maghribText: '#8c620a',
    imsakBg: '#eaf4ef',
    imsakText: '#0d4d3a'
  },
  {
    id: 'midnight',
    nameAr: 'سماء الليل والفضة',
    nameDe: 'Mitternachtsblau & Silber',
    bgTop: '#0b192e',
    bgBottom: '#040a14',
    cardBg: '#0f213b',
    headerBg: '#173256',
    rowEven: '#0c1b30',
    rowOdd: '#102440',
    rowHighlight: '#1d3c66',
    border: '#93c5fd',
    accent: '#e0f2fe',
    textPrimary: '#ffffff',
    textSecondary: '#b6cce6',
    maghribBg: '#17375e',
    maghribText: '#fde68a',
    imsakBg: '#122b4a',
    imsakText: '#bae6fd'
  },
  {
    id: 'ottoman',
    nameAr: 'المخطوطة العثمانية الدافئة',
    nameDe: 'Osmanisches Pergament',
    isLight: true,
    bgTop: '#faf3e6',
    bgBottom: '#efe1c8',
    cardBg: '#fffdf8',
    headerBg: '#5c1f1a',
    rowEven: '#fffdf8',
    rowOdd: '#f6ecda',
    rowHighlight: '#ecd8b4',
    border: '#9c6f19',
    accent: '#5c1f1a',
    textPrimary: '#241a14',
    textSecondary: '#59483b',
    maghribBg: '#f4e0be',
    maghribText: '#6e2319',
    imsakBg: '#efe8da',
    imsakText: '#144c3c'
  },
  {
    id: 'andalus',
    nameAr: 'الأندلس البرونزي والذهب',
    nameDe: 'Andalusische Bronze & Gold',
    bgTop: '#29160f',
    bgBottom: '#120805',
    cardBg: '#22120c',
    headerBg: '#422216',
    rowEven: '#1d0f0a',
    rowOdd: '#26140d',
    rowHighlight: '#4a2819',
    border: '#e59252',
    accent: '#fcd34d',
    textPrimary: '#ffffff',
    textSecondary: '#dec8bc',
    maghribBg: '#4a2515',
    maghribText: '#fde68a',
    imsakBg: '#321a10',
    imsakText: '#fed7aa'
  },
  {
    id: 'turquoise',
    nameAr: 'الزبرجد الدمشقي',
    nameDe: 'Damaszener Türkis',
    bgTop: '#082c33',
    bgBottom: '#031216',
    cardBg: '#093038',
    headerBg: '#0f4854',
    rowEven: '#07272e',
    rowOdd: '#0a333b',
    rowHighlight: '#13525e',
    border: '#5eead4',
    accent: '#f6e09f',
    textPrimary: '#ffffff',
    textSecondary: '#b7dde0',
    maghribBg: '#124f5a',
    maghribText: '#fde68a',
    imsakBg: '#0c3c45',
    imsakText: '#99f6e4'
  }
];

let cachedTransparentLogo: HTMLCanvasElement | null = null;

// Load official transparent PNG logo directly for high-DPI canvas rendering
export function loadAssociationLogo(): Promise<HTMLCanvasElement | null> {
  if (cachedTransparentLogo) {
    return Promise.resolve(cachedTransparentLogo);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const off = document.createElement('canvas');
        off.width = img.naturalWidth || img.width;
        off.height = img.naturalHeight || img.height;
        const octx = off.getContext('2d');
        if (!octx) {
          resolve(null);
          return;
        }
        octx.drawImage(img, 0, 0);
        cachedTransparentLogo = off;
        resolve(off);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = ASSOCIATION_LOGO_PATH;
  });
}

// Draw the transparent logo harmoniously: directly on light parchment or embedded inside a warm champagne-gold crest on dark backgrounds
export function drawHarmoniousLogoCrest(
  ctx: CanvasRenderingContext2D,
  logoCanvas: HTMLCanvasElement | null,
  cx: number,
  cy: number,
  radius: number,
  borderColor: string,
  isLightBg: boolean
): void {
  if (!logoCanvas) return;

  ctx.save();

  if (!isLightBg) {
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.45);
    glow.addColorStop(0, `${borderColor}44`);
    glow.addColorStop(1, `${borderColor}00`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    const medGrad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
    medGrad.addColorStop(0, '#fcf8ee');
    medGrad.addColorStop(0.65, '#f2e6c8');
    medGrad.addColorStop(1, '#dfc68c');
    ctx.fillStyle = medGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = `${borderColor}88`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = borderColor;
    for (let k = 0; k < 8; k++) {
      const ang = (k * Math.PI) / 4;
      const px = cx + Math.cos(ang) * (radius + 6);
      const py = cy + Math.sin(ang) * (radius + 6);
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.strokeStyle = `${borderColor}55`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  const imgSize = radius * 1.72;
  ctx.drawImage(logoCanvas, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
  ctx.restore();
}

function drawPosterLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  scale: number,
  borderColor: string,
  glowColor: string
) {
  ctx.save();
  ctx.translate(x, topY);
  ctx.scale(scale, scale);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -110);
  ctx.lineTo(0, 0);
  ctx.stroke();

  const glow = ctx.createRadialGradient(0, 42, 4, 0, 42, 72);
  glow.addColorStop(0, `${glowColor}55`);
  glow.addColorStop(1, `${glowColor}00`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 42, 72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = borderColor;
  ctx.beginPath();
  ctx.moveTo(-16, 18);
  ctx.quadraticCurveTo(0, -4, 16, 18);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = `${glowColor}30`;
  ctx.beginPath();
  ctx.moveTo(-20, 18);
  ctx.lineTo(20, 18);
  ctx.lineTo(15, 62);
  ctx.lineTo(-15, 62);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(0, 62);
  ctx.stroke();

  ctx.fillStyle = borderColor;
  ctx.beginPath();
  ctx.moveTo(-11, 62);
  ctx.lineTo(11, 62);
  ctx.lineTo(0, 78);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPosterCrescent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  bgCutColor: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bgCutColor;
  ctx.beginPath();
  ctx.arc(x + radius * 0.36, y - radius * 0.16, radius * 0.84, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export interface SchedulePosterOptions {
  rows: DaySchedule[];
  titleAr: string;
  titleDe: string;
  subtitleAr: string;
  subtitleDe: string;
  mode: 'monthly' | 'ramadan10y';
  themeId: PosterThemeId;
  layoutId?: PosterLayoutId;
  lang: Language;
}

export async function drawSchedulePosterToCanvas(
  canvas: HTMLCanvasElement,
  options: SchedulePosterOptions
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1654;
  const height = 2339;
  canvas.width = width;
  canvas.height = height;

  const theme = POSTER_THEMES.find((t) => t.id === options.themeId) || POSTER_THEMES[0];
  const layoutId: PosterLayoutId =
    options.layoutId || (options.mode === 'ramadan10y' ? 'ramadan_imsakiya' : 'classic');
  const logoImg = await loadAssociationLogo();
  const isAr = options.lang === 'ar';
  const isLight = Boolean(theme.isLight);

  // 1. Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgTop);
  grad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative stars on dark themes
  if (!isLight) {
    ctx.fillStyle = `${theme.border}26`;
    for (let i = 0; i < 75; i++) {
      const sx = ((i * 293) % (width - 160)) + 80;
      const sy = ((i * 179) % 410) + 60;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ornamental Islamic Mihrab Arch header for 'arch_lanterns' & 'ramadan_imsakiya'
  if (layoutId === 'arch_lanterns' || layoutId === 'ramadan_imsakiya') {
    ctx.save();
    ctx.strokeStyle = `${theme.border}55`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(110, 470);
    ctx.lineTo(110, 210);
    ctx.bezierCurveTo(110, 95, 520, 62, width / 2, 58);
    ctx.bezierCurveTo(width - 520, 62, width - 110, 95, width - 110, 210);
    ctx.lineTo(width - 110, 470);
    ctx.stroke();

    // Hanging glowing lanterns
    drawPosterLantern(ctx, 215, 165, 1.35, theme.border, theme.accent);
    drawPosterLantern(ctx, width - 215, 165, 1.35, theme.border, theme.accent);

    if (layoutId === 'ramadan_imsakiya') {
      drawPosterLantern(ctx, 355, 145, 0.95, theme.border, theme.accent);
      drawPosterLantern(ctx, width - 355, 145, 0.95, theme.border, theme.accent);
      drawPosterCrescent(ctx, 145, 148, 30, theme.border, theme.bgTop);
      drawPosterCrescent(ctx, width - 145, 148, 30, theme.border, theme.bgTop);
    }
    ctx.restore();
  }

  // 2. Outer Double Frame & Islamic Corner Brackets
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = `${theme.border}88`;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  const drawCorner = (x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 52);
    ctx.lineTo(0, 0);
    ctx.lineTo(52, 0);
    ctx.stroke();
    ctx.fillStyle = theme.border;
    ctx.beginPath();
    ctx.arc(16, 16, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCorner(50, 50, 0);
  drawCorner(width - 50, 50, Math.PI / 2);
  drawCorner(width - 50, height - 50, Math.PI);
  drawCorner(50, height - 50, -Math.PI / 2);

  // 3. Header Section with Harmoniously Blended Official Logo Crest
  drawHarmoniousLogoCrest(
    ctx,
    logoImg,
    width / 2,
    158,
    78,
    theme.border,
    isLight
  );

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = theme.accent;
  ctx.font = 'bold 34px "Cairo", "Amiri", sans-serif';
  ctx.fillText('الرابطة الإسلامية في مدينة روستوك  •  Islamischer Bund Rostock e.V.', width / 2, 278);

  ctx.direction = isAr ? 'rtl' : 'ltr';
  ctx.fillStyle = theme.textSecondary;
  ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'مسجد روستوك الكبير  ۞  مسجد النور  •  Rostock, Deutschland'
      : 'Große Moschee Rostock  ۞  Al-Nour Moschee  •  Rostock, Deutschland',
    width / 2,
    316
  );

  // Main Poster Title
  ctx.fillStyle = theme.textPrimary;
  ctx.font = 'bold 46px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(isAr ? options.titleAr : options.titleDe, width / 2, 382);

  ctx.fillStyle = theme.border;
  ctx.font = '600 23px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(isAr ? options.subtitleAr : options.subtitleDe, width / 2, 424);

  // Optional Special Dua Ribbon for Ramadan Imsakiya Model
  let tableY = 478;
  let availableBodyH = 1620;

  if (layoutId === 'ramadan_imsakiya') {
    const ribbonX = 110;
    const ribbonY = 450;
    const ribbonW = width - 220;
    const ribbonH = 68;

    ctx.fillStyle = isLight ? `${theme.border}18` : `${theme.headerBg}cc`;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 21px "Cairo", "Amiri", sans-serif';
    ctx.fillText(
      isAr
        ? 'نِيَّةُ الصِّيَام: اللهم إني نويت صيام رمضان إيماناً واحتساباً  ۞  دُعَاءُ الإِفْطَار: ذهب الظَّمأ وابتلَّت العروق وثبت الأجر إن شاء الله'
        : 'Fasten-Absicht & Iftar-Bittgebet: „Der Durst ist vergangen, die Adern sind benetzt und der Lohn ist gewiss, so Allah will.“',
      width / 2,
      ribbonY + 42
    );

    tableY = 538;
    availableBodyH = 1560;
  } else {
    ctx.strokeStyle = `${theme.border}99`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(140, 454);
    ctx.lineTo(width - 140, 454);
    ctx.stroke();
  }

  // 4. Prayer Table
  const tableX = 84;
  const tableW = width - 168;
  const headerH = 62;
  const rowCount = Math.max(options.rows.length, 1);
  const rowH = Math.min(54, Math.floor(availableBodyH / rowCount));

  const cols = isAr
    ? [
        { key: 'day', label: options.mode === 'ramadan10y' ? 'رمضان' : 'اليوم', w: 165 },
        { key: 'greg', label: 'الميلادي', w: 175 },
        { key: 'hijri', label: 'الهجري', w: 255 },
        { key: 'imsak', label: 'الإمساك', w: 120 },
        { key: 'fajr', label: 'الفجر', w: 120 },
        { key: 'sunrise', label: 'الشروق', w: 120 },
        { key: 'dhuhr', label: 'الظهر', w: 120 },
        { key: 'asr', label: 'العصر', w: 120 },
        { key: 'maghrib', label: 'المغرب (الإفطار)', w: 171 },
        { key: 'isha', label: 'العشاء', w: 120 }
      ]
    : [
        { key: 'day', label: options.mode === 'ramadan10y' ? 'Ramadan' : 'Tag', w: 165 },
        { key: 'greg', label: 'Datum', w: 175 },
        { key: 'hijri', label: 'Hijri', w: 255 },
        { key: 'imsak', label: 'Imsak', w: 120 },
        { key: 'fajr', label: 'Fajr', w: 120 },
        { key: 'sunrise', label: 'Shuruq', w: 120 },
        { key: 'dhuhr', label: 'Dhuhr', w: 120 },
        { key: 'asr', label: 'Asr', w: 120 },
        { key: 'maghrib', label: 'Maghrib (Iftar)', w: 171 },
        { key: 'isha', label: 'Isha', w: 120 }
      ];

  const totalTableH = headerH + rowH * options.rows.length;
  ctx.fillStyle = theme.cardBg;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(tableX, tableY, tableW, totalTableH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(tableX, tableY, tableW, totalTableH, 14);
  ctx.clip();

  // Header Background
  ctx.fillStyle = theme.headerBg;
  ctx.fillRect(tableX, tableY, tableW, headerH);

  // Header Labels
  let curX = tableX;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (const col of cols) {
    ctx.fillStyle =
      col.key === 'maghrib'
        ? '#f6e09f'
        : col.key === 'imsak' && layoutId === 'ramadan_imsakiya'
        ? '#9ee7cf'
        : '#ffffff';
    ctx.font = 'bold 20px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(col.label, curX + col.w / 2, tableY + headerH / 2);
    curX += col.w;
  }

  // Rows
  options.rows.forEach((row, idx) => {
    const ry = tableY + headerH + idx * rowH;
    const isFriday = row.dayNameDe === 'Freitag';
    const isHighlight = row.isRamadan && options.mode === 'monthly';

    ctx.fillStyle =
      isHighlight || isFriday
        ? theme.rowHighlight
        : idx % 2 === 0
        ? theme.rowEven
        : theme.rowOdd;
    ctx.fillRect(tableX, ry, tableW, rowH);

    ctx.strokeStyle = `${theme.border}33`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tableX, ry + rowH);
    ctx.lineTo(tableX + tableW, ry + rowH);
    ctx.stroke();

    let cellX = tableX;
    for (const col of cols) {
      if (col.key === 'maghrib') {
        ctx.fillStyle = theme.maghribBg;
        ctx.fillRect(cellX, ry, col.w, rowH);
      } else if (col.key === 'imsak' && layoutId === 'ramadan_imsakiya') {
        ctx.fillStyle = theme.imsakBg;
        ctx.fillRect(cellX, ry, col.w, rowH);
      }

      ctx.strokeStyle = `${theme.border}22`;
      ctx.beginPath();
      ctx.moveTo(cellX, ry);
      ctx.lineTo(cellX, ry + rowH);
      ctx.stroke();

      const cx = cellX + col.w / 2;
      const cy = ry + rowH / 2;

      if (col.key === 'day') {
        ctx.direction = isAr ? 'rtl' : 'ltr';
        ctx.fillStyle = theme.textPrimary;
        ctx.font = 'bold 19px "Cairo", "Plus Jakarta Sans", sans-serif';
        const dayStr = isAr
          ? `\u200F${row.dayNumber}  ${row.dayNameAr}`
          : `${row.dayNumber}  ${row.dayNameDe}`;
        ctx.fillText(dayStr, cx, cy);
      } else if (col.key === 'greg') {
        ctx.direction = 'ltr';
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '600 19px "Plus Jakarta Sans", monospace';
        ctx.fillText(row.gregorianDate, cx, cy);
      } else if (col.key === 'hijri') {
        ctx.direction = isAr ? 'rtl' : 'ltr';
        ctx.fillStyle = row.isRamadan ? theme.maghribText : theme.textSecondary;
        ctx.font = row.isRamadan
          ? 'bold 19px "Cairo", "Plus Jakarta Sans", sans-serif'
          : '500 18px "Cairo", "Plus Jakarta Sans", sans-serif';
        const hijriStr = isAr
          ? `\u200F${row.hijri.day} ${row.hijri.monthNameAr} \u200F${row.hijri.year}`
          : `${row.hijri.day} ${row.hijri.monthNameDe} ${row.hijri.year}`;
        ctx.fillText(hijriStr, cx, cy);
      } else if (col.key === 'maghrib') {
        ctx.direction = 'ltr';
        ctx.fillStyle = theme.maghribText;
        ctx.font = 'bold 22px "Plus Jakarta Sans", monospace';
        ctx.fillText(row.maghrib, cx, cy);
      } else if (col.key === 'imsak' && layoutId === 'ramadan_imsakiya') {
        ctx.direction = 'ltr';
        ctx.fillStyle = theme.imsakText;
        ctx.font = 'bold 20px "Plus Jakarta Sans", monospace';
        ctx.fillText(row.imsak, cx, cy);
      } else {
        ctx.direction = 'ltr';
        ctx.fillStyle = col.key === 'sunrise' ? theme.textSecondary : theme.textPrimary;
        ctx.font = '600 20px "Plus Jakarta Sans", monospace';
        const val = row[col.key as 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'isha'];
        ctx.fillText(val, cx, cy);
      }

      cellX += col.w;
    }
  });

  ctx.restore();

  // 5. Footer Info on Poster
  const footerY = tableY + totalTableH + 46;
  ctx.textAlign = 'center';
  ctx.direction = isAr ? 'rtl' : 'ltr';
  ctx.fillStyle = theme.textSecondary;
  ctx.font = '600 19px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'مسجد روستوك الكبير: Erich-Schlesinger-Str. 21, 18059  •  مسجد النور: Salvador-Allende-Str. 28/29, 18147 Rostock  •  \u200E+49 176 45639663\u200E'
      : 'Große Moschee: Erich-Schlesinger-Str. 21, 18059  •  Al-Nour Moschee: Salvador-Allende-Str. 28/29, 18147 Rostock  •  +49 176 45639663',
    width / 2,
    Math.min(footerY, height - 108)
  );

  ctx.fillStyle = theme.border;
  ctx.font = 'bold 20px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'تقبل الله منا ومنكم الصيام والقيام وصالح الأعمال • توقيت مدينة روستوك \u200E(CET/CEST)\u200E'
      : 'Möge Allah unser aller Gebete und Fasten annehmen • Ortszeit Rostock (CET/CEST)',
    width / 2,
    Math.min(footerY + 38, height - 68)
  );
}

export async function downloadSchedulePosterPng(
  options: SchedulePosterOptions,
  fileName: string
): Promise<void> {
  const offscreen = document.createElement('canvas');
  await drawSchedulePosterToCanvas(offscreen, options);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = offscreen.toDataURL('image/png');
  link.click();
}
