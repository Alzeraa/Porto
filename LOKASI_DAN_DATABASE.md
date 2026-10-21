# 📌 Peta Lokasi Komponen, Database & Dashboard Admin (Porto)

Dokumen ini memuat informasi lengkap mengenai lokasi setiap source code, letak penyimpanan fisik database lokal, panduan akses **Dashboard Admin**, serta cara backup proyek.

---

## 🧭 1. Ringkasan Lokasi Komponen

Semua file dan data proyek portofolio ini **100% tersimpan di dalam folder `Porto` ini**. Tidak ada file, service, atau dependensi database yang tersimpan di luar folder proyek (seperti di `C:\Program Files`, direktori Windows lain, ataupun cloud pihak ketiga).

| Komponen | Bahasa / Teknologi | Lokasi Folder / File | Keterangan |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite + Tailwind | `frontend/` | Kode antarmuka portofolio publik & Admin Dashboard |
| **Backend** | Node.js + Express | `backend/` | REST API (Auth, Profile, Services, Projects, Contacts, Team, Testimonials, Pricing) |
| **Database Engine** | SQLite 3 (better-sqlite3) | `backend/src/config/database.js` | Database lokal performa tinggi (WAL mode), 100% stabil di Windows |
| **Penyimpanan Data DB** | Berkas Fisik SQLite | `backend/portfolio.db` | **1 file fisik tempat seluruh data tersimpan (profil, proyek, layanan, tim, testimoni, harga, pesan kontak)** |
| **Konfigurasi Env** | Environment Variables | `backend/.env` | Port server, JWT Secret, API key email |

---

## 🔐 2. Akses Dashboard Admin

Website ini sudah dilengkapi sistem autentikasi dan **Dashboard Admin interaktif** untuk mengelola seluruh konten dinamis tanpa menyentuh kode:

* **URL Login Admin**: [http://localhost:5173/erynalva](http://localhost:5173/erynalva)
* **Email Akun**: `admin@gmail.com`
* **Password Akun**: `admin123`

### Fitur yang Bisa Dikelola di Dashboard Admin:
1. 📊 **Ringkasan (Overview)**: Statistik lengkap total pesan masuk, proyek, layanan aktif, anggota tim, testimoni, dan paket harga.
2. 📩 **Pesan Masuk (Inbox)**: Lihat semua pesan dari pengunjung form kontak, klik langsung ke WhatsApp pengirim (`wa.me`), tandai dibaca, atau hapus pesan.
3. 👤 **Edit Profil & Hero**: Mengubah nama studio, badge headline, judul hero, deskripsi, nomor WhatsApp kontak, logo, dan email secara live.
4. 💼 **Kelola Proyek**: Tambah proyek baru, upload thumbnail (URL/Base64), edit detail/kategori/tech stack, ubah link GitHub/demo, atau hapus proyek.
5. 🛠️ **Kelola Layanan**: Menambah atau mengedit layanan yang ditawarkan (icon emoji, judul, deskripsi, daftar fitur).
6. 👥 **Kelola Tim**: Menambah, mengedit foto, nama, peran (role), dan bio anggota tim.
7. ⭐ **Kelola Testimoni**: Menambah review/ulasan klien, bintang rating (1-5), role, dan foto klien.
8. 💰 **Kelola Harga Paket**: Menambah dan mengedit paket harga layanan, tag "Paling Populer", dan daftar fitur paket.
9. 📱 **Live Preview Web**: Melihat tampilan aktual website secara real-time langsung di dashboard dengan switch mode **Desktop** atau **Mobile (frame smartphone)** serta tombol segarkan.

---

## 🗄️ 3. Detail Database Lokal (`backend/portfolio.db`)

Semua data portofolio tersimpan di dalam **satu file fisik** bernama `portfolio.db` di dalam folder `backend/`:

### Struktur Tabel yang Ada:
1. `admins`: Akun administrator terenkripsi (bcrypt).
2. `profile`: Data brand, headline hero, deskripsi, logo, dan kontak.
3. `services`: Data layanan yang ditawarkan dan daftar fitur.
4. `projects`: Data portofolio karya dan teknologi yang digunakan.
5. `contacts`: Data pesan yang dikirimkan oleh pengunjung melalui form kontak.
6. `team`: Data anggota tim (nama, peran, bio, foto).
7. `testimonials`: Data testimoni klien (nama, peran, ulasan, rating bintang, foto).
8. `pricing`: Data paket harga (nama paket, nominal harga, tag populer, daftar fitur).

---

## 💾 4. Panduan Cara Backup & Restore Database

Karena seluruh database tersimpan dalam **1 file fisik**:

### A. Cara Backup Data:
1. Salin (copy) file `backend/portfolio.db` ke tempat penyimpanan aman (Google Drive, Flashdisk, dll).
2. Atau, buat arsip `.zip` dari seluruh folder `Porto/` — semua kode dan data database otomatis ikut ter-backup.

### B. Cara Restore Data:
1. Cukup letakkan kembali file `portfolio.db` hasil backup ke dalam folder `backend/`.
2. Jalankan server, seluruh data profil, proyek, tim, testimoni, harga, dan pesan kontak akan langsung kembali seperti semula.

---

## 🚀 5. Perintah Menjalankan Proyek

* **Backend API**:
  ```bash
  cd backend
  npm run dev
  ```
  *(Berjalan di http://localhost:5000)*

* **Frontend & Admin**:
  ```bash
  cd frontend
  npm run dev
  ```
  *(Berjalan di http://localhost:5173)*

