import { DaySchedule } from './prayerTimes';
import { Language } from './translations';

export const ASSOCIATION_LOGO_PATH = '/assets/aistudio/Untitled_design_ede8bbc1.png';

export type PosterThemeId = 'emerald' | 'ivory' | 'midnight';

export interface PosterTheme {
  id: PosterThemeId;
  nameAr: string;
  nameDe: string;
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
    maghribText: '#f6e09f'
  },
  {
    id: 'ivory',
    nameAr: 'اللؤلؤ الفاخر (مناسب للطباعة)',
    nameDe: 'Elfenbein Klassik (Druckfreundlich)',
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
    maghribText: '#8c620a'
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
    maghribText: '#fde68a'
  }
];

let cachedTransparentLogo: HTMLCanvasElement | null = null;

// Load logo and cleanly key out its uniform off-white background so it blends seamlessly into any design
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
        const imgData = octx.getImageData(0, 0, off.width, off.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          // Sample corner studio background (~245, 244, 240); low-saturation bright pixels fade smoothly to transparent
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const spread = maxC - minC;
          if (minC > 215 && spread < 26) {
            // Smooth edge feathering between minC 215..238
            const factor = Math.max(0, Math.min(1, (238 - minC) / 23));
            d[i + 3] = Math.round(d[i + 3] * factor);
          }
        }
        octx.putImageData(imgData, 0, 0);
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
    // Soft ambient outer glow behind the crest
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius * 1.45);
    glow.addColorStop(0, `${borderColor}44`);
    glow.addColorStop(1, `${borderColor}00`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Warm champagne-parchment satin medallion that harmonizes with emerald/gold/midnight
    const medGrad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
    medGrad.addColorStop(0, '#fcf8ee');
    medGrad.addColorStop(0.65, '#f2e6c8');
    medGrad.addColorStop(1, '#dfc68c');
    ctx.fillStyle = medGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Double ornamental gold border + 8 subtle star points around rim
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
    // On ivory/light parchment: subtle delicate gold ring around the blended logo with zero background patch
    ctx.strokeStyle = `${borderColor}55`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw the background-removed logo centered cleanly
  const imgSize = radius * 1.72;
  ctx.drawImage(logoCanvas, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
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
  const logoImg = await loadAssociationLogo();
  const isAr = options.lang === 'ar';

  // 1. Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgTop);
  grad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative stars/dots on dark themes
  if (theme.id !== 'ivory') {
    ctx.fillStyle = `${theme.border}22`;
    for (let i = 0; i < 65; i++) {
      const sx = ((i * 293) % (width - 160)) + 80;
      const sy = ((i * 179) % 340) + 60;
      ctx.beginPath();
      ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
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
    162,
    82,
    theme.border,
    theme.id === 'ivory'
  );

  // Bismillah & Association Titles
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.accent;
  ctx.font = 'bold 34px "Cairo", "Amiri", sans-serif';
  ctx.fillText('الرابطة الإسلامية في مدينة روستوك  •  Islamischer Bund Rostock e.V.', width / 2, 286);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = '600 22px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'مسجد روستوك الكبير  ۞  مسجد النور  •  Rostock, Deutschland'
      : 'Große Moschee Rostock  ۞  Al-Nour Moschee  •  Rostock, Deutschland',
    width / 2,
    324
  );

  // Main Poster Title
  ctx.fillStyle = theme.textPrimary;
  ctx.font = 'bold 46px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(isAr ? options.titleAr : options.titleDe, width / 2, 392);

  ctx.fillStyle = theme.border;
  ctx.font = '600 24px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(isAr ? options.subtitleAr : options.subtitleDe, width / 2, 434);

  // Decorative divider
  ctx.strokeStyle = `${theme.border}99`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, 462);
  ctx.lineTo(width - 140, 462);
  ctx.stroke();

  // 4. Prayer Table
  const tableX = 84;
  const tableY = 490;
  const tableW = width - 168;
  const headerH = 62;
  const availableBodyH = 1610;
  const rowCount = Math.max(options.rows.length, 1);
  const rowH = Math.min(54, Math.floor(availableBodyH / rowCount));

  // Column definitions (Left to Right for both, or mirrored neatly)
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
        { key: 'sunrise', label: 'Aufgang', w: 120 },
        { key: 'dhuhr', label: 'Dhuhr', w: 120 },
        { key: 'asr', label: 'Asr', w: 120 },
        { key: 'maghrib', label: 'Maghrib (Iftar)', w: 171 },
        { key: 'isha', label: 'Isha', w: 120 }
      ];

  // Outer Table Container Shadow/Border
  const totalTableH = headerH + rowH * options.rows.length;
  ctx.fillStyle = theme.cardBg;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(tableX, tableY, tableW, totalTableH, 14);
  ctx.fill();
  ctx.stroke();

  // Clip inside rounded rect for crisp rows
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
    ctx.fillStyle = col.key === 'maghrib' ? '#f6e09f' : '#ffffff';
    ctx.font = 'bold 20px "Cairo", "Plus Jakarta Sans", sans-serif';
    ctx.fillText(col.label, curX + col.w / 2, tableY + headerH / 2);
    curX += col.w;
  }

  // Rows
  options.rows.forEach((row, idx) => {
    const ry = tableY + headerH + idx * rowH;
    const isFriday = row.dayNameDe === 'Freitag';
    const isHighlight = row.isRamadan && options.mode === 'monthly';

    ctx.fillStyle = isHighlight || isFriday
      ? theme.rowHighlight
      : idx % 2 === 0
      ? theme.rowEven
      : theme.rowOdd;
    ctx.fillRect(tableX, ry, tableW, rowH);

    // Subtle row separator
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
      }

      // Column vertical divider
      ctx.strokeStyle = `${theme.border}22`;
      ctx.beginPath();
      ctx.moveTo(cellX, ry);
      ctx.lineTo(cellX, ry + rowH);
      ctx.stroke();

      const cx = cellX + col.w / 2;
      const cy = ry + rowH / 2;

      if (col.key === 'day') {
        ctx.fillStyle = theme.textPrimary;
        ctx.font = 'bold 19px "Cairo", "Plus Jakarta Sans", sans-serif';
        const dayStr = `${row.dayNumber}  ${isAr ? row.dayNameAr : row.dayNameDe}`;
        ctx.fillText(dayStr, cx, cy);
      } else if (col.key === 'greg') {
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '600 19px "Plus Jakarta Sans", monospace';
        ctx.fillText(row.gregorianDate, cx, cy);
      } else if (col.key === 'hijri') {
        ctx.fillStyle = row.isRamadan ? theme.maghribText : theme.textSecondary;
        ctx.font = row.isRamadan
          ? 'bold 19px "Cairo", "Plus Jakarta Sans", sans-serif'
          : '500 18px "Cairo", "Plus Jakarta Sans", sans-serif';
        const hijriStr = `${row.hijri.day} ${isAr ? row.hijri.monthNameAr : row.hijri.monthNameDe} ${row.hijri.year}`;
        ctx.fillText(hijriStr, cx, cy);
      } else if (col.key === 'maghrib') {
        ctx.fillStyle = theme.maghribText;
        ctx.font = 'bold 22px "Plus Jakarta Sans", monospace';
        ctx.fillText(row.maghrib, cx, cy);
      } else {
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
  ctx.fillStyle = theme.textSecondary;
  ctx.font = '600 19px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'مسجد روستوك الكبير: Erich-Schlesinger-Str. 21, 18059  •  مسجد النور: Salvador-Allende-Str. 28/29, 18147 Rostock  •  +49 176 45639663'
      : 'Große Moschee: Erich-Schlesinger-Str. 21, 18059  •  Al-Nour Moschee: Salvador-Allende-Str. 28/29, 18147 Rostock  •  +49 176 45639663',
    width / 2,
    Math.min(footerY, height - 108)
  );

  ctx.fillStyle = theme.border;
  ctx.font = 'bold 20px "Cairo", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isAr
      ? 'تقبل الله منا ومنكم الصيام والقيام وصالح الأعمال • توقيت مدينة روستوك (CET/CEST)'
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
