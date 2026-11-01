# 🎨 Alvaeryn Portfolio - Full Stack Application

**A modern, full-stack portfolio website with admin dashboard, theme customization, and dynamic content management.**

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Prerequisites Check

**Pastikan sudah install:**
- ✅ Node.js v20/v22 LTS atau v24 ([nodejs.org](https://nodejs.org))
- ✅ npm 10.x atau lebih tinggi
- ✅ git

**Verifikasi:**
```powershell
node --version    # Harus v20.x, v22.x, atau v24.x
npm --version     # Harus 10.x atau lebih
git --version
```

⚠️ **JANGAN GUNAKAN NODE V23!** (Versi ini bermasalah, banyak library incompatible)

---

### 2️⃣ Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend (di terminal baru)
cd frontend
npm install
```

---

### 3️⃣ Run Development Server

```powershell
# Terminal 1: Backend
cd backend
npm start
# Output: [Server] Aktif di http://localhost:5000

# Terminal 2: Frontend (buka terminal baru)
cd frontend
npm run dev
# Output: http://localhost:5173
```

✅ **Done! Buka** http://localhost:5173

---

## 📁 Project Structure

```
porto/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── app.js             # Main server
│   │   ├── config/            # Database config
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Request handlers
│   │   └── middlewares/       # Auth & CORS
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom hooks
│   │   └── config/            # API endpoints
│   ├── package.json
│   └── .env                   # Frontend config
│
└── informations.md            # Full documentation
```

---

## 🔐 Default Login

```
Email:    admin@gmail.com
Password: admin123
```

**Admin Dashboard:** http://localhost:5173/erynalva

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js v20+ LTS
- **Framework:** Express.js
- **Database:** PostgreSQL (PGlite for dev)
- **Auth:** JWT (jsonwebtoken)
- **Upload:** Multer
- **Email:** Nodemailer + Resend

### Frontend
- **Language:** TypeScript + React 18
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP:** Fetch API

---

## 🚀 Available Scripts

### Backend
```powershell
npm start                    # Production mode
npm run dev                  # Development (auto-reload with nodemon)
```

### Frontend
```powershell
npm run dev                  # Dev server (Vite)
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # ESLint check
```

---

## 🌐 API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Authentication
```bash
POST /api/auth/login
GET /api/auth/verify-token
```

### Content Management
```bash
GET /api/profile              # Profile/Hero data
GET /api/services             # Services
GET /api/projects             # Portfolio projects
GET /api/team                 # Team members
GET /api/testimonials         # Testimonials
GET /api/pricing              # Pricing plans
GET /api/hero-cards           # Hero cards
GET /api/faq                  # FAQ items
GET /api/about-sections       # About page sections
```

---

## ⚙️ Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔑 Key Features

✅ **Admin Dashboard**
- Theme customization (colors, logo, fonts)
- Content management (projects, services, team, testimonials)
- FAQ & about sections management
- Contact form submissions inbox

✅ **Dynamic Content**
- Language switching (ID/EN)
- Dark/Light mode
- Responsive design

✅ **Authentication**
- JWT-based login
- Protected admin routes
- Secure API endpoints

✅ **Database**
- PostgreSQL with PGlite for development
- Auto-migration on startup
- Seeded default data

---

## 📊 Database Schema

**Tables:**
- `admins` - Admin users
- `profile` - Portfolio profile
- `services` - Service offerings
- `projects` - Portfolio projects
- `team` - Team members
- `testimonials` - Client testimonials
- `pricing` - Pricing packages
- `contacts` - Contact submissions
- `theme_settings` - Theme customization
- `hero_cards` - Hero section cards
- `faq_items` - FAQ list
- `about_sections` - About page content

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
```

### Node Version Error
```powershell
# Check version
node --version

# Should be v20.x, v22.x, or v24.x
# Download from nodejs.org if needed
```

### npm install Failed
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
rm -r node_modules package-lock.json

# Fresh install
npm install
```

### Backend Connection Error
```powershell
# Make sure backend is running
cd backend
npm start

# Check: http://localhost:5000/api/health
```

---

## 📖 Full Documentation

Untuk dokumentasi lengkap, lihat:
- **[informations.md](./informations.md)** - Detailed setup & configuration
- **[env.md](./env.md)** - Environment variables reference
- **Backend README** - [backend/README.md](./backend/README.md)

---

## 🤝 Team

- **Frontend** - React + TypeScript
- **Backend** - Node.js + Express
- **Design** - Figma mockups available

---

## 📝 License

ISC

---

## 🚀 Deployment

### Production with PM2

```powershell
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start npm --name "backend" -- start

# Build and serve frontend
cd frontend
npm run build
pm2 serve dist 5173 --name "frontend"

# Save PM2 config
pm2 save
pm2 startup
```

---

## ✅ Deployment Checklist

```
☑️ Node.js v20/v22 LTS installed
☑️ npm dependencies installed
☑️ .env files configured
☑️ Database migrations ran
☑️ Backend running on :5000
☑️ Frontend built and serving
☑️ PM2 configured (optional)
☑️ Domain/SSL configured
```

---

## 💬 Questions?

Check **informations.md** for detailed setup guide or contact the team!

**Ready to start?** → Run `npm install` di backend & frontend, then `npm start` & `npm run dev`! 🚀
