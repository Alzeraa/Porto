const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database SQLite disimpan langsung di folder backend/portfolio.db
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Inisialisasi tabel-tabel database
const initDatabase = () => {
  try {
    // 1. Tabel Admin
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabel Profile / Hero
    db.exec(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL,
        badge TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        bio TEXT,
        whatsapp TEXT,
        email TEXT,
        github TEXT,
        linkedin TEXT,
        logo_url TEXT DEFAULT '/Final-Logo.png',
        cta_primary_text TEXT DEFAULT 'Konsultasi Gratis Sekarang',
        cta_primary_link TEXT DEFAULT '#contact',
        cta_secondary_text TEXT DEFAULT 'Lihat Proyek Kami',
        cta_secondary_link TEXT DEFAULT '#projects',
        trusted_by_title TEXT DEFAULT 'Dipercaya oleh Startup & UMKM Mapan',
        tech_stack_title TEXT DEFAULT 'Teknologi yang Kami Gunakan',
        tech_stack TEXT DEFAULT 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pastikan kolom baru otomatis ada jika tabel sudah terbuat sebelumnya
    const profileColumns = db.prepare('PRAGMA table_info(profile)').all().map(c => c.name);
    if (!profileColumns.includes('logo_url')) db.exec("ALTER TABLE profile ADD COLUMN logo_url TEXT DEFAULT '/Final-Logo.png'");
    if (!profileColumns.includes('cta_primary_text')) db.exec("ALTER TABLE profile ADD COLUMN cta_primary_text TEXT DEFAULT 'Konsultasi Gratis Sekarang'");
    if (!profileColumns.includes('cta_primary_link')) db.exec("ALTER TABLE profile ADD COLUMN cta_primary_link TEXT DEFAULT '#contact'");
    if (!profileColumns.includes('cta_secondary_text')) db.exec("ALTER TABLE profile ADD COLUMN cta_secondary_text TEXT DEFAULT 'Lihat Proyek Kami'");
    if (!profileColumns.includes('cta_secondary_link')) db.exec("ALTER TABLE profile ADD COLUMN cta_secondary_link TEXT DEFAULT '#projects'");
    if (!profileColumns.includes('trusted_by_title')) db.exec("ALTER TABLE profile ADD COLUMN trusted_by_title TEXT DEFAULT 'Dipercaya oleh Startup & UMKM Mapan'");
    if (!profileColumns.includes('tech_stack_title')) db.exec("ALTER TABLE profile ADD COLUMN tech_stack_title TEXT DEFAULT 'Teknologi yang Kami Gunakan'");
    if (!profileColumns.includes('tech_stack')) db.exec("ALTER TABLE profile ADD COLUMN tech_stack TEXT DEFAULT 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma'");


    // 3. Tabel Services
    db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        features TEXT NOT NULL, -- JSON array
        order_index INTEGER DEFAULT 0
      );
    `);

    // 4. Tabel Projects
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        tech TEXT NOT NULL, -- JSON array
        image TEXT NOT NULL,
        link TEXT,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 5. Tabel Contacts
    db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT,
        service TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Tabel Team
    db.exec(`
      CREATE TABLE IF NOT EXISTS team (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        bio TEXT NOT NULL,
        image TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 7. Tabel Testimonials
    db.exec(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        photo TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 8. Tabel Pricing
    db.exec(`
      CREATE TABLE IF NOT EXISTS pricing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        popular INTEGER DEFAULT 0,
        features TEXT NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);

    // 9. Tabel Theme Settings
    db.exec(`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        primary_color TEXT DEFAULT '#1e3a5f',
        primary_light TEXT DEFAULT '#2563eb',
        primary_dark TEXT DEFAULT '#0f172a',
        accent_color TEXT DEFAULT '#0ea5e9',
        background_dark TEXT DEFAULT '#0f172a',
        text_primary TEXT DEFAULT '#ffffff',
        logo_url TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Tabel Hero Cards (untuk card stacking di hero section)
    db.exec(`
      CREATE TABLE IF NOT EXISTS hero_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 11. Tabel FAQ Items
    db.exec(`
      CREATE TABLE IF NOT EXISTS faq_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 12. Tabel About Sections (untuk halaman AboutPage)
    db.exec(`
      CREATE TABLE IF NOT EXISTS about_sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL, -- 'core_foundations', 'process_stages', 'studio_ethics', 'faq', 'service_caps', 'pragmatic_points', 'client_segments'
        title TEXT NOT NULL,
        subtitle TEXT DEFAULT '',
        items TEXT NOT NULL, -- JSON array
        order_index INTEGER DEFAULT 0
      );
    `);

    // 13. Tabel Translations (untuk multi-bahasa support)
    db.exec(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        language TEXT NOT NULL DEFAULT 'id',
        text TEXT NOT NULL,
        source_key TEXT,
        source_language TEXT DEFAULT 'en',
        is_manual INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Index untuk performa
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
      CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language);
      CREATE INDEX IF NOT EXISTS idx_translations_key_language ON translations(key, language);
    `);

    // 14. Tabel Translation Caches (untuk caching hasil translate)
    db.exec(`
      CREATE TABLE IF NOT EXISTS translation_caches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_text TEXT NOT NULL,
        source_language TEXT NOT NULL,
        target_language TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        provider TEXT DEFAULT 'libretranslate',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Index untuk cache lookup
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trans_cache_lookup ON translation_caches(source_text, source_language, target_language);
    `);

    // Seed Admin Default jika belum ada (admin@gmail.com / admin123)
    const checkAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@gmail.com');
    if (!checkAdmin) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
        'admin@gmail.com',
        hashedPassword,
        'Alvaeryn Admin'
      );
      console.log('[Database] Default admin created: admin@gmail.com / admin123');
    }

    // Seed Profile Default jika belum ada
    const checkProfile = db.prepare('SELECT id FROM profile WHERE id = 1').get();
    if (!checkProfile) {
      db.prepare(`
        INSERT INTO profile (id, name, badge, title, subtitle, bio, whatsapp, email, github, linkedin)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'Alvaeryn',
        'Jasa Pembuatan Website & Aplikasi Profesional',
        'Bangun Website & Aplikasi Yang Memukau',
        'Alvaeryn siap membantu kamu buat website, landing page, dan aplikasi mobile modern—cepat, responsif, dan profesional!',
        'Digital agency & software engineering studio berbasis di Indonesia.',
        '081234567890',
        'admin@gmail.com',
        'https://github.com/Alvaeryn',
        'https://linkedin.com'
      );
      console.log('[Database] Default profile seeded.');
    }

    // Seed Services jika masih kosong
    const countServices = db.prepare('SELECT count(*) as count FROM services').get().count;
    if (countServices === 0) {
      const defaultServices = [
        {
          icon: '🌐',
          title: 'Web Development',
          description: 'Membangun website modern dengan React, Next.js, dan performa optimal.',
          features: JSON.stringify(['Responsive Design', 'SEO Friendly', 'Fast Loading']),
          order_index: 1
        },
        {
          icon: '📱',
          title: 'Mobile App',
          description: 'Aplikasi cross-platform dengan Flutter & React Native untuk iOS dan Android.',
          features: JSON.stringify(['Single Codebase', 'Native Performance', 'Smooth UI']),
          order_index: 2
        },
        {
          icon: '🎨',
          title: 'UI/UX Design',
          description: 'Desain interface yang menarik dan user-friendly dengan Figma.',
          features: JSON.stringify(['Modern Design', 'User Research', 'Prototyping']),
          order_index: 3
        },
        {
          icon: '🛒',
          title: 'E-Commerce',
          description: 'Toko online lengkap dengan payment gateway dan manajemen produk.',
          features: JSON.stringify(['Payment Gateway', 'Inventory System', 'Order Management']),
          order_index: 4
        }
      ];

      const insertService = db.prepare(`
        INSERT INTO services (icon, title, description, features, order_index)
        VALUES (@icon, @title, @description, @features, @order_index)
      `);
      for (const s of defaultServices) {
        insertService.run(s);
      }
      console.log('[Database] Default services seeded.');
    }

    // Seed Projects jika masih kosong
    const countProjects = db.prepare('SELECT count(*) as count FROM projects').get().count;
    if (countProjects === 0) {
      const defaultProjects = [
        {
          title: 'Travel App',
          category: 'Full-Stack Web',
          description: 'Platform travel untuk booking paket wisata dengan antarmuka modern dan integrasi pembayaran Midtrans.',
          tech: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Express', 'MySQL']),
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
          link: 'https://github.com/Alvaeryn/Travel-App',
          order_index: 1
        },
        {
          title: 'Absensi Siswa Berbasis QRCODE',
          category: 'Full-Stack Web',
          description: 'Sistem absensi modern dengan face recognition dan QR code untuk SD.',
          tech: JSON.stringify(['React', 'Express', 'MySQL', 'JavaScript']),
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          link: 'https://github.com/Alvaeryn/Absensi-Siswa-Berbasis-QRCODE',
          order_index: 2
        },
        {
          title: 'Portfolio Website',
          category: 'Full-Stack Web',
          description: 'Website portfolio modern dengan React, TypeScript, dan Tailwind CSS.',
          tech: JSON.stringify(['React', 'TypeScript', 'Tailwind', 'Node.js']),
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
          link: 'https://github.com/Alvaeryn/Porto',
          order_index: 3
        },
        {
          title: 'Aplikasi Perkuliahan',
          category: 'Mobile App',
          description: 'Aplikasi mobile untuk manajemen perkuliahan dengan antarmuka yang user-friendly.',
          tech: JSON.stringify(['Flutter', 'Dart']),
          image: 'https://plus.unsplash.com/premium_photo-1664301435093-9804155eb991?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          link: 'https://github.com/ychaara/Aplikasi_Perkuliahan',
          order_index: 4
        }
      ];

      const insertProj = db.prepare(`
        INSERT INTO projects (title, category, description, tech, image, link, order_index)
        VALUES (@title, @category, @description, @tech, @image, @link, @order_index)
      `);
      for (const p of defaultProjects) {
        insertProj.run(p);
      }
      console.log('[Database] Default projects seeded.');
    }

    // Seed Team jika masih kosong
    const countTeam = db.prepare('SELECT count(*) as count FROM team').get().count;
    if (countTeam === 0) {
      const defaultTeam = [
        {
          name: 'Alvaeryn',
          role: 'Founder & Full Stack Developer',
          bio: 'Spesialis dalam pengembangan web dan aplikasi mobile dengan pengalaman lebih dari 2 tahun.',
          image: '/founder.jpeg',
          order_index: 1
        },
        {
          name: 'Carisa R Ryanti',
          role: 'Mobile App & UI/UX Developer',
          bio: 'Spesialis dalam pengembangan aplikasi mobile dan desain UI/UX yang kreatif dan responsif.',
          image: '/ica.jpeg',
          order_index: 2
        },
        {
          name: 'Revalin Amalia',
          role: 'UI/UX Designer',
          bio: 'Desainer kreatif yang fokus pada pengalaman pengguna yang intuitif dan menarik.',
          image: '/revalin.jpeg',
          order_index: 3
        }
      ];
      const insertTeam = db.prepare(`INSERT INTO team (name, role, bio, image, order_index) VALUES (@name, @role, @bio, @image, @order_index)`);
      for (const t of defaultTeam) insertTeam.run(t);
      console.log('[Database] Default team seeded.');
    }

    // Seed Testimonials jika masih kosong
    const countTesti = db.prepare('SELECT count(*) as count FROM testimonials').get().count;
    if (countTesti === 0) {
      const defaultTestimonials = [
        {
          name: 'Rizky Pratama',
          role: 'Owner Toko Fashion',
          content: 'Hasilnya luar biasa! Website toko online saya jadi cepat dan profesional. Penjualan naik 35%!',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
          order_index: 1
        },
        {
          name: 'Siti Nurhaliza',
          role: 'Founder Startup Edukasi',
          content: 'Desain UI/UXnya sangat intuitive dan modern. User feedbacknya positif banget!',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
          order_index: 2
        },
        {
          name: 'Ahmad Fauzi',
          role: 'CEO Tech Company',
          content: 'Kerja sama dengan Alvaeryn sangat menyenangkan. Komunikasi dan hasilnya sesuai ekspektasi!',
          rating: 5,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
          order_index: 3
        }
      ];
      const insertTesti = db.prepare(`INSERT INTO testimonials (name, role, content, rating, photo, order_index) VALUES (@name, @role, @content, @rating, @photo, @order_index)`);
      for (const t of defaultTestimonials) insertTesti.run(t);
      console.log('[Database] Default testimonials seeded.');
    }

    // Seed Pricing jika masih kosong
    const countPricing = db.prepare('SELECT count(*) as count FROM pricing').get().count;
    if (countPricing === 0) {
      const defaultPricing = [
        {
          name: 'Landing Page',
          price: 'Rp 399K',
          popular: 0,
          features: JSON.stringify(['Responsive Design', '5-7 Sections', 'Contact Form', 'Basic SEO', '7 Hari Pengerjaan']),
          order_index: 1
        },
        {
          name: 'Business Website',
          price: 'Rp 1,2JT',
          popular: 1,
          features: JSON.stringify(['Multi Page (Max 8)', 'Premium UI/UX', 'SEO Optimization', 'Admin CMS', '14 Hari Pengerjaan', '30 Hari Support', 'Free Domain 1 Tahun']),
          order_index: 2
        },
        {
          name: 'Full-Stack App',
          price: 'Rp 3JT+',
          popular: 0,
          features: JSON.stringify(['Full-Stack Development', 'Custom Features', 'Database Integration', 'API Development', '21-30 Hari Pengerjaan', 'Full Source Code']),
          order_index: 3
        }
      ];
      const insertPricing = db.prepare(`INSERT INTO pricing (name, price, popular, features, order_index) VALUES (@name, @price, @popular, @features, @order_index)`);
      for (const p of defaultPricing) insertPricing.run(p);
      console.log('[Database] Default pricing seeded.');
    }

    // Seed Theme Settings jika belum ada
    const checkTheme = db.prepare('SELECT id FROM theme_settings WHERE id = 1').get();
    if (!checkTheme) {
      db.prepare(`
        INSERT INTO theme_settings (id, primary_color, primary_light, primary_dark, accent_color, background_dark, text_primary)
        VALUES (1, ?, ?, ?, ?, ?, ?)
      `).run(
        '#1e3a5f',
        '#2563eb',
        '#0f172a',
        '#0ea5e9',
        '#0f172a',
        '#ffffff'
      );
      console.log('[Database] Default theme settings seeded.');
    }

    // Seed Hero Cards jika masih kosong
    const countHeroCards = db.prepare('SELECT count(*) as count FROM hero_cards').get().count;
    if (countHeroCards === 0) {
      const defaultHeroCards = [
        {
          title: 'Web Development',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&q=80&w=600&h=400',
          description: 'Modern responsive web development with cutting-edge technologies',
          order_index: 1
        },
        {
          title: 'Dashboard & Analytics',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
          description: 'Beautiful data visualization and analytics dashboards',
          order_index: 2
        },
        {
          title: 'Cloud Platform',
          image: 'https://images.unsplash.com/photo-1629944112320-37d440d1eec2?auto=format&fit=crop&q=80&w=600&h=400',
          description: 'Scalable cloud infrastructure and deployment solutions',
          order_index: 3
        }
      ];

      const insertHeroCard = db.prepare(`
        INSERT INTO hero_cards (title, image, description, order_index)
        VALUES (@title, @image, @description, @order_index)
      `);
      for (const card of defaultHeroCards) {
        insertHeroCard.run(card);
      }
      console.log('[Database] Default hero cards seeded.');
    }

    // Seed FAQ jika masih kosong
    const countFAQ = db.prepare('SELECT count(*) as count FROM faq_items').get().count;
    if (countFAQ === 0) {
      const defaultFAQ = [
        {
          question: 'Berapa lama proses pembuatan website atau aplikasi?',
          answer: 'Tergantung scope project. Landing page biasanya 3-7 hari, company profile sekitar 1-2 minggu, dan aplikasi custom bisa 3-8 minggu tergantung fitur.',
          order_index: 1
        },
        {
          question: 'Apakah saya bisa request desain yang sesuai brand saya?',
          answer: 'Bisa. Warna, gaya visual, tipografi, sampai struktur halaman bisa disesuaikan dengan brand bisnis Anda agar terlihat lebih profesional dan konsisten.',
          order_index: 2
        },
        {
          question: 'Apakah website bisa dibuka di HP dan laptop?',
          answer: 'Bisa. Semua website dibuat responsif sehingga tetap nyaman dipakai di mobile, tablet, maupun desktop.',
          order_index: 3
        },
        {
          question: 'Apakah ada revisi setelah project selesai?',
          answer: 'Ada. Saya biasanya menyediakan sesi revisi sesuai paket atau kesepakatan awal agar hasil akhir benar-benar sesuai kebutuhan Anda.',
          order_index: 4
        },
        {
          question: 'Kalau belum punya hosting dan domain, apakah bisa dibantu?',
          answer: 'Bisa. Saya bisa bantu rekomendasi, setup, sampai proses deploy agar website siap online tanpa Anda perlu ribet teknis.',
          order_index: 5
        },
        {
          question: 'Bagaimana cara mulai konsultasi project?',
          answer: 'Tinggal hubungi lewat WhatsApp atau form kontak. Kirim gambaran kebutuhan project, target bisnis, dan referensi jika ada, lalu saya bantu arahkan solusi yang paling cocok.',
          order_index: 6
        }
      ];

      const insertFAQ = db.prepare(`
        INSERT INTO faq_items (question, answer, order_index)
        VALUES (?, ?, ?)
      `);
      for (const faq of defaultFAQ) {
        insertFAQ.run(faq.question, faq.answer, faq.order_index);
      }
      console.log('[Database] Default FAQ seeded.');
    }

    // Seed About Sections jika masih kosong
    const countAboutSections = db.prepare('SELECT count(*) as count FROM about_sections').get().count;
    if (countAboutSections === 0) {
      const defaultAboutSections = [
        {
          type: 'core_foundations',
          title: 'Core Foundations',
          items: JSON.stringify([
            { num: '01', title: 'Understand Before Building', desc: 'Start by understanding the business, its actual users, and the root problem that needs solving. We never write code until the workflow friction points are systematically mapped.', bullets: ['Root workflow analysis', 'Pain-point validation audits'], icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>' },
            { num: '02', title: 'Keep It Practical', desc: 'Choose features and implementation approaches that serve a clear purpose instead of adding unnecessary operational overhead or brittle framework dependencies.', bullets: ['Lean, dependency-conscious architecture', 'Zero superfluous micro-services'], icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h12M4 10h8M4 14h5" strokeLinecap="round" /></svg>' },
            { num: '03', title: 'Build for Real Use', desc: 'Create digital experiences that are immediately understandable, stress-free to maintain, and appropriate for the exact daily habits of the people who interact with them.', bullets: ['Human-centered UI workflows', 'Documented, self-sufficient codebases'], icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" /></svg>' }
          ]),
          order_index: 1
        },
        {
          type: 'process_stages',
          title: 'Process Stages',
          items: JSON.stringify([
            { stage: 'STAGE 01', title: 'Listen & Understand', desc: 'Discuss operational goals, target users, constraints, and current systemic bottlenecks.', icon: '<svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2a4 4 0 014 4v1.5A2.5 2.5 0 019.5 10H8a4 4 0 01-4-4V6a4 4 0 014-4z" strokeLinecap="round" /><path d="M5 14a3 3 0 006 0" strokeLinecap="round" /></svg>' },
            { stage: 'STAGE 02', title: 'Define the Scope', desc: 'Specify essential deliverables, technological stack, milestone deliverables, and timeline commitments.', icon: '<svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5" /><path d="M5 8h6M8 5v6" strokeLinecap="round" /></svg>' },
            { stage: 'STAGE 03', title: 'Design the UX', desc: 'Organize site architecture, establish high-fidelity UI systems, and validate key end-to-end task flows.', icon: '<svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="M5 6h6M5 9h4" strokeLinecap="round" /></svg>' },
            { stage: 'STAGE 04', title: 'Build & Refine', desc: 'Implement production-grade code, execute rigorous functional tests, and polish user experience metrics.', icon: '<svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13l3-3 2 2 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg>' },
            { stage: 'STAGE 05', title: 'Launch & Handover', desc: 'Execute secure deployment, deliver technical documentation, and initiate warranty support periods.', icon: '<svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.5 4.5H14l-3.75 2.75 1.5 4.5L8 11.25 4.25 13.75l1.5-4.5L2 6.5h4.5L8 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>' }
          ]),
          order_index: 2
        },
        {
          type: 'studio_ethics',
          title: 'Studio Ethics',
          items: JSON.stringify([
            { title: 'Clear Communication', desc: 'We discuss technical trade-offs, architecture decisions, and roadmap priorities in accessible, business-centric language without obfuscating technical jargon.', icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V5z" strokeLinecap="round" strokeLinejoin="round" /></svg>' },
            { title: 'Defined Expectations', desc: 'Scope boundaries, specific milestones, functional deliverables, and revisions are locked down explicitly before any codebase development commences.', icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="3" width="14" height="14" rx="2" /></svg>' },
            { title: 'Thoughtful Execution', desc: 'We hold an uncompromising attitude toward design typography, UX friction, responsive performance budgets, cross-browser compatibility, and modular codebase hygiene.', icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="16" height="13" rx="2" /><path d="M6 7h8M6 11h5" strokeLinecap="round" /></svg>' },
            { title: 'Honest Collaboration', desc: 'If an idea is over-engineered or introduces unnecessary risks to your operating model, we say so upfront. We value client viability above billable hours.', icon: '<svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10s1-6 6-6 6 6 6 6-1 6-6 6-6-6-6-6z" /><circle cx="10" cy="10" r="2" /></svg>' }
          ]),
          order_index: 3
        }
      ];

      const insertAboutSection = db.prepare(`
        INSERT INTO about_sections (type, title, subtitle, items, order_index)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const section of defaultAboutSections) {
        insertAboutSection.run(section.type, section.title, section.subtitle, section.items, section.order_index);
      }
      console.log('[Database] Default About Sections seeded.');
    }

    // Seed Translations Default
    const checkTranslations = db.prepare('SELECT COUNT(*) as count FROM translations').get();
    if (checkTranslations.count === 0) {
      const defaultTranslations = [
        // FAQ Questions (English)
        { key: 'faq_q_1', language: 'en', text: 'How long does website or application development take?', source_key: 'faq_q_1', source_language: 'en', is_manual: 0 },
        { key: 'faq_q_2', language: 'en', text: 'Can I request design that matches my brand?', source_key: 'faq_q_2', source_language: 'en', is_manual: 0 },
        { key: 'faq_q_3', language: 'en', text: 'Will the website work on mobile and laptop?', source_key: 'faq_q_3', source_language: 'en', is_manual: 0 },
        { key: 'faq_q_4', language: 'en', text: 'Is there revision after project completion?', source_key: 'faq_q_4', source_language: 'en', is_manual: 0 },
        { key: 'faq_q_5', language: 'en', text: "Can you help with hosting and domain if I don't have them?", source_key: 'faq_q_5', source_language: 'en', is_manual: 0 },
        { key: 'faq_q_6', language: 'en', text: 'How do I start project consultation?', source_key: 'faq_q_6', source_language: 'en', is_manual: 0 },

        // FAQ Answers (English)
        { key: 'faq_a_1', language: 'en', text: 'Depends on scope. Landing page usually 3-7 days, company profile around 1-2 weeks, custom app 3-8 weeks depending on features.', source_key: 'faq_a_1', source_language: 'en', is_manual: 0 },
        { key: 'faq_a_2', language: 'en', text: 'Yes. Colors, visual style, typography, even page structure can be customized to match your brand for a more professional look.', source_key: 'faq_a_2', source_language: 'en', is_manual: 0 },
        { key: 'faq_a_3', language: 'en', text: 'Yes. All websites are built responsive so they remain comfortable to use on mobile, tablet, or desktop.', source_key: 'faq_a_3', source_language: 'en', is_manual: 0 },
        { key: 'faq_a_4', language: 'en', text: 'Yes. I usually provide revision sessions as per package or initial agreement so the final result matches your needs exactly.', source_key: 'faq_a_4', source_language: 'en', is_manual: 0 },
        { key: 'faq_a_5', language: 'en', text: 'Yes. I can help recommend, setup, and deployment so your website goes online smoothly without technical hassle.', source_key: 'faq_a_5', source_language: 'en', is_manual: 0 },
        { key: 'faq_a_6', language: 'en', text: 'Just contact via WhatsApp or contact form. Send project needs, business goals, and references if any, then I guide you to the best solution.', source_key: 'faq_a_6', source_language: 'en', is_manual: 0 },
      ];

      const insertTranslation = db.prepare(`
        INSERT INTO translations (key, language, text, source_key, source_language, is_manual)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const trans of defaultTranslations) {
        insertTranslation.run(trans.key, trans.language, trans.text, trans.source_key, trans.source_language, trans.is_manual);
      }
      console.log('[Database] Default translations seeded.');
    }

    console.log(`[Database] SQLite Database aktif dan siap di: ${dbPath}`);
  } catch (err) {
    console.error('[Database] Inisialisasi error:', err);
  }
};

initDatabase();

module.exports = db;