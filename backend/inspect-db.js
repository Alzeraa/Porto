const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');
console.log('DB Path:', dbPath);

let db;
try {
  db = new Database(dbPath);
} catch (e) {
  console.error('Gagal buka DB:', e.message);
  process.exit(1);
}

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

console.log('\n=== DAFTAR TABEL (' + tables.length + ' tabel) ===\n');
tables.forEach(t => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TABLE: ' + t.name);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const rows = db.prepare('SELECT * FROM "' + t.name + '"').all();
    console.log('Jumlah row: ' + rows.length);
    if (rows.length > 0) {
      rows.forEach((row, i) => {
        console.log('  [' + (i+1) + '] ' + JSON.stringify(row));
      });
    } else {
      console.log('  (kosong)');
    }
  } catch(e) {
    console.log('  Error: ' + e.message);
  }
  console.log('');
});

db.close();
console.log('=== SELESAI ===');
