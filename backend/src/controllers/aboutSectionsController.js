const db = require('../config/database');

// GET all About Sections (Public)
exports.getAllAboutSections = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM about_sections ORDER BY order_index ASC, id ASC').all();
    const formatted = rows.map(r => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : []
    }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    console.error('Error fetching About Sections:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat About Sections.' });
  }
};

// POST add About Section (Admin)
exports.createAboutSection = (req, res) => {
  try {
    const { type, title, subtitle, items, order_index } = req.body;
    if (!type || !title) {
      return res.status(400).json({ status: 'error', message: 'Type dan title wajib diisi!' });
    }

    const itemsStr = Array.isArray(items) ? JSON.stringify(items) : JSON.stringify([]);
    
    const stmt = db.prepare(`
      INSERT INTO about_sections (type, title, subtitle, items, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(type, title, subtitle || '', itemsStr, order_index || 0);

    const created = db.prepare('SELECT * FROM about_sections WHERE id = ?').get(result.lastInsertRowid);
    created.items = JSON.parse(created.items);

    res.status(201).json({ status: 'success', message: 'About Section berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create About Section error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan About Section.' });
  }
};

// PUT update About Section (Admin)
exports.updateAboutSection = (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, subtitle, items, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM about_sections WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'About Section tidak ditemukan.' });
    }

    const itemsStr = items ? (Array.isArray(items) ? JSON.stringify(items) : JSON.stringify([items])) : existing.items;

    db.prepare(`
      UPDATE about_sections SET
        type = COALESCE(?, type),
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        items = ?,
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      type ?? null,
      title ?? null,
      subtitle ?? null,
      itemsStr,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM about_sections WHERE id = ?').get(id);
    updated.items = JSON.parse(updated.items);

    res.json({ status: 'success', message: 'About Section berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update About Section error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui About Section.' });
  }
};

// DELETE About Section (Admin)
exports.deleteAboutSection = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM about_sections WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'About Section tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'About Section berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus About Section.' });
  }
};
