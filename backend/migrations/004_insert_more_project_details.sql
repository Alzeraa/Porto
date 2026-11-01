-- Insert sample project details for remaining projects
-- Migration: Insert detailed project information for Absensi, Portfolio, and Aplikasi Perkuliahan

-- 1. Absensi Siswa Berbasis QRCODE (ID 2)
INSERT INTO project_details (
  project_id, tagline, hero_stats, overview_body, overview_meta,
  bottleneck_intro, bottlenecks, strategy_body, pipeline, pipeline_note, pipeline_note_right,
  capabilities_intro, capabilities, tech_specs,
  deliverables_intro, deliverables, deliverables_disclaimer, related_slugs
) VALUES (
  2,
  'EDUCATION TECH // STUDENT ATTENDANCE SYSTEM',
  '[{"value": "8", "label": "Cabang SD"}, {"value": "2500+", "label": "Siswa Terdaftar"}, {"value": "98%", "label": "Akurasi Kehadiran"}]'::jsonb,
  'Sistem absensi modern menggunakan QR code dan teknologi face recognition untuk sekolah dasar. Menggantikan sistem manual dengan otomasi penuh, meningkatkan efisiensi dan akurasi pencatatan kehadiran siswa.',
  '[{"label": "Problem", "value": "Pencatatan manual memakan waktu dan rawan kesalahan"}, {"label": "Solution", "value": "QR code scanning + face recognition untuk verifikasi otomatis"}]'::jsonb,
  'Sistem absensi konvensional di sekolah memiliki beberapa bottleneck utama:',
  '[{"title": "Pencatatan Manual", "desc": "Guru mencatat kehadiran secara manual setiap hari"}, {"title": "Data Terduplikasi", "desc": "Arsip kehadiran disimpan di berbagai format (buku, spreadsheet)"}, {"title": "Laporan Lambat", "desc": "Pembuatan laporan bulanan memakan waktu berjam-jam"}]'::jsonb,
  'Kami membangun platform terintegrasi dengan dua layer autentikasi: QR code untuk kecepatan, dan face recognition sebagai backup verifikasi.',
  '[{"phase": "Scanning QR", "desc": "Siswa scan QR code di masuk gerbang"}, {"phase": "Face Verification", "desc": "Sistem verifikasi wajah sebagai double-check"}, {"phase": "Record Update", "desc": "Data absensi otomatis tersimpan dan ter-sync"}, {"phase": "Report Generation", "desc": "Laporan real-time tersedia untuk guru"}]'::jsonb,
  'Sistem dapat memproses hingga 500 siswa dalam 10 menit di jam masuk.',
  'Mengurangi beban administrasi guru sebesar 85%',
  'Fitur utama yang dibangun:',
  '[{"name": "QR Code Scanner", "status": "production"}, {"name": "Face Recognition", "status": "production"}, {"name": "Real-time Dashboard", "status": "production"}, {"name": "Automated Reports", "status": "production"}, {"name": "Parent Notifications", "status": "production"}]'::jsonb,
  '[{"tech": "React", "category": "Frontend"}, {"tech": "Express", "category": "Backend"}, {"tech": "MySQL", "category": "Database"}, {"tech": "OpenCV", "category": "ML"}]'::jsonb,
  'Deliverables mencakup:',
  '[{"item": "Web Dashboard untuk Guru & Admin"}, {"item": "Mobile App untuk Orang Tua (notifications)"}, {"item": "QR Code Generation System"}, {"item": "Face Recognition API"}, {"item": "Report Generator"}, {"item": "Training Documentation"}]'::jsonb,
  'Semua fitur telah teruji di 2 sekolah dengan 500+ siswa aktif.',
  '["portfolio-website", "aplikasi-perkuliahan"]'::jsonb
) ON CONFLICT (project_id) DO NOTHING;

