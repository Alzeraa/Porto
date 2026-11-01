const pool = require('./src/config/database');

async function addSlugColumn() {
  try {
    console.log('🔄 Checking if slug column exists...');
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='projects' AND column_name='slug'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Slug column already exists!');
      process.exit(0);
    }
    
    console.log('➕ Adding slug column...');
    
    // Add slug column
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN slug VARCHAR(255) UNIQUE;
    `);
    console.log('✅ Slug column added!');
    
    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    `);
    console.log('✅ Index created!');
    
    // Generate slugs for existing projects
    console.log('🔄 Generating slugs for existing projects...');
    
    const projects = await pool.query('SELECT id, title FROM projects WHERE slug IS NULL');
    
    for (const project of projects.rows) {
      const slug = project.title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-+|\-+$/g, '');
      
      await pool.query(
        'UPDATE projects SET slug = $1 WHERE id = $2',
        [slug, project.id]
      );
      console.log(`  ✅ ${project.title} → ${slug}`);
    }
    
    console.log('🎉 Semua project sudah punya slug!');
    
    // Show all projects with slugs
    const allProjects = await pool.query('SELECT id, title, slug FROM projects ORDER BY id');
    console.log('\n📋 Data projects:');
    allProjects.rows.forEach(p => {
      console.log(`  ID ${p.id}: ${p.title} → ${p.slug}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSlugColumn();
