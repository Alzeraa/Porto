const pool = require('../config/database');

// GET Theme Settings
exports.getTheme = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM theme_settings WHERE id = 1');
    res.json({ status: 'success', data: rows[0] || {} });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat tema.' });
  }
};

// PUT Theme Settings (Admin)
exports.updateTheme = async (req, res) => {
  try {
    const { primary_color, primary_light, primary_dark, accent_color, background_dark, text_primary, logo_url } = req.body;

    const { rows } = await pool.query(`
      UPDATE theme_settings SET
        primary_color   = COALESCE($1, primary_color),
        primary_light   = COALESCE($2, primary_light),
        primary_dark    = COALESCE($3, primary_dark),
        accent_color    = COALESCE($4, accent_color),
        background_dark = COALESCE($5, background_dark),
        text_primary    = COALESCE($6, text_primary),
        logo_url        = COALESCE($7, logo_url),
        updated_at      = NOW()
      WHERE id = 1
      RETURNING *
    `, [
      primary_color ?? null, primary_light ?? null, primary_dark ?? null,
      accent_color ?? null, background_dark ?? null, text_primary ?? null, logo_url ?? null,
    ]);

    res.json({ status: 'success', message: 'Tema berhasil diperbarui!', data: rows[0] });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui tema.' });
  }
};
