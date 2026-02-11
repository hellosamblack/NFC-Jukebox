import { useRef, useEffect } from 'react';
import { GENRES } from '../utils/genres';
import { STICKER_DIMENSIONS } from '../utils/constants';

const FULL_W = STICKER_DIMENSIONS.BLEED.pixels.w;
const FULL_H = STICKER_DIMENSIONS.BLEED.pixels.h;

export default function StickerPreview({ imageUrl, title, subtitle, genre = 'Default', width = 400 }) {
  const canvasRef = useRef(null);
  const config = GENRES[genre] || GENRES.Default;
  const scale = width / FULL_W;
  const height = Math.round(FULL_H * scale);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image covering the canvas
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > canvasAspect) {
        sw = img.height * canvasAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / canvasAspect;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      // Vignette overlay
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.7);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Bottom gradient bar
      const barH = height * 0.35;
      const grad = ctx.createLinearGradient(0, height - barH, 0, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.7)');
      grad.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, height - barH, width, barH);

      // Title text
      const titleSize = Math.round(18 * scale * 2);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${titleSize}px Inter, sans-serif`;
      ctx.textBaseline = 'bottom';
      const textX = 14 * scale * 2;
      const titleY = height - 12 * scale * 2;
      const subtitleSize = Math.round(12 * scale * 2);
      const subtitleY = titleY - titleSize * 0.2;
      ctx.fillText(truncateText(ctx, title || '', width * 0.75), textX, subtitleY);

      // Subtitle text
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `${subtitleSize}px Inter, sans-serif`;
      ctx.fillText(truncateText(ctx, subtitle || '', width * 0.75), textX, subtitleY + subtitleSize + 4);

      // Genre icon circle
      const circleR = 18 * scale * 2;
      const cx = width - circleR - 10 * scale * 2;
      const cy = circleR + 10 * scale * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.fill();
      ctx.font = `${Math.round(circleR)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.icon, cx, cy);
      ctx.textAlign = 'start';
    };

    img.onerror = () => {
      // Draw placeholder when image fails
      ctx.fillStyle = '#1a1a24';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#a0a0b5';
      ctx.font = `${Math.round(24 * scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No Image', width / 2, height / 2);
      ctx.textAlign = 'start';
    };

    if (imageUrl) {
      img.src = imageUrl;
    } else {
      img.onerror();
    }
  }, [imageUrl, title, subtitle, genre, width, height, config, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="rounded-lg shadow-lg"
    />
  );
}

function truncateText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}
