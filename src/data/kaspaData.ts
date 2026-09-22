import { GitHubRelease, GitHubRepoMeta, FeatureItem } from '../types';

export const GITHUB_REPO_URL = 'https://github.com/Curious-being99/Kaspa-browser-';
export const GITHUB_RELEASES_URL = 'https://github.com/Curious-being99/Kaspa-browser-/releases';
export const GITHUB_API_BASE = 'https://api.github.com/repos/Curious-being99/Kaspa-browser-';

// Static fallback in case GitHub API rate limit is exceeded - initialized with absolute latest release
export const DEFAULT_LATEST_RELEASE: GitHubRelease = {
  id: 392297373,
  tag_name: 'v1.0.20260920031739',
  name: 'KaspaBrowser v1.0.20260920031739',
  published_at: '2026-09-20T03:17:44Z',
  html_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/tag/v1.0.20260920031739',
  prerelease: false,
  body: `**Full Changelog**: https://github.com/Curious-being99/Kaspa-browser-/compare/v1.0.20260919171517...v1.0.20260920031739\n\nbuild: remove unused Google Services and Firebase code\nClean up the build configuration by removing the Google Services plugin and unused dependency declarations.`,
  tarball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/tarball/v1.0.20260920031739',
  zipball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/zipball/v1.0.20260920031739',
  assets: [
    {
      id: 576006705,
      name: 'KaspaBrowser-release-signed.apk',
      size: 21183635,
      download_count: 12,
      content_type: 'application/vnd.android.package-archive',
      created_at: '2026-09-20T03:17:42Z',
      browser_download_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/download/v1.0.20260920031739/KaspaBrowser-release-signed.apk',
      digest: 'sha256:1a4e719c039e5d7a4d86e959810c67d4b39ebc02251ffc7c7c6b54019bcbb302'
    }
  ]
};

export const FALLBACK_RELEASES: GitHubRelease[] = [
  DEFAULT_LATEST_RELEASE,
  {
    id: 391695427,
    tag_name: 'v1.0.20260918183336',
    name: 'KaspaBrowser v1.0.20260918183336',
    published_at: '2026-09-18T18:33:41Z',
    html_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/tag/v1.0.20260918183336',
    prerelease: false,
    body: `**Full Changelog**: https://github.com/Curious-being99/Kaspa-browser-/compare/v1.0.20260918122337...v1.0.20260918183336\n\nfix: improve reader mode stability and add theme persistence\n- Encode JS extraction output to prevent parsing failures in Android.\n- Implement SharedPreference persistence for browser theme settings.\n- Add Palette icon for theme customization UI.`,
    tarball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/tarball/v1.0.20260918183336',
    zipball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/zipball/v1.0.20260918183336',
    assets: [
      {
        id: 573209817,
        name: 'KaspaBrowser-release-signed.apk',
        size: 23934207,
        download_count: 4,
        content_type: 'application/vnd.android.package-archive',
        created_at: '2026-09-18T18:33:40Z',
        browser_download_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/download/v1.0.20260918183336/KaspaBrowser-release-signed.apk',
        digest: 'sha256:444c6368931c6d303f991ecc8194b9e0753c0d4010691bc7328486b364ad980f'
      }
    ]
  }
];

export const FALLBACK_REPO_META: GitHubRepoMeta = {
  name: 'Kaspa-browser-',
  full_name: 'Curious-being99/Kaspa-browser-',
  description: 'Kaspa Browser is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem. Built with Kotlin and Jetpack Compose (Material 3), it unifies standard web browsing, decentralized peer-to-peer mesh discovery, cryptographic identity management, on-device local node hosting, and high-performance Web3 browsing into a fast, privacy-first mobile client.',
  stargazers_count: 28,
  forks_count: 6,
  open_issues_count: 0,
  updated_at: '2026-09-18T12:33:40Z',
  license: {
    name: 'Apache License 2.0',
    spdx_id: 'Apache-2.0',
    url: 'https://api.github.com/licenses/apache-2.0'
  },
  html_url: GITHUB_REPO_URL
};

