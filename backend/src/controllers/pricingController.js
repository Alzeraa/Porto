const pool = require('../config/database');

// GET all pricing packages (Public)
exports.getAllPricing = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pricing ORDER BY order_index ASC, id ASC');
    const formatted = rows.map(r => ({
      ...r,
      popular: r.popular === 1 || r.popular === true,
      features: JSON.parse(r.features || '[]'),
    }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat paket harga.' });
  }
};

// POST add pricing package (Admin)
exports.createPricing = async (req, res) => {
  try {
    const { name, price, popular, features, order_index } = req.body;
    if (!name || !price) {
      return res.status(400).json({ status: 'error', message: 'Nama paket dan harga wajib diisi!' });
    }

    const featStr = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const { rows } = await pool.query(
      `INSERT INTO pricing (name, price, popular, features, order_index)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, price, popular ? 1 : 0, featStr, order_index || 0]
    );
    const created = { ...rows[0], features: JSON.parse(rows[0].features), popular: rows[0].popular === 1 };
    res.status(201).json({ status: 'success', message: 'Paket harga berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create pricing error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan paket harga.' });
  }
};

// PUT update pricing package (Admin)
exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, popular, features, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM pricing WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan.' });
    }

    const featStr = features
      ? (Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]))
      : existing.features;
    const popularVal = popular !== undefined ? (popular ? 1 : 0) : existing.popular;

    const { rows } = await pool.query(`
      UPDATE pricing SET
        name        = COALESCE($1, name),
        price       = COALESCE($2, price),
        popular     = $3,
        features    = $4,
        order_index = COALESCE($5, order_index)
      WHERE id = $6
      RETURNING *
    `, [name ?? null, price ?? null, popularVal, featStr, order_index ?? null, id]);

    const updated = { ...rows[0], features: JSON.parse(rows[0].features), popular: rows[0].popular === 1 };
    res.json({ status: 'success', message: 'Paket harga berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui paket harga.' });
  }
};

// DELETE pricing package (Admin)
exports.deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM pricing WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Paket harga berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus paket harga.' });
  }
};
