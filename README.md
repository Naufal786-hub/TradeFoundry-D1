# TradeFoundry V2 — Starter

Starter React + Vite + Firebase untuk membangun TradeFoundry V2 dengan tampilan dark market terminal.

## Isi saat ini
- Login dan registrasi email/password melalui Firebase Authentication.
- Pembuatan profil dasar dan pencatatan waktu mulai trial 3 hari pada saat registrasi.
- Paket membership: 1 bulan Rp1.200.000, 2 bulan Rp2.000.000, 1 tahun Rp8.900.000.
- Chat komunitas realtime untuk room General, XAUUSD, Fundamental, dan Technical (Firestore).
- Dashboard awal untuk XAUUSD, DXY, US 10Y yield, news, dan kalender ekonomi sebagai placeholder UI.

## Persiapan Firebase
1. Buat project di https://console.firebase.google.com/
2. Aktifkan Authentication > Sign-in method > Email/Password.
3. Buat Cloud Firestore database.
4. Dari Project settings, buat Web App dan salin konfigurasi Firebase.
5. Salin `.env.example` menjadi `.env.local`, lalu isi semua nilai `VITE_FIREBASE_...`.
6. Pasang Firestore rules dari `firebase/firestore.rules` (aturan ini baseline awal, wajib ditinjau ulang sebelum produksi).

## Jalankan di komputer
```bash
npm install
npm run dev
```
Untuk build:
```bash
npm run build
```

## Deploy
Bisa deploy ke Firebase Hosting, Vercel, atau layanan hosting statis lain setelah konfigurasi Firebase lengkap.

## Catatan penting sebelum dipakai publik
Ini masih starter, bukan aplikasi produksi/siap Play Store. Belum ada:
- Payment gateway dan webhook Midtrans/Xendit.
- Validasi membership/trial yang aman di backend.
- Live market data, chart provider, news API, dan kalender ekonomi.
- DM privat, grup buatan pengguna, upload foto profil, push notification, moderation tools, dan dashboard admin lengkap.
- Proteksi spam/rate limit, audit keamanan, privacy policy, dan proses rilis Android.

Jangan mengandalkan countdown di browser sebagai pengunci membership. Status trial dan pembayaran harus diverifikasi di backend. Jangan pernah menyimpan password pembayaran, PIN, atau data kartu pengguna. Admin role harus diberikan melalui backend tepercaya, bukan dari browser pengguna.
