# 🏛️ THE MONETRA BLUEPRINTS: ENTERPRISE ENGINEERING DOCUMENTATION
**Project Code:** MONETRA-PRO-2026 | **Version:** 4.0 (Lead Architect Release) | **Status:** Production Ready

---

## 🧭 1. EXECUTIVE SUMMARY & PROJECT GOALS
**Monetra** adalah solusi manajemen finansial cerdas yang dirancang untuk menjembatani celah antara pencatatan transaksi manual dan analisis keuangan otomatis. Aplikasi ini dikembangkan dengan pendekatan **Zero-Server Architecture**, memanfaatkan kapabilitas Cloud-Native untuk memastikan ketersediaan tinggi, keamanan data maksimal, dan performa yang responsif.

### Tujuan Utama:
1.  **Financial Clarity:** Memberikan visualisasi arus kas yang akurat secara real-time.
2.  **Spending Control:** Mencegah kebocoran anggaran melalui sistem *Threshold Warning* yang dinamis.
3.  **Auditability:** Menyediakan riwayat transaksi yang valid dengan dukungan bukti fisik (gambar).
4.  **Accessibility:** Berjalan sebagai Progressive Web App (PWA) dengan dukungan notifikasi latar belakang.

---

## 🏗️ 2. ARSITEKTUR SISTEM & FLOW DATA

### Arsitektur High-Level
Aplikasi ini menggunakan pola **Decoupled Architecture** dengan pembagian tanggung jawab sebagai berikut:
- **Client Layer (Frontend):** React (Vite) sebagai *Single Source of Truth* untuk logika antarmuka dan manajemen state klien.
- **Backend-as-a-Service (BaaS):** Supabase sebagai penyedia layanan Database (PostgreSQL), Authentication (GoTrue), dan Storage.
- **Background Layer:** Service Worker (Web Worker API) untuk menangani Push Notifications dan caching offline.

### Flow Komunikasi Data:
1.  **Request:** React memicu query via `supabase-js` menggunakan JWT (JSON Web Token) yang tersimpan di memori.
2.  **Gatekeeper:** Supabase mengevaluasi **Row Level Security (RLS)** untuk memastikan user hanya mengakses data miliknya.
3.  **Processing:** PostgreSQL mengeksekusi query dan mengembalikan JSON.
4.  **Reaction:** State di React diperbarui, memicu re-render UI secara parsial.

---

## 🛡️ 3. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)

Sistem Monetra menerapkan keamanan berlapis dengan skema sebagai berikut:

### Authentication Flow:
- **Provider:** Supabase Auth (Email/Password).
- **Session:** JWT dengan mekanisme *Auto-refresh token*.
- **Route Protection:** Komponen `App.tsx` bertindak sebagai *Guard*. Jika session `null`, semua route akan di-render ke halaman `Auth.tsx`.

### Role Definition:
| Role | Hak Akses (Permissions) | Pembatasan (Restrictions) |
| :--- | :--- | :--- |
| **User** | CRUD Transaksi Pribadi, Kelola Budget, Lihat Analytics, Export PDF. | Tidak bisa melihat data user lain, tidak bisa mengakses dashboard admin. |
| **Admin** | Melihat seluruh statistik sistem, manajemen user, pengawasan keamanan. | Tidak bisa memodifikasi saldo user secara langsung tanpa audit log. |

### Route Guard Logic:
```tsx
// Implementasi pada App.tsx
if (!user) return <Auth />;
return user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
```

---

## 🗄️ 4. DATABASE ENGINEERING & SCHEMA DESIGN

Kami menggunakan **PostgreSQL** dengan relasi yang dinormalisasi untuk menjaga integritas data.

### 4.1 Tabel: `transactions`
Pusat dari seluruh data finansial.
- `id` (UUID, PK): Identifier unik global.
- `user_id` (UUID, FK): Relasi ke `auth.users`.
- `judul` (TEXT): Deskripsi singkat transaksi.
- `amount` (NUMERIC): Nilai uang (Presisi tinggi).
- `category` (TEXT): Kategori (Makanan, Transport, dll).
- `type` (ENUM): `income` (+) atau `expense` (-).
- `proof_url` (TEXT): Link ke Supabase Storage.
- `date` (DATE): Tanggal transaksi dilakukan.

