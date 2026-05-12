# 📘 MANUAL TEKNIS KOMPREHENSIF: PROYEK MONETRA
**Money Tracker & Analyzer - High Performance Edition**

Dokumentasi ini dibuat khusus untuk tim pengembang (developers) agar memahami setiap jengkal arsitektur, logika, dan infrastruktur yang membangun aplikasi Monetra.

---

## 🏗️ 1. ARSITEKTUR SISTEM & FILOSOFI DESAIN
Monetra dibangun dengan filosofi **"Fast, Reliable, & Interactive"**. Aplikasi ini menggunakan pola **Single Page Application (SPA)** dengan integrasi backend-as-a-service yang memungkinkan sinkronisasi data real-time tanpa memerlukan server backend sendiri.

### Core Tech Stack:
- **Frontend Engine:** React 18+ (Vite)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 (Sistem Desain Modular)
- **Database Backend:** Supabase (PostgreSQL)
- **Real-time Engine:** Supabase Realtime (Postgres Changes)
- **Storage:** Supabase Storage (Bucket Management)
- **Notification:** Service Worker & Web Push API
- **Reporting:** jsPDF dengan AutoTable plugin

---

## 📂 2. STRUKTUR DIREKTORI (DEEP DIVE)

```text
/src
  ├── /assets          # Aset visual (Avatar default, logo)
  ├── /components      # Komponen Reusable
  │   └── Sidebar.tsx  # Navigasi utama dengan logika deteksi role (User/Admin)
  ├── /lib             # Core Services & Konfigurasi
  │   ├── supabase.ts      # Inisialisasi Client & Singleton Pattern
  │   └── notifications.ts # Service Class untuk Push Notification & Alerts
  ├── /pages           # Modul Halaman Utama
  │   ├── Auth.tsx          # Autentikasi (Login/Sign Up/OAuth)
  │   ├── Dashboard.tsx     # Hub pusat, memproses statistik kumulatif
  │   ├── Transactions.tsx  # CRUD Transaksi, Upload Bukti, & Search Logic
  │   ├── Budgets.tsx       # Logika kalkulasi spending vs limit
  │   ├── Analysis.tsx      # Agregasi data untuk visualisasi Recharts
  │   ├── Notifications.tsx # Manajemen log aktivitas pengguna
  │   └── Settings.tsx      # Integrasi Supabase Auth (Update Profile/Password)
  ├── App.tsx          # Central Routing, Theme State, & Global Listeners
  └── sw.js            # Service Worker (Background Process)
```

---

## ⚙️ 3. LOGIKA INTERNAL & ALUR DATA (DATA FLOW)

### A. Alur Autentikasi (Supabase Auth)
1. **Login:** Menggunakan `supabase.auth.signInWithPassword`. Jika berhasil, session disimpan di browser (Cookies/Local).
2. **Persistence:** Di `App.tsx`, terdapat `onAuthStateChange` listener yang secara otomatis memperbarui state `user` setiap kali session berubah atau kadaluarsa.
3. **Protected Routes:** Halaman hanya akan dirender jika state `user` tersedia, jika tidak, user akan diarahkan ke `/auth`.

### B. Manajemen Transaksi (Transactions Page)
- **Fetching:** Menggunakan query PostgreSQL via Supabase dengan sorting `date` descending.
- **Background Upload:** Saat menambah pengeluaran dengan bukti:
  1. Data transaksi dikirim ke tabel `transactions`.
  2. Gambar diunggah ke bucket `transaction-proofs` dengan path `user_id/timestamp_namafile`.
  3. URL publik gambar didapat dan diupdate kembali ke baris transaksi terkait.
- **Optimasi UI:** Setelah insert, sistem memanggil `setDbTransactions` secara manual (Optimistic Update) SEBELUM memanggil `fetchTransactions` lagi untuk memastikan kecepatan UI.

### C. Logika Smart Budgets
- Sistem melakukan **Double Query**: 
  1. Mengambil limit budget dari tabel `budgets`.
  2. Melakukan agregasi (SUM) dari tabel `transactions` berdasarkan kategori dan periode yang sama.
- Hasilnya dibandingkan di frontend untuk menentukan warna bar:
  - `spent < amount * 0.8` => **Emerald (Hijau)**
  - `spent < amount` => **Amber (Kuning)**
  - `spent >= amount` => **Rose (Merah)**

---

## 🔒 4. KEAMANAN & DATABASE (SECURITY DEEP DIVE)

### Row Level Security (RLS)
Sangat krusial! Monetra menggunakan RLS agar data tidak bocor. Developer harus memastikan kebijakan (Policy) berikut aktif di Supabase SQL Editor:

```sql
-- Contoh Policy untuk tabel Transactions
CREATE POLICY "Users can only see their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

### Tabel Database (Detail Kolom):
1. **`transactions`**:
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to auth.users)
   - `amount` (numeric)
   - `category` (text) - Contoh: 'Makanan', 'Transport'
   - `type` (text) - 'income' atau 'expense'
   - `judul` (text)
   - `catatan` (text, nullable)
   - `proof_url` (text, nullable)
   - `date` (date)

2. **`budgets`**:
   - `limit` (numeric), `spent` (numeric), `period` (text: 'Bulanan', etc)

---

## 🔔 5. SISTEM NOTIFIKASI & SERVICE WORKER
Monetra menggunakan teknologi **Background Sync**:
1. **`PushNotificationService`**: Class statis di `src/lib/notifications.ts` yang menangani permintaan izin (`Notification.requestPermission`) dan pengiriman notifikasi.
2. **`sw.js` (Service Worker)**: 
   - Mendengarkan event `push` dari server.
   - Menggunakan `self.registration.showNotification` untuk memunculkan pop-up sistem meskipun browser tertutup.
   - Menangani `notificationclick` untuk mengarahkan user kembali ke aplikasi.

---

## 📈 6. ANALISIS & REPORTING (LOGIKA EXPORT)
- **Recharts Integration:** Data transaksi difilter berdasarkan 30 hari terakhir, dikelompokkan per tanggal, dan dijumlahkan untuk membentuk grafik garis/area.
- **jsPDF Logic:**
  - Laporan dibuat di sisi klien (Client-side) untuk menghemat bandwidth.
  - Menggunakan `jspdf-autotable` untuk merender riwayat transaksi ke dalam format grid yang rapi.
  - Header laporan berisi nama user dan timestamp pembuatan.

---

## 🚀 7. PANDUAN PENGEMBANGAN LANJUTAN
Bagi developer yang ingin menambahkan fitur:
1. **Tambah Kategori:** Perbarui array `categories` di `Transactions.tsx` dan `Budgets.tsx`. Pastikan ikon Lucide yang sesuai sudah di-import.
2. **Ganti Tema:** Warna utama dikendalikan via CSS Variables di `index.css` (Tailwind v4 `@theme`).
3. **Tambah Halaman Baru:** 
   - Buat file baru di `/src/pages`.
   - Tambahkan ID halaman di `Sidebar.tsx` (bagian `userNavigation`).
   - Tambahkan kondisi render di `App.tsx`.

---
**Peringatan Keamanan:** Jangan pernah menyimpan `SUPABASE_SERVICE_ROLE_KEY` di file frontend. Selalu gunakan `ANON_KEY` untuk akses publik yang aman dengan RLS.

**Dokumentasi Versi:** 2.0 (Edisi Pengembang Profesional)
**Terakhir Diperbarui:** Mei 2026
