PORT_FRONTEND : http://localhost:5173/   
PORT_BACKEND : http://localhost:5000

# 🌐 CLOUDFLARE TUNNEL SETUP

## ✅ Status Tunnel Saat Ini

```
Tunnel Name: porto
Domain: alzera.web.id

Routes Configuration:
- alzera.web.id          → http://localhost:5173  (Frontend)
- api.alzera.web.id      → http://localhost:5000  (Backend)
```

---

## 🔥 LOCALHOST YANG HARUS SELALU NYALA

Untuk tunnel Cloudflare berfungsi, **kedua service ini HARUS selalu berjalan:**

### 1️⃣ **Backend (CRITICAL)**
```
Service: Node.js Express Server
URL: http://localhost:5000
Port: 5000
Status: ⚠️ MUST BE RUNNING
```

### 2️⃣ **Frontend (CRITICAL)**
```
Service: React Vite Dev Server
URL: http://localhost:5173
Port: 5173
Status: ⚠️ MUST BE RUNNING
```

### 3️⃣ **Database (REQUIRED)**
```
Service: PostgreSQL (PGlite)
Port: 5432
Status: ⚠️ RUNS WITH BACKEND
Auto-start: Saat backend dijalankan
```

---

## 🚀 CARA MENJALANKAN (STARTUP SEQUENCE)

### Step 1: Start Backend (Terminal 1)
```bash
cd c:\Reavlenia Arezha\Porto\backend
npm start
```

**Tunggu sampai output:**
```
[Database] PostgreSQL Database aktif...
[Server] Aktif di http://localhost:5000
```

✅ Backend + Database siap!

---

### Step 2: Start Frontend (Terminal 2 - BARU)
```bash
cd c:\Reavlenia Arezha\Porto\frontend
npm run dev
```

**Tunggu sampai output:**
```
  VITE v8.0.16  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend siap!

---

### Step 3: Verify Tunnel (Terminal 3 - Optional)
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:5173
```

---

## 📊 Verification Checklist

**Sebelum Tunnel aktif, pastikan:**

```
☑️ Backend running: http://localhost:5000
☑️ Frontend running: http://localhost:5173
☑️ Database connected (check backend logs)
☑️ Cloudflare Tunnel aktif
☑️ Routes configured: alzera.web.id & api.alzera.web.id
```

**Then akses via domain:**
- Frontend: https://alzera.web.id
- Backend API: https://api.alzera.web.id/api/health

---

## 🔄 COMPLETE STARTUP SCRIPT

Untuk automation, buat file batch:

**File: `start-all.bat`** (di folder Porto root)
```batch
@echo off
echo Starting Alvaeryn Portfolio...

REM Terminal 1: Backend
start cmd /k "cd backend && npm start"
timeout /t 5

REM Terminal 2: Frontend
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ Startup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Via Cloudflare Tunnel:
echo Frontend: https://alzera.web.id
echo API:      https://api.alzera.web.id
echo.
pause
```

**Cara pakai:**
```bash
# Double-click start-all.bat atau:
start-all.bat
```

---

## ⚠️ PENTING: HARUS SELALU NYALA

### Saat Development:
✅ Backend (Terminal 1) - ALWAYS RUNNING
✅ Frontend (Terminal 2) - ALWAYS RUNNING
✅ Database - AUTO (dengan backend)

### Saat Production (dengan Cloudflare):
✅ Backend (via PM2) - ALWAYS RUNNING
✅ Frontend (built/served) - ALWAYS RUNNING
✅ Database - ALWAYS RUNNING
✅ Cloudflare Tunnel - ALWAYS CONNECTED

---

## 🛠️ SETUP PM2 UNTUK PRODUCTION

Untuk memastikan service tetap hidup saat restart/error:

### 1. Setup PM2 untuk Backend
```bash
cd backend
pm2 start npm --name "backend" -- start
```

### 2. Setup PM2 untuk Frontend
```bash
cd frontend
npm run build
pm2 serve dist 5173 --name "frontend"
```

### 3. Save PM2 Config
```bash
pm2 save
pm2 startup
```

**Sekarang service auto-restart saat error/reboot!**

---

## 📋 MONITORING CHECKLIST

