const pool = require('./src/config/database');

async function updateSlugs() {
  try {
    console.log('🔄 Fetching projects without slugs...');
    
    const projects = await pool.query('SELECT id, title FROM projects WHERE slug IS NULL OR slug = \'\'');
    
    if (projects.rows.length === 0) {
      console.log('✅ Semua projects sudah punya slug!');
      
      // Show all projects
      const allProjects = await pool.query('SELECT id, title, slug FROM projects ORDER BY id');
      console.log('\n📋 Data projects:');
      allProjects.rows.forEach(p => {
        console.log(`  ID ${p.id}: ${p.title} → ${p.slug}`);
      });
      
      process.exit(0);
    }
    
    console.log(`📝 Ditemukan ${projects.rows.length} projects tanpa slug\n`);
    
    // Helper function to generate unique slug
    async function generateUniqueSlug(title, excludeId = null) {
      let baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-+|\-+$/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      
      while (true) {
        let query = `SELECT id FROM projects WHERE slug = $1`;
        let params = [slug];
        
        if (excludeId) {
          query += ` AND id != $2`;
          params.push(excludeId);
        }
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
          return slug;
        }
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    // Update each project
    for (const project of projects.rows) {
      const slug = await generateUniqueSlug(project.title, project.id);
      await pool.query(
        'UPDATE projects SET slug = $1 WHERE id = $2',
        [slug, project.id]
      );
      console.log(`  ✅ ID ${project.id}: "${project.title}" → "${slug}"`);
    }
    
    console.log('\n🎉 Semua projects sudah punya slug!\n');
    
    // Show all projects
    const allProjects = await pool.query('SELECT id, title, slug FROM projects ORDER BY id');
    console.log('📋 Final data projects:');
    allProjects.rows.forEach(p => {
      console.log(`  ID ${p.id}: ${p.title}`);
      console.log(`          → slug: "${p.slug}"`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSlugs();
