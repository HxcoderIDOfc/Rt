# Axynera Chat Demo

Versi demo untuk app chat Axynera:

- Vite untuk UI web.
- Capacitor untuk bungkus jadi APK Android.
- Package Android: `com.axynera.official`.
- Permission Android awal: `android.permission.INTERNET`.
- Login email/password demo.
- UI chat bergaya server/channel + direct message.
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
https://api.axynera.my.id/auth/login
https://api.axynera.my.id/messages
https://api.axynera.my.id/ai/chat
```

Untuk sekarang login hanya menyimpan user demo ke `localStorage`.

## Build APK di GitHub

Workflow sudah ada di `.github/workflows/build-android.yml`.

Cara pakai:

1. Push project ini ke GitHub.
2. Buka tab **Actions**.
3. Pilih **Build Android APK**.
4. Klik **Run workflow**.
5. Download artifact bernama `axynera-v0.2-demo-debug-apk`.

File APK debug akan dibuat dari:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Changelog

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
