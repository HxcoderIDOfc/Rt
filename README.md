# Axynera Mobile Messenger Demo

Versi demo untuk app chat Axynera:

- Vite untuk UI web.
- Capacitor untuk bungkus jadi APK Android.
- Package Android: `com.axynera.official`.
- Permission Android awal: Internet, storage, camera, microphone, location, contacts, SMS, dan notifications.
- Splash screen.
- Pemilihan bahasa sekali saat setup awal.
- Login nomor HP + OTP demo.
- Setup profile akun baru: foto, nama, username.
- Dashboard mobile dengan navbar bawah: Chat, Grup, Status, Server, Panggilan.
- Tema default Light Blue/Cyan, bukan hijau.
- PP dan sampul/thumbnail mendukung image/GIF demo lokal.
- Badge mini Verify, Dev, dan VIP tampil di belakang nama.
- Profile floating modal saat avatar diklik.
- Rich Presence demo opt-in untuk playing/listening.
- Popup permission demo saat masuk aplikasi, plus tombol kelola izin di Settings.
- Status demo otomatis hilang setelah 24 jam.
- Profile sendiri hanya menampilkan tombol edit, sementara profile orang punya Message/Call.
- Profile grup dan server tampil ringkas dengan avatar dan nama.
- Icon navigasi dan tombol dibuat lebih rapi.
- Tab Status dan Server dibuat list vertikal seperti Chat.
- Topbar menghapus teks tema dan memakai menu titik tiga.
- Settings dibuat lebih lengkap dengan menu Admin demo.
- Admin demo mendukung pilihan ban permanent, time ban, dan unban.
- Floating kontak bisa menampilkan kontak terdaftar atau tombol undang.
- Edit profile memakai thumbnail besar dengan PP bertumpuk.
- Asset brand transparan untuk navbar, splash/loading, dan app icon AX.
- Slot AI siap disambungkan ke Cloudflare Worker.
- Build APK manual lewat GitHub Actions.

## Jalankan web

```bash
npm install
npm run dev
```

## Build web

```bash
npm run build
```

## Siapkan Android Capacitor

```bash
npm run build
npm run cap:add:android
npm run cap:sync
```

Kalau di komputer ada Android Studio:

```bash
npm run cap:open
```

## Nanti disambungkan ke Cloudflare Worker

Login dan chat demo di `src/main.js` bisa diganti ke endpoint:

```text
https://api.axynera.my.id/auth/phone/start
https://api.axynera.my.id/auth/phone/verify
https://api.axynera.my.id/profile
https://api.axynera.my.id/messages
https://api.axynera.my.id/ai/chat
```

Untuk sekarang bahasa, nomor HP, dan profile hanya disimpan ke `localStorage`.

## Build APK di GitHub

Workflow sudah ada di `.github/workflows/build-android.yml`.

Cara pakai:

1. Push project ini ke GitHub.
2. Buka tab **Actions**.
3. Pilih **Build Android APK**.
4. Klik **Run workflow**.
5. Download artifact bernama `axynera-v0.7-demo-debug-apk`.

File APK debug akan dibuat dari:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Changelog

### v0.7.0-demo

- Menambahkan icon baru untuk Chat, Grup, Status, Server, dan Panggilan.
- Mengubah Status dan Server menjadi list vertikal seperti Chat.
- Menghapus teks tema dari topbar dan menambahkan menu titik tiga.
- Menambahkan floating kontak dengan status terdaftar atau undang.
- Merapikan edit profile dengan thumbnail besar dan PP bertumpuk.
- Menambahkan Settings yang lebih lengkap dan halaman Admin demo.
- Menambahkan pilihan ban permanent, time ban, dan unban di Admin demo.
- Mengubah artifact APK menjadi `axynera-v0.7-demo-debug-apk`.

### v0.6.0-demo

- Mengubah profile modal agar profile sendiri hanya punya tombol edit.
- Menambahkan profile card untuk orang dari halaman Chat dan Panggilan dengan Message/Call.
- Menambahkan profile ringkas untuk Grup dan Server.
- Merapikan icon navigasi, tombol atas, dan tombol aksi profile.
- Mengubah artifact APK menjadi `axynera-v0.6-demo-debug-apk`.

### v0.5.0-demo

- Menambahkan popup permission demo saat masuk aplikasi.
- Menambahkan request runtime untuk notifikasi, kamera, mic, dan lokasi jika didukung perangkat.
- Menambahkan daftar izin Android untuk kontak, storage, dan SMS di permission center.
- Menambahkan status demo yang otomatis aktif hanya 24 jam.
- Mengubah artifact APK menjadi `axynera-v0.5-demo-debug-apk`.

### v0.4.0-demo

- Mengubah tema default menjadi Light Blue/Cyan.
- Menambahkan logo AX berbasis CSS, splash light, dan halaman onboarding baru.
- Menambahkan upload PP dan sampul/thumbnail demo dengan dukungan image/GIF.
- Menambahkan badge mini Verify, Dev, dan VIP di belakang nama.
- Menambahkan profile floating modal saat avatar diklik.
- Menambahkan halaman Chat, Grup, Status, Server, Panggilan, dan Settings yang lebih lengkap.
- Menambahkan Rich Presence demo opt-in untuk playing/listening.
- Mengubah artifact APK menjadi `axynera-v0.4-demo-debug-apk`.

### v0.3.0-demo

- Mengubah flow menjadi splash screen, pemilihan bahasa, login nomor HP demo, setup profile, lalu dashboard.
- Menambahkan dashboard mobile dengan navbar bawah: Chat, Grup, Status, Server, dan Panggilan.
- Menambahkan halaman Settings di navbar atas.
- Menyiapkan permission Android untuk Internet, storage, camera, microphone, location, contacts, SMS, dan notifications.
- Mengubah artifact APK menjadi `axynera-v0.3-demo-debug-apk`.

### v0.2.0-demo

- Mengubah app menjadi demo chat bergaya Discord/WA.
- Menambahkan login email/password demo.
- Menambahkan server rail, channel list, direct message, chat room, composer, dan panel AI.
- Menyiapkan placeholder endpoint Cloudflare Worker untuk login, pesan, dan AI.

### v0.1.0

- Menambahkan halaman login dummy dengan tombol Google.
- Menambahkan dashboard awal Axynera.
- Menambahkan session dummy via `localStorage`.
- Menambahkan package Android `com.axynera.official`.
- Menambahkan permission Android `android.permission.INTERNET`.
- Menambahkan konfigurasi Capacitor Android.
- Menambahkan workflow GitHub Actions manual untuk build APK debug.
