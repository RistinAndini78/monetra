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

## 🖥️ PENJELASAN DETAIL ANTARMUKA (PER HALAMAN)

### 👤 A. HALAMAN PENGGUNA (USER INTERFACE)
Halaman ini adalah area utama bagi pengguna untuk mengelola keuangan pribadi mereka.

#### 1. Bagian Dashboard (Pusat Ringkasan)
Dashboard dirancang untuk memberikan informasi tercepat tentang kondisi uang Anda.
*   **Widget Saldo Utama:** Menampilkan angka "Total Saldo" yang dihitung secara otomatis (Uang Masuk dikurangi Uang Keluar).
*   **Grafik Arus Kas (Trend Chart):** Grafik garis yang menunjukkan naik-turunnya keuangan Anda selama 6 bulan terakhir.
*   **Donat Alokasi Dana:** Menunjukkan persentase pengeluaran Anda (misal: 40% untuk Makanan, 20% untuk Transport).
*   **Logika Teknis:** Data diambil secara asinkron dari Supabase dan diperbarui secara instan tanpa refresh halaman.

#### 2. Bagian Halaman Transaksi (Catatan Keuangan)
Tempat pengguna mencatat setiap rupiah yang keluar atau masuk.
*   **Tombol Tambah Transaksi:** Memunculkan formulir modern untuk mengisi judul, nominal, kategori, dan tanggal.
*   **Fitur Import (Baru):** Pengguna bisa menarik (*Drag & Drop*) file laporan bank (CSV/JSON) langsung ke halaman ini untuk input massal.
*   **Daftar Riwayat:** Tabel yang menampilkan detail transaksi lengkap dengan ikon indikator (Panah Hijau untuk Masuk, Panah Merah untuk Keluar).
*   **Sistem Filter:** Pengguna bisa menyaring tampilan berdasarkan "Hanya Pemasukan" atau "Hanya Pengeluaran".

#### 3. Bagian Halaman Budget (Pengendali Anggaran)
Berfungsi sebagai "rem" agar Anda tidak boros.
*   **Progress Bar:** Menampilkan visualisasi batang warna. Jika sudah mendekati batas, warna akan berubah menjadi merah.
*   **Periode Fleksibel:** Bisa mengatur budget secara harian, mingguan, atau bulanan.
*   **Smart Calculation:** Sistem otomatis menghitung sisa budget Anda berdasarkan transaksi yang baru saja Anda buat di halaman Transaksi.

#### 4. Bagian Halaman Tagihan / Bills (Reminder)
Mengelola daftar kewajiban pembayaran rutin.
*   **Status Tagihan:** Menampilkan mana yang "Belum Dibayar" dan mana yang "Lunas".
*   **Tombol Bayar Instan:** Dilengkapi proteksi *Interaction Lock* agar tidak terjadi pembayaran ganda.
*   **Auto-Update:** Begitu diklik "Bayar", data otomatis berpindah ke halaman Transaksi sebagai pengeluaran baru.

#### 5. Bagian Header & Notifikasi (Pusat Aktivitas)
Terletak di bagian atas aplikasi untuk informasi cepat.
*   **Ikon Lonceng Interaktif:** Lonceng akan bergetar (bounce) jika ada notifikasi baru.
*   **Dropdown Pesan:** Menampilkan 5 aktivitas terbaru (misal: "Tagihan Listrik Lunas" atau "Gaji Berhasil Dicatat").
*   **Badget Angka:** Menunjukkan jumlah pesan yang belum Anda baca.

---

### 🛡️ B. HALAMAN ADMINISTRATOR (ADMIN CONSOLE)
Halaman rahasia yang hanya bisa diakses oleh akun dengan peran 'Admin'.

#### 1. Bagian Admin Dashboard (Monitoring Sistem)
*   **Total User:** Menampilkan jumlah total orang yang menggunakan aplikasi Monetra.
*   **Total Perputaran Uang:** Melihat total aset yang dikelola oleh sistem Monetra secara keseluruhan.
*   **Statistik Pertumbuhan:** Grafik yang menunjukkan pertumbuhan jumlah pengguna baru.

#### 2. Bagian Kelola User (User Management)
*   **Tabel Data User:** Menampilkan Nama, Email, dan Tanggal Bergabung setiap pengguna.
*   **Kontrol Akun:** Admin dapat melihat siapa saja pengguna yang aktif dan memberikan status 'Premium' secara manual.

#### 3. Bagian Laporan Global (System Reports)
*   **Export Data:** Admin dapat mengunduh laporan aktivitas sistem dalam format dokumen untuk keperluan audit atau presentasi.

---

## 🛠️ ARSITEKTUR TEKNOLOGI
Aplikasi ini menggunakan kombinasi teknologi modern:

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
