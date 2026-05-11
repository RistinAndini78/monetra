# 🏦 MONETRA: SISTEM EKOSISTEM FINANSIAL MULTIPLATFORM
> **Project Utama MK: Pengembangan Aplikasi Berbasis Platform**

---

## 🏆 PEMENUHAN KETENTUAN TUGAS BESAR
Aplikasi Monetra telah dirancang untuk memenuhi 100% kriteria penilaian tugas:

### 1. Multiplatform (Minimal 2 Kategori)
*   **Platform 1 (Web):** Progressive Web App (PWA) responsif yang dapat diakses melalui browser modern.
*   **Platform 2 (Mobile):** Aplikasi Android Native yang dikonversi menggunakan **Capacitor**, memungkinkan akses ke fitur hardware perangkat.

### 2. Backend Tunggal (Shared Backend)
*   Seluruh data (Web & Android) terpusat pada satu database **Supabase (PostgreSQL)**. Semua klien menggunakan API yang sama untuk sinkronisasi data secara real-time.

### 3. Fitur Autentikasi
*   Implementasi sistem Login & Registrasi menggunakan **Supabase Auth**. Mendukung enkripsi kata sandi dan manajemen sesi yang aman di seluruh platform.

### 4. Platform-Specific Features (Fitur Unik)
*   **🌐 Fitur Unik Web:**
    *   **Drag & Drop File Import:** Kemampuan mengunggah file transaksi (CSV/JSON) hanya dengan menggeser file ke area dashboard.
    *   **PWA Installability:** Dapat di-install langsung dari browser ke desktop/HP tanpa melalui App Store.
*   **📱 Fitur Unik Mobile (Android):**
    *   **Native Biometric Authentication:** Login super aman menggunakan Sidik Jari (Fingerprint) atau FaceID yang terintegrasi dengan hardware HP.
    *   **Haptic Feedback:** Getaran saat transaksi berhasil (diprogram melalui sistem Android).

---

## 📖 ANALISIS TEKNIS PER HALAMAN

### 1. Dashboard (Pusat Kendali)
Halaman ini adalah "otak" visual aplikasi.
*   **Logic:** Menghitung saldo bersih secara asinkron dari tabel `transactions`.
*   **Visual:** Menggunakan **Recharts** untuk grafik tren dan distribusi kategori.
*   **Real-time:** Menggunakan `supabase.channel` untuk memperbarui angka saldo setiap kali ada transaksi baru di perangkat mana pun.

### 2. Transaksi (Data Center)
Halaman utama untuk manajemen arus kas.
*   **Inovasi Baru:** Fitur **Import File** (CSV/JSON) yang memudahkan pengguna memindahkan data bank ke Monetra.
*   **Keamanan:** Dilengkapi sistem validasi agar tidak ada data kosong atau nominal negatif.

### 3. Budget (Perencanaan)
Sistem pengawasan pengeluaran.
*   **Logic:** Melakukan kalkulasi dinamis antara batas budget yang ditentukan dengan realita pengeluaran di kategori yang sama.
*   **Notifikasi:** Jika pengeluaran mendekati 80%, sistem akan memicu peringatan.

### 4. Tagihan / Bills (Manajemen Utang)
*   **Logic:** Menampilkan daftar tagihan yang harus dibayar.
*   **Double-Click Protection:** Mencegah pembayaran ganda akibat klik yang tidak sengaja.
*   **Auto-Transaction:** Begitu tagihan ditandai "Lunas", sistem otomatis membuat catatan pengeluaran di tabel transaksi.

### 5. Notifikasi (Pusat Informasi) - *Baru!*
Pusat pemberitahuan real-time untuk aktivitas akun.
*   **Logic:** Menyimpan setiap pesan di tabel `notifications`.
*   **UI:** Dropdown interaktif di Header dengan animasi **Framer Motion**.
*   **Real-time:** Lonceng akan bergetar dan muncul angka merah seketika saat ada aktivitas baru.

### 6. Auth (Keamanan & Biometrik) - *Baru!*
Pintu masuk sistem yang sangat aman.
*   **Mobile Feature:** Tombol **"Masuk dengan Sidik Jari"** muncul otomatis di perangkat Android.
*   **Logic:** Menggunakan token identitas hardware untuk login otomatis ke Supabase tanpa perlu mengetik ulang email/password.

---

## 🛠️ ARSITEKTUR TEKNOLOGI

| Teknologi | Fungsi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **React 18** | Frontend Library | Performa cepat dengan *Virtual DOM* dan komponen yang modular. |
| **Vite** | Build Tool | Proses development sangat ringan dan build produksi yang optimal. |
| **Capacitor** | Mobile Bridge | Mengonversi Web App ke Native Mobile dengan akses hardware penuh. |
| **Supabase** | Backend as a Service | Database PostgreSQL dengan fitur Real-time yang sangat stabil. |
| **Framer Motion** | Animation | Memberikan pengalaman pengguna yang premium dan halus. |
| **Native Biometric** | Mobile Security | Standar keamanan tertinggi untuk aplikasi finansial modern. |

---

## 🔒 KEAMANAN DATA
Monetra menerapkan **Row Level Security (RLS)** pada Supabase. Artinya, data User A tidak akan pernah bisa dilihat oleh User B, bahkan jika seseorang mencoba meretas API secara langsung, karena validasi dilakukan di tingkat database, bukan hanya di aplikasi.

---

## 📂 STRUKTUR FOLDER PENTING
*   `/src/pages`: Berisi logika utama setiap halaman.
*   `/src/components`: Komponen UI yang dapat digunakan kembali (Header, Sidebar, dsb).
*   `/src/lib`: Konfigurasi layanan eksternal (Supabase, Notifikasi).
*   `/android`: Folder project Android Native (hasil konversi Capacitor).
*   `migration_notifications.sql`: Skrip database untuk mengaktifkan fitur notifikasi.

---
**© 2026 MONETRA PROJECT TEAM. DOKUMEN INI ADALAH VERSI FINAL UNTUK PRESENTASI.**
