# 📘 THE MONETRA MASTER GUIDE: DOKUMENTASI TEKNIS END-TO-END (v3.0)
**Panduan Utama Pengembangan & Pemeliharaan Aplikasi Monetra**

Dokumentasi ini dirancang agar developer manapun dapat memahami, memperbaiki, dan memperluas aplikasi Monetra tanpa perlu bertanya lagi. Dokumen ini membedah setiap modul hingga ke level fungsi dan state.

---

## 🏗️ 1. RINGKASAN ARSITEKTUR & TEKNOLOGI

Aplikasi Monetra menggunakan arsitektur **Serverless SPA (Single Page Application)**. Tidak ada backend server tradisional (Node.js/Python); semua logika bisnis yang memerlukan persistensi langsung berkomunikasi dengan **Supabase** sebagai Backend-as-a-Service (BaaS).

### Tech Stack Breakdown:
| Layer | Teknologi | Alasan Penggunaan |
| :--- | :--- | :--- |
| **Framework** | React 18 (Vite) | Rendering cepat dengan Fast Refresh untuk pengembangan. |
| **Bahasa** | TypeScript | Menghindari error runtime dengan static typing pada object transaksi/user. |
| **Database** | PostgreSQL (Supabase) | Mendukung query kompleks untuk laporan keuangan dan RLS. |
| **Auth** | Supabase Auth | Manajemen session aman dengan JWT dan dukungan OAuth/Email. |
| **Styling** | Tailwind CSS v4 | Utilitas CSS modern untuk desain premium tanpa menulis banyak file CSS. |
| **Ikon** | Lucide React | Library ikon vektor yang ringan dan mudah dikustomisasi. |
| **Grafik** | Recharts | Visualisasi data deklaratif yang responsif. |
| **Export** | jsPDF | Pembuatan dokumen PDF langsung di sisi klien (Client-side). |

---

## 📂 2. STRUKTUR FOLDER & MODUL (DETAILED)

### `src/App.tsx` (The Controller)
Ini adalah "Otak" dari aplikasi. 
- **State Utama:** 
  - `activeTab`: Menentukan halaman mana yang sedang tampil (Dashboard, Transactions, dll).
  - `user`: Menyimpan objek profil user yang sedang login.
  - `isSidebarOpen`: Mengontrol drawer navigasi pada tampilan mobile.
- **Logika Kunci:** 
  - `onAuthStateChange`: Listener yang memantau status login. Jika logout, state dibersihkan dan user dilempar ke halaman Auth.
  - `useEffect (Tab Persistence)`: Menyimpan tab terakhir yang dibuka ke `localStorage` agar saat refresh halaman tidak kembali ke Dashboard.

### `src/lib/supabase.ts`
Berisi inisialisasi client Supabase. Client ini bersifat **Singleton**, artinya hanya ada satu instance koneksi yang digunakan oleh seluruh aplikasi untuk efisiensi memori.

### `src/lib/notifications.ts` (Notification Engine)
Mengatur komunikasi dengan Browser Notification API.
- **Fungsi `sendNotification`**: Memeriksa izin browser. Jika diizinkan, ia akan memanggil Service Worker untuk menampilkan notifikasi.
- **Fungsi `sendTransactionAlert`**: Logika khusus untuk memberikan feedback instan setelah transaksi (suara/getar/notifikasi).

---

## 📑 3. ANALISIS MENDALAM PER HALAMAN

### A. Dashboard (`Dashboard.tsx`)
Halaman ini adalah hub informasi yang melakukan agregasi data dari berbagai tabel.
- **Logika Agregasi Data:**
  - Fungsi `fetchDashboardData` mengambil semua transaksi user, lalu menggunakan filter JavaScript untuk memisahkan pemasukan dan pengeluaran bulan ini.
  - `totalBalance` dihitung dengan rumus: `(Total Pemasukan - Total Pengeluaran)`.
- **Grafik Kategori Teratas:**
  - Data transaksi di-group berdasarkan kategori menggunakan `reduce()`.
  - Hasilnya diurutkan (`sort`) dari yang terbesar untuk ditampilkan di grafik Recharts.
- **Fitur Export PDF:**
  - Menggunakan library `jsPDF`.
  - Logika: Membuat dokumen baru -> Menambahkan Header -> Memanggil `autoTable` untuk merender data transaksi ke tabel PDF -> `doc.save()` untuk mendownload.

### B. Transaksi (`Transactions.tsx`)
Modul CRUD paling kompleks di aplikasi ini.
- **State Management:**
  - `transactions`: Array mentah dari database.
  - `dbTransactions`: State untuk "Optimistic UI", di mana UI update dulu sebelum database selesai memproses (agar terasa instan).
