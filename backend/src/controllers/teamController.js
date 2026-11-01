const pool = require('../config/database');

// GET all team members (Public)
exports.getAllTeam = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM team ORDER BY order_index ASC, id ASC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat data tim.' });
  }
};

// POST add team member (Admin)
exports.createTeam = async (req, res) => {
  try {
    const { name, role, bio, image, order_index } = req.body;
    if (!name || !role) {
      return res.status(400).json({ status: 'error', message: 'Nama dan role wajib diisi!' });
    }

    const { rows } = await pool.query(
      `INSERT INTO team (name, role, bio, image, order_index)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, role, bio || '', image || '', order_index || 0]
    );
    res.status(201).json({ status: 'success', message: 'Anggota tim berhasil ditambahkan!', data: rows[0] });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan anggota tim.' });
  }
};

// PUT update team member (Admin)
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, image, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM team WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Anggota tim tidak ditemukan.' });
    }

    const { rows } = await pool.query(`
      UPDATE team SET
        name        = COALESCE($1, name),
        role        = COALESCE($2, role),
        bio         = COALESCE($3, bio),
        image       = COALESCE($4, image),
        order_index = COALESCE($5, order_index)
      WHERE id = $6
      RETURNING *
    `, [name ?? null, role ?? null, bio ?? null, image ?? null, order_index ?? null, id]);

    res.json({ status: 'success', message: 'Anggota tim berhasil diperbarui!', data: rows[0] });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui anggota tim.' });
  }
};

// DELETE team member (Admin)
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM team WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Anggota tim tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Anggota tim berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus anggota tim.' });
  }
};
