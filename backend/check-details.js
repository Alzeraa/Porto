const pool = require('./src/config/database');

async function checkDetails() {
  try {
    console.log('📋 Cek Project Details di database:\n');
    
    // Get all projects with their details
    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.slug,
        CASE WHEN pd.id IS NOT NULL THEN 'ADA' ELSE 'KOSONG' END as status_detail,
        pd.id as detail_id, pd.tagline, pd.hero_stats
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.id
    `);
    
    result.rows.forEach(row => {
      const status = row.status_detail === 'ADA' ? '✅' : '❌';
      console.log(`${status} ID ${row.id}: ${row.title}`);
      console.log(`   Slug: ${row.slug}`);
      console.log(`   Detail: ${row.status_detail}`);
      if (row.tagline) console.log(`   Tagline: ${row.tagline}`);
      console.log('');
    });
    
    // Count summary
    const summary = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_projects,
        COUNT(DISTINCT pd.id) as projects_with_detail
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
    `);
    
    console.log('📊 Summary:');
    console.log(`   Total Projects: ${summary.rows[0].total_projects}`);
    console.log(`   Projects dengan Detail: ${summary.rows[0].projects_with_detail}`);
    console.log(`   Projects tanpa Detail: ${summary.rows[0].total_projects - summary.rows[0].projects_with_detail}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDetails();