### Daily/Weekly:
```
☑️ Backend running? → curl http://localhost:5000/api/health
☑️ Frontend accessible? → curl http://localhost:5173
☑️ Database healthy? → Check backend logs
☑️ Tunnel connected? → Check Cloudflare dashboard
☑️ Domain accessible? → Visit alzera.web.id
```

### PM2 Monitoring:
```bash
pm2 list              # Check status
pm2 logs backend      # Check backend logs
pm2 logs frontend     # Check frontend logs
pm2 monit             # Real-time monitoring
pm2 save              # Save config
```

---

## 🔐 DEFAULT LOGIN CREDENTIALS

```
Email:    admin@gmail.com
Password: admin123
```

---

## 📊 Quick Reference Table

| Component | Port | Status | Action |
|-----------|------|--------|--------|
| Backend | 5000 | 🔴 Manual | `npm start` |
| Frontend | 5173 | 🔴 Manual | `npm run dev` |
| Database | 5432 | 🟢 Auto | Runs with backend |
| Tunnel | - | ✅ Active | Check Cloudflare |

---

## 🚨 TROUBLESHOOTING

### ❌ "Connection refused" di Cloudflare
**Penyebab:** Backend/Frontend tidak running
**Solution:**
```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd frontend && npm run dev
```

### ❌ "Port already in use"
**Solution:**
```bash
# Kill existing process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Atau ganti port di .env
```

### ❌ Tunnel disconnect
**Solution:**
```bash
# Check Cloudflare dashboard
# Restart tunnel di Cloudflare UI
# Atau restart localhost services
```

### ❌ Frontend tidak muat
**Solution:**
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Check: http://localhost:5173 (local)
# Check: https://alzera.web.id (via tunnel)
```

---

## 💡 BEST PRACTICE

### During Development:
1. Terminal 1: Backend (`npm start`)
2. Terminal 2: Frontend (`npm run dev`)
3. Keep both running while working
4. Test via http://localhost:5173
5. Access via tunnel: https://alzera.web.id

### Before Sleep/Away:
```bash
# Option 1: Stop everything
# Terminal 1 & 2: Ctrl+C

# Option 2: Keep running (production-like)
pm2 start npm --name "backend" -- start
pm2 serve frontend/dist 5173 --name "frontend"
```

### Daily Check:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5173
pm2 list
```

---

## 📝 SERVICE DEPENDENCIES

```
Cloudflare Tunnel (Remote)
    ↓
Port Forward: 5173 & 5000
    ↓
Frontend (http://localhost:5173)
Backend (http://localhost:5000)
    ↓
PostgreSQL Database (http://localhost:5432)
```

**Semua harus connected untuk tunnel berfungsi!**

---

## ✅ FINAL CHECKLIST

```
☑️ Backend installed: npm install (backend)
☑️ Frontend installed: npm install (frontend)
☑️ PostgreSQL ready: .env configured
☑️ Cloudflare tunnel created: porto tunnel
☑️ Routes configured: alzera.web.id → :5173, api.alzera.web.id → :5000
☑️ Startup script ready: start-all.bat
☑️ PM2 setup (optional): pm2 start ...
☑️ Domain accessible: https://alzera.web.id
```

**Semuanya sudah siap untuk production! 🚀**


## Backend Stack
- **Language:** Node.js (JavaScript)
- **Framework:** Express.js (REST API)
- **Database:** PostgreSQL (dengan PGlite untuk development lokal)
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Email:** Nodemailer + Resend
- **Password Hash:** bcryptjs
- **Port:** 5000

## Frontend Stack
- **Language:** TypeScript + React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Fetch API
- **Port:** 5173

---

# 💾 DATABASE - PostgreSQL (PGlite)

## ✅ Apa itu PostgreSQL & PGlite?

**PostgreSQL:**
- Professional-grade relational database
- Powerful, reliable, production-ready
- Support advanced features (JSON, Full-text search, etc)
- Cocok untuk enterprise applications

**PGlite:**
- PostgreSQL lokal untuk development
- Tidak perlu install PostgreSQL server terpisah
- Data disimpan di folder `backend/pg_data/`
- Compatible dengan PostgreSQL queries

## � Lokasi Database

```
backend/pg_data/           ← PostgreSQL data directory
backend/.env               ← Database configuration
```

