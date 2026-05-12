# 📑 Dokumentasi Resmi Proyek: MONETRA (Money Tracker & Analyzer)

**Monetra** adalah aplikasi manajemen keuangan pribadi berbasis web (Progressive Web App) yang dirancang untuk membantu pengguna melacak transaksi, merencanakan anggaran, dan menganalisis kesehatan finansial secara real-time.

---

## 🚀 1. Tech Stack (Teknologi yang Digunakan)
Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa tinggi dan skalabilitas:

- **Frontend:** React.js (Vite) dengan TypeScript untuk keamanan tipe data.
- **Styling:** Tailwind CSS v4 untuk antarmuka yang modern dan responsif.
- **Database & Auth:** Supabase (PostgreSQL) sebagai backend-as-a-service.
- **State Management:** React Hooks (useState, useEffect, useContext).
- **Icons:** Lucide React (Ikon minimalis & konsisten).
- **Charts:** Recharts (Visualisasi data transaksi & kategori).
- **PDF Engine:** jsPDF & jsPDF-AutoTable (Pembuatan laporan keuangan).
- **Animations:** Framer Motion (Transisi antar halaman & elemen).

---

## 📂 2. Struktur Proyek
Developer baru harus memahami organisasi folder berikut:

```text
/src
  /assets         # Gambar statis dan logo (Avatar, dll)
  /components     # Komponen UI global (Sidebar, Navbar, dll)
  /lib            # Konfigurasi library eksternal
    - supabase.ts # Koneksi ke database Supabase
    - notifications.ts # Service pengiriman push notification
  /pages          # Halaman utama aplikasi (Routing)
    - Dashboard.tsx    # Ringkasan akun & grafik
    - Transactions.tsx # Pengelolaan data transaksi
    - Budgets.tsx      # Perencanaan anggaran (Harian/Mingguan/Bulanan)
    - Analysis.tsx     # Detail analisis statistik
    - Settings.tsx     # Pengaturan profil & keamanan
    - Auth.tsx         # Halaman Login & Registrasi
  /App.tsx        # Entry point utama & Routing logic
  /index.css      # Styling global & variabel tema
/public
  - sw.js         # Service Worker untuk notifikasi background
```

---

## 🛠️ 3. Fitur Utama & Logika Bisnis

### A. Dashboard (Analisis Modular)
- Menampilkan ringkasan saldo, pemasukan, dan pengeluaran bulan berjalan.
- Grafik interaktif untuk memantau kategori pengeluaran teratas.
- Fitur **Export PDF** yang mengonversi data transaksi menjadi laporan profesional.

### B. Transaksi & Bukti Pembayaran
- Pengguna bisa menambah, mengedit, dan menghapus transaksi.
- **Upload Bukti:** Khusus pengeluaran, sistem terintegrasi dengan **Supabase Storage** (bucket: `transaction-proofs`) untuk menyimpan foto struk/nota.
- Sinkronisasi real-time menggunakan `fetchTransactions()` setelah setiap perubahan data.

### C. Sistem Anggaran (Smart Budgets)
- Pembuatan anggaran berdasarkan periode (Harian, Mingguan, Bulanan).
- **Visual Indicators:** Bar progress berubah warna secara dinamis:
  - 🟢 **Hijau:** < 80% pemakaian.
  - 🟡 **Kuning:** 80% - 100% pemakaian (Warning).
  - 🔴 **Merah:** > 100% (Over budget).

### D. Notifikasi (Native Push & In-App)
- Menggunakan **Service Worker (`sw.js`)** agar notifikasi bisa muncul di sistem operasi (Windows/Android/iOS) meskipun browser sedang ditutup atau di background.
- Notifikasi dipicu saat:
  - Berhasil menambah/hapus transaksi.
  - Update profil atau ganti password.

---

## 🗄️ 4. Skema Database (Supabase)
Tabel-tabel utama yang harus dikonfigurasi di Supabase:

| Tabel | Kolom Utama | Fungsi |
| :--- | :--- | :--- |
| `transactions` | `id, user_id, amount, category, type, description, proof_url, date` | Menyimpan semua arus kas user. |
| `budgets` | `id, user_id, category, amount, period, month, year` | Menyimpan target anggaran user. |
| `notifications` | `id, user_id, title, message, type, read` | Log notifikasi dalam aplikasi. |
| `user_profiles` | `id, name, email, avatar_url, role` | Data metadata tambahan pengguna. |

---

## ⚙️ 5. Konfigurasi Lingkungan (.env)
Aplikasi membutuhkan file `.env` di direktori root dengan variabel berikut:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ 6. Cara Menjalankan untuk Developer
1. **Clone & Install:**
   ```bash
   npm install
   ```
2. **Menjalankan Dev Server:**
   ```bash
   npm run dev
   ```
3. **Membangun untuk Produksi:**
   ```bash
   npm run build
   ```

---

## 📝 7. Catatan Penting untuk Developer Lanjutan
- **Optimasi Performa:** Gunakan `Promise.all` saat melakukan tugas background (seperti kirim notifikasi) agar tidak menghalangi UI.
- **Security:** Pastikan **Row Level Security (RLS)** di Supabase aktif agar user hanya bisa melihat data milik mereka sendiri berdasarkan `auth.uid()`.
- **Skeleton Loaders:** Gunakan class `.skeleton` di CSS saat fetching data untuk UX yang lebih halus.

---
**Dokumentasi Versi:** 1.0 (Mei 2026)  
**Author:** AI Coding Assistant (Antigravity) & USER  
