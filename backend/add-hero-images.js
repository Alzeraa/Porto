const pool = require('./src/config/database');

async function addHeroImages() {
  try {
    console.log('🖼️  Adding hero images/screenshots...\n');

    // Update projects dengan demo/screenshot images
    const projects = [
      {
        id: 1,
        name: 'Travel App',
        screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600'
      },
      {
        id: 2,
        name: 'Absensi Siswa',
        screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=600'
      },
      {
        id: 3,
        name: 'Portfolio Website',
        screenshot: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=600'
      },
      {
        id: 4,
        name: 'Aplikasi Perkuliahan',
        screenshot: 'https://plus.unsplash.com/premium_photo-1664301435093-9804155eb991?q=80&w=1200&auto=format&fit=crop&h=600'
      },
      {
        id: 6,
        name: 'Velora',
        screenshot: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&q=80&w=1200&h=600'
      }
    ];

    // Add screenshot_url column if not exists
    await pool.query(`
      ALTER TABLE project_details
      ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
    `);
    console.log('✅ Column added');

    // Update each project
    for (const proj of projects) {
      await pool.query(
        'UPDATE project_details SET screenshot_url = $1 WHERE project_id = $2',
        [proj.screenshot, proj.id]
      );
      console.log(`✅ ${proj.name} screenshot added`);
    }

    console.log('\n✅ All screenshots added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addHeroImages();