## 🔧 Database Configuration (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATA_DIR=./pg_data
```

---

## 🔧 CARA MENJALANKAN BACKEND MANUAL

### Option 1: Direct NPM (Recommended)
```bash
cd backend
npm start
```

**Output yang benar:**
```
[Database] PostgreSQL Database aktif di: postgresql://postgres:postgres@localhost:5432/portfolio_db
[Database] Tables created successfully
[Database] Default data seeded
[Server] Aktif di http://localhost:5000
```

### Option 2: Nodemon (Auto-reload saat edit file)
```bash
cd backend
npm run dev
```

### Option 3: PM2 (Production)
```bash
pm2 start npm --name "backend" -- start
pm2 logs backend
```

---

## 🐳 Database Status

### ✅ Database Hidup Bersama Backend
- Saat `npm start`, database otomatis aktif
- Database stop saat backend stop
- **Tidak perlu start database terpisah!**

### ✅ Setup PGlite
- Auto-create tables pada start pertama
- Auto-seed default data dengan admin@gmail.com / admin123
- Auto-setup schema sesuai kebutuhan

---

## 📊 Database Tables

Ketika backend start, tables otomatis dibuat dengan data default:

1. **admins** - Admin users (Default: admin@gmail.com / admin123)
2. **profile** - Data profile/hero
3. **services** (4 default) - Web Dev, Mobile App, UI/UX, E-Commerce
4. **projects** (8 default) - Portfolio projects
5. **team** (3 default) - Team members
6. **testimonials** (3 default) - Client testimonials
7. **pricing** (3 default) - Pricing packages
8. **contacts** - Contact form submissions
9. **theme_settings** - Theme colors & logo

---

## 🔐 DEFAULT LOGIN CREDENTIALS

```
Email:    admin@gmail.com
Password: admin123
```

---

## ⚠️ JIKA PM2 MATI / ERROR

### 1. Check Status PM2
```bash
pm2 list
pm2 status
pm2 logs backend
```

### 2. Stop & Restart PM2
```bash
pm2 stop backend
pm2 delete backend
cd backend
npm start
```

### 3. Jika Port 5000 Sudah Terpakai
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
# Atau ganti PORT di .env
```

### 4. Database Error
```bash
# Delete data directory jika perlu reset
rmdir /s /q backend\pg_data

# Restart backend - database akan auto-recreate
cd backend
npm start
```

---

## 📊 Quick Reference

| Service | URL | Port | Status |
|---------|-----|------|--------|
| Frontend | http://localhost:5173 | 5173 | Vite dev server |
| Backend | http://localhost:5000 | 5000 | Node.js Express |
| Database | localhost:5432 | 5432 | PostgreSQL |
| API Health | http://localhost:5000/api/health | 5000 | Check server |

---

## ✅ Verification Steps

### Check Backend Running
```bash
curl http://localhost:5000/api/health
```

### Check Frontend Access
```
Buka di browser: http://localhost:5173
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

---

## 📝 COMMON ISSUES & SOLUTIONS

### ❌ Backend tidak jalan
**Solution:**
1. `cd backend`
2. `npm install` (jika belum)
3. `npm start`

### ❌ Port 5000 conflict
**Solution:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ Login gagal
**Solution:**
1. Email: `admin@gmail.com`
2. Password: `admin123`
3. Backend running? `curl http://localhost:5000/api/health`

### ❌ PM2 tidak berjalan
**Solution:**
```bash
pm2 list
cd backend
npm start
```

---

## 🚀 BEST PRACTICE

### Development
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev

# Akses: http://localhost:5173
```

### Production
```bash
pm2 start npm --name "backend" -- start
pm2 save
pm2 startup
```

### Monitoring
```bash
pm2 logs backend
pm2 monit
curl http://localhost:5000/api/health
```

---

## 💡 NOTES

✅ **PostgreSQL advantages:**
- Better performance untuk data besar
- Support advanced SQL features
- Production-ready
- Better untuk team collaboration

✅ **PGlite benefits:**
- Development lokal tanpa setup complex
- Compatible dengan PostgreSQL production
- Easy migration ke PostgreSQL server

✅ **Current Status:**
- Backend setup complete
- Database configuration ready
- Authentication working (admin@gmail.com / admin123)