- **Logika Upload Gambar (Bukti Struk):**
  - Hanya muncul jika `type === 'expense'`.
  - Alur: Klik Upload -> Pilih File -> `FileReader` merender preview -> Saat "Simpan", file diunggah ke folder `transaction-proofs/[USER_ID]/` -> URL didapat -> URL disimpan ke kolom `proof_url`.
- **Fitur Pencarian:** 
  - Menggunakan filter `.filter()` pada array transaksi berdasarkan `judul` atau `kategori`.

### C. Anggaran (`Budgets.tsx`)
Modul perencanaan keuangan.
- **Logika Perhitungan:**
  - Mengambil data dari tabel `budgets`.
  - Melakukan cross-reference ke tabel `transactions` untuk menghitung sisa saldo di kategori tersebut.
- **Sistem Warna Indikator:**
  - Menggunakan rumus persentase: `(terpakai / budget) * 100`.
  - Logika CSS dinamis: `className={percent > 100 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`.

### D. Pengaturan (`Settings.tsx`)
Modul manajemen identitas user.
- **Update Profil:** Menggunakan `supabase.auth.updateUser`. Fungsi ini memperbarui `user_metadata` yang berisi nama lengkap.
- **Security Toggles:** Meskipun tampilannya toggle, fungsinya saat ini menyimpan preferensi user ke `localStorage` atau `user_metadata`.
- **Ganti Password:** Memicu email resmi dari Supabase Auth untuk reset password secara aman.

---

## 🗄️ 4. STRUKTUR DATABASE (FULL SQL SCHEMA)

Jika developer ingin memindahkan database atau melakukan migrasi, gunakan skema SQL berikut:

```sql
-- 1. Tabel Transaksi
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  judul TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  date DATE DEFAULT CURRENT_DATE,
  catatan TEXT,
  proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Budget
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  period TEXT DEFAULT 'Bulanan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kebijakan Keamanan (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa melihat datanya sendiri
CREATE POLICY "Individu" ON transactions
FOR ALL USING (auth.uid() = user_id);
```

---

## 📡 5. SERVICE WORKER & PWA (`sw.js`)

Aplikasi ini memiliki kemampuan berjalan di background melalui `sw.js`.
- **Event `install`**: Melakukan caching aset statis agar aplikasi bisa dibuka lebih cepat.
- **Event `push`**: Mendengarkan sinyal dari Supabase/Cloud Messaging. Saat sinyal masuk, ia menjalankan `self.registration.showNotification()`.
- **Event `notificationclick`**: Mendeteksi saat user mengklik notifikasi, lalu membuka kembali tab browser yang berisi aplikasi Monetra.

---

## 🛠️ 6. PANDUAN ERROR HANDLING & TROUBLESHOOTING

1. **Layar Putih (White Screen):**
   - **Penyebab:** Biasanya karena ada ikon yang belum di-import dari `lucide-react`.
   - **Solusi:** Cek konsol browser (F12), cari error "ReferenceError: [IconName] is not defined".
2. **Gambar Tidak Muncul:**
   - **Penyebab:** Policy di Supabase Storage bucket `transaction-proofs` belum diset ke 'Public'.
   - **Solusi:** Buka dashboard Supabase -> Storage -> Buckets -> Edit Bucket -> Jadikan Public.
3. **Notifikasi Tidak Muncul:**
   - **Penyebab:** Browser memblokir notifikasi atau Service Worker gagal registrasi.
   - **Solusi:** Klik ikon gembok di URL bar browser -> Site Settings -> Reset Permissions -> Refresh.

---

## 🚀 7. ALUR KERJA (WORKFLOW) DEVELOPER

1. **Menambah Fitur Baru:**
   - Buat komponen di `/components`.
   - Import komponen ke halaman yang sesuai di `/pages`.
   - Jika butuh data baru, buat tabel di Supabase dan aktifkan RLS.
2. **Update Desain:**
   - Edit `index.css` pada bagian `@theme`.
   - Gunakan utility Tailwind langsung di elemen JSX.
3. **Deployment:**
   - Cukup `git push` ke GitHub, Vercel akan otomatis melakukan build (`npm run build`) dan mendistribusikan aplikasi secara global.

---

**Dibuat Oleh:** AI Coding Assistant (Antigravity) & Tim Monetra  
**Versi Dokumen:** 3.0 (Ultimate Developer Edition)  
**Terakhir Diupdate:** Mei 2026  
