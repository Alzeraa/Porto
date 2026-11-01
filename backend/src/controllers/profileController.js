const pool = require('../config/database');

// GET Profile (Public)
exports.getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profile WHERE id = 1');
    res.json({ status: 'success', data: rows[0] || {} });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat profil.' });
  }
};

// PUT Profile (Admin)
exports.updateProfile = async (req, res) => {
  try {
    const {
      name, badge, title, subtitle, bio, whatsapp, email, github, linkedin,
      logo_url, cta_primary_text, cta_primary_link, cta_secondary_text,
      cta_secondary_link, trusted_by_title, tech_stack_title, tech_stack,
    } = req.body;

    await pool.query(`
      UPDATE profile SET
        name               = COALESCE($1,  name),
        badge              = COALESCE($2,  badge),
        title              = COALESCE($3,  title),
        subtitle           = COALESCE($4,  subtitle),
        bio                = COALESCE($5,  bio),
        whatsapp           = COALESCE($6,  whatsapp),
        email              = COALESCE($7,  email),
        github             = COALESCE($8,  github),
        linkedin           = COALESCE($9,  linkedin),
        logo_url           = COALESCE($10, logo_url),
        cta_primary_text   = COALESCE($11, cta_primary_text),
        cta_primary_link   = COALESCE($12, cta_primary_link),
        cta_secondary_text = COALESCE($13, cta_secondary_text),
        cta_secondary_link = COALESCE($14, cta_secondary_link),
        trusted_by_title   = COALESCE($15, trusted_by_title),
        tech_stack_title   = COALESCE($16, tech_stack_title),
        tech_stack         = COALESCE($17, tech_stack),
        updated_at         = NOW()
      WHERE id = 1
    `, [
      name ?? null, badge ?? null, title ?? null, subtitle ?? null, bio ?? null,
      whatsapp ?? null, email ?? null, github ?? null, linkedin ?? null,
      logo_url ?? null, cta_primary_text ?? null, cta_primary_link ?? null,
      cta_secondary_text ?? null, cta_secondary_link ?? null,
      trusted_by_title ?? null, tech_stack_title ?? null, tech_stack ?? null,
    ]);

    const { rows } = await pool.query('SELECT * FROM profile WHERE id = 1');
    res.json({ status: 'success', message: 'Profil & data Hero berhasil diperbarui!', data: rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui profil.' });
  }
};
