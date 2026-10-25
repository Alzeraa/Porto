const db = require('./src/config/database.js');

// Delete existing hero cards
db.prepare('DELETE FROM hero_cards').run();

// Insert new hero cards with local images
const newCards = [
  {
    title: 'Anime Character 1',
    image: '/hero-cards/b2d8f8ea426b92559143658ce8de8a68.jpg',
    description: 'Beautiful anime character design',
    order_index: 1
  },
  {
    title: 'Anime Character 2',
    image: '/hero-cards/cea59e0253c22df9ec118c815e108214.jpg',
    description: 'Stunning anime artwork',
    order_index: 2
  },
  {
    title: 'Anime Character 3',
    image: '/hero-cards/dbbf09c83be990c5ec83bd6b88955fa7.jpg',
    description: 'Creative anime illustration',
    order_index: 3
  }
];

const insertStmt = db.prepare(`
  INSERT INTO hero_cards (title, image, description, order_index)
  VALUES (?, ?, ?, ?)
`);

for (const card of newCards) {
  insertStmt.run(card.title, card.image, card.description, card.order_index);
}

console.log('[✓] Hero cards updated with local images');
const result = db.prepare('SELECT * FROM hero_cards ORDER BY order_index').all();
console.log('Cards in DB:', result);
