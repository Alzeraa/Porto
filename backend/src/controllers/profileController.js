const db = require('../config/database');

// GET Profile (Public)
exports.getProfile = (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json({
      status: 'success',
      data: profile || {}
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat profil.' });
  }
};

// PUT Profile (Admin)
exports.updateProfile = (req, res) => {
  try {
    const {
      name,
      badge,
      title,
      subtitle,
      bio,
      whatsapp,
      email,
      github,
      linkedin,
      logo_url,
      cta_primary_text,
      cta_primary_link,
      cta_secondary_text,
      cta_secondary_link,
      trusted_by_title,
      tech_stack_title,
      tech_stack
    } = req.body;

    db.prepare(`
      UPDATE profile SET
        name = COALESCE(?, name),
        badge = COALESCE(?, badge),
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        bio = COALESCE(?, bio),
        whatsapp = COALESCE(?, whatsapp),
        email = COALESCE(?, email),
        github = COALESCE(?, github),
        linkedin = COALESCE(?, linkedin),
        logo_url = COALESCE(?, logo_url),
        cta_primary_text = COALESCE(?, cta_primary_text),
        cta_primary_link = COALESCE(?, cta_primary_link),
        cta_secondary_text = COALESCE(?, cta_secondary_text),
        cta_secondary_link = COALESCE(?, cta_secondary_link),
        trusted_by_title = COALESCE(?, trusted_by_title),
        tech_stack_title = COALESCE(?, tech_stack_title),
        tech_stack = COALESCE(?, tech_stack),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      name ?? null,
      badge ?? null,
      title ?? null,
      subtitle ?? null,
      bio ?? null,
      whatsapp ?? null,
      email ?? null,
      github ?? null,
      linkedin ?? null,
      logo_url ?? null,
      cta_primary_text ?? null,
      cta_primary_link ?? null,
      cta_secondary_text ?? null,
      cta_secondary_link ?? null,
      trusted_by_title ?? null,
      tech_stack_title ?? null,
      tech_stack ?? null
    );

    const updated = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json({
      status: 'success',
      message: 'Profil & data Hero berhasil diperbarui!',
      data: updated
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui profil.' });
  }
};
