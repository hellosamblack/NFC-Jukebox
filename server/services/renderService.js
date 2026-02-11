const sharp = require('sharp');
const { URL } = require('url');
const { STICKER_DIMENSIONS, DPI } = require('../utils/constants');
const { getGenreConfig } = require('./genreService');

const BLEED_W = STICKER_DIMENSIONS.BLEED.pixels.w;
const BLEED_H = STICKER_DIMENSIONS.BLEED.pixels.h;
const SAFE_W = STICKER_DIMENSIONS.SAFE.pixels.w;
const SAFE_H = STICKER_DIMENSIONS.SAFE.pixels.h;

const SAFE_X = Math.round((BLEED_W - SAFE_W) / 2);
const SAFE_Y = Math.round((BLEED_H - SAFE_H) / 2);

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const FETCH_TIMEOUT_MS = 15000;

/**
 * Validate a URL is safe to fetch (block private IPs, non-http(s) schemes).
 */
function validateImageUrl(urlStr) {
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch {
    throw new Error('Invalid image URL');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }

  const hostname = parsed.hostname;

  // Block private/internal ranges
  const blockedPatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^0\./,
    /^22[4-9]\./,
    /^2[3-5]\d\./,
    /^24[0-9]\./,
    /^25[0-5]\./,
    /^\[::1\]/,
    /^\[fc/i,
    /^\[fd/i,
    /^\[fe80/i,
    /^metadata\.google\.internal$/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(hostname)) {
      throw new Error('URLs pointing to private/internal networks are not allowed');
    }
  }

  return parsed;
}

/**
 * Fetch image from URL or decode from base64, return a Sharp instance.
 */
async function loadSourceImage(config) {
  if (config.imageBase64) {
    const base64Data = config.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    return sharp(Buffer.from(base64Data, 'base64'));
  }

  if (config.imageUrl) {
    validateImageUrl(config.imageUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(config.imageUrl, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        throw new Error(`Unexpected content-type: ${contentType}. Expected an image.`);
      }

      const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
      if (contentLength > 0 && contentLength > MAX_IMAGE_SIZE) {
        throw new Error(`Image too large (${contentLength} bytes). Max: ${MAX_IMAGE_SIZE} bytes.`);
      }

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_IMAGE_SIZE) {
        throw new Error(`Image too large (${arrayBuffer.byteLength} bytes). Max: ${MAX_IMAGE_SIZE} bytes.`);
      }

      return sharp(Buffer.from(arrayBuffer));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error('No image source provided (imageUrl or imageBase64 required)');
}

/**
 * Build an SVG string for the vignetting overlay (dark edges).
 */
function buildVignetteOverlay(width, height) {
  return Buffer.from(`<svg width="${width}" height="${height}">
    <defs>
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="transparent" />
        <stop offset="70%" stop-color="transparent" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.55)" />
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#vignette)" />
  </svg>`);
}

/**
 * Escape special XML characters for safe SVG embedding.
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Map genre fontFamily to a system-safe fallback chain.
 * Google Fonts may not be installed on the server; these fallbacks
 * ensure consistent rendering across environments.
 */
const SYSTEM_FONT_FALLBACKS = {
  serif: 'Georgia, "Times New Roman", Times, serif',
  'sans-serif': 'Arial, Helvetica, "Liberation Sans", sans-serif',
  monospace: '"Courier New", Courier, monospace',
};

function buildFontStack(genreFontFamily) {
  // Provide the genre font first (available if installed), then system fallbacks
  return `"${genreFontFamily}", ${SYSTEM_FONT_FALLBACKS['sans-serif']}`;
}

/**
 * Build an SVG string for text and genre icon overlay.
 */
function buildTextOverlay(width, height, config) {
  const genre = config.genre || 'Default';
  const genreConfig = getGenreConfig(genre);
  const title = escapeXml(config.customTitle || config.title || 'Unknown Title');
  const subtitle = escapeXml(config.customSubtitle || config.subtitle || 'Unknown Artist');
  const iconColor = genreConfig.color;
  const icon = escapeXml(genreConfig.icon);
  const fontStack = escapeXml(buildFontStack(genreConfig.fontFamily));

  const gradientHeight = Math.round(height * 0.45);
  const gradientY = height - gradientHeight;

  const textX = SAFE_X + 24;
  const titleY = height - SAFE_Y - 60;
  const subtitleY = height - SAFE_Y - 24;

  const iconX = SAFE_X + SAFE_W - 60;
  const iconY = SAFE_Y + 16;
  const iconR = 22;

  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)" />
        <stop offset="40%" stop-color="rgba(0,0,0,0.3)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.75)" />
      </linearGradient>
    </defs>

    <!-- Bottom gradient bar -->
    <rect x="0" y="${gradientY}" width="${width}" height="${gradientHeight}" fill="url(#bottomGrad)" />

    <!-- Title text -->
    <text x="${textX}" y="${titleY}" fill="white" font-size="42" font-weight="bold"
          font-family="${fontStack}"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
      ${title}
    </text>

    <!-- Subtitle text -->
    <text x="${textX}" y="${subtitleY}" fill="rgba(255,255,255,0.9)" font-size="28" font-weight="400"
          font-family="${fontStack}"
          filter="drop-shadow(0 1px 3px rgba(0,0,0,0.5))">
      ${subtitle}
    </text>

    <!-- Genre icon circle -->
    <circle cx="${iconX}" cy="${iconY}" r="${iconR}" fill="${iconColor}" opacity="0.9" />
    <text x="${iconX}" y="${iconY + 8}" text-anchor="middle" font-size="22">${icon}</text>
  </svg>`);
}

/**
 * Render the background image with vignette only (no text), for PDF use.
 */
async function renderBackgroundToBuffer(config) {
  const source = await loadSourceImage(config);

  const base = await source
    .resize(BLEED_W, BLEED_H, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const vignetteOverlay = buildVignetteOverlay(BLEED_W, BLEED_H);

  return sharp(base)
    .composite([{ input: vignetteOverlay, top: 0, left: 0 }])
    .png()
    .withMetadata({ density: DPI })
    .toBuffer();
}

/**
 * Render a sticker to a PNG buffer (full render with text overlay).
 */
async function renderStickerToBuffer(config) {
  const bgBuffer = await renderBackgroundToBuffer(config);
  const textOverlay = buildTextOverlay(BLEED_W, BLEED_H, config);

  return sharp(bgBuffer)
    .composite([{ input: textOverlay, top: 0, left: 0 }])
    .png()
    .withMetadata({ density: DPI })
    .toBuffer();
}

/**
 * Select the best PDFKit built-in font for a genre.
 * PDFKit ships with Courier, Helvetica, Times-Roman (and bold/italic variants).
 * We map genre font styles to the closest built-in font.
 */
function getPDFFont(genreFontFamily) {
  // Serif-style genre fonts → Times-Roman
  const serifFonts = [
    'Playfair Display', 'Cormorant Garamond', 'Lora', 'Merriweather',
    'Libre Baskerville', 'EB Garamond', 'Cinzel', 'DM Serif Display', 'Bitter',
  ];
  if (serifFonts.includes(genreFontFamily)) {
    return { title: 'Times-Bold', subtitle: 'Times-Roman' };
  }
  // Default: sans-serif → Helvetica
  return { title: 'Helvetica-Bold', subtitle: 'Helvetica' };
}

/**
 * Render sticker content onto a PDFKit page.
 */
async function renderStickerToPDFPage(doc, config, imageBuffer) {
  const ptW = (STICKER_DIMENSIONS.BLEED.inches.w * 72);
  const ptH = (STICKER_DIMENSIONS.BLEED.inches.h * 72);

  doc.addPage({ size: [ptW, ptH], margin: 0 });

  // Draw background image
  doc.image(imageBuffer, 0, 0, { width: ptW, height: ptH });

  // Bottom gradient simulation (semi-transparent rectangles)
  const gradientSteps = 20;
  const gradientHeight = ptH * 0.4;
  const gradientY = ptH - gradientHeight;
  for (let i = 0; i < gradientSteps; i++) {
    const opacity = (i / gradientSteps) * 0.7;
    const stepH = gradientHeight / gradientSteps;
    doc
      .rect(0, gradientY + i * stepH, ptW, stepH)
      .fill({ color: '#000000', opacity });
  }

  const genre = config.genre || 'Default';
  const genreConfig = getGenreConfig(genre);
  const title = config.customTitle || config.title || 'Unknown Title';
  const subtitle = config.customSubtitle || config.subtitle || 'Unknown Artist';
  const pdfFonts = getPDFFont(genreConfig.fontFamily);

  const safeXPt = (SAFE_X / BLEED_W) * ptW;
  const safeYPt = (SAFE_Y / BLEED_H) * ptH;
  const safeWPt = (SAFE_W / BLEED_W) * ptW;

  const textX = safeXPt + 12;
  const titleY = ptH - safeYPt - 42;
  const subtitleY = ptH - safeYPt - 18;

  // Title
  doc
    .font(pdfFonts.title)
    .fontSize(18)
    .fillColor('white')
    .text(title, textX, titleY, { width: safeWPt - 24, lineBreak: false, ellipsis: true });

  // Subtitle
  doc
    .font(pdfFonts.subtitle)
    .fontSize(12)
    .fillColor('white', 0.9)
    .text(subtitle, textX, subtitleY, { width: safeWPt - 24, lineBreak: false, ellipsis: true });

  // Genre icon circle in top-right
  const iconXPt = safeXPt + safeWPt - 28;
  const iconYPt = safeYPt + 12;
  doc
    .circle(iconXPt, iconYPt, 10)
    .fill(genreConfig.color);

  doc
    .fontSize(10)
    .fillColor('white')
    .text(genreConfig.icon, iconXPt - 5, iconYPt - 5, { width: 10, align: 'center' });
}

module.exports = { renderStickerToBuffer, renderBackgroundToBuffer, renderStickerToPDFPage };
