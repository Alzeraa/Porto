const pool = require('../config/database');

// GET all hero cards
const getAllHeroCards = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hero_cards ORDER BY order_index ASC');
    res.json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error fetching hero cards:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET single hero card by ID
const getHeroCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM hero_cards WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }
    res.json({ status: 'success', data: rows[0] });
  } catch (err) {
    console.error('Error fetching hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// CREATE new hero card
const createHeroCard = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !image) {
      return res.status(400).json({ status: 'error', message: 'Title and image are required' });
    }

    const { rows: maxRows } = await pool.query('SELECT MAX(order_index) as max_order FROM hero_cards');
    const nextOrder = (maxRows[0].max_order || 0) + 1;

    const { rows } = await pool.query(
      `INSERT INTO hero_cards (title, image, description, order_index)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, image, description || null, nextOrder]
    );
    res.status(201).json({ status: 'success', data: rows[0], message: 'Hero card created' });
  } catch (err) {
    console.error('Error creating hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// UPDATE hero card
const updateHeroCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description, order_index } = req.body;

    const existing = (await pool.query('SELECT * FROM hero_cards WHERE id = $1', [id])).rows[0];
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }

    const { rows } = await pool.query(`
      UPDATE hero_cards SET
        title       = $1,
        image       = $2,
        description = $3,
        order_index = $4,
        updated_at  = NOW()
      WHERE id = $5
      RETURNING *
    `, [
      title || existing.title,
      image || existing.image,
      description !== undefined ? description : existing.description,
      order_index !== undefined ? order_index : existing.order_index,
      id,
    ]);
    res.json({ status: 'success', data: rows[0], message: 'Hero card updated' });
  } catch (err) {
    console.error('Error updating hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE hero card
const deleteHeroCard = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM hero_cards WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }
    res.json({ status: 'success', message: 'Hero card deleted' });
  } catch (err) {
    console.error('Error deleting hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// REORDER hero cards
const reorderHeroCards = async (req, res) => {
  try {
    const { cards } = req.body;
    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Cards array is required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const card of cards) {
        await client.query('UPDATE hero_cards SET order_index = $1 WHERE id = $2', [card.order_index, card.id]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const { rows } = await pool.query('SELECT * FROM hero_cards ORDER BY order_index ASC');
    res.json({ status: 'success', data: rows, message: 'Hero cards reordered' });
  } catch (err) {
    console.error('Error reordering hero cards:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getAllHeroCards, getHeroCardById, createHeroCard, updateHeroCard, deleteHeroCard, reorderHeroCards };
