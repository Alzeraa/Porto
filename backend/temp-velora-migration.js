const pool = require('./src/config/database');
const fs = require('fs');

async function migrate() {
  try {
    const sql = fs.readFileSync('./migrations/005_insert_velora_details.sql', 'utf-8');
    await pool.query(sql);
    console.log('✅ Velora details inserted!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
migrate();
