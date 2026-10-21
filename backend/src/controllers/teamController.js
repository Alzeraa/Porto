const db = require('../config/database');

// GET all team members (Public)
exports.getAllTeam = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM team ORDER BY order_index ASC, id ASC').all();
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat data tim.' });
  }
};

// POST add team member (Admin)
exports.createTeam = (req, res) => {
  try {
    const { name, role, bio, image, order_index } = req.body;
    if (!name || !role) {
      return res.status(400).json({ status: 'error', message: 'Nama dan role wajib diisi!' });
    }

    const stmt = db.prepare(`INSERT INTO team (name, role, bio, image, order_index) VALUES (?, ?, ?, ?, ?)`);
    const result = stmt.run(name, role, bio || '', image || '', order_index || 0);
    const created = db.prepare('SELECT * FROM team WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ status: 'success', message: 'Anggota tim berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan anggota tim.' });
  }
};

// PUT update team member (Admin)
exports.updateTeam = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, image, order_index } = req.body;

    const existing = db.prepare('SELECT * FROM team WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Anggota tim tidak ditemukan.' });
    }

    db.prepare(`
      UPDATE team SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        bio = COALESCE(?, bio),
        image = COALESCE(?, image),
        order_index = COALESCE(?, order_index)
      WHERE id = ?
    `).run(
      name ?? null,
      role ?? null,
      bio ?? null,
      image ?? null,
      order_index ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM team WHERE id = ?').get(id);
    res.json({ status: 'success', message: 'Anggota tim berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui anggota tim.' });
  }
};

// DELETE team member (Admin)
exports.deleteTeam = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM team WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Anggota tim tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Anggota tim berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus anggota tim.' });
  }
};
