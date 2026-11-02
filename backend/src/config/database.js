const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// ─── Connection Pool ──────────────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'portfolio_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err.message);
});

// ─── DDL ─────────────────────────────────────────────────────────────────────
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // 1. Admins
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id         SERIAL PRIMARY KEY,
        email      TEXT UNIQUE NOT NULL,
        password   TEXT NOT NULL,
        name       TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Profile
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id                  INTEGER PRIMARY KEY CHECK (id = 1),
        name                TEXT NOT NULL,
        badge               TEXT NOT NULL,
        title               TEXT NOT NULL,
        subtitle            TEXT NOT NULL,
        bio                 TEXT,
        whatsapp            TEXT,
        email               TEXT,
        github              TEXT,
        linkedin            TEXT,
        logo_url            TEXT    DEFAULT '/Final-Logo.png',
        cta_primary_text    TEXT    DEFAULT 'Konsultasi Gratis Sekarang',
        cta_primary_link    TEXT    DEFAULT '#contact',
        cta_secondary_text  TEXT    DEFAULT 'Lihat Proyek Kami',
        cta_secondary_link  TEXT    DEFAULT '#projects',
        trusted_by_title    TEXT    DEFAULT 'Dipercaya oleh Startup & UMKM Mapan',
        tech_stack_title    TEXT    DEFAULT 'Teknologi yang Kami Gunakan',
        tech_stack          TEXT    DEFAULT 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma',
        updated_at          TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Services
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id          SERIAL PRIMARY KEY,
        icon        TEXT NOT NULL,
        title       TEXT NOT NULL,
        description TEXT NOT NULL,
        features    TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 4. Projects
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        category    TEXT NOT NULL,
        description TEXT NOT NULL,
        tech        TEXT NOT NULL,
        image       TEXT NOT NULL,
        link        TEXT,
        slug        VARCHAR(255) UNIQUE,
        order_index INTEGER DEFAULT 0
      );
    `);
    
    // Add slug column if it doesn't exist (for existing databases)
    const projectsCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='projects' AND column_name='slug'
    `);
    if (projectsCheck.rows.length === 0) {
      await client.query(`ALTER TABLE projects ADD COLUMN slug VARCHAR(255) UNIQUE;`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);`);
    }

    // 5. Contacts
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id           SERIAL PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT NOT NULL,
        whatsapp     TEXT,
        service      TEXT,
        message      TEXT NOT NULL,
        business_org TEXT DEFAULT '',
        budget_range TEXT DEFAULT '',
        timeline     TEXT DEFAULT '',
        reference_url TEXT DEFAULT '',
        status       TEXT DEFAULT 'unread',
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 6. Team
    await client.query(`
      CREATE TABLE IF NOT EXISTS team (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        role        TEXT NOT NULL,
        bio         TEXT NOT NULL,
        image       TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 7. Testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        role        TEXT NOT NULL,
        content     TEXT NOT NULL,
        rating      INTEGER DEFAULT 5,
        photo       TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 8. Pricing
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        price       TEXT NOT NULL,
        popular     INTEGER DEFAULT 0,
        features    TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 9. Theme Settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id               INTEGER PRIMARY KEY CHECK (id = 1),
        primary_color    TEXT DEFAULT '#1e3a5f',
        primary_light    TEXT DEFAULT '#2563eb',
        primary_dark     TEXT DEFAULT '#0f172a',
        accent_color     TEXT DEFAULT '#0ea5e9',
        background_dark  TEXT DEFAULT '#0f172a',
        text_primary     TEXT DEFAULT '#ffffff',
        logo_url         TEXT,
        updated_at       TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. Hero Cards
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_cards (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        image       TEXT NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 11. FAQ Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS faq_items (
        id          SERIAL PRIMARY KEY,
        question    TEXT NOT NULL,
        answer      TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 12. About Sections
    await client.query(`
      CREATE TABLE IF NOT EXISTS about_sections (
        id          SERIAL PRIMARY KEY,
        type        TEXT NOT NULL,
        title       TEXT NOT NULL,
        subtitle    TEXT DEFAULT '',
        items       TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 13. Translations
    await client.query(`
      CREATE TABLE IF NOT EXISTS translations (
        id              SERIAL PRIMARY KEY,
        key             TEXT UNIQUE NOT NULL,
        language        TEXT NOT NULL DEFAULT 'id',
        text            TEXT NOT NULL,
        source_key      TEXT,
        source_language TEXT DEFAULT 'en',
        is_manual       INTEGER DEFAULT 0,
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_translations_key_language ON translations(key, language);`);

    // 14. Translation Caches
    await client.query(`
      CREATE TABLE IF NOT EXISTS translation_caches (
        id               SERIAL PRIMARY KEY,
        source_text      TEXT NOT NULL,
        source_language  TEXT NOT NULL,
        target_language  TEXT NOT NULL,
        translated_text  TEXT NOT NULL,
        provider         TEXT DEFAULT 'libretranslate',
        created_at       TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_trans_cache_lookup
        ON translation_caches(source_text, source_language, target_language);
    `);

    console.log('[Database] Semua tabel siap.');

    // ── Seeding ───────────────────────────────────────────────────────────────

    // Admin default
    const adminExists = await client.query(`SELECT id FROM admins WHERE email = $1`, ['admin@gmail.com']);
    if (adminExists.rows.length === 0) {
      const hashed = bcrypt.hashSync('admin123', 10);
      await client.query(
        `INSERT INTO admins (email, password, name) VALUES ($1, $2, $3)`,
        ['admin@gmail.com', hashed, 'Alvaeryn Admin']
      );
      console.log('[Database] Default admin created: admin@gmail.com / admin123');
    }

    // Profile default
    const profileExists = await client.query(`SELECT id FROM profile WHERE id = 1`);
    if (profileExists.rows.length === 0) {
      await client.query(`
        INSERT INTO profile
          (id, name, badge, title, subtitle, bio, whatsapp, email, github, linkedin)
        VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        'Alvaeryn',
        'Jasa Pembuatan Website & Aplikasi Profesional',
        'Bangun Website & Aplikasi Yang Memukau',
        'Alvaeryn siap membantu kamu buat website, landing page, dan aplikasi mobile modern—cepat, responsif, dan profesional!',
        'Digital agency & software engineering studio berbasis di Indonesia.',
        '081234567890',
        'admin@gmail.com',
        'https://github.com/Alvaeryn',
        'https://linkedin.com',
      ]);
      console.log('[Database] Default profile seeded.');
    }

    // Services default
    const { rows: [{ count: svcCount }] } = await client.query(`SELECT COUNT(*) as count FROM services`);
    if (parseInt(svcCount) === 0) {
      const services = [
        { icon: '🌐', title: 'Web Development',  description: 'Membangun website modern dengan React, Next.js, dan performa optimal.', features: JSON.stringify(['Responsive Design', 'SEO Friendly', 'Fast Loading']), order_index: 1 },
        { icon: '📱', title: 'Mobile App',        description: 'Aplikasi cross-platform dengan Flutter & React Native untuk iOS dan Android.', features: JSON.stringify(['Single Codebase', 'Native Performance', 'Smooth UI']), order_index: 2 },
        { icon: '🎨', title: 'UI/UX Design',      description: 'Desain interface yang menarik dan user-friendly dengan Figma.', features: JSON.stringify(['Modern Design', 'User Research', 'Prototyping']), order_index: 3 },
        { icon: '🛒', title: 'E-Commerce',         description: 'Toko online lengkap dengan payment gateway dan manajemen produk.', features: JSON.stringify(['Payment Gateway', 'Inventory System', 'Order Management']), order_index: 4 },
      ];
      for (const s of services) {
        await client.query(
          `INSERT INTO services (icon, title, description, features, order_index) VALUES ($1,$2,$3,$4,$5)`,
          [s.icon, s.title, s.description, s.features, s.order_index]
        );
      }
      console.log('[Database] Default services seeded.');
    }

    // Projects default
    const { rows: [{ count: projCount }] } = await client.query(`SELECT COUNT(*) as count FROM projects`);
    if (parseInt(projCount) === 0) {
      const projects = [
        { title: 'Travel App', slug: 'travel-app', category: 'Full-Stack Web', description: 'Platform travel untuk booking paket wisata dengan antarmuka modern dan integrasi pembayaran Midtrans.', tech: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Express', 'MySQL']), image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800', link: 'https://github.com/Alvaeryn/Travel-App', order_index: 1 },
        { title: 'Absensi Siswa Berbasis QRCODE', slug: 'absensi-siswa-qrcode', category: 'Full-Stack Web', description: 'Sistem absensi modern dengan face recognition dan QR code untuk SD.', tech: JSON.stringify(['React', 'Express', 'MySQL', 'JavaScript']), image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', link: 'https://github.com/Alvaeryn/Absensi-Siswa-Berbasis-QRCODE', order_index: 2 },
        { title: 'Portfolio Website', slug: 'portfolio-website', category: 'Full-Stack Web', description: 'Website portfolio modern dengan React, TypeScript, dan Tailwind CSS.', tech: JSON.stringify(['React', 'TypeScript', 'Tailwind', 'Node.js']), image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', link: 'https://github.com/Alvaeryn/Porto', order_index: 3 },
        { title: 'Aplikasi Perkuliahan', slug: 'aplikasi-perkuliahan', category: 'Mobile App', description: 'Aplikasi mobile untuk manajemen perkuliahan dengan antarmuka yang user-friendly.', tech: JSON.stringify(['Flutter', 'Dart']), image: 'https://plus.unsplash.com/premium_photo-1664301435093-9804155eb991?q=80&w=1470&auto=format&fit=crop', link: 'https://github.com/ychaara/Aplikasi_Perkuliahan', order_index: 4 },
      ];
      for (const p of projects) {
        await client.query(
          `INSERT INTO projects (title, category, description, tech, image, link, slug, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [p.title, p.category, p.description, p.tech, p.image, p.link, p.slug, p.order_index]
        );
      }
      console.log('[Database] Default projects seeded.');
    }

    // Team default
    const { rows: [{ count: teamCount }] } = await client.query(`SELECT COUNT(*) as count FROM team`);
    if (parseInt(teamCount) === 0) {
      const team = [
        { name: 'Alvaeryn',       role: 'Founder & Full Stack Developer',  bio: 'Spesialis dalam pengembangan web dan aplikasi mobile dengan pengalaman lebih dari 2 tahun.', image: '/founder.jpeg', order_index: 1 },
        { name: 'Carisa R Ryanti', role: 'Mobile App & UI/UX Developer',    bio: 'Spesialis dalam pengembangan aplikasi mobile dan desain UI/UX yang kreatif dan responsif.', image: '/ica.jpeg',     order_index: 2 },
        { name: 'Revalin Amalia',  role: 'UI/UX Designer',                  bio: 'Desainer kreatif yang fokus pada pengalaman pengguna yang intuitif dan menarik.',              image: '/revalin.jpeg',order_index: 3 },
      ];
      for (const t of team) {
        await client.query(
          `INSERT INTO team (name, role, bio, image, order_index) VALUES ($1,$2,$3,$4,$5)`,
          [t.name, t.role, t.bio, t.image, t.order_index]
        );
      }
      console.log('[Database] Default team seeded.');
    }

    // Testimonials default
    const { rows: [{ count: testiCount }] } = await client.query(`SELECT COUNT(*) as count FROM testimonials`);
    if (parseInt(testiCount) === 0) {
      const testimonials = [
        { name: 'Rizky Pratama',   role: 'Owner Toko Fashion',       content: 'Hasilnya luar biasa! Website toko online saya jadi cepat dan profesional. Penjualan naik 35%!', rating: 5, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', order_index: 1 },
        { name: 'Siti Nurhaliza',  role: 'Founder Startup Edukasi',  content: 'Desain UI/UXnya sangat intuitive dan modern. User feedbacknya positif banget!', rating: 5, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', order_index: 2 },
        { name: 'Ahmad Fauzi',     role: 'CEO Tech Company',         content: 'Kerja sama dengan Alvaeryn sangat menyenangkan. Komunikasi dan hasilnya sesuai ekspektasi!', rating: 5, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200', order_index: 3 },
      ];
      for (const t of testimonials) {
        await client.query(
          `INSERT INTO testimonials (name, role, content, rating, photo, order_index) VALUES ($1,$2,$3,$4,$5,$6)`,
          [t.name, t.role, t.content, t.rating, t.photo, t.order_index]
        );
      }
      console.log('[Database] Default testimonials seeded.');
    }

    // Pricing default
    const { rows: [{ count: pricingCount }] } = await client.query(`SELECT COUNT(*) as count FROM pricing`);
    if (parseInt(pricingCount) === 0) {
      const pricing = [
        { name: 'Landing Page',    price: 'Rp 399K',  popular: 0, features: JSON.stringify(['Responsive Design', '5-7 Sections', 'Contact Form', 'Basic SEO', '7 Hari Pengerjaan']), order_index: 1 },
        { name: 'Business Website',price: 'Rp 1,2JT', popular: 1, features: JSON.stringify(['Multi Page (Max 8)', 'Premium UI/UX', 'SEO Optimization', 'Admin CMS', '14 Hari Pengerjaan', '30 Hari Support', 'Free Domain 1 Tahun']), order_index: 2 },
        { name: 'Full-Stack App',  price: 'Rp 3JT+',  popular: 0, features: JSON.stringify(['Full-Stack Development', 'Custom Features', 'Database Integration', 'API Development', '21-30 Hari Pengerjaan', 'Full Source Code']), order_index: 3 },
      ];
      for (const p of pricing) {
        await client.query(
          `INSERT INTO pricing (name, price, popular, features, order_index) VALUES ($1,$2,$3,$4,$5)`,
          [p.name, p.price, p.popular, p.features, p.order_index]
        );
      }
      console.log('[Database] Default pricing seeded.');
    }

    // Theme Settings default
    const themeExists = await client.query(`SELECT id FROM theme_settings WHERE id = 1`);
    if (themeExists.rows.length === 0) {
      await client.query(`
        INSERT INTO theme_settings (id, primary_color, primary_light, primary_dark, accent_color, background_dark, text_primary)
        VALUES (1, $1, $2, $3, $4, $5, $6)
      `, ['#1e3a5f', '#2563eb', '#0f172a', '#0ea5e9', '#0f172a', '#ffffff']);
      console.log('[Database] Default theme settings seeded.');
    }

    // Hero Cards default
    const { rows: [{ count: heroCount }] } = await client.query(`SELECT COUNT(*) as count FROM hero_cards`);
    if (parseInt(heroCount) === 0) {
      const heroCards = [
        { title: 'Web Development',       image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&q=80&w=600&h=400', description: 'Modern responsive web development with cutting-edge technologies', order_index: 1 },
        { title: 'Dashboard & Analytics', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400', description: 'Beautiful data visualization and analytics dashboards',              order_index: 2 },
        { title: 'Cloud Platform',        image: 'https://images.unsplash.com/photo-1629944112320-37d440d1eec2?auto=format&fit=crop&q=80&w=600&h=400', description: 'Scalable cloud infrastructure and deployment solutions',             order_index: 3 },
      ];
      for (const c of heroCards) {
        await client.query(
          `INSERT INTO hero_cards (title, image, description, order_index) VALUES ($1,$2,$3,$4)`,
          [c.title, c.image, c.description, c.order_index]
        );
      }
      console.log('[Database] Default hero cards seeded.');
    }

    // FAQ default
    const { rows: [{ count: faqCount }] } = await client.query(`SELECT COUNT(*) as count FROM faq_items`);
    if (parseInt(faqCount) === 0) {
      const faqs = [
        { question: 'Berapa lama proses pembuatan website atau aplikasi?', answer: 'Tergantung scope project. Landing page biasanya 3-7 hari, company profile sekitar 1-2 minggu, dan aplikasi custom bisa 3-8 minggu tergantung fitur.', order_index: 1 },
        { question: 'Apakah saya bisa request desain yang sesuai brand saya?', answer: 'Bisa. Warna, gaya visual, tipografi, sampai struktur halaman bisa disesuaikan dengan brand bisnis Anda agar terlihat lebih profesional dan konsisten.', order_index: 2 },
        { question: 'Apakah website bisa dibuka di HP dan laptop?', answer: 'Bisa. Semua website dibuat responsif sehingga tetap nyaman dipakai di mobile, tablet, maupun desktop.', order_index: 3 },
        { question: 'Apakah ada revisi setelah project selesai?', answer: 'Ada. Saya biasanya menyediakan sesi revisi sesuai paket atau kesepakatan awal agar hasil akhir benar-benar sesuai kebutuhan Anda.', order_index: 4 },
        { question: 'Kalau belum punya hosting dan domain, apakah bisa dibantu?', answer: 'Bisa. Saya bisa bantu rekomendasi, setup, sampai proses deploy agar website siap online tanpa Anda perlu ribet teknis.', order_index: 5 },
        { question: 'Bagaimana cara mulai konsultasi project?', answer: 'Tinggal hubungi lewat WhatsApp atau form kontak. Kirim gambaran kebutuhan project, target bisnis, dan referensi jika ada, lalu saya bantu arahkan solusi yang paling cocok.', order_index: 6 },
      ];
      for (const f of faqs) {
        await client.query(
          `INSERT INTO faq_items (question, answer, order_index) VALUES ($1,$2,$3)`,
          [f.question, f.answer, f.order_index]
        );
      }
      console.log('[Database] Default FAQ seeded.');
    }

    // About Sections default
    const { rows: [{ count: aboutCount }] } = await client.query(`SELECT COUNT(*) as count FROM about_sections`);
    if (parseInt(aboutCount) === 0) {
      const aboutSections = [
        {
          type: 'core_foundations', title: 'Core Foundations', subtitle: '', order_index: 1,
          items: JSON.stringify([
            { num: '01', title: 'Understand Before Building', desc: 'Start by understanding the business, its actual users, and the root problem that needs solving.', bullets: ['Root workflow analysis', 'Pain-point validation audits'] },
            { num: '02', title: 'Keep It Practical',          desc: 'Choose features and implementation approaches that serve a clear purpose.', bullets: ['Lean, dependency-conscious architecture', 'Zero superfluous micro-services'] },
            { num: '03', title: 'Build for Real Use',         desc: 'Create digital experiences that are immediately understandable and stress-free to maintain.', bullets: ['Human-centered UI workflows', 'Documented, self-sufficient codebases'] },
          ]),
        },
        {
          type: 'process_stages', title: 'Process Stages', subtitle: '', order_index: 2,
          items: JSON.stringify([
            { stage: 'STAGE 01', title: 'Listen & Understand', desc: 'Discuss operational goals, target users, constraints, and current systemic bottlenecks.' },
            { stage: 'STAGE 02', title: 'Define the Scope',    desc: 'Specify essential deliverables, technological stack, milestone deliverables, and timeline commitments.' },
            { stage: 'STAGE 03', title: 'Design the UX',       desc: 'Organize site architecture, establish high-fidelity UI systems, and validate key end-to-end task flows.' },
            { stage: 'STAGE 04', title: 'Build & Refine',      desc: 'Implement production-grade code, execute rigorous functional tests, and polish user experience metrics.' },
            { stage: 'STAGE 05', title: 'Launch & Handover',   desc: 'Execute secure deployment, deliver technical documentation, and initiate warranty support periods.' },
          ]),
        },
        {
          type: 'studio_ethics', title: 'Studio Ethics', subtitle: '', order_index: 3,
          items: JSON.stringify([
            { title: 'Clear Communication',   desc: 'We discuss technical trade-offs and architecture decisions in accessible, business-centric language.' },
            { title: 'Defined Expectations',  desc: 'Scope boundaries, milestones, and deliverables are locked down explicitly before any development commences.' },
            { title: 'Thoughtful Execution',  desc: 'We hold an uncompromising attitude toward design typography, UX friction, and codebase hygiene.' },
            { title: 'Honest Collaboration',  desc: 'If an idea is over-engineered or introduces unnecessary risk, we say so upfront.' },
          ]),
        },
      ];
      for (const s of aboutSections) {
        await client.query(
          `INSERT INTO about_sections (type, title, subtitle, items, order_index) VALUES ($1,$2,$3,$4,$5)`,
          [s.type, s.title, s.subtitle, s.items, s.order_index]
        );
      }
      console.log('[Database] Default About Sections seeded.');
    }

    // ─── PROJECT DETAILS TABLE (for case study content) ───
    console.log('[Database] Creating project_details table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_details (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
        
        -- Hero Section
        tagline TEXT,
        hero_stats JSONB DEFAULT '[]',
        screenshot_url TEXT,
        archive_code TEXT,
        year INTEGER,
        
        -- Overview Section
        overview_title TEXT,
        overview_description TEXT,
        overview_meta JSONB DEFAULT '[]',
        
        -- Problem Section
        problem_title TEXT,
        problem_description TEXT,
        bottlenecks JSONB DEFAULT '[]',
        
        -- Solution Section
        solution_title TEXT,
        solution_description TEXT,
        pipeline JSONB DEFAULT '[]',
        
        -- Capabilities Section
        capabilities_title TEXT,
        capabilities JSONB DEFAULT '[]',
        
        -- Tech Specs Section
        tech_title TEXT,
        tech_specs JSONB DEFAULT '[]',
        tech_image_url TEXT,
        
        -- Outcomes Section
        outcomes_title TEXT,
        deliverables JSONB DEFAULT '[]',
        
        -- How Built Section
        how_built_title TEXT,
        how_built_description TEXT,
        how_built_items JSONB DEFAULT '[]',
        
        -- Related Projects
        related_slugs TEXT[] DEFAULT '{}',
        
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create index for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_project_details_project_id ON project_details(project_id);
    `);

    // Seed LogiFlow project detail if exists
    const logiflowCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = (SELECT id FROM projects WHERE slug = $1 LIMIT 1)',
      ['logiflow-dispatch-portal']
    );

    if (logiflowCheck.rows.length === 0) {
      const logiflowProjectId = await client.query(
        'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
        ['logiflow-dispatch-portal']
      );

      if (logiflowProjectId.rows.length > 0) {
        const projectId = logiflowProjectId.rows[0].id;
        
        await client.query(`
          INSERT INTO project_details (
            project_id, tagline, hero_stats, screenshot_url, archive_code, year,
            overview_title, overview_description, overview_meta,
            problem_title, problem_description, bottlenecks,
            solution_title, solution_description, pipeline,
            capabilities_title, capabilities,
            tech_title, tech_specs, tech_image_url,
            outcomes_title, deliverables,
            how_built_title, how_built_description, how_built_items,
            related_slugs
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `, [
          projectId,
          'Enterprise Fleet Dispatch Platform',
          JSON.stringify([
            { value: '94 / 100', label: 'LIGHTHOUSE SCORE', blue: true, sub: 'Performance & Accessibility' },
            { value: '+270ms', label: 'AVERAGE LOAD TIME', sub: 'vs +3.2s industry standard' },
            { value: '-19.4%', label: 'DISPATCH INEFFICIENCY', sub: 'Operational savings' }
          ]),
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
          'CS-LogiFlow-2024',
          2024,
          
          'Project Overview',
          'LogiFlow is a unified, real-time dispatch platform built for large-scale logistics operators managing 200+ vehicles across multiple depots. The system combines predictive routing algorithms, real-time GPS tracking, and role-based access control into a single SPA that reduced operational inefficiency by 67% while improving customer satisfaction.',
          JSON.stringify([
            { icon: '📊', title: 'Real-Time Analytics', desc: 'Live fleet tracking with predictive routing algorithms' },
            { icon: '🔒', title: 'Enterprise-Grade Security', desc: 'SOC 2 compliant, role-based access control' },
            { icon: '⚡', title: 'Sub-Second Performance', desc: 'Optimized React components + WebSocket updates' }
          ]),
          
          'The Operational Bottleneck',
          'The client relied on fragmented tools (spreadsheets, phone calls, multiple dispatch systems) resulting in manual routing, delayed response times, and zero visibility into real-time fleet status.',
          JSON.stringify([
            { icon: '⚠️', title: 'Legacy Dispatch Queues', desc: 'Manual spreadsheet-based routing causing $200K+ in inefficiency annually' },
            { icon: '📉', title: 'Operational Visibility Gap', desc: 'Fragmented data sources prevented real-time decision making' },
            { icon: '🚫', title: 'Compliance Risk', desc: 'No audit trail or role-based access control' }
          ]),
          
          'Our Approach: Deterministic Workflow Engineering',
          'Rather than building "yet another dispatch tool," we engineered a deterministic workflow that replaces manual decision-making with rule-based automation. Every dispatch decision is logged, auditable, and continuously optimized based on real-world performance metrics.',
          JSON.stringify([
            { num: '01', title: 'Deterministic Workflow Engineering', desc: 'Mapped entire dispatch workflow to eliminate manual touchpoints' },
            { num: '02', title: 'Real-Time Data Pipeline', desc: 'Built WebSocket infrastructure for live GPS & status updates' },
            { num: '03', title: 'Analytics-First Architecture', desc: 'Implemented dimensional modeling for BI dashboards' },
            { num: '04', title: 'Role-Based Access Control', desc: 'Implemented fine-grained permissions & audit logging' }
          ]),
          
          'Key Implemented Capabilities',
          JSON.stringify([
            { title: 'Real-Time GPS Tracking Pipeline', description: 'Live vehicle position updates with geofencing & predictive arrival ETAs' },
            { title: 'Predictive Routing Algorithm', description: 'Machine learning–powered route optimization reducing drive time by 18%' },
            { title: 'Automated Dispatch Queues', description: 'Rules-based automatic task assignment based on vehicle capacity & location' },
            { title: 'Role-Based Access Layer', description: 'Fine-grained permission system for dispatchers, drivers, & management' },
            { title: 'Multi-Tenant Cost Allocation', description: 'Automatic cost tracking & billing segmentation per client' },
            { title: 'Compliance & Audit Logging', description: 'Complete audit trail for SOC 2 & regulatory requirements' },
            { title: 'Real-Time BI Dashboard', description: 'Live KPI monitoring with drill-down analytics capabilities' },
            { title: 'Mobile-First Driver Interface', description: 'React Native app for iOS & Android with offline-first capabilities' }
          ]),
          
          'Inside the Product: Crafted for Speed & High-Stress Operations',
          JSON.stringify([
            { category: 'Frontend', tech: 'React 18 + TypeScript', note: 'Server-side rendered for performance' },
            { category: 'Backend', tech: 'Node.js Express + GraphQL', note: 'Scalable API layer with subscription support' },
            { category: 'Real-time', tech: 'WebSocket + Socket.io', note: 'Sub-100ms broadcast latency' },
            { category: 'Database', tech: 'PostgreSQL + PostGIS', note: 'Geospatial queries for tracking' },
            { category: 'Cache', tech: 'Redis Cluster', note: 'Session & route cache management' },
            { category: 'Infrastructure', tech: 'Kubernetes + Docker', note: 'Auto-scaling based on load' }
          ]),
          'https://images.unsplash.com/photo-1553117459-d10256231c64?auto=format&fit=crop&q=80&w=800',
          
          'The Outcome: Verified Deliverables',
          JSON.stringify([
            { icon: '📈', title: 'Efficiency Gain', value: '67%', note: 'Dispatch time reduction vs. manual baseline' },
            { icon: '⏱️', title: 'ETA Accuracy', value: '94%', note: 'Within 5-minute window on 94% of deliveries' },
            { icon: '🎯', title: 'Route Optimization', value: '+18%', note: 'Average distance reduction per route' },
            { icon: '💰', title: 'Cost Savings', value: '$420K+', note: 'Annual operational cost reduction' }
          ]),
          
          'How It Was Built',
          'Built with deterministic architecture principles, the system prioritizes predictability and auditability over feature count.',
          JSON.stringify([
            { phase: 'Discovery & Workflow Mapping', weeks: '2-3', description: 'Mapped entire dispatch workflow to identify automation opportunities' },
            { phase: 'Prototype & Validation', weeks: '2', description: 'Validated predictions with live pilot group' },
            { phase: 'Production Build & Deployment', weeks: '6-8', description: 'Engineered production-grade system with compliance & monitoring' },
            { phase: 'Optimization & Scaling', weeks: '4+', description: 'Continuous performance tuning & feature expansion' }
          ]),
          
          ARRAY['travel-app', 'absensi-siswa-berbasis-qrcode']
        ]);
        
        console.log('[Database] LogiFlow project detail seeded.');
      }
    }

    // ─── SEED PROJECT DETAILS FOR OTHER PROJECTS ───
    // Travel App
    const travelAppCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = (SELECT id FROM projects WHERE slug = $1 LIMIT 1)',
      ['travel-app']
    );

    if (travelAppCheck.rows.length === 0) {
      const travelAppProjectId = await client.query(
        'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
        ['travel-app']
      );

      if (travelAppProjectId.rows.length > 0) {
        const projectId = travelAppProjectId.rows[0].id;
        await client.query(`
          INSERT INTO project_details (
            project_id, tagline, hero_stats, screenshot_url, archive_code, year,
            overview_title, overview_description, overview_meta,
            problem_title, problem_description, bottlenecks,
            solution_title, solution_description, pipeline,
            capabilities_title, capabilities,
            tech_title, tech_specs, tech_image_url,
            outcomes_title, deliverables,
            how_built_title, how_built_description, how_built_items,
            related_slugs
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `, [
          projectId,
          'Modern Travel Booking Platform',
          JSON.stringify([
            { value: '45K+', label: 'MONTHLY BOOKINGS', blue: true, sub: 'Active users' },
            { value: '98%', label: 'PAYMENT SUCCESS RATE', sub: 'Midtrans integration' },
            { value: '2.3s', label: 'AVERAGE LOAD TIME', sub: 'Optimized' }
          ]),
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
          'CS-TravelApp-2024',
          2024,
          
          'Project Overview',
          'Travel App adalah platform booking paket wisata yang memudahkan users mencari dan membooking paket wisata dari berbagai operator dengan interface yang modern dan payment integration yang smooth.',
          JSON.stringify([
            { icon: '🗺️', title: 'Destination Catalog', desc: 'Database lengkap destinasi wisata di Indonesia' },
            { icon: '💳', title: 'Seamless Payment', desc: 'Integrasi Midtrans untuk berbagai metode pembayaran' },
            { icon: '⭐', title: 'Review System', desc: 'User reviews dan ratings untuk transparansi' }
          ]),
          
          'Problem',
          'Travel booking marketplace yang ada masih kompleks dan sulit untuk user casual.',
          JSON.stringify([
            { icon: '🔍', title: 'Difficult Discovery', desc: 'Sulit menemukan paket wisata yang sesuai' },
            { icon: '💰', title: 'Payment Friction', desc: 'Banyak metode pembayaran tidak tersedia' },
            { icon: '❌', title: 'No Reviews', desc: 'Tidak ada sistem review untuk kepercayaan' }
          ]),
          
          'Solution',
          'Kami membangun platform travel yang fokus pada UX simplicity dengan payment gateway terintegrasi dan sistem review yang kredibel.',
          JSON.stringify([
            { num: '01', title: 'Streamlined Search', desc: 'Filter yang intuitif untuk menemukan paket' },
            { num: '02', title: 'Multi-Payment Gateway', desc: 'Integrasi Midtrans untuk semua metode pembayaran' },
            { num: '03', title: 'Trust System', desc: 'Review dan rating dari verified users' },
            { num: '04', title: 'Mobile First', desc: 'Optimized untuk mobile experience' }
          ]),
          
          'Key Features',
          JSON.stringify([
            { title: 'Advanced Search & Filter', description: 'Find packages by destination, price, date, and more' },
            { title: 'Real-time Availability', description: 'Live updates on package availability' },
            { title: 'Secure Payment Processing', description: 'Multiple payment methods via Midtrans' },
            { title: 'Booking Management', description: 'Easy tracking and management of bookings' },
            { title: 'Review & Ratings', description: 'Community reviews for transparency' },
            { title: 'Instant Confirmation', description: 'Automatic booking confirmation via email' },
            { title: 'Multi-Language Support', description: 'Available in Indonesian and English' },
            { title: 'Admin Dashboard', description: 'Operator portal for package management' }
          ]),
          
          'Tech Stack & Performance',
          JSON.stringify([
            { category: 'Frontend', tech: 'React + TypeScript', note: 'Modern UI with Tailwind' },
            { category: 'Backend', tech: 'Node.js + Express', note: 'RESTful API architecture' },
            { category: 'Database', tech: 'MySQL', note: 'Relational data management' },
            { category: 'Payment', tech: 'Midtrans Integration', note: 'Indonesian payment gateway' },
            { category: 'Hosting', tech: 'Cloud Server', note: 'Scalable infrastructure' },
            { category: 'CDN', tech: 'Image Optimization', note: 'Fast image delivery' }
          ]),
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
          
          'Results & Impact',
          JSON.stringify([
            { icon: '📈', title: 'User Growth', value: '+300%', note: 'First year adoption' },
            { icon: '💰', title: 'Revenue', value: '+$2M', note: 'First year revenue' },
            { icon: '⭐', title: 'Ratings', value: '4.8/5', note: 'App store rating' },
            { icon: '🚀', title: 'Speed', value: '2.3s', note: 'Average load time' }
          ]),
          
          'Development Process',
          'Iterative development dengan regular user testing dan feedback incorporation.',
          JSON.stringify([
            { phase: 'Requirements & Design', weeks: '3-4', description: 'Gathered user requirements and designed UI/UX' },
            { phase: 'Backend Development', weeks: '4-5', description: 'Built API and integrated Midtrans' },
            { phase: 'Frontend Development', weeks: '3-4', description: 'Implemented React frontend' },
            { phase: 'Testing & Launch', weeks: '2-3', description: 'QA testing and production launch' }
          ]),
          
          ARRAY['logiflow-dispatch-portal', 'absensi-siswa-qrcode']
        ]);
        console.log('[Database] Travel App project detail seeded.');
      }
    }

    // Absensi Siswa
    const absensiCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = (SELECT id FROM projects WHERE slug = $1 LIMIT 1)',
      ['absensi-siswa-qrcode']
    );

    if (absensiCheck.rows.length === 0) {
      const absensiProjectId = await client.query(
        'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
        ['absensi-siswa-qrcode']
      );

      if (absensiProjectId.rows.length > 0) {
        const projectId = absensiProjectId.rows[0].id;
        await client.query(`
          INSERT INTO project_details (
            project_id, tagline, hero_stats, screenshot_url, archive_code, year,
            overview_title, overview_description, overview_meta,
            problem_title, problem_description, bottlenecks,
            solution_title, solution_description, pipeline,
            capabilities_title, capabilities,
            tech_title, tech_specs, tech_image_url,
            outcomes_title, deliverables,
            how_built_title, how_built_description, how_built_items,
            related_slugs
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `, [
          projectId,
          'Smart Student Attendance System',
          JSON.stringify([
            { value: '10+ Schools', label: 'ACTIVE ADOPTION', blue: true, sub: 'Across Indonesia' },
            { value: '95%', label: 'ACCURACY RATE', sub: 'Face recognition + QR code' },
            { value: '5000+', label: 'DAILY USERS', sub: 'Students and teachers' }
          ]),
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          'CS-Absensi-2024',
          2024,
          
          'Project Overview',
          'Sistem absensi yang modern menggunakan kombinasi QR code scanning dan face recognition technology untuk automasi dan akurasi yang lebih tinggi di sekolah.',
          JSON.stringify([
            { icon: '🎓', title: 'Education Focused', desc: 'Designed specifically for school environment' },
            { icon: '📱', title: 'Mobile Integration', desc: 'App-based attendance for teachers' },
            { icon: '🔐', title: 'Secure & Verified', desc: 'Multiple verification methods' }
          ]),
          
          'Challenge',
          'Sistem absensi manual di sekolah memakan waktu dan rentan terhadap fraud.',
          JSON.stringify([
            { icon: '⏰', title: 'Time Consuming', desc: 'Manual roll-call takes too long' },
            { icon: '🤥', title: 'Attendance Fraud', desc: 'Students marking attendance for others' },
            { icon: '📊', title: 'No Analytics', desc: 'Difficult to track patterns' }
          ]),
          
          'Our Solution',
          'Automated attendance system dengan dual verification (QR + Face Recognition) untuk akurasi maksimal.',
          JSON.stringify([
            { num: '01', title: 'QR Code Scanning', desc: 'Quick check-in using mobile app' },
            { num: '02', title: 'Face Recognition', desc: 'Biometric verification for accuracy' },
            { num: '03', title: 'Real-time Dashboard', desc: 'Live attendance monitoring for teachers' },
            { num: '04', title: 'Detailed Reports', desc: 'Automated attendance reports and analytics' }
          ]),
          
          'Key Capabilities',
          JSON.stringify([
            { title: 'QR Code Generation', description: 'Dynamic QR codes for each class session' },
            { title: 'Face Recognition', description: 'Accurate facial identification for verification' },
            { title: 'Mobile App', description: 'iOS and Android app for easy check-in' },
            { title: 'Teacher Dashboard', description: 'Real-time attendance tracking' },
            { title: 'Parent Notifications', description: 'Auto-notify parents of absences' },
            { title: 'Analytics & Reports', description: 'Comprehensive attendance analytics' },
            { title: 'Multi-School Support', description: 'Manage multiple school locations' },
            { title: 'Admin Portal', description: 'Complete system administration interface' }
          ]),
          
          'Technical Implementation',
          JSON.stringify([
            { category: 'Frontend', tech: 'React + TypeScript', note: 'Modern dashboard interface' },
            { category: 'Mobile', tech: 'React Native', note: 'iOS and Android app' },
            { category: 'Backend', tech: 'Node.js + Express', note: 'Scalable API server' },
            { category: 'Database', tech: 'MySQL', note: 'Attendance data storage' },
            { category: 'AI/ML', tech: 'Face Recognition API', note: 'TensorFlow or similar' },
            { category: 'QR Code', tech: 'QR Library', note: 'Dynamic QR generation' }
          ]),
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          
          'Outcomes Achieved',
          JSON.stringify([
            { icon: '⏱️', title: 'Time Saved', value: '80%', note: 'Reduction in attendance time' },
            { icon: '🛡️', title: 'Fraud Prevention', value: '99%', note: 'Elimination of fake attendance' },
            { icon: '📈', title: 'Adoption Rate', value: '92%', note: 'School acceptance' },
            { icon: '⭐', title: 'Satisfaction', value: '4.9/5', note: 'User satisfaction score' }
          ]),
          
          'Build Timeline',
          'Complete development cycle untuk school-ready system.',
          JSON.stringify([
            { phase: 'Research & Design', weeks: '2-3', description: 'Conducted school surveys and designed system' },
            { phase: 'Core Development', weeks: '5-6', description: 'Built backend and frontend' },
            { phase: 'ML Integration', weeks: '2-3', description: 'Integrated face recognition' },
            { phase: 'Testing & Deployment', weeks: '2-3', description: 'School pilots and full rollout' }
          ]),
          
          ARRAY['travel-app', 'logiflow-dispatch-portal']
        ]);
        console.log('[Database] Absensi Siswa project detail seeded.');
      }
    }

    // Portfolio Website
    const portfolioCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = (SELECT id FROM projects WHERE slug = $1 LIMIT 1)',
      ['portfolio-website']
    );

    if (portfolioCheck.rows.length === 0) {
      const portfolioProjectId = await client.query(
        'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
        ['portfolio-website']
      );

      if (portfolioProjectId.rows.length > 0) {
        const projectId = portfolioProjectId.rows[0].id;
        await client.query(`
          INSERT INTO project_details (
            project_id, tagline, hero_stats, screenshot_url, archive_code, year,
            overview_title, overview_description, overview_meta,
            problem_title, problem_description, bottlenecks,
            solution_title, solution_description, pipeline,
            capabilities_title, capabilities,
            tech_title, tech_specs, tech_image_url,
            outcomes_title, deliverables,
            how_built_title, how_built_description, how_built_items,
            related_slugs
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `, [
          projectId,
          'Modern Developer Portfolio',
          JSON.stringify([
            { value: '10K+', label: 'MONTHLY VISITORS', blue: true, sub: 'Active portfolio viewers' },
            { value: '99.9%', label: 'UPTIME', sub: 'Reliable hosting' },
            { value: '0.8s', label: 'LOAD TIME', blue: true, sub: 'Optimized performance' }
          ]),
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
          'CS-Portfolio-2024',
          2024,
          
          'Project Overview',
          'Portfolio website modern yang showcase skills, projects, dan pengalaman developer dengan design yang clean dan performa yang optimal.',
          JSON.stringify([
            { icon: '🎨', title: 'Modern Design', desc: 'Clean and professional design system' },
            { icon: '⚡', title: 'High Performance', desc: 'Optimized for speed and responsiveness' },
            { icon: '📱', title: 'Fully Responsive', desc: 'Works perfect on all devices' }
          ]),
          
          'Challenge',
          'Portfolio generik tidak showcase developer skills dengan efektif dan tidak memorable untuk potential employers.',
          JSON.stringify([
            { icon: '😴', title: 'Generic Templates', desc: "Standard portfolio doesn't stand out" },
            { icon: '🐌', title: 'Poor Performance', desc: 'Slow loading affects user experience' },
            { icon: '📉', title: 'Low Engagement', desc: "Doesn't drive meaningful connections" }
          ]),
          
          'Approach',
          'Membangun portfolio yang unique dengan design yang striking, performa yang excellent, dan content yang showcasing.',
          JSON.stringify([
            { num: '01', title: 'Custom Design', desc: 'Unique design that reflects personality' },
            { num: '02', title: 'Performance First', desc: 'Optimized for speed and SEO' },
            { num: '03', title: 'Project Showcase', desc: 'Detailed case studies of projects' },
            { num: '04', title: 'Contact Integration', desc: 'Easy way for opportunities' }
          ]),
          
          'Key Features',
          JSON.stringify([
            { title: 'Hero Section', description: 'Compelling introduction with CTA' },
            { title: 'Project Gallery', description: 'Showcase of best works with filters' },
            { title: 'Skills Section', description: 'Technical skills visualization' },
            { title: 'Experience Timeline', description: 'Professional experience display' },
            { title: 'Case Studies', description: 'Detailed project write-ups' },
            { title: 'Blog Integration', description: 'Technical articles and insights' },
            { title: 'Contact Form', description: 'Easy contact and inquiry system' },
            { title: 'Dark Mode', description: 'Beautiful dark theme support' }
          ]),
          
          'Tech Stack Used',
          JSON.stringify([
            { category: 'Frontend', tech: 'React + TypeScript', note: 'Component-based architecture' },
            { category: 'Styling', tech: 'Tailwind CSS', note: 'Utility-first CSS' },
            { category: 'Deployment', tech: 'Vercel', note: 'Serverless deployment' },
            { category: 'CMS', tech: 'Markdown', note: 'Simple content management' },
            { category: 'Analytics', tech: 'Google Analytics', note: 'Track visitor behavior' },
            { category: 'SEO', tech: 'Next.js SEO', note: 'Optimized for search' }
          ]),
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
          
          'Achievements',
          JSON.stringify([
            { icon: '🏆', title: 'Job Offers', value: '5+', note: 'Direct opportunities from portfolio' },
            { icon: '📊', title: 'Engagement', value: '+200%', note: 'Higher conversion rate' },
            { icon: '⭐', title: 'Reviews', value: '4.9/5', note: 'Visitor feedback' },
            { icon: '🚀', title: 'Performance', value: '100/100', note: 'Lighthouse score' }
          ]),
          
          'Development Timeline',
          'Quick turnaround untuk launch portfolio yang impactful.',
          JSON.stringify([
            { phase: 'Design & Planning', weeks: '1', description: 'Created design mockups' },
            { phase: 'Development', weeks: '2', description: 'Built React components' },
            { phase: 'Content Creation', weeks: '1', description: 'Wrote case studies' },
            { phase: 'Optimization & Launch', weeks: '1', description: 'Performance optimization' }
          ]),
          
          ARRAY['travel-app', 'logiflow-dispatch-portal']
        ]);
        console.log('[Database] Portfolio Website project detail seeded.');
      }
    }

    // Aplikasi Perkuliahan
    const perkuliahanCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = (SELECT id FROM projects WHERE slug = $1 LIMIT 1)',
      ['aplikasi-perkuliahan']
    );

    if (perkuliahanCheck.rows.length === 0) {
      const perkuliahanProjectId = await client.query(
        'SELECT id FROM projects WHERE slug = $1 LIMIT 1',
        ['aplikasi-perkuliahan']
      );

      if (perkuliahanProjectId.rows.length > 0) {
        const projectId = perkuliahanProjectId.rows[0].id;
        await client.query(`
          INSERT INTO project_details (
            project_id, tagline, hero_stats, screenshot_url, archive_code, year,
            overview_title, overview_description, overview_meta,
            problem_title, problem_description, bottlenecks,
            solution_title, solution_description, pipeline,
            capabilities_title, capabilities,
            tech_title, tech_specs, tech_image_url,
            outcomes_title, deliverables,
            how_built_title, how_built_description, how_built_items,
            related_slugs
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `, [
          projectId,
          'Integrated Campus Management System',
          JSON.stringify([
            { value: '1000+', label: 'ACTIVE USERS', blue: true, sub: 'Students and lecturers' },
            { value: '15+', label: 'UNIVERSITIES', sub: 'Across Indonesia' },
            { value: '98%', label: 'ADOPTION RATE', blue: true, sub: 'Student satisfaction' }
          ]),
          'https://plus.unsplash.com/premium_photo-1664301435093-9804155eb991?q=80&w=1470&auto=format&fit=crop',
          'CS-Perkuliahan-2024',
          2024,
          
          'Project Overview',
          'Aplikasi manajemen perkuliahan yang comprehensive untuk mengelola kelas, assignments, grades, dan komunikasi antara mahasiswa dan dosen dalam satu platform terintegrasi.',
          JSON.stringify([
            { icon: '📚', title: 'Centralized Learning', desc: 'All course materials in one place' },
            { icon: '📝', title: 'Assignment Management', desc: 'Easy submission and grading system' },
            { icon: '💬', title: 'Communication Hub', desc: 'Direct messaging and announcements' }
          ]),
          
          'Problem',
          'Universitas menggunakan multiple systems yang tidak terintegrasi, menyebabkan confusion dan komunikasi yang inefficient.',
          JSON.stringify([
            { icon: '🔀', title: 'Fragmented Systems', desc: 'Multiple disconnected platforms' },
            { icon: '📧', title: 'Poor Communication', desc: 'Email overload and missed messages' },
            { icon: '📊', title: 'No Central Hub', desc: 'Students confused where to find info' }
          ]),
          
          'Solution',
          'Integrated platform yang consolidates semua aspek manajemen perkuliahan untuk simplify academic workflow.',
          JSON.stringify([
            { num: '01', title: 'Unified Dashboard', desc: 'All courses and materials in one place' },
            { num: '02', title: 'Assignment Tracking', desc: 'Submit, grade, and track assignments' },
            { num: '03', title: 'Grade Management', desc: 'Central grade book and transcript' },
            { num: '04', title: 'Communication Tools', desc: 'Announcements, messaging, and notifications' }
          ]),
          
          'Key Capabilities',
          JSON.stringify([
            { title: 'Course Management', description: 'Create and manage courses, sections, and materials' },
            { title: 'Assignment System', description: 'Create, distribute, collect, and grade assignments' },
            { title: 'Grade Book', description: 'Comprehensive gradebook with automatic calculations' },
            { title: 'Student Records', description: 'Manage student information and enrollments' },
            { title: 'Messaging', description: 'Direct messaging between instructors and students' },
            { title: 'Announcements', description: 'Class-wide and course announcements' },
            { title: 'Attendance Tracking', description: 'Digital attendance and absence management' },
            { title: 'Document Library', description: 'Upload and share course materials' }
          ]),
          
          'Technical Architecture',
          JSON.stringify([
            { category: 'Mobile', tech: 'Flutter & Dart', note: 'iOS and Android apps' },
            { category: 'Backend', tech: 'Node.js', note: 'Scalable API server' },
            { category: 'Database', tech: 'Firebase', note: 'Real-time data sync' },
            { category: 'Cloud', tech: 'Google Cloud', note: 'Scalable infrastructure' },
            { category: 'Notifications', tech: 'Firebase Cloud Messaging', note: 'Push notifications' },
            { category: 'Security', tech: 'OAuth 2.0', note: 'Secure authentication' }
          ]),
          'https://plus.unsplash.com/premium_photo-1664301435093-9804155eb991?q=80&w=1470&auto=format&fit=crop',
          
          'Results Delivered',
          JSON.stringify([
            { icon: '⏱️', title: 'Time Saved', value: '5h/week', note: 'Per instructor saved' },
            { icon: '📈', title: 'Engagement', value: '+150%', note: 'Student participation increase' },
            { icon: '⭐', title: 'Satisfaction', value: '4.7/5', note: 'User rating' },
            { icon: '📊', title: 'Adoption', value: '98%', note: 'University-wide adoption' }
          ]),
          
          'Development Phases',
          'Staged rollout untuk ensure quality at each phase.',
          JSON.stringify([
            { phase: 'Requirements Gathering', weeks: '2', description: 'Interviewed students and instructors' },
            { phase: 'Core Development', weeks: '8', description: 'Built main features and backend' },
            { phase: 'Mobile Apps', weeks: '6', description: 'Developed iOS and Android apps' },
            { phase: 'Testing & Rollout', weeks: '4', description: 'UAT and phased university rollout' }
          ]),
          
          ARRAY['travel-app', 'absensi-siswa-qrcode']
        ]);
        console.log('[Database] Aplikasi Perkuliahan project detail seeded.');
      }
    }

    console.log('[Database] Inisialisasi selesai.');
  } catch (err) {
    console.error('[Database] Inisialisasi gagal:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// Jalankan inisialisasi saat module di-load
initDatabase().catch((err) => {
  console.error('[Database] Fatal — tidak bisa connect ke PostgreSQL:', err.message);
  process.exit(1);
});

module.exports = pool;


