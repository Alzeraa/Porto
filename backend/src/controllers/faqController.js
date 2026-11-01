const pool = require('../config/database');

// GET all FAQ items (Public)
exports.getAllFAQ = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM faq_items ORDER BY order_index ASC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat FAQ.' });
  }
};

// POST add FAQ item (Admin)
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, order_index } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ status: 'error', message: 'Pertanyaan dan jawaban wajib diisi!' });
    }

    const { rows } = await pool.query(
      `INSERT INTO faq_items (question, answer, order_index)
       VALUES ($1,$2,$3) RETURNING *`,
      [question, answer, order_index || 0]
    );
    res.status(201).json({ status: 'success', message: 'FAQ berhasil ditambahkan!', data: rows[0] });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan FAQ.' });
  }
};

// PUT update FAQ item (Admin)
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM faq_items WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'FAQ tidak ditemukan.' });
    }

    const { rows } = await pool.query(`
      UPDATE faq_items SET
        question    = COALESCE($1, question),
        answer      = COALESCE($2, answer),
        order_index = COALESCE($3, order_index)
      WHERE id = $4
      RETURNING *
    `, [question ?? null, answer ?? null, order_index ?? null, id]);

    res.json({ status: 'success', message: 'FAQ berhasil diperbarui!', data: rows[0] });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui FAQ.' });
  }
};

// DELETE FAQ item (Admin)
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM faq_items WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'FAQ tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'FAQ berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus FAQ.' });
  }
};
