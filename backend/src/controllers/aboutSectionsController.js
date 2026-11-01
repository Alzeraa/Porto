const pool = require('../config/database');

// GET all About Sections (Public)
exports.getAllAboutSections = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM about_sections ORDER BY order_index ASC, id ASC');
    const formatted = rows.map(r => ({ ...r, items: r.items ? JSON.parse(r.items) : [] }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('Error fetching About Sections:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat About Sections.' });
  }
};

// POST add About Section (Admin)
exports.createAboutSection = async (req, res) => {
  try {
    const { type, title, subtitle, items, order_index } = req.body;
    if (!type || !title) {
      return res.status(400).json({ status: 'error', message: 'Type dan title wajib diisi!' });
    }

    const itemsStr = Array.isArray(items) ? JSON.stringify(items) : JSON.stringify([]);
    const { rows } = await pool.query(
      `INSERT INTO about_sections (type, title, subtitle, items, order_index)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [type, title, subtitle || '', itemsStr, order_index || 0]
    );
    const created = { ...rows[0], items: JSON.parse(rows[0].items) };
    res.status(201).json({ status: 'success', message: 'About Section berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create About Section error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan About Section.' });
  }
};

// PUT update About Section (Admin)
exports.updateAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, subtitle, items, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM about_sections WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'About Section tidak ditemukan.' });
    }

    const itemsStr = items
      ? (Array.isArray(items) ? JSON.stringify(items) : JSON.stringify([items]))
      : existing.items;

    const { rows } = await pool.query(`
      UPDATE about_sections SET
        type        = COALESCE($1, type),
        title       = COALESCE($2, title),
        subtitle    = COALESCE($3, subtitle),
        items       = $4,
        order_index = COALESCE($5, order_index)
      WHERE id = $6
      RETURNING *
    `, [type ?? null, title ?? null, subtitle ?? null, itemsStr, order_index ?? null, id]);

    const updated = { ...rows[0], items: JSON.parse(rows[0].items) };
    res.json({ status: 'success', message: 'About Section berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update About Section error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui About Section.' });
  }
};

// DELETE About Section (Admin)
exports.deleteAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM about_sections WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'About Section tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'About Section berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus About Section.' });
  }
};
