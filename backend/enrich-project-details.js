const pool = require('./src/config/database');

async function enrichDetails() {
  try {
    console.log('🔄 Enriching project details with complete data...\n');

    // 1. TRAVEL APP - Already has good data, just enhance capabilities
    await pool.query(`
      UPDATE project_details SET
        capabilities_intro = $1,
        capabilities = $2
      WHERE project_id = 1
    `, [
      'Engineered to perform in high-stress operational environments with strict role prioritization and fault-tolerant failovers.',
      JSON.stringify([
        { name: 'Real-Time GPS Tracking Pipeline', status: 'production', desc: '5-second interval heartbeat ingestion with geofence breach notifications' },
        { name: 'Multi-Tier Driver Dispatch Queue', status: 'production', desc: 'Intelligent route sorting matching painting waybill profiles to closest certified available driver' },
        { name: 'Automated Waybill & Digital POD', status: 'production', desc: 'Instant PDF generation with driver signature capture and automated WhatsApp manifest dispatching' },
        { name: 'Role-Based Access (RBAC Level 4)', status: 'production', desc: 'Segregated permission silos separating Senior Fleet Controllers, Branch Dispatchers, Financial Teams' }
      ])
    ]);
    console.log('✅ Travel App enriched');

    // 2. ABSENSI SISWA - More complete
    await pool.query(`
      UPDATE project_details SET
        capabilities_intro = $1,
        capabilities = $2
      WHERE project_id = 2
    `, [
      'Fitur utama yang dibangun untuk otomasi penuh sistem kehadiran sekolah.',
      JSON.stringify([
        { name: 'QR Code Scanner', status: 'production', desc: 'Scan cepat di setiap siswa masuk dengan verification otomatis' },
        { name: 'Face Recognition', status: 'production', desc: 'Double-check dengan teknologi face recognition untuk akurasi 98%' },
        { name: 'Real-time Dashboard', status: 'production', desc: 'Guru bisa lihat kehadiran real-time untuk setiap kelas' },
        { name: 'Automated Reports', status: 'production', desc: 'Laporan bulanan otomatis dikirim ke orang tua via email/SMS' }
      ])
    ]);
    console.log('✅ Absensi Siswa enriched');

    // 3. PORTFOLIO WEBSITE - Enhance
    await pool.query(`
      UPDATE project_details SET
        capabilities_intro = $1,
        capabilities = $2
      WHERE project_id = 3
    `, [
      'Portfolio capabilities yang showcase kemampuan modern web development:',
      JSON.stringify([
        { name: 'Responsive Web Design', status: 'production', desc: 'Mobile, tablet, desktop dengan performance optimal di semua devices' },
        { name: 'SEO Optimization', status: 'production', desc: 'Structured data, meta tags, sitemap untuk ranking search engine' },
        { name: 'Performance Tuning', status: 'production', desc: '98 Lighthouse score dengan image optimization & code splitting' },
        { name: 'Interactive Animations', status: 'production', desc: 'Scroll-reveal effects dan smooth transitions untuk better UX' }
      ])
    ]);
    console.log('✅ Portfolio Website enriched');

    // 4. APLIKASI PERKULIAHAN - Cross platform
    await pool.query(`
      UPDATE project_details SET
        capabilities_intro = $1,
        capabilities = $2
      WHERE project_id = 4
    `, [
      'Platform capabilities untuk seamless cross-device experience:',
      JSON.stringify([
        { name: 'Cross-Platform (iOS, Android, Web)', status: 'production', desc: 'Single codebase dengan native performance di semua platform' },
        { name: 'Real-time Sync', status: 'production', desc: 'Firebase sync memastikan data selalu update di semua perangkat' },
        { name: 'Offline Mode', status: 'production', desc: 'Akses data offline, otomatis sync saat connection kembali' },
        { name: 'Push Notifications', status: 'production', desc: 'Real-time notifications untuk update jadwal, nilai, dan pengumuman' }
      ])
    ]);
    console.log('✅ Aplikasi Perkuliahan enriched');

    // 5. VELORA - Fintech capabilities
    await pool.query(`
      UPDATE project_details SET
        capabilities_intro = $1,
        capabilities = $2
      WHERE project_id = 6
    `, [
      'Fitur fintech yang didukung oleh AI dan machine learning:',
      JSON.stringify([
        { name: 'Bank Account Sync', status: 'production', desc: 'Koneksi ke 50+ bank Indonesia untuk auto-pull transactions' },
        { name: 'AI Categorization', status: 'production', desc: 'Machine learning auto-categorize setiap transaksi dengan 98% akurasi' },
        { name: 'Budget Recommendations', status: 'production', desc: 'AI memberikan saran personalized saving berdasarkan spending pattern' },
        { name: 'Investment Monitor', status: 'production', desc: 'Track portfolio investasi dengan real-time market prices' }
      ])
    ]);
    console.log('✅ Velora enriched');

    console.log('\n✅ All projects enriched!\n');
    
    // Show results
    const result = await pool.query(`
      SELECT 
        p.title,
        CASE WHEN pd.capabilities IS NOT NULL THEN 'ADA' ELSE 'KOSONG' END as capabilities_status,
        jsonb_array_length(pd.capabilities) as capability_count
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.id
    `);
    
    result.rows.forEach(row => {
      const status = row.capabilities_status === 'ADA' ? '✅' : '❌';
      console.log(`${status} ${row.title}: ${row.capability_count} capabilities`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

enrichDetails();
