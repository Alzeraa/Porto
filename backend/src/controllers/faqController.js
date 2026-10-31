const db = require('../config/database');

// GET all FAQ items (Public)
exports.getAllFAQ = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM faq_items ORDER BY order_index ASC, id ASC').all();
    res.json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat FAQ.' });
  }
};

// POST add FAQ item (Admin)
exports.createFAQ = (req, res) => {
  try {
    const { question, answer, order_index } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ status: 'error', message: 'Pertanyaan dan jawaban wajib diisi!' });
    }

    const stmt = db.prepare(`
      INSERT INTO faq_items (question, answer, order_index)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(question, answer, order_index || 0);

    const created = db.prepare('SELECT * FROM faq_items WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ status: 'success', message: 'FAQ berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan FAQ.' });
  }
};

// PUT update FAQ item (Admin)
exports.updateFAQ = (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM faq_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'FAQ tidak ditemukan.' });
    }

    db.prepare(`
      UPDATE faq_items SET
        question = COALESCE(?, question),
        answer = COALESCE(?, answer),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      question ?? null,
      answer ?? null,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM faq_items WHERE id = ?').get(id);
    res.json({ status: 'success', message: 'FAQ berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui FAQ.' });
  }
};

// DELETE FAQ item (Admin)
exports.deleteFAQ = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM faq_items WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'FAQ tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'FAQ berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus FAQ.' });
  }
};
