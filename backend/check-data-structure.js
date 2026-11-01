const pool = require('./src/config/database');

async function checkStructure() {
  try {
    console.log('📊 Checking data structure for Travel App:\n');
    
    const result = await pool.query(`
      SELECT 
        p.title,
        pd.capabilities,
        pd.tech_specs,
        pd.bottlenecks,
        pd.deliverables,
        pd.hero_stats
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      WHERE p.slug = 'travel-app'
    `);
    
    const row = result.rows[0];
    
    console.log('Capabilities:', row.capabilities);
    console.log('\nTech Specs:', row.tech_specs);
    console.log('\nBottlenecks type:', typeof row.bottlenecks);
    console.log('Bottlenecks:', row.bottlenecks);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkStructure();
