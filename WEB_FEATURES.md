# Web Platform Features (PWA) - Monetra

## Platform-Specific Features untuk Web

Monetra web platform mengimplementasikan fitur-fitur khas Progressive Web App (PWA) sebagai berikut:

### 1. **Web Push Notifications** ✅
**File**: `src/lib/notifications.ts`

Implementasi push notifications untuk memberikan alert kepada user:
- **Notification Permission**: Request izin notifikasi dari browser saat app startup
- **Transaction Alerts**: Notifikasi ketika user menambahkan transaksi (pemasukan/pengeluaran)
- **Budget Alerts**: Notifikasi ketika budget terlampaui
- **Goal Progress**: Notifikasi progress goal keuangan
- **Custom Notifications**: API umum untuk mengirim notifikasi custom

**Penggunaan**:
```typescript
PushNotificationService.sendTransactionAlert('income', 1000000, 'Gaji');
PushNotificationService.sendBudgetAlert('Makanan', 500000, 1000000, 50);
PushNotificationService.sendGoalProgressNotification('Liburan', 75);
```

### 2. **Drag & Drop File Upload** ✅
**File**: `src/lib/fileService.ts` & `src/pages/Transactions.tsx`

Fitur drag-drop untuk import/export transaksi:
- **File Upload Area**: Drag & drop zone di halaman Transactions
- **CSV Import**: Import transaksi dari file CSV
- **JSON Import**: Import transaksi dari file JSON
- **CSV Export**: Export seluruh transaksi ke format CSV
- **File Validation**: Validasi ukuran file dan format
- **Error Handling**: Notifikasi ketika import/export selesai

**Fitur Drag-Drop**:
```
1. Drag file CSV/JSON ke area yang ditandai
2. File akan otomatis ter-import
3. Validasi data dan insert ke database
4. Notifikasi success/error
```

**Fitur Export**:
```
1. Klik tombol Download di halaman Transactions
2. Semua transaksi (sesuai filter) akan diekspor ke CSV
3. File otomatis terdownload dengan timestamp
```

### 3. **PWA (Progressive Web App)** ✅
**File**: `vite.config.ts`, `src/main.tsx`

Implementasi PWA lengkap untuk installability dan offline support:

#### a) **Installable Application**
- Manifest file dengan metadata lengkap
- App dapat diinstall di home screen (Android/iOS/Desktop)
- Icon dan splash screen
- App shortcuts untuk akses cepat

#### b) **Offline Support**
- Service Worker auto-registration
- Cache strategies:
  - **NetworkFirst**: Untuk API calls (dengan 5 min cache)
  - **CacheFirst**: Untuk gambar (dengan 30 hari cache)
- Workbox untuk cache management

#### c) **App Shortcuts**
Users dapat membuat shortcuts quick-access:
- Tambah Transaksi (langsung buka modal transaksi)
- Dashboard (langsung ke dashboard)

#### d) **Responsive Design**
- Fully responsive UI dari mobile hingga desktop
- Adaptive layout dengan Tailwind CSS
- Touch-friendly interfaces

### 4. **Service Worker & Caching**
**Activated Features**:
- Auto-update service worker
- Offline page loading (cached assets)
- Background sync (future capability)
- Push event handling

## File Struktur yang Dimodifikasi

```
src/
├── lib/
│   ├── notifications.ts          (NEW) - Push notification service
│   ├── fileService.ts            (NEW) - File import/export service
│   └── supabase.ts               (existing)
├── pages/
│   └── Transactions.tsx           (MODIFIED) - Drag-drop & export UI
├── main.tsx                       (MODIFIED) - PWA init & notifications
└── App.tsx                        (existing)

vite.config.ts                     (MODIFIED) - Enhanced PWA config
```

## Cara Menggunakan

### Web Push Notifications
1. Buka aplikasi di browser
2. Browser akan meminta izin untuk mengirim notifikasi
3. Klik "Allow" untuk mengaktifkan
4. Setiap transaksi baru akan mengirim notifikasi

### Drag & Drop Import
1. Siapkan file CSV atau JSON dengan format:
   ```csv
   Tanggal,Nama,Kategori,Tipe,Jumlah,Catatan
   2024-01-15,Gaji Bulanan,Gaji,Pemasukan,5000000,
   2024-01-16,Makan Siang,Makanan,Pengeluaran,50000,Warung makan
   ```
2. Buka halaman Transactions
3. Drag file ke area yang ditandai
4. Tunggu import complete

### Export to CSV
1. Buka halaman Transactions
2. Gunakan filter sesuai kebutuhan (Semua/Pengeluaran/Pemasukan)
3. Klik tombol Download di header
4. File CSV akan terdownload dengan nama: `transactions_export_YYYY-MM-DD.csv`

### Install as App
1. Buka aplikasi di browser (Chrome, Firefox, Edge, Safari)
2. Klik menu (⋮) atau menu lainnya
3. Pilih "Install app" atau "Add to home screen"
4. App akan diinstall dan dapat diakses offline

## Teknologi yang Digunakan

- **PWA**: Vite PWA Plugin, Workbox
- **Push Notifications**: Browser Notification API
- **File Handling**: File API, Blob API
- **Service Worker**: Virtual PWA Register
- **Styling**: Tailwind CSS (responsive)

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Push Notifications | ✅ | ✅ | ⚠️ Limited | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| PWA/Installable | ✅ | ✅ | ✅ Limited | ✅ |
| Offline Mode | ✅ | ✅ | ⚠️ Limited | ✅ |

## Future Enhancements

- [ ] Background sync untuk transaksi offline
- [ ] Web Push dari server (memerlukan backend)
- [ ] IndexedDB untuk local storage lebih besar
- [ ] WebRTC untuk sharing/collaboration
- [ ] Periodic background sync untuk sync otomatis

---

**Last Updated**: May 10, 2026
**Status**: ✅ Production Ready
