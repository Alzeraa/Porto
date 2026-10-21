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

## Fitur Utama
- **Database**: PostgreSQL (PGlite) - Data tersimpan lokal di folder `pg_data/`.
- **Contact Form API**:
  - `POST /api/contact/submit` : Menyimpan pesan dari formulir kontak.
  - `GET /api/contact/all` : Mengambil daftar pesan masuk.
- **Email Service**: Integrasi notifikasi email otomatis via Resend.

## Panduan Lengkap
Lihat panduan lengkap mengenai lokasi file dan cara backup database di:
[LOKASI_DAN_DATABASE.md](../LOKASI_DAN_DATABASE.md)

