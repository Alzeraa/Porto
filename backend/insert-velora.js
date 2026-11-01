const pool = require('./src/config/database');

async function insertVelora() {
  try {
    console.log('🔄 Inserting Velora project details...\n');
    
    const result = await pool.query(`
      INSERT INTO project_details (
        project_id, tagline, hero_stats, overview_body, overview_meta,
        bottleneck_intro, bottlenecks, strategy_body, pipeline, pipeline_note, pipeline_note_right,
        capabilities_intro, capabilities, tech_specs,
        deliverables_intro, deliverables, deliverables_disclaimer, related_slugs
      ) VALUES (
        6,
        'FINTECH // PERSONAL MONEY MANAGEMENT',
        '[{"value": "50K+", "label": "Active Users"}, {"value": "$200M", "label": "Transactions Tracked"}, {"value": "4.7★", "label": "App Rating"}]'::jsonb,
        'Platform manajemen keuangan pribadi yang membantu pengguna track pengeluaran, budgeting, dan investasi dalam satu dashboard terpadu. Menggunakan AI untuk insight keuangan dan rekomendasi penghematan.',
        '[{"label": "Problem", "value": "Pengguna kesulitan track pengeluaran dan membuat budget"}, {"label": "Solution", "value": "Dashboard real-time dengan AI-powered insights"}]'::jsonb,
        'Pengelolaan keuangan pribadi memiliki beberapa hambatan utama:',
        '[{"title": "Fragmented Data", "desc": "Transaksi tersebar di berbagai bank dan payment apps"}, {"title": "Manual Budgeting", "desc": "Mencatat budget secara manual memakan waktu dan tidak akurat"}, {"title": "Lack of Insights", "desc": "Sulit melihat pola pengeluaran dan opportunity untuk saving"}]'::jsonb,
        'Membangun platform all-in-one dengan integrasi open banking API untuk auto-sync transaksi. Machine learning untuk categorize spending dan memberikan personalized recommendations.',
        '[{"phase": "Bank API Integration", "desc": "Koneksi ke 50+ bank untuk auto-pull transactions"}, {"phase": "Category AI Training", "desc": "Machine learning model untuk auto-categorize expenses"}, {"phase": "Dashboard Development", "desc": "Real-time dashboard dengan charts dan insights"}, {"phase": "Mobile Optimization", "desc": "Aplikasi mobile-first untuk accessibility maksimal"}]'::jsonb,
        'Proses auto-categorize mencapai 98% akurasi setelah training dengan 100K+ transaksi.',
        'User dapat menghemat rata-rata 25% dari pengeluaran bulanan mereka.',
        'Platform capabilities:',
        '[{"name": "Bank Account Sync", "status": "production"}, {"name": "Automatic Categorization", "status": "production"}, {"name": "AI Budget Recommendations", "status": "production"}, {"name": "Savings Goals Tracking", "status": "production"}, {"name": "Investment Portfolio Monitor", "status": "production"}]'::jsonb,
        '[{"tech": "React", "category": "Frontend"}, {"tech": "Node.js", "category": "Backend"}, {"tech": "PostgreSQL", "category": "Database"}, {"tech": "TensorFlow", "category": "ML"}]'::jsonb,
        'Deliverables yang dikembangkan:',
        '[{"item": "Web Dashboard untuk Money Management"}, {"item": "iOS & Android Mobile Apps"}, {"item": "Open Banking API Integration"}, {"item": "Machine Learning Categorization Engine"}, {"item": "Real-time Notification System"}, {"item": "Automated Report Generation"}]'::jsonb,
        'Platform telah memproses $200M+ transaksi dengan 99.9% uptime.',
        '["travel-app", "absensi-siswa-berbasis-qrcode"]'::jsonb
      )
      ON CONFLICT (project_id) DO NOTHING
    `);
    
    console.log('✅ Velora details inserted!\n');
    
    // Check final status
    const check = await pool.query(`
      SELECT 
        p.id, p.title, p.slug,
        CASE WHEN pd.id IS NOT NULL THEN 'ADA' ELSE 'KOSONG' END as status_detail,
        pd.tagline
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.id
    `);
    
    console.log('📋 Final status:\n');
    check.rows.forEach(row => {
      const status = row.status_detail === 'ADA' ? '✅' : '❌';
      console.log(`${status} ID ${row.id}: ${row.title}`);
      if (row.tagline) console.log(`   → ${row.tagline}`);
    });
    
    // Summary
    const summary = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id) as total,
        COUNT(DISTINCT pd.id) as with_detail
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
    `);
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Projects dengan detail: ${summary.rows[0].with_detail}/${summary.rows[0].total}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertVelora();
