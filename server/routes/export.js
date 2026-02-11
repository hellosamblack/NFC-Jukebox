const express = require('express');
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { renderStickerToBuffer, renderBackgroundToBuffer, renderStickerToPDFPage } = require('../services/renderService');
const { STICKER_DIMENSIONS } = require('../utils/constants');

const router = express.Router();

/**
 * POST /render-sticker
 * Render a single sticker PNG from config, return base64.
 */
router.post('/render-sticker', async (req, res) => {
  try {
    const config = req.body;

    if (!config || (!config.imageUrl && !config.imageBase64)) {
      return res.status(400).json({
        error: 'Invalid config',
        message: 'Sticker config must include imageUrl or imageBase64',
      });
    }

    const buffer = await renderStickerToBuffer(config);

    res.json({
      image: `data:image/png;base64,${buffer.toString('base64')}`,
      width: STICKER_DIMENSIONS.BLEED.pixels.w,
      height: STICKER_DIMENSIONS.BLEED.pixels.h,
    });
  } catch (err) {
    res.status(500).json({ error: 'Render failed', message: err.message });
  }
});

/**
 * POST /export-project
 * Render all stickers and package into a ZIP.
 */
router.post('/export-project', async (req, res) => {
  try {
    const { stickers } = req.body;

    if (!stickers || !Array.isArray(stickers) || stickers.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must include a non-empty "stickers" array',
      });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="nfc-jukebox-stickers-${uuidv4().slice(0, 8)}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Archive error', message: err.message });
      }
      res.end();
    });
    res.on('close', () => {
      archive.abort();
    });
    archive.pipe(res);

    for (let i = 0; i < stickers.length; i++) {
      const config = stickers[i];
      const buffer = await renderStickerToBuffer(config);
      const safeName = (config.title || `sticker-${i + 1}`)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 60);
      archive.append(buffer, { name: `${String(i + 1).padStart(2, '0')}-${safeName}.png` });
    }

    await archive.finalize();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Export failed', message: err.message });
    }
  }
});

/**
 * POST /export-pdf
 * Render all stickers into a multi-page PDF.
 */
router.post('/export-pdf', async (req, res) => {
  try {
    const { stickers } = req.body;

    if (!stickers || !Array.isArray(stickers) || stickers.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must include a non-empty "stickers" array',
      });
    }

    const ptW = STICKER_DIMENSIONS.BLEED.inches.w * 72;
    const ptH = STICKER_DIMENSIONS.BLEED.inches.h * 72;

    const doc = new PDFDocument({
      autoFirstPage: false,
      size: [ptW, ptH],
      margin: 0,
      info: {
        Title: 'NFC Jukebox Stickers',
        Creator: 'NFC Jukebox',
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="nfc-jukebox-stickers-${uuidv4().slice(0, 8)}.pdf"`);

    doc.pipe(res);

    for (const config of stickers) {
      // Render only the background image (vignette, no text) — text is drawn as PDF vectors
      const imageBuffer = await renderBackgroundToBuffer(config);
      await renderStickerToPDFPage(doc, config, imageBuffer);
    }

    doc.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF export failed', message: err.message });
    }
  }
});

module.exports = router;
