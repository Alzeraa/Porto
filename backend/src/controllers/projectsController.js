const pool = require('../config/database');
const { generateUniqueSlug } = require('../utils/slugGenerator');

// GET all projects (Public)
exports.getAllProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');
    const formatted = rows.map(r => ({ ...r, tech: JSON.parse(r.tech || '[]') }));
    res.json({ status: 'success', data: formatted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memuat proyek.' });
  }
};

// POST add project (Admin)
exports.createProject = async (req, res) => {
  try {
    const { title, category, description, tech, image, link, order_index } = req.body;
    if (!title || !description) {
      return res.status(400).json({ status: 'error', message: 'Judul dan deskripsi wajib diisi!' });
    }

    const techStr = Array.isArray(tech) ? JSON.stringify(tech) : JSON.stringify([]);
    const defaultImg = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800';
    
    // Auto-generate slug from title
    const slug = await generateUniqueSlug(pool, title);

    const { rows } = await pool.query(
      `INSERT INTO projects (title, category, description, tech, image, link, slug, order_index)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, category || 'Full-Stack Web', description, techStr, image || defaultImg, link || '', slug, order_index || 0]
    );
    const created = { ...rows[0], tech: JSON.parse(rows[0].tech) };
    res.status(201).json({ status: 'success', message: 'Proyek berhasil ditambahkan!', data: created });
  } catch (error) {
    console.error('[ProjectsController] Create error:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal menambahkan proyek.' });
  }
};

// PUT update project (Admin)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, tech, image, link, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM projects WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Proyek tidak ditemukan.' });
    }

    const techStr = tech
      ? (Array.isArray(tech) ? JSON.stringify(tech) : JSON.stringify([tech]))
      : existing.tech;
    
    // Generate new slug if title changed, otherwise keep existing slug
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = await generateUniqueSlug(pool, title, id);
    }

    const { rows } = await pool.query(`
      UPDATE projects SET
        title       = COALESCE($1, title),
        category    = COALESCE($2, category),
        description = COALESCE($3, description),
        tech        = $4,
        image       = COALESCE($5, image),
        link        = COALESCE($6, link),
        slug        = $7,
        order_index = COALESCE($8, order_index)
      WHERE id = $9
      RETURNING *
    `, [title ?? null, category ?? null, description ?? null, techStr, image ?? null, link ?? null, slug, order_index ?? null, id]);

    const updated = { ...rows[0], tech: JSON.parse(rows[0].tech) };
    res.json({ status: 'success', message: 'Proyek berhasil diperbarui!', data: updated });
  } catch (error) {
    console.error('[ProjectsController] Update error:', error.message);
    res.status(500).json({ status: 'error', message: 'Gagal memperbarui proyek.' });
  }
};

// DELETE project (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Proyek tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Proyek berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus proyek.' });
  }
};
