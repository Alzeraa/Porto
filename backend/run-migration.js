const pool = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Running migration: 004_insert_more_project_details.sql\n');
    
    const sqlFile = path.join(__dirname, 'migrations', '004_insert_more_project_details.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    // Split by semicolon dan execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt.length > 0) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await pool.query(stmt);
        console.log(`✅ Done!\n`);
      }
    }
    
    console.log('🎉 Migration completed!\n');
    
    // Show results
    console.log('📋 Cek hasil migration:\n');
    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.slug,
        CASE WHEN pd.id IS NOT NULL THEN 'ADA' ELSE 'KOSONG' END as status_detail,
        pd.tagline
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.id
    `);
    
    result.rows.forEach(row => {
      const status = row.status_detail === 'ADA' ? '✅' : '❌';
      console.log(`${status} ID ${row.id}: ${row.title}`);
      if (row.tagline) console.log(`   → ${row.tagline}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runMigration();
