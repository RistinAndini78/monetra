# 🚀 Fitur & Arsitektur Teknologi - Monetra WealthFlow

Dokumen ini merangkum seluruh fitur unggulan dan tumpukan teknologi (tech stack) yang digunakan dalam pengembangan aplikasi Monetra.

---

## 🛠️ 1. Tumpukan Teknologi (Tech Stack)

Aplikasi dibangun menggunakan teknologi modern dengan standar industri untuk memastikan kecepatan, keamanan, dan skalabilitas.

*   **Frontend Framework**: `React.js` dengan `TypeScript` (untuk keamanan tipe data).
*   **Build Tool**: `Vite` (untuk performa pengembangan dan build yang sangat cepat).
*   **Backend-as-a-Service**: `Supabase` (Database PostgreSQL, Real-time Engine, Auth, & Storage).
*   **Styling & Design**: `Tailwind CSS` dengan sistem desain **Glassmorphism**.
*   **Animasi**: `Framer Motion` (untuk transisi UI yang halus).
*   **Ikon**: `Lucide React`.
*   **Utilities**: `date-fns` (manajemen waktu) dan `jsPDF` (generasi laporan PDF).

---

## ✨ 2. Fitur Utama (Core Features)

### A. Dashboard Finansial Real-time
*   **Statistik Otomatis**: Perhitungan total pemasukan, pengeluaran, dan saldo secara otomatis berdasarkan bulan berjalan.
*   **Activity Feed**: Aliran aktivitas transaksi terbaru yang selalu diperbarui secara instan.

### B. Manajemen Transaksi Cerdas
*   **Pencatatan Multi-kategori**: Mendukung berbagai kategori pemasukan dan pengeluaran.
*   **Drag & Drop Upload (Web-Specific)**: Fitur unggah bukti struk pembayaran dengan cara menyeret file langsung ke browser.
*   **Export Data**: Kemampuan untuk mengunduh riwayat transaksi dalam format **PDF** dan **CSV**.

### C. Perencanaan Anggaran (Budgeting)
*   **Batas Anggaran**: Menetapkan batas pengeluaran per kategori.
*   **Monitoring Visual**: Indikator progres yang menunjukkan sisa budget untuk mencegah pemborosan.

### D. Notifikasi & Pengingat Tagihan
*   **Pelacak Tagihan**: Mencatat kewajiban rutin dan tanggal jatuh temponya.
*   **Pengingat Otomatis**: Munculnya notifikasi peringatan jika ada tagihan yang harus dibayar dalam waktu dekat.

### E. Analisis Grafik & Tren
*   **Visualisasi Data**: Grafik interaktif yang menunjukkan tren pengeluaran bulanan dan perbandingan arus kas.

---

## 📱 3. Fitur Khusus Platform (Platform-Specific)

Sesuai dengan ketentuan teknis multi-platform, Monetra mengimplementasikan fitur unik untuk masing-masing pengalaman:

*   **Fitur Web**: **Drag and Drop File Upload** & **PDF Generation** (kemampuan native browser).
*   **Fitur Mobile**: **Camera Integration** (akses kamera langsung untuk foto profil) & **Adaptive List View** (tampilan yang dirancang khusus untuk layar sentuh).
*   **Cross-Device Sync**: Sinkronisasi data otomatis secara instan antara Laptop dan HP menggunakan mekanisme `Live Metadata Sync`.

---

## 🔒 4. Keamanan & Sinkronisasi
*   **Autentikasi Aman**: Login dan registrasi terenkripsi melalui Supabase Auth.
*   **Live Profil Sync**: Perubahan foto atau nama di satu perangkat akan langsung tercermin di perangkat lain tanpa perlu refresh manual.