export const FEATURES: FeatureItem[] = [
  {
    id: 'dual-stack-engine',
    title: 'Dual-Stack Protocol Interception Engine',
    badge: 'Core Engine',
    iconName: 'Globe',
    category: 'core',
    description: 'Android System WebView coupled with low-level protocol interception for custom network routing.',
    highlights: [
      'Custom URL scheme interception for decentralized protocols',
      'Direct HTTP/3 and Cronet zero round-trip transport pipeline',
      'Local SHA-256 asset integrity verification',
      'Room database caching with encrypted local storage'
    ],
    techDetail: 'WebViewClient interceptor + Chromium network stack'
  },
  {
    id: 'traffic-audit-privacy',
    title: 'Privacy Shield & Traffic Security',
    badge: 'Security',
    iconName: 'ShieldCheck',
    category: 'privacy',
    description: 'Enforces strict encrypted transport, strips intrusive trackers, and protects on-device browsing history.',
    highlights: [
      'Automatic HTTPS-only upgrade for unencrypted connections',
      'Tracker and advertisement script blocking engine',
      'Incognito mode with sandbox state isolation',
      'One-tap purge for cookies, web storage, and cache'
    ],
    techDetail: 'Zero telemetry | Room SQLite + CookieManager Purge'
  },
  {
    id: 'quic-http3-pipeline',
    title: 'HTTP/3 & QUIC 0-RTT Network Pipeline',
    badge: 'High Speed',
    iconName: 'Zap',
    category: 'network',
    description: 'Next-generation network transport delivering zero head-of-line blocking and instant handshakes.',
    highlights: [
      'UDP-based multiplexed streams preventing connection stalls',
      '0-RTT resumption for previously visited destinations',
      'BBR congestion control optimized for mobile cellular data',
      'TLS 1.3 encryption with forward secrecy'
    ],
    techDetail: 'Cronet / QUIC UDP transport layer'
  },
  {
    id: 'kaspa-blockdag-web3',
    title: 'Kaspa BlockDAG & Web3 Gateway',
    badge: 'Web3 Gateway',
    iconName: 'Cpu',
    category: 'blockchain',
    description: 'Decentralized BlockDAG gateway and high-performance Web3 browsing connecting to peer-to-peer networks.',
    highlights: [
      'Direct integration with Kaspa GHOSTDAG network nodes',
      'Custom URL scheme handling for decentralized protocols',
      'Cryptographic identity management via Android Keystore',
      'High-performance decentralized Web3 application browsing'
    ],
    techDetail: 'Kotlin 2.0 + Jetpack Compose Material 3'
  }
];

export const TECH_SPECS = [
  { label: 'Platform', value: 'Android (Native Kotlin)' },
  { label: 'Language', value: 'Kotlin 2.0+ (100% Native)' },
  { label: 'UI Framework', value: 'Jetpack Compose (Material 3)' },
  { label: 'Target Android OS', value: 'Android 16 (API 36)' },
  { label: 'Minimum Android OS', value: 'Android 8.0 (API 26)' },
  { label: 'Local Persistence', value: 'AndroidX Room (SQLite)' },
  { label: 'Network Stack', value: 'OkHttp3, Cronet (HTTP/3 QUIC)' },
  { label: 'Cryptography', value: 'SHA-256, Android Keystore' },
  { label: 'License', value: 'Apache 2.0 (Open Source)' }
];

export const FAQS = [
  {
    q: 'What is KaspaBrowser and what are its core features?',
    a: 'Kaspa Browser is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem. Built with Kotlin and Jetpack Compose (Material 3), it unifies standard web browsing, decentralized peer-to-peer mesh discovery, cryptographic identity management, on-device local node hosting, and high-performance Web3 browsing into a fast, privacy-first mobile client.'
  },
  {
    q: 'What makes KaspaBrowser unique for decentralized browsing?',
    a: 'KaspaBrowser unifies standard web browsing with peer-to-peer mesh discovery, cryptographic identity management, on-device local node hosting, and high-performance Web3 browsing into a fast, privacy-first mobile client built natively with Jetpack Compose.'
  },
  {
    q: 'How does the download button work?',
    a: 'Clicking the download button directly fetches the official signed APK (KaspaBrowser-release-signed.apk) compiled by GitHub Actions CI/CD from the official repository releases stream.'
  },
  {
    q: 'How do I install the signed APK on Android?',
    a: 'After downloading KaspaBrowser-release-signed.apk, open the file on your Android device. If prompted, toggle "Allow from this source" in Settings > Install Unknown Apps, then tap Install.'
  },
  {
    q: 'Is KaspaBrowser completely open source?',
    a: 'Yes, KaspaBrowser is 100% open source under the Apache 2.0 License. You can inspect the source code, review build scripts, and verify SHA-256 release checksums directly on GitHub.'
  }
];

