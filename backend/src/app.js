require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Inisialisasi Database SQLite
require('./config/database');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const teamRoutes = require('./routes/teamRoutes');
const testimonialsRoutes = require('./routes/testimonialsRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const themeRoutes = require('./routes/themeRoutes');
const heroCardsRoutes = require('./routes/heroCardsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares with larger limit for logo / image uploads
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Root Health & Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Alvaeryn Portfolio Backend API',
    status: 'online',
    author: 'Alvaeryn'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'SQLite (portfolio.db)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/hero-cards', heroCardsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Aktif di http://localhost:${PORT}`);
});
