# Changelog

## v0.3.0-demo

- Changed the app flow to splash screen, one-time language selection, demo phone login, profile setup, and dashboard.
- Added mobile bottom navigation for Chat, Groups, Status, Server, and Calls.
- Added top Settings entry with demo permission overview.
- Added Android manifest permissions for internet, storage, camera, microphone, location, contacts, SMS, and notifications in the manual APK workflow.
- Renamed the debug APK artifact to `axynera-v0.3-demo-debug-apk`.

## v0.2.0-demo

- Changed Axynera into a chat app demo.
- Added demo email/password login.
- Added server rail, channels, direct messages, chat room, composer, and AI panel.
- Added Cloudflare Worker endpoint placeholders for auth, messages, and AI.

## v0.1.0

- Initial Axynera app shell.
- Dummy Google login that opens the dashboard immediately.
- Local dummy session using `localStorage`.
- Mobile-first dashboard with Cloud, AI, and APK status cards.
- Capacitor config for Android package `com.axynera.official`.
- Manual-only GitHub Actions APK build workflow.
