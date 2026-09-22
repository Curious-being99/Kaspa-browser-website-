# Kaspa Browser

> **Privacy-First, Decentralized Android Web Browser & Web3 Gateway**

Kaspa Browser is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem.

Built with **Kotlin** and **Jetpack Compose (Material 3)**, it unifies standard web browsing, decentralized peer-to-peer mesh discovery, cryptographic identity management, on-device local node hosting, and high-performance Web3 browsing into a fast, privacy-first mobile client.

---

## 📱 Android Application Overview

* **Platform:** Android (Native Kotlin)
* **Language:** Kotlin 2.0+ (100% Native)
* **UI Framework:** Jetpack Compose (Material 3)
* **Target Android OS:** Android 16 (API 36) | Min SDK: Android 8.0 (API 26)
* **Local Persistence:** AndroidX Room (SQLite)
* **Network Stack:** OkHttp3, Cronet (HTTP/3 QUIC with 0-RTT)
* **Cryptography:** SHA-256, Android Keystore, Secp256k1
* **License:** Apache License 2.0 (Open Source)
* **Repository:** [https://github.com/Curious-being99/Kaspa-browser-](https://github.com/Curious-being99/Kaspa-browser-)

---

## 🚀 Key Features

### 1. Native Kaspa BlockDAG (KAS) Integration
* Direct BlockDAG network queries with ultra-fast confirmation awareness.
* Native custom URI protocol scheme handling (`kaspa://`, `kas://`).
* Cryptographic identity management backed by hardware-isolated Android Keystore.

### 2. Decentralized Peer-to-Peer Mesh Discovery
* P2P mesh radar and decentralized network node discovery.
* Support for on-device lightweight node hosting.

### 3. HTTP/3 & QUIC 0-RTT Acceleration
* Next-generation transport stack powered by Cronet/OkHttp3.
* Multiplexed streams with zero head-of-line blocking and instant connection resumption.

### 4. Hardware-Isolated Privacy Shield
* Real-time tracker blocking, script sandbox isolation, and cookie containerization.
* Strict zero-telemetry and zero-log architecture.

---

## 🌐 Official Web Portal & Release Tracker (`kaspabrowser.xyz`)

This repository also contains the official web presentation platform and automated release distributor:

* **Live GitHub Release Synchronization:** Automatically fetches and serves the latest signed APK binaries (`KaspaBrowser-release-signed.apk`), release notes, file sizes, and verification digests.
* **Dynamic QR Code Scanner:** Instant on-screen QR code generator for direct mobile APK installation.
* **Integrity & Verification:** Display of SHA-256 binary checksums for cryptographic authenticity verification.
* **Security Hardening:** Compliant with RFC 9116 (`/.well-known/security.txt`), Schema.org `SoftwareApplication` JSON-LD, and search indexation directives.

---

## 🛠️ Web Portal Development & Build

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build production bundle to /dist
npm run build
```

---

## 📄 License

KaspaBrowser is free, open-source software licensed under the **[Apache License 2.0](LICENSE)**.

