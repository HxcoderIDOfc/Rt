# Axynera v0.1

Versi awal untuk app Axynera:

- Vite untuk UI web.
- Capacitor untuk bungkus jadi APK Android.
- Login Google dummy, sekali klik langsung masuk dashboard.
- Backend Cloudflare Worker bisa disambungkan nanti.
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

Tombol dummy di `src/main.js` bisa diganti ke endpoint:

```text
https://api.axynera.my.id/auth/google
```

Untuk sekarang tombol Google hanya menyimpan user dummy ke `localStorage`.

## Build APK di GitHub

Workflow sudah ada di `.github/workflows/build-android.yml`.

Cara pakai:

1. Push project ini ke GitHub.
2. Buka tab **Actions**.
3. Pilih **Build Android APK**.
4. Klik **Run workflow**.
5. Download artifact bernama `axynera-v0.1-debug-apk`.

File APK debug akan dibuat dari:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Changelog

### v0.1.0

- Menambahkan halaman login dummy dengan tombol Google.
- Menambahkan dashboard awal Axynera.
- Menambahkan session dummy via `localStorage`.
- Menambahkan konfigurasi Capacitor Android.
- Menambahkan workflow GitHub Actions manual untuk build APK debug.
