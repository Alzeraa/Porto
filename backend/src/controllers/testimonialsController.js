const pool = require('../config/database');

// GET all testimonials (Public)
exports.getAllTestimonials = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY order_index ASC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat testimoni.' });
  }
};

// POST add testimonial (Admin)
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, photo, order_index } = req.body;
    if (!name || !content) {
      return res.status(400).json({ status: 'error', message: 'Nama dan isi testimoni wajib diisi!' });
    }

    const { rows } = await pool.query(
      `INSERT INTO testimonials (name, role, content, rating, photo, order_index)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, role || '', content, rating || 5, photo || '', order_index || 0]
    );
    res.status(201).json({ status: 'success', message: 'Testimoni berhasil ditambahkan!', data: rows[0] });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan testimoni.' });
  }
};

// PUT update testimonial (Admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, content, rating, photo, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM testimonials WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Testimoni tidak ditemukan.' });
    }

    const { rows } = await pool.query(`
      UPDATE testimonials SET
        name        = COALESCE($1, name),
        role        = COALESCE($2, role),
        content     = COALESCE($3, content),
        rating      = COALESCE($4, rating),
        photo       = COALESCE($5, photo),
        order_index = COALESCE($6, order_index)
      WHERE id = $7
      RETURNING *
    `, [name ?? null, role ?? null, content ?? null, rating ?? null, photo ?? null, order_index ?? null, id]);

    res.json({ status: 'success', message: 'Testimoni berhasil diperbarui!', data: rows[0] });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui testimoni.' });
  }
};

// DELETE testimonial (Admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Testimoni tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Testimoni berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus testimoni.' });
  }
};