### 4.2 Tabel: `budgets`
Digunakan untuk kontrol pengeluaran.
- `limit_amount` (NUMERIC): Batas atas anggaran.
- `period` (TEXT): `Harian`, `Mingguan`, atau `Bulanan`.

### 4.3 Row Level Security (RLS) - Kebijakan Keamanan:
Setiap tabel wajib memiliki kebijakan RLS. Contoh SQL:
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User Own Data" ON transactions FOR ALL USING (auth.uid() = user_id);
```

---

## 📱 5. ANALISIS MENDALAM MODUL HALAMAN

### 5.1 Dashboard (Financial Command Center)
- **Fungsi:** Menyajikan ringkasan eksekutif saldo dan pengeluaran.
- **Logika Bisnis:** Mengagregasi data transaksi bulan berjalan menggunakan `Array.reduce()`.
- **Fitur Utama:** 
  - *Skeleton Loading*: UI tidak langsung kosong, tapi menampilkan placeholder abu-abu saat fetching.
  - *PDF Export*: Mengambil snapshot state `transactions` dan merendernya ke `jsPDF`.
- **Error Handling:** Jika database gagal diakses, menampilkan pesan "Koneksi Bermasalah" alih-alih layar putih.

### 5.2 Transaksi (Management Hub)
- **User Flow:** User klik Tambah -> Pilih Tipe -> Jika 'Keluar' muncul upload bukti -> Simpan.
- **CRUD Process:** 
  - *Create*: Melakukan validasi input (tidak boleh kosong) -> Upload ke Storage -> Insert DB.
  - *Update*: Mengisi form dengan data lama (`setEditingId`) -> Update baris berdasarkan ID.
  - *Delete*: Konfirmasi -> Delete baris -> Optimistic update (hapus dari state `transactions` segera).
- **Upload Logic:** Menggunakan UUID untuk nama file gambar guna menghindari duplikasi di Storage.

### 5.3 Budget (Planning & Prevention)
- **Alur Bisnis:** Sistem menghitung total spending di kategori X, lalu membandingkannya dengan target budget di kategori X.
- **Visual Logic:** 
  - `< 80%`: Aman (Emerald).
  - `> 80%`: Warning (Amber).
  - `> 100%`: Overlimit (Rose).
- **Push Notification:** Mengirim sinyal via `PushNotificationService` saat spending menyentuh 90%.

---

## 🧩 6. SISTEM KOMPONEN & DESIGN TOKENS

Monetra menggunakan pendekatan **Atomic Design** (meskipun dalam struktur flat):

- **Sidebar.tsx:** Komponen navigasi stateful. Menggunakan `framer-motion` untuk transisi drawer yang halus.
- **GlassCard.tsx:** Utility UI yang menggunakan `backdrop-blur` untuk efek premium.
- **Notifications.tsx:** Komponen polling yang mengecek tabel `notifications` setiap 30 detik untuk update terbaru.

---

## 📡 7. PWA, NOTIFIKASI & SERVICE WORKER

### Service Worker (`sw.js`):
- **Lifecycle:** `Install` -> `Activate` -> `Fetch`.
- **Push Handling:** Mendengarkan event `push` dari Web Push Protocol.
- **Payload:** Mengolah data JSON dari notifikasi untuk menampilkan judul dan isi pesan di sistem OS.

---

## 🛠️ 8. ONBOARDING & TROUBLESHOOTING

### Setup Project:
1. `npm install`
2. Konfigurasi `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
3. `npm run dev`

### Debugging Umum:
- **Layar Putih:** Cek `import` pada file yang baru diedit. Biasanya ada ikon `lucide-react` yang tertulis tapi belum di-import.
- **Data Tidak Update:** Cek apakah fungsi `fetchTransactions()` dipanggil setelah proses `await` database selesai.
- **Auth Error:** Pastikan `Site URL` di Dashboard Supabase (Authentication -> Settings) sudah mengarah ke localhost atau URL Vercel yang benar.

---

## 🚀 9. DEPLOYMENT PIPELINE
- **Platform:** Vercel (Auto-deploy via GitHub).
- **Environment:** Production branch (`main`).
- **Optimization:** Vite melakukan *code-splitting* untuk membagi file JS menjadi potongan-potongan kecil agar loading awal lebih ringan.

---
**Lead Architect:** Antigravity AI  
**Project Owner:** Ristin Iman Andini  
**Copyright:** 2026 Monetra Ecosystem.
