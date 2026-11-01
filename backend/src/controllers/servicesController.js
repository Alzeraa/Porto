const pool = require('../config/database');

// GET all services (Public)
exports.getAllServices = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY order_index ASC, id ASC');
    const formatted = rows.map(r => ({ ...r, features: JSON.parse(r.features || '[]') }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat layanan.' });
  }
};

// POST add service (Admin)
exports.createService = async (req, res) => {
  try {
    const { icon, title, description, features, order_index } = req.body;
    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul dan deskripsi wajib diisi!' });
    }

    const featStr = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const { rows } = await pool.query(
      `INSERT INTO services (icon, title, description, features, order_index)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [icon || '⚡', title, description, featStr, order_index || 0]
    );
    const created = { ...rows[0], features: JSON.parse(rows[0].features) };
    res.status(201).json({ status: 'success', message: 'Layanan berhasil ditambahkan!', data: created });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan layanan.' });
  }
};

// PUT update service (Admin)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM services WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Layanan tidak ditemukan.' });
    }

    const featStr = features
      ? (Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]))
      : existing.features;

    const { rows } = await pool.query(`
      UPDATE services SET
        icon        = COALESCE($1, icon),
        title       = COALESCE($2, title),
        description = COALESCE($3, description),
        features    = $4,
        order_index = COALESCE($5, order_index)
      WHERE id = $6
      RETURNING *
    `, [icon ?? null, title ?? null, description ?? null, featStr, order_index ?? null, id]);

    const updated = { ...rows[0], features: JSON.parse(rows[0].features) };
    res.json({ status: 'success', message: 'Layanan berhasil diperbarui!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui layanan.' });
  }
};

// DELETE service (Admin)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Layanan tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Layanan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus layanan.' });
  }
};
