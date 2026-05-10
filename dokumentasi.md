# 🏦 MASTER PROJECT BIBLE: MONETRA FINTECH ECOSYSTEM

---

## 🏆 PEMENUHAN KETENTUAN TEKNIS (LENGKAP)
Aplikasi Monetra telah sepenuhnya memenuhi seluruh butir Ketentuan Teknis yang diwajibkan:

1.  **Minimal 2 Platform Berbeda:**
    - **Platform 1 (Web):** Menggunakan React + Vite.
    - **Platform 2 (Desktop):** Menggunakan **Electron** untuk platform Windows/Linux.
2.  **Shared Backend:** Seluruh platform (Web & Desktop) menggunakan satu backend yang sama yaitu **Supabase (PostgreSQL)**.
3.  **Fitur Autentikasi:** Implementasi sistem Registrasi dan Login mandiri menggunakan **Supabase Auth** di semua platform.
4.  **Platform-Specific Features (Fitur Unik):**
    - **Web:** Menggunakan **PWA (Progressive Web App)** untuk akses offline dan installability, serta **Web Push Notification** untuk pengingat transaksi.
    - **Desktop:** Menggunakan **System Tray Access** (aplikasi tetap aktif di background) dan **Global Keyboard Shortcut** (`Ctrl+Alt+M`) untuk akses cepat dari aplikasi mana pun.
5.  **UI & Feature Adaptation:**
    - Layout menggunakan sistem responsif yang menyesuaikan visual berdasarkan container platform (Web Browser vs Desktop Window).

---

Selamat datang di dokumentasi resmi paling lengkap untuk platform **Monetra**. Dokumen ini dirancang sebagai panduan otoritatif bagi pengembang, administrator, dan pemilik proyek untuk memahami setiap inci dari aplikasi ini.

---

