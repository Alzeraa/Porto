const db = require('../config/database');

// GET all testimonials (Public)
exports.getAllTestimonials = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM testimonials ORDER BY order_index ASC, id ASC').all();
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat testimoni.' });
  }
};

// POST add testimonial (Admin)
exports.createTestimonial = (req, res) => {
  try {
    const { name, role, content, rating, photo, order_index } = req.body;
    if (!name || !content) {
      return res.status(400).json({ status: 'error', message: 'Nama dan isi testimoni wajib diisi!' });
    }

    const stmt = db.prepare(`INSERT INTO testimonials (name, role, content, rating, photo, order_index) VALUES (?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(name, role || '', content, rating || 5, photo || '', order_index || 0);
    const created = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ status: 'success', message: 'Testimoni berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan testimoni.' });
  }
};

// PUT update testimonial (Admin)
exports.updateTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, content, rating, photo, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Testimoni tidak ditemukan.' });
    }

    db.prepare(`
      UPDATE testimonials SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        content = COALESCE(?, content),
        rating = COALESCE(?, rating),
        photo = COALESCE(?, photo),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      name ?? null,
      role ?? null,
      content ?? null,
      rating ?? null,
      photo ?? null,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    res.json({ status: 'success', message: 'Testimoni berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui testimoni.' });
  }
};

// DELETE testimonial (Admin)
exports.deleteTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Testimoni tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Testimoni berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus testimoni.' });
  }
};
