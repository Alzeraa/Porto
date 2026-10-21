const db = require('../config/database');

// GET all services (Public)
exports.getAllServices = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY order_index ASC, id ASC').all();
    const formatted = rows.map(r => ({
      ...r,
      features: JSON.parse(r.features || '[]')
    }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat layanan.' });
  }
};

// POST add service (Admin)
exports.createService = (req, res) => {
  try {
    const { icon, title, description, features, order_index } = req.body;
    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul dan deskripsi wajib diisi!' });
    }

    const featStr = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
    const stmt = db.prepare(`
      INSERT INTO services (icon, title, description, features, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(icon || '⚡', title, description, featStr, order_index || 0);

    const created = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    created.features = JSON.parse(created.features);

    res.status(201).json({ status: 'success', message: 'Layanan berhasil ditambahkan!', data: created });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan layanan.' });
  }
};

// PUT update service (Admin)
exports.updateService = (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Layanan tidak ditemukan.' });
    }

    const featStr = features ? (Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features])) : existing.features;

    db.prepare(`
      UPDATE services SET
        icon = COALESCE(?, icon),
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        features = ?,
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      icon ?? null,
      title ?? null,
      description ?? null,
      featStr,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    updated.features = JSON.parse(updated.features);

    res.json({ status: 'success', message: 'Layanan berhasil diperbarui!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui layanan.' });
  }
};

// DELETE service (Admin)
exports.deleteService = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM services WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Layanan tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Layanan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus layanan.' });
  }
};
