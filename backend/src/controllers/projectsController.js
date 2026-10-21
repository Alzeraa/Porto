const db = require('../config/database');

// GET all projects (Public)
exports.getAllProjects = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY order_index ASC, id DESC').all();
    const formatted = rows.map(r => ({
      ...r,
      tech: JSON.parse(r.tech || '[]')
    }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat proyek.' });
  }
};

// POST add project (Admin)
exports.createProject = (req, res) => {
  try {
    const { title, category, description, tech, image, link, order_index } = req.body;
    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul dan deskripsi wajib diisi!' });
    }

    const techStr = Array.isArray(tech) ? JSON.stringify(tech) : JSON.stringify([]);
    const defaultImg = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800';

    const stmt = db.prepare(`
      INSERT INTO projects (title, category, description, tech, image, link, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title,
      category || 'Full-Stack Web',
      description,
      techStr,
      image || defaultImg,
      link || '',
      order_index || 0
    );

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    created.tech = JSON.parse(created.tech);

    res.status(201).json({ status: 'success', message: 'Proyek berhasil ditambahkan!', data: created });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan proyek.' });
  }
};

// PUT update project (Admin)
exports.updateProject = (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, tech, image, link, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Proyek tidak ditemukan.' });
    }

    const techStr = tech ? (Array.isArray(tech) ? JSON.stringify(tech) : JSON.stringify([tech])) : existing.tech;

    db.prepare(`
      UPDATE projects SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        tech = ?,
        image = COALESCE(?, image),
        link = COALESCE(?, link),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      title ?? null,
      category ?? null,
      description ?? null,
      techStr,
      image ?? null,
      link ?? null,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    updated.tech = JSON.parse(updated.tech);

    res.json({ status: 'success', message: 'Proyek berhasil diperbarui!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui proyek.' });
  }
};

// DELETE project (Admin)
exports.deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Proyek tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Proyek berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus proyek.' });
  }
};
