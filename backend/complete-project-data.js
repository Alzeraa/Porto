const pool = require('./src/config/database');

async function completeProjectData() {
  try {
    console.log('📋 Completing project details with comprehensive data...\n');

    // Complete Travel App
    await pool.query(`
      UPDATE project_details SET
        deliverables_intro = 'Deliverables mencakup sistem end-to-end yang production-ready:',
        deliverables = $1
      WHERE project_id = 1
    `, [
      JSON.stringify([
        { item: 'Real-Time GPS Telemetry Dashboard' },
        { item: 'Multi-Tier Driver Dispatch Queue UI' },
        { item: 'Automated Waybill & POD System' },
        { item: 'Role-Based Admin Console' },
        { item: 'Driver Mobile App (iOS & Android)' },
        { item: 'API Documentation & Staging Environment' }
      ])
    ]);
    console.log('✅ Travel App deliverables complete');

    // Complete Absensi Siswa
    await pool.query(`
      UPDATE project_details SET
        deliverables_intro = 'Deliverables yang sudah dikerjakan:',
        deliverables = $1
      WHERE project_id = 2
    `, [
      JSON.stringify([
        { item: 'Web Dashboard untuk Guru & Admin' },
        { item: 'Mobile App untuk Orang Tua (Notifications)' },
        { item: 'QR Code Generation & Scanning System' },
        { item: 'Face Recognition API Integration' },
        { item: 'Automated Attendance Reports' },
        { item: 'Training & Documentation' }
      ])
    ]);
    console.log('✅ Absensi Siswa deliverables complete');

    // Complete Portfolio Website
    await pool.query(`
      UPDATE project_details SET
        deliverables_intro = 'Deliverables yang telah diserahkan:',
        deliverables = $1
      WHERE project_id = 3
    `, [
      JSON.stringify([
        { item: 'Fully Responsive Design (Mobile, Tablet, Desktop)' },
        { item: '47 Case Studies dengan Project Deep-dives' },
        { item: 'Contact Form dengan Email Integration' },
        { item: 'Blog Section dengan Markdown Support' },
        { item: 'Dark Mode Toggle' },
        { item: 'Google Analytics Integration' }
      ])
    ]);
    console.log('✅ Portfolio Website deliverables complete');

    // Complete Aplikasi Perkuliahan
    await pool.query(`
      UPDATE project_details SET
        deliverables_intro = 'Deliverables project:',
        deliverables = $1
      WHERE project_id = 4
    `, [
      JSON.stringify([
        { item: 'Native iOS App (App Store)' },
        { item: 'Native Android App (Google Play)' },
        { item: 'Web Version (Progressive Web App)' },
        { item: 'University API Connector' },
        { item: 'Admin Dashboard untuk Universitas' },
        { item: 'Push Notification System' }
      ])
    ]);
    console.log('✅ Aplikasi Perkuliahan deliverables complete');

    // Complete Velora
    await pool.query(`
      UPDATE project_details SET
        deliverables_intro = 'Deliverables yang dikembangkan:',
        deliverables = $1
      WHERE project_id = 6
    `, [
      JSON.stringify([
        { item: 'Web Dashboard untuk Money Management' },
        { item: 'iOS & Android Mobile Apps' },
        { item: 'Open Banking API Integration' },
        { item: 'Machine Learning Categorization Engine' },
        { item: 'Real-time Notification System' },
        { item: 'Automated Report Generation' }
      ])
    ]);
    console.log('✅ Velora deliverables complete');

    console.log('\n✅ All projects now have comprehensive deliverables!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

completeProjectData();
