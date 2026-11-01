---
title: Portfolio Backend
emoji: 💼
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Portfolio Backend API

Backend API untuk portfolio dengan arsitektur bersih, menggunakan **Node.js + Express** dan database **PostgreSQL Lokal (PGlite)**.

## ⚠️ SYSTEM REQUIREMENTS - PENTING!

### Node.js Version

**Pastikan menggunakan salah satu versi di bawah:**

| Version | Status | Recommendation |
|---------|--------|-----------------|
| **v22 LTS** | ✅ **BEST** | Recommended - Stable & long-term support |
| **v20 LTS** | ✅ **BEST** | Recommended - Stable & long-term support |
| **v24** | ✅ **OK** | Works - Current version |
| **v23** | ❌ **NO** | DO NOT USE - Many library incompatibility issues |
| **v18** | ⚠️ OLD | Can work but outdated |

### ❌ Jangan Gunakan Node v23!

Node v23 adalah "transitional version" yang sering bermasalah dengan library seperti `better-sqlite3`. **Gunakan v20/v22 LTS atau upgrade ke v24.**

### Cek Versi Sekarang

```bash
node --version
npm --version
```

Harus menampilkan:
```
v22.12.0  (atau v20.x atau v24.x)
10.5.0
```

---

## Fitur Utama
- **Database**: PostgreSQL (PGlite) - Data tersimpan lokal di folder `pg_data/`.
- **Contact Form API**:
  - `POST /api/contact/submit` : Menyimpan pesan dari formulir kontak.
  - `GET /api/contact/all` : Mengambil daftar pesan masuk.
- **Email Service**: Integrasi notifikasi email otomatis via Resend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start backend
npm start

# Output harus:
# [Database] PostgreSQL Database aktif...
# [Server] Aktif di http://localhost:5000
```

## Available Scripts

```bash
npm start        # Production mode
npm run dev      # Development mode (auto-reload dengan nodemon)
```

---

## Panduan Lengkap
Lihat panduan lengkap mengenai lokasi file dan cara backup database di:
[LOKASI_DAN_DATABASE.md](../LOKASI_DAN_DATABASE.md)

