# Nexus AI — Android App (Progressive Web App & Trusted Web Activity)

This folder contains the configuration and build instructions for the **Nexus AI Android App**.

Nexus AI is engineered as a zero-overhead **PWA + TWA (Trusted Web Activity)** application. It provides:
- **Instant Fullscreen Launch**: Launches without Chrome browser address bar or navigation buttons.
- **Offline Intelligence Cache**: Pre-caches assets, icons, fonts, and pages for offline startup.
- **Native Android Home Screen & App Drawer Icon**: 512x512 adaptive maskable icon with splash screen.
- **Multi-Shortcut Menu**: Long-press app icon on Android to jump directly into **Workspace**, **Supervisor**, or **Reports**.
- **Google Play Store Readiness**: Package ID `ai.nexus.app` ready for Google Play Console submission.

---

## 3 Ways to Run / Install Nexus AI on Android

### Method 1: Instant 1-Tap Direct Install (No Computer or Play Store Needed!)
1. Open your Android phone's browser (Google Chrome or Samsung Internet).
2. Visit: **`https://nexus-ai-ecru-nine.vercel.app/`**
3. Tap the **"Install Android App"** prompt at the bottom of the screen, OR tap Chrome's **⋮ (three dots)** menu in the top-right and select **"Install app"** (or **"Add to Home screen"**).
4. Tap **Install**.
5. The **Nexus AI** app icon will appear on your Android home screen and in your Android App Drawer alongside all your other native apps!

---

### Method 2: Download Ready-to-Install APK via PWABuilder (Instant & Free)
1. Open [PWABuilder.com](https://www.pwabuilder.com/).
2. Enter your live URL: `https://nexus-ai-ecru-nine.vercel.app/`
3. Click **Start**. PWABuilder validates the manifest, service worker, and icons (all 100% green).
4. Click **Package for Stores** -> **Android**.
5. Click **Generate Package**.
6. Download the generated `.apk` (for direct sideloading on your phone) and `.aab` (Android App Bundle for Google Play Store).

---

### Method 3: Command-Line Build with Bubblewrap (Official Google CLI)
To compile the APK and AAB locally using Google's official Bubblewrap tool:

1. Open a terminal in this directory:
   ```bash
   cd "r:\NEXUS AI\nexus-ai\android"
   ```
2. Run the automated build script:
   - On Windows: Double click `build-apk.bat`
   - Or run:
     ```bash
     npx @bubblewrap/cli build
     ```
3. The script will output:
   - `app-release-signed.apk` (Direct install on Android phones)
   - `app-release-bundle.aab` (For uploading to Google Play Console)
