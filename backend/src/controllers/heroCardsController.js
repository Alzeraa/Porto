const db = require('../config/database');

// GET all hero cards
const getAllHeroCards = (req, res) => {
  try {
    const cards = db.prepare('SELECT * FROM hero_cards ORDER BY order_index ASC').all();
    res.json({ status: 'success', data: cards });
  } catch (err) {
    console.error('Error fetching hero cards:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET single hero card by ID
const getHeroCardById = (req, res) => {
  try {
    const { id } = req.params;
    const card = db.prepare('SELECT * FROM hero_cards WHERE id = ?').get(id);
    
    if (!card) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }
    
    res.json({ status: 'success', data: card });
  } catch (err) {
    console.error('Error fetching hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// CREATE new hero card
const createHeroCard = (req, res) => {
  try {
    const { title, image, description } = req.body;

    if (!title || !image) {
      return res.status(400).json({ status: 'error', message: 'Title and image are required' });
    }

    // Get max order_index
    const maxOrder = db.prepare('SELECT MAX(order_index) as max_order FROM hero_cards').get();
    const nextOrder = (maxOrder.max_order || 0) + 1;

    const result = db.prepare(`
      INSERT INTO hero_cards (title, image, description, order_index)
      VALUES (?, ?, ?, ?)
    `).run(title, image, description || null, nextOrder);

    const newCard = db.prepare('SELECT * FROM hero_cards WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ status: 'success', data: newCard, message: 'Hero card created' });
  } catch (err) {
    console.error('Error creating hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// UPDATE hero card
const updateHeroCard = (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description, order_index } = req.body;

    const card = db.prepare('SELECT * FROM hero_cards WHERE id = ?').get(id);
    if (!card) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }

    db.prepare(`
      UPDATE hero_cards 
      SET title = ?, image = ?, description = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || card.title,
      image || card.image,
      description !== undefined ? description : card.description,
      order_index !== undefined ? order_index : card.order_index,
      id
    );

    const updatedCard = db.prepare('SELECT * FROM hero_cards WHERE id = ?').get(id);
    res.json({ status: 'success', data: updatedCard, message: 'Hero card updated' });
  } catch (err) {
    console.error('Error updating hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE hero card
const deleteHeroCard = (req, res) => {
  try {
    const { id } = req.params;

    const card = db.prepare('SELECT * FROM hero_cards WHERE id = ?').get(id);
    if (!card) {
      return res.status(404).json({ status: 'error', message: 'Hero card not found' });
    }

    db.prepare('DELETE FROM hero_cards WHERE id = ?').run(id);
    
    res.json({ status: 'success', message: 'Hero card deleted' });
  } catch (err) {
    console.error('Error deleting hero card:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// REORDER hero cards
const reorderHeroCards = (req, res) => {
  try {
    const { cards } = req.body; // Array of {id, order_index}

    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Cards array is required' });
    }

    const updateStmt = db.prepare('UPDATE hero_cards SET order_index = ? WHERE id = ?');
    
    for (const card of cards) {
      updateStmt.run(card.order_index, card.id);
    }

    const updated = db.prepare('SELECT * FROM hero_cards ORDER BY order_index ASC').all();
    res.json({ status: 'success', data: updated, message: 'Hero cards reordered' });
  } catch (err) {
    console.error('Error reordering hero cards:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getAllHeroCards,
  getHeroCardById,
  createHeroCard,
  updateHeroCard,
  deleteHeroCard,
  reorderHeroCards
};
