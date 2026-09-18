# KaspaBrowser Web Application

> **Official Web Presentation & Landing Platform for KaspaBrowser**

This repository contains the web application and release tracking portal for **KaspaBrowser** — an open-source Android web browser engineered for the Kaspa BlockDAG network.

It automatically syncs with GitHub Releases to provide direct APK downloads, live version write-ups, SHA-256 verification hashes, and interactive feature explorations.

---

## 🚀 Features

* **Live GitHub Releases Sync**: Automatically fetches and presents the latest release APK, file size, version tag, and release notes directly from GitHub APIs.
* **Auto-Navigating Feature Card**: Interactive preview showcasing native protocol routing (`kas://`), QUIC transport, and privacy sandbox architecture.
* **Sideloading Instructions**: Step-by-step setup guide for installing signed APKs on Android 8.0 through Android 16.
* **Responsive Dark Minimal UI**: Crafted with React 18, Tailwind CSS, and Lucide icons.

---

## 🛠️ Local Development

Install dependencies and start the Vite local development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Build for production deployment:

```bash
# Build static assets to dist/
npm run build
```

---

## 🌐 Deploying to Vercel, 4Everland, or Netlify

This is a standard React + Vite Single Page Application (SPA). You can deploy it instantly by connecting your GitHub repository to **Vercel**, **4Everland**, **Netlify**, or **GitHub Pages**.

### Configuration Settings:
* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Node Version**: `18.x` or `20.x`

---

## 📄 License

KaspaBrowser is open-source software licensed under the [Apache License 2.0](LICENSE).
