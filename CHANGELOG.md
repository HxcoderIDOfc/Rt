# Changelog

## v0.9.0-demo

- Added a stable demo debug signing key for GitHub Actions APK builds.
- Installed the stable debug keystore before Gradle assembles the debug APK.
- Updated GitHub Actions to newer Node 24 compatible action versions.
- Renamed the debug APK artifact to `axynera-v0.9-demo-debug-apk`.

## v0.8.0-demo

- Installed the full horizontal Axynera logo on the left side of the navbar.
- Moved the user avatar to the right side near the three-dot menu.
- Moved launcher icon generation after Capacitor sync so the AX icon is not overwritten.
- Added normal, round, and foreground Android launcher icon outputs.
- Renamed the debug APK artifact to `axynera-v0.8-demo-debug-apk`.

## v0.7.0-demo

- Added refreshed icons for Chat, Groups, Status, Server, and Calls.
- Changed Status and Server content into vertical chat-style lists.
- Removed the theme label from the topbar and added a three-dot menu.
- Added a floating contacts panel with registered or invite states.
- Refined profile setup with a large thumbnail and overlapping avatar.
- Added transparent brand assets for the navbar, splash/loading screen, and AX app icon.
- Added fuller Settings and an Admin demo panel.
- Added permanent ban, time ban, and unban options in the Admin demo.
- Renamed the debug APK artifact to `axynera-v0.7-demo-debug-apk`.

## v0.6.0-demo

- Changed the profile modal so the user's own profile only shows edit actions.
- Added contact profile cards from Chat and Calls with Message/Call actions.
- Added compact Group and Server profile cards.
- Refined navigation, top action, and profile action icons.
- Renamed the debug APK artifact to `axynera-v0.6-demo-debug-apk`.

## v0.5.0-demo

- Added a permission center popup after entering the app.
- Added runtime permission requests for notifications, camera, microphone, and location where supported.
- Added Android-ready permission notes for contacts, storage, and SMS.
- Added demo status cards that automatically expire after 24 hours.
- Renamed the debug APK artifact to `axynera-v0.5-demo-debug-apk`.

## v0.4.0-demo

- Changed the default theme to Light Blue/Cyan.
- Added CSS-based AX logo, light splash, and refreshed onboarding screens.
- Added demo profile picture and cover/thumbnail uploads with image/GIF support.
- Added mini Verify, Dev, and VIP badges inline after names.
- Added floating profile modal opened from the avatar.
- Added fuller Chat, Group, Status, Server, Calls, and Settings pages.
- Added opt-in Rich Presence demo for playing/listening states.
- Renamed the debug APK artifact to `axynera-v0.4-demo-debug-apk`.

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
