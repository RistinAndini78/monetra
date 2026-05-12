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

## 🖥️ DESKRIPSI MENDALAM ANTARMUKA (USER JOURNEY)

### 👤 A. HALAMAN PENGGUNA (USER INTERFACE)
Halaman pengguna dirancang dengan estetika *Premium Light Mode* yang mengutamakan kejelasan data dan kenyamanan visual. Setiap elemen memiliki animasi halus untuk memberikan kesan aplikasi yang "hidup".

#### 1. Eksplorasi Dashboard (The Command Center)
Saat pertama kali masuk, pengguna disambut oleh **Dashboard** yang merangkum seluruh kondisi finansial dalam satu layar. Di bagian atas, terdapat **Premium Balance Card** yang menampilkan total saldo dengan angka yang besar dan tegas; angka ini merupakan hasil kalkulasi otomatis yang membandingkan seluruh pemasukan dan pengeluaran secara *real-time*. 

Di sisi tengah, pengguna dapat melihat **Trend Arus Kas** yang digambarkan melalui grafik garis elegan. Grafik ini tidak statis; ia akan bergerak mengikuti fluktuasi uang Anda selama 6 bulan terakhir, memberikan gambaran apakah kekayaan Anda sedang tumbuh atau menurun. Di sampingnya, terdapat **Diagram Alokasi**, sebuah *Pie Chart* berwarna-warni yang secara visual langsung memberi tahu Anda ke mana perginya uang paling banyak, misalnya untuk "Makanan" atau "Hiburan", tanpa perlu membaca angka yang rumit.

#### 2. Manajemen Transaksi & Fitur Import Cerdas
Halaman **Transaksi** adalah laboratorium utama data. Pengguna akan melihat daftar panjang aktivitas keuangan yang tersusun rapi secara kronologis. Setiap baris transaksi dilengkapi dengan ikon indikator warna: panah hijau meluncur ke atas untuk uang masuk, dan panah merah meluncur ke bawah untuk uang keluar.

Yang paling istimewa adalah fitur **Drag & Drop Import**. Pengguna tidak perlu lagi mengetik transaksi satu per satu jika memiliki banyak data. Cukup ambil file laporan bank (CSV/JSON), lalu jatuhkan file tersebut ke area yang disediakan. Seketika, aplikasi akan membaca file tersebut, melakukan validasi data, dan memasukkannya ke dalam database Supabase. Seluruh proses ini berjalan di latar belakang dengan indikator *loading* yang halus, memberikan pengalaman pengguna yang sangat modern.

#### 3. Pengendali Anggaran (Smart Budgeting)
Halaman **Budget** bertindak sebagai pendamping cerdas yang membantu pengguna menahan diri dari pemborosan. Setiap kategori anggaran ditampilkan dalam bentuk kartu yang memiliki **Progress Bar**. Batang visual ini akan terisi perlahan seiring dengan bertambahnya transaksi Anda. 

Jika pengeluaran masih dalam batas aman, batang akan berwarna biru atau hijau. Namun, saat pengeluaran mendekati 80% dari batas, sistem akan memberikan peringatan visual. Logika di balik halaman ini sangat kompleks: ia terus menerus melakukan sinkronisasi dengan halaman transaksi untuk memastikan bahwa setiap sen yang Anda belanjakan langsung tercermin pada sisa anggaran Anda saat itu juga.

#### 4. Penagih & Pengingat (Bills Management)
Halaman **Tagihan** dirancang untuk menghilangkan rasa cemas akan terlambat membayar. Pengguna dapat melihat kartu-kartu tagihan yang menonjolkan tanggal jatuh tempo. Terdapat tombol **"Bayar Sekarang"** yang memiliki sistem keamanan *Double-Click Protection*. 

Sistem ini memastikan bahwa jika pengguna tidak sengaja menekan tombol dua kali, transaksi tetap hanya akan diproses satu kali. Setelah sukses, status tagihan akan berubah menjadi "Lunas" dengan animasi centang hijau yang memuaskan, dan secara otomatis sistem akan mengirimkan catatan pengeluaran ke buku besar transaksi pengguna.

#### 5. Sistem Notifikasi & Lonceng Real-Time
Header aplikasi dilengkapi dengan **Lonceng Notifikasi** yang aktif. Berbeda dengan lonceng biasa, lonceng ini memiliki nyawa; ia akan bergetar (*bounce*) secara otomatis setiap kali ada pesan masuk. Ketika diklik, sebuah jendela melayang (*dropdown*) akan muncul dengan animasi yang sangat halus. Di sana, pengguna dapat membaca pesan-pesan konfirmasi, seperti "Gaji Anda telah berhasil dicatat" atau "Tagihan Listrik telah dilunasi". Fitur ini memastikan pengguna selalu terhubung dengan setiap perubahan yang terjadi pada akun mereka.

#### 6. Layanan Notifikasi Email (Premium Alert) - *Baru!*
Monetra kini selangkah lebih maju dengan integrasi **Email Gateway (Resend)**. Fitur ini tidak hanya memberikan notifikasi di dalam aplikasi, tetapi juga mengirimkan bukti pembayaran resmi dan pengingat tagihan langsung ke alamat email pengguna. Pengguna dapat mengontrol fitur ini melalui halaman Pengaturan, memberikan fleksibilitas penuh antara kenyamanan dan privasi. Setiap email didesain dengan format HTML profesional yang mencakup detail nominal, kategori, dan tanggal transaksi.

---

### 🛡️ B. HALAMAN ADMINISTRATOR (ADMIN CONSOLE)
Area ini didesain lebih minimalis dan fungsional, berfokus pada pengawasan data skala besar.

#### 1. Monitoring & Statistik Global
Di sini, admin disuguhkan pemandangan "Helikopter" dari seluruh sistem Monetra. Admin dapat melihat total pengguna yang terdaftar di seluruh dunia dan total volume uang yang mengalir di dalam sistem. Data ini disajikan dalam bentuk statistik pertumbuhan, memungkinkan admin untuk mengetahui tren popularitas aplikasi dari waktu ke waktu.

#### 2. Manajemen Pengguna & Keamanan Sistem
Halaman ini berisi tabel lengkap data identitas pengguna. Admin memiliki otoritas untuk memantau aktivitas, melihat level akun pengguna, dan memastikan bahwa sistem berjalan tanpa kendala teknis. Admin juga memiliki fitur ekspor laporan global yang memungkinkan data-data statistik sistem diubah menjadi dokumen untuk keperluan audit profesional.

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
