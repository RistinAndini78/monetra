# 🏦 Monetra WealthFlow - Internal Project Documentation
**Version:** 1.0.4  
**Author:** Technical Lead / Senior Software Architect  
**Tech Stack:** React (Vite), TypeScript, Tailwind CSS, Supabase, Framer Motion

---

## 📖 1. Project Overview
Monetra WealthFlow adalah platform manajemen keuangan personal (Personal Finance Management) yang dirancang untuk membantu pengguna melacak pemasukan, pengeluaran, tagihan, dan anggaran secara real-time. Aplikasi ini memiliki arsitektur yang berfokus pada kecepatan, keamanan (Supabase Auth), dan estetika modern (Glassmorphism UI).

---

## 👥 2. Roles and Permissions

### A. User Role
*   **Target:** Pengguna akhir yang mengelola keuangan pribadi.
*   **Akses Halaman:** Dashboard, Transaksi, Budget, Analisis, Notifikasi (Tagihan), Profil & Pengaturan.
*   **Workflow:** Melakukan input transaksi harian -> Memantau statistik bulanan -> Mengatur budget -> Membayar tagihan tepat waktu.

### B. Admin Role
*   **Target:** Administrator sistem untuk monitoring platform.
*   **Akses Halaman:** Seluruh halaman User + Admin Dashboard, Kelola User, Data Transaksi Global, Analytics Sistem, Notifikasi Sistem.
*   **Workflow:** Memantau pertumbuhan user -> Mengaudit transaksi jika terjadi anomali -> Mengelola status akun pengguna.

---

## 📁 3. Folder Structure & File Relations

```text
src/
├── assets/          # Aset statis (ikon, ilustrasi)
├── components/      # UI Components yang dapat digunakan kembali
│   ├── Sidebar.tsx  # Navigasi utama & profil sync
│   ├── Header.tsx   # Search bar global & notifikasi dropdown
│   └── Layout.tsx   # Wrapper untuk membungkus halaman (HOC)
├── lib/             # Konfigurasi library eksternal
│   └── supabase.ts  # Inisialisasi & helper Supabase
├── pages/           # Halaman utama aplikasi
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Bills.tsx (Notifikasi)
│   └── ...
├── App.tsx          # Router, Global State Management (User Auth)
└── main.tsx         # Entry point aplikasi
```

---

## 📄 4. Detailed Page Documentation

### 📊 Dashboard
*   **Fungsi:** Pusat informasi keuangan ringkas.
*   **Tujuan:** Memberikan gambaran cepat mengenai kondisi keuangan bulan berjalan.
*   **Fitur Utama:**
    *   Statistik Bulanan (Total Masuk, Total Keluar, Saldo Akhir).
    *   Activity Feed: Menampilkan 4 transaksi terakhir.
    *   Shortcut "Tambah Transaksi".
*   **State Management:** Menggunakan `useState` untuk menyimpan data transaksi yang di-fetch secara real-time dari Supabase.
*   **Data Flow:** Dashboard melakukan query ke tabel `transactions` dengan filter `current_month`.

### 💳 Transaksi (Transactions)
*   **Fungsi:** Manajemen database transaksi pengguna.
*   **Alur CRUD:**
    *   **Create:** Modal input dengan validasi field wajib (Nama, Jumlah, Tanggal, Kategori).
    *   **Read:** Daftar transaksi dengan pagination/scroll. Mendukung list view di mobile dan table view di desktop.
    *   **Update:** Mengambil data ID transaksi ke modal edit, memperbarui record di Supabase.
    *   **Delete:** Konfirmasi penghapusan permanen.
*   **Validasi:** Form menggunakan tipe data `number` untuk jumlah dan pengecekan field kosong sebelum submit.
*   **Fitur Khusus:** 
    *   **Drag & Drop Proof Upload:** Mengunggah bukti struk ke Supabase Storage.
    *   **Export:** Konversi data ke format PDF (via `jspdf`) dan CSV.

### 🔔 Notifikasi & Tagihan (Bills)
*   **Fungsi:** Pengingat kewajiban pembayaran rutin.
*   **Fitur:** Kalender jatuh tempo, status "Lunas" vs "Mendatang", sistem pengingat otomatis di dashboard.
*   **Workflow:** Pengguna mendaftarkan tagihan -> Sistem mengecek tanggal -> Jika jatuh tempo, muncul notifikasi di header dan dashboard.

### ⚙️ Profil & Pengaturan (Settings)
*   **Fungsi:** Personalisasi akun dan keamanan.
*   **Cross-Device Sync:**
    *   Aplikasi menggunakan `getUser()` dari Supabase Auth untuk memastikan metadata profil (nama & foto) selalu sinkron di laptop maupun HP.
    *   Mengimplementasikan `window.focus` listener untuk mendeteksi perpindahan perangkat secara instan.
*   **Upload Foto:** Menggunakan kamera atau galeri, disimpan di Supabase Storage dengan cache-busting timestamp (`?t=timestamp`).

---

## 🔐 5. Technical Specifications

### Authentication Flow
1.  **Login:** Pengguna memasukkan Email & Password.
2.  **Session:** `App.tsx` mendengarkan `onAuthStateChange`. Jika ada session, user masuk ke dashboard.
3.  **Forgot Password:** Menggunakan `resetPasswordForEmail` dari Supabase.

### Database Schema (Supabase)
*   **`profiles`**: Menyimpan metadata user (name, avatar_url).
*   **`transactions`**: Log keuangan (name, amount, type, category, date, proof_url).
*   **`bills`**: Daftar tagihan (name, due_date, amount, status).
*   **`notifications`**: Log notifikasi sistem untuk user.

### State Management & Sync
*   **Global State:** Dikelola di `App.tsx` menggunakan `useState` yang dibagikan ke komponen via Props.
*   **Real-time:** Dashboard menggunakan Supabase Channels untuk memperbarui angka statistik secara instan saat ada data masuk.

---

## 🛠️ 6. Developer Guidelines
1.  **Adding a Page:** Tambahkan file di `src/pages`, daftarkan route/case di `App.tsx`, dan tambahkan item navigasi di `Sidebar.tsx`.
2.  **Styling:** Gunakan utility classes Tailwind. Ikuti desain **Glassmorphism** (bg-white/80, backdrop-blur).
3.  **Mobile First:** Selalu gunakan prefix `sm:`, `md:`, `lg:` untuk memastikan komponen responsif. Gunakan *List View* untuk mobile daripada *Table*.

---
**END OF DOCUMENTATION**
