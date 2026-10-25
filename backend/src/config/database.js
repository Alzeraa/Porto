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

    console.log(`[Database] SQLite Database aktif dan siap di: ${dbPath}`);
  } catch (err) {
    console.error('[Database] Inisialisasi error:', err);
  }
};

initDatabase();

module.exports = db;