-- 2. Portfolio Website (ID 3)
INSERT INTO project_details (
  project_id, tagline, hero_stats, overview_body, overview_meta,
  bottleneck_intro, bottlenecks, strategy_body, pipeline, pipeline_note, pipeline_note_right,
  capabilities_intro, capabilities, tech_specs,
  deliverables_intro, deliverables, deliverables_disclaimer, related_slugs
) VALUES (
  3,
  'WEB DESIGN // PERSONAL BRAND SHOWCASE',
  '[{"value": "47", "label": "Case Studies"}, {"value": "2.3s", "label": "Page Load Time"}, {"value": "98", "label": "Lighthouse Score"}]'::jsonb,
  'Portfolio website modern yang menampilkan karya desain dan pengembangan dengan performa tinggi. Dioptimalkan untuk konversi lead dengan showcase visual yang menarik dan user experience yang seamless.',
  '[{"label": "Goal", "value": "Showcase karya berkualitas premium"}, {"label": "Technology", "value": "React + TypeScript + Tailwind CSS"}]'::jsonb,
  'Portfolio tradisional memiliki beberapa kelemahan:',
  '[{"title": "Performa Lambat", "desc": "Loading image berat memperlambat akses dari mobile"}, {"title": "Desain Outdated", "desc": "Tidak mencerminkan kemampuan desain modern developer"}, {"title": "Konversi Rendah", "desc": "CTA (call-to-action) tidak jelas dan tersembunyi"}]'::jsonb,
  'Membangun portfolio dengan fokus pada visual storytelling, performa optimal, dan conversion rate optimization. Setiap case study dirancang untuk menunjukkan problem-solving ability dan technical expertise.',
  '[{"phase": "Design System", "desc": "Buat design system yang cohesive dan reusable"}, {"phase": "Case Study Layout", "desc": "Desain layout untuk showcase setiap project detail"}, {"phase": "Performance Optimization", "desc": "Image optimization, code splitting, lazy loading"}, {"phase": "Analytics Integration", "desc": "Track visitor behavior dan conversion metrics"}]'::jsonb,
  'Hasil akhir: portfolio yang fast, responsive, dan conversion-focused.',
  'Meningkatkan lead generation sebesar 3x dalam 3 bulan pertama',
  'Capabilities yang showcase:',
  '[{"name": "Responsive Web Design", "status": "production"}, {"name": "SEO Optimization", "status": "production"}, {"name": "Performance Tuning", "status": "production"}, {"name": "Interactive Animations", "status": "production"}]'::jsonb,
  '[{"tech": "React", "category": "Frontend"}, {"tech": "TypeScript", "category": "Language"}, {"tech": "Tailwind CSS", "category": "Styling"}, {"tech": "Vercel", "category": "Hosting"}]'::jsonb,
  'Deliverables yang didapat:',
  '[{"item": "Fully Responsive Design (Mobile, Tablet, Desktop)"}, {"item": "47 Case Studies dengan Project Deep-dives"}, {"item": "Contact Form dengan Email Integration"}, {"item": "Blog Section dengan Markdown Support"}, {"item": "Dark Mode Toggle"}, {"item": "Google Analytics Integration"}]'::jsonb,
  'Portfolio telah menerima 500+ visitor per hari dengan bounce rate 32%.',
  '["travel-app", "absensi-siswa-berbasis-qrcode"]'::jsonb
) ON CONFLICT (project_id) DO NOTHING;

-- 3. Aplikasi Perkuliahan (ID 4)
INSERT INTO project_details (
  project_id, tagline, hero_stats, overview_body, overview_meta,
  bottleneck_intro, bottlenecks, strategy_body, pipeline, pipeline_note, pipeline_note_right,
  capabilities_intro, capabilities, tech_specs,
  deliverables_intro, deliverables, deliverables_disclaimer, related_slugs
) VALUES (
  4,
  'MOBILE APP // UNIVERSITY COURSE MANAGEMENT',
  '[{"value": "3", "label": "Platform (iOS, Android, Web)"}, {"value": "2M+", "label": "Users"}, {"value": "95%", "label": "User Satisfaction"}]'::jsonb,
  'Aplikasi manajemen perkuliahan yang membantu mahasiswa mengelola jadwal, tugas, dan nilai dengan mudah. Tersedia di iOS, Android, dan web dengan sinkronisasi real-time antar platform.',
  '[{"label": "Use Case", "value": "Mahasiswa dapat akses semua informasi kuliah dari satu tempat"}, {"label": "Target", "value": "200+ universitas di Indonesia"}]'::jsonb,
  'Aplikasi perkuliahan tradisional menghadapi tantangan:',
  '[{"title": "Multi-Platform Fragmented", "desc": "Informasi tersebar di berbagai aplikasi (portal kampus, grup WA, email)"}, {"title": "Sinkronisasi Buruk", "desc": "Update nilai/jadwal tidak konsisten antar perangkat"}, {"title": "User Experience Jelek", "desc": "Interface membingungkan dan susah dipakai dari mobile"}]'::jsonb,
  'Mengembangkan aplikasi cross-platform dengan Firebase untuk real-time sync. UI/UX dirancang fokus pada kemudahan penggunaan di perangkat mobile dengan battery optimization.',
  '[{"phase": "Mobile First Design", "desc": "Prioritas mobile experience, responsive di semua ukuran"}, {"phase": "Backend Setup", "desc": "Firebase untuk auth, database, dan real-time sync"}, {"phase": "Feature Integration", "desc": "Integrasi dengan API kampus untuk pull data jadwal/nilai"}, {"phase": "Testing & Launch", "desc": "Beta testing di 5 kampus sebelum full launch"}]'::jsonb,
  'Aplikasi lightweight dengan cache-first strategy untuk efisiensi data.',
  'Daily active users: 15,000+ mahasiswa dari 50+ universitas',
  'Platform capabilities:',
  '[{"name": "Cross-Platform (iOS, Android, Web)", "status": "production"}, {"name": "Real-time Sync", "status": "production"}, {"name": "Offline Mode", "status": "production"}, {"name": "Push Notifications", "status": "production"}, {"name": "University API Integration", "status": "production"}]'::jsonb,
  '[{"tech": "Flutter", "category": "Mobile"}, {"tech": "Dart", "category": "Language"}, {"tech": "Firebase", "category": "Backend"}, {"tech": "Node.js", "category": "API"}]'::jsonb,
  'Deliverables project:',
  '[{"item": "Native iOS App (App Store)"}, {"item": "Native Android App (Google Play)"}, {"item": "Web Version (Progressive Web App)"}, {"item": "University API Connector"}, {"item": "Admin Dashboard untuk Universitas"}, {"item": "Push Notification System"}]'::jsonb,
  'App telah di-download 500k+ kali dengan rating 4.8 bintang.',
  '["travel-app", "portfolio-website"]'::jsonb
) ON CONFLICT (project_id) DO NOTHING;
