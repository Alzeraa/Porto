const db = require('../config/database');

// GET Theme Settings
exports.getTheme = (req, res) => {
  try {
    const theme = db.prepare('SELECT * FROM theme_settings WHERE id = 1').get();
    res.json({
      status: 'success',
      data: theme || {}
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat tema.' });
  }
};

// PUT Theme Settings (Admin)
exports.updateTheme = (req, res) => {
  try {
    const {
      primary_color,
      primary_light,
      primary_dark,
      accent_color,
      background_dark,
      text_primary,
      logo_url
    } = req.body;

    db.prepare(`
      UPDATE theme_settings SET
        primary_color = COALESCE(?, primary_color),
        primary_light = COALESCE(?, primary_light),
        primary_dark = COALESCE(?, primary_dark),
        accent_color = COALESCE(?, accent_color),
        background_dark = COALESCE(?, background_dark),
        text_primary = COALESCE(?, text_primary),
        logo_url = COALESCE(?, logo_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      primary_color ?? null,
      primary_light ?? null,
      primary_dark ?? null,
      accent_color ?? null,
      background_dark ?? null,
      text_primary ?? null,
      logo_url ?? null
    );

    const updated = db.prepare('SELECT * FROM theme_settings WHERE id = 1').get();
    res.json({
      status: 'success',
      message: 'Tema berhasil diperbarui!',
      data: updated
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui tema.' });
  }
};