## 📖 DAFTAR ISI UTAMA
1.  [RINGKASAN EKOSISTEM MONETRA](#1-ringkasan-ekosistem-monetra)
2.  [ANALISIS FRAMEWORK & PLATFORM (FULL STACK)](#2-analisis-framework--platform-full-stack)
3.  [DEEP DIVE: ANTARMUKA PENGGUNA (USER INTERFACE)](#3-deep-dive-antarmuka-pengguna-user-interface)
4.  [DEEP DIVE: DASHBOARD ADMIN (ADMINISTRATION PANEL)](#4-deep-dive-dashboard-admin-administration-panel)
5.  [ARSITEKTUR DATA & LOGIKA BISNIS](#5-arsitektur-data--logika-bisnis)
6.  [SISTEM KEAMANAN & PRIVASI DATA](#6-sistem-keamanan--privasi-data)
7.  [ALUR KERJA REAL-TIME & SINKRONISASI](#7-alur-kerja-real-time--sinkronisasi)
8.  [PANDUAN PENGEMBANGAN & DEPLOYMENT](#8-panduan-pengembangan--deployment)

---

## 1. RINGKASAN EKOSISTEM MONETRA
Monetra adalah platform *Financial Management* berbasis cloud yang membagi sistem menjadi dua entitas besar:
- **User Side:** Berfokus pada kemudahan input data, perencanaan anggaran (budgeting), dan analisis pribadi.
- **Admin Side:** Berfokus pada pengawasan sistem, manajemen pengguna, dan analisis data agregat (total aset seluruh sistem).

---

## 2. ANALISIS FRAMEWORK & PLATFORM (FULL STACK)
Aplikasi ini menggunakan kombinasi teknologi terbaik di industri:

### A. Frontend: React 18 & Vite
- **Vite:** Bertindak sebagai *Next-Generation Frontend Tooling*. Ia memberikan kecepatan *Hot Module Replacement* (HMR) yang luar biasa saat pengembangan.
- **React 18:** Digunakan karena arsitektur berbasis komponennya. Setiap elemen di Monetra (Card, Button, Chart) adalah komponen independen yang dapat digunakan kembali.

### B. Styling: Tailwind CSS
- Menggunakan sistem *Utility-First*.
- **Konfigurasi Khusus:** Kita menggunakan palet warna `Indigo` dan `Slate` untuk menciptakan nuansa **Premium Light Mode**.
- **Responsive Design:** Seluruh UI didesain untuk beradaptasi mulai dari layar ponsel hingga monitor ultra-wide.

### C. Database & Real-Time: Supabase
- **PostgreSQL:** Database utama yang sangat kuat untuk menangani relasi data keuangan.
- **Realtime Engine:** Menggunakan teknologi *WebSockets* untuk memantulkan perubahan data dari server ke browser secara instan.
- **Supabase Auth:** Mengelola login, registrasi, dan sesi pengguna secara aman.

### D. Animasi & Ikonografi
- **Framer Motion:** Framework animasi standar industri untuk React. Digunakan untuk efek *fade-in*, *slide*, dan transisi antar halaman.
- **Lucide React:** Set ikon yang konsisten dan ringan untuk memvisualisasikan kategori transaksi.

---

## 3. DEEP DIVE: ANTARMUKA PENGGUNA (USER INTERFACE)

### Halaman 1: Dashboard (Overview)
- **Fungsi:** Memberikan *snapshot* instan kesehatan keuangan.
- **Komponen Utama:**
  - **Premium Balance Card:** Menampilkan total saldo bersih (`Total Income - Total Expense`).
  - **Area Trend Chart:** Visualisasi aliran kas selama 6 bulan terakhir.
  - **Quick Analysis:** Ringkasan donat alokasi dana per kategori.
- **Logika:** Menggabungkan data dari tabel `transactions` secara real-time.

### Halaman 2: Transaksi (Data Center)
- **Fungsi:** Laboratorium input dan history data.
- **Fitur Detail:**
  - **CRUD System:** Tambah, lihat, dan (nantinya) hapus/edit transaksi.
  - **Validation:** Sistem memastikan nominal tidak boleh nol dan deskripsi harus diisi.
- **Logika:** Menggunakan asinkronus `await` untuk memastikan data tersimpan di Supabase sebelum tampilan layar diperbarui.

### Halaman 3: Budget (Planning)
- **Fungsi:** Pengendali pengeluaran otomatis.
- **Tipe Anggaran:** Mendukung skala Harian, Mingguan, dan Bulanan.
- **Logika Sinkronisasi:** Sistem melakukan "lookup" silang ke tabel transaksi untuk menghitung sisa budget per detik.

---

## 4. DEEP DIVE: DASHBOARD ADMIN (ADMINISTRATION PANEL)
Bagian ini dirancang khusus untuk administrator sistem untuk mengawasi operasional.

### Halaman: User Management
- **Daftar Pengguna:** Menampilkan semua user yang terdaftar di sistem.
- **Status Akun:** Memantau siapa saja yang aktif dan level akun mereka (Free/Premium).

### Halaman: Global Analytics
- **Total Dana Sistem:** Administrator dapat melihat total perputaran uang di seluruh platform (secara agregat).
- **Statistik Pertumbuhan:** Melihat jumlah user baru per hari/bulan.

---

## 5. ARSITEKTUR DATA & LOGIKA BISNIS
Setiap data di Monetra memiliki relasi yang kuat:

1. **User (auth.users):** Entitas utama.
2. **Transactions:** Terikat ke `user_id`. Setiap transaksi harus memiliki `type` (income/expense).
3. **Budgets:** Terikat ke `user_id` dan `category`. Ia "mendengarkan" tabel transaksi untuk menghitung pemakaian.

---

## 6. SISTEM KEAMANAN & PRIVASI DATA
Monetra menerapkan standar keamanan **"Bank-Grade Security"**:

- **Row Level Security (RLS):** Protokol di tingkat database yang mencegah User A mengakses data User B meskipun mereka mengetahui ID-nya.
- **Environment Variables:** Kredensial sensitif disimpan di file `.env` dan tidak pernah diekspos ke publik.
- **Enkripsi SSL:** Semua komunikasi antara browser pengguna dan Supabase dienkripsi menggunakan SSL/TLS.

---

## 7. ALUR KERJA REAL-TIME & SINKRONISASI
Inilah yang membuat Monetra terasa sangat cepat:
1. **Event Trigger:** Setiap perubahan di PostgreSQL (insert/update/delete).
2. **Broadcast:** Server mengirimkan sinyal perubahan ke semua klien yang terhubung.
3. **State Update:** React menangkap sinyal tersebut dan memperbarui variabel state di memori, memicu render ulang komponen yang relevan saja.

---

## 8. PANDUAN PENGEMBANGAN & DEPLOYMENT
1. **Lokal:** Jalankan `npm run dev` di terminal.
2. **SQL Editor:** Masukkan semua skema dari `migration_fase1.sql`.
3. **Deployment:** Direkomendasikan menggunakan **Vercel** atau **Netlify** untuk performa frontend terbaik.

---

**© 2026 MONETRA PROJECT TEAM. DOKUMENTASI INI ADALAH VERSI PALING LENGKAP.**
*Dibuat dengan dedikasi untuk kejelasan teknis dan kemudahan pengembangan masa depan.*
