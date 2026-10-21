const db = require('../config/database');

// GET all pricing packages (Public)
exports.getAllPricing = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM pricing ORDER BY order_index ASC, id ASC').all();
    const formatted = rows.map(r => ({
      ...r,
      popular: r.popular === 1 || r.popular === true,
      features: JSON.parse(r.features || '[]')
    }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat paket harga.' });
  }
};

// POST add pricing package (Admin)
exports.createPricing = (req, res) => {
  try {
    const { name, price, popular, features, order_index } = req.body;
    if (!name || !price) {
      return res.status(400).json({ status: 'error', message: 'Nama paket dan harga wajib diisi!' });
    }

    const featStr = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const stmt = db.prepare(`INSERT INTO pricing (name, price, popular, features, order_index) VALUES (?, ?, ?, ?, ?)`);
    const result = stmt.run(name, price, popular ? 1 : 0, featStr, order_index || 0);
    const created = db.prepare('SELECT * FROM pricing WHERE id = ?').get(result.lastInsertRowid);
    created.features = JSON.parse(created.features);
    created.popular = created.popular === 1;

    res.status(201).json({ status: 'success', message: 'Paket harga berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create pricing error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan paket harga.' });
  }
};

// PUT update pricing package (Admin)
exports.updatePricing = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, popular, features, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM pricing WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan.' });
    }

    const featStr = features
      ? (Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]))
      : existing.features;

    db.prepare(`
      UPDATE pricing SET
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        popular = ?,
        features = ?,
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      name ?? null,
      price ?? null,
      popular !== undefined ? (popular ? 1 : 0) : existing.popular,
      featStr,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM pricing WHERE id = ?').get(id);
    updated.features = JSON.parse(updated.features);
    updated.popular = updated.popular === 1;

    res.json({ status: 'success', message: 'Paket harga berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui paket harga.' });
  }
};

// DELETE pricing package (Admin)
exports.deletePricing = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM pricing WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Paket harga berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus paket harga.' });
  }
};
