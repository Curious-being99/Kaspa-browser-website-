import { GitHubRelease, GitHubRepoMeta, FeatureItem } from '../types';

export const GITHUB_REPO_URL = 'https://github.com/Curious-being99/Kaspa-browser-';
export const GITHUB_RELEASES_URL = 'https://github.com/Curious-being99/Kaspa-browser-/releases';
export const GITHUB_API_BASE = 'https://api.github.com/repos/Curious-being99/Kaspa-browser-';

// Static fallback in case GitHub API rate limit is exceeded - initialized with absolute latest release
export const DEFAULT_LATEST_RELEASE: GitHubRelease = {
  id: 393718513,
  tag_name: 'v1.0.20260922123310',
  name: 'KaspaBrowser v1.0.20260922123310',
  published_at: '2026-09-22T12:33:15Z',
  html_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/tag/v1.0.20260922123310',
  prerelease: false,
  body: `**Full Changelog**: https://github.com/Curious-being99/Kaspa-browser-/compare/v1.0.20260922001736...v1.0.20260922123310\n\nrefactor: improve Cronet configuration and UX\n- Add resilient Cronet provider initialization with fallback logging\n- Integrate download management features into top-level navigation\n- Refactor history item display for cleaner presentation`,
  tarball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/tarball/v1.0.20260922123310',
  zipball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/zipball/v1.0.20260922123310',
  assets: [
    {
      id: 578685194,
      name: 'KaspaBrowser-release-signed.apk',
      size: 21068947,
      download_count: 5,
      content_type: 'application/vnd.android.package-archive',
      created_at: '2026-09-22T12:33:14Z',
      browser_download_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/download/v1.0.20260922123310/KaspaBrowser-release-signed.apk',
      digest: 'sha256:96229c614e43cda4e7397c8b52ca186cdd72974b4ce39441d8024e9c76cbf91e'
    }
  ]
};

export const FALLBACK_RELEASES: GitHubRelease[] = [
  DEFAULT_LATEST_RELEASE,
  {
    id: 393374530,
    tag_name: 'v1.0.20260922001736',
    name: 'KaspaBrowser v1.0.20260922001736',
    published_at: '2026-09-22T00:17:41Z',
    html_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/tag/v1.0.20260922001736',
    prerelease: false,
    body: `**Full Changelog**: https://github.com/Curious-being99/Kaspa-browser-/compare/v1.0.20260921231702...v1.0.20260922001736\n\nrefactor: simplify network and address logic\n- Simplify Cronet engine initialization and network interceptor logic\n- Enhance address bar URL parsing and validation`,
    tarball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/tarball/v1.0.20260922001736',
    zipball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/zipball/v1.0.20260922001736',
    assets: [
      {
        id: 578291042,
        name: 'KaspaBrowser-release-signed.apk',
        size: 21200019,
        download_count: 8,
        content_type: 'application/vnd.android.package-archive',
        created_at: '2026-09-22T00:17:40Z',
        browser_download_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/download/v1.0.20260922001736/KaspaBrowser-release-signed.apk',
        digest: 'sha256:0dad3c2f3333479154271eeae2444e832910689a50cab3bf8ce3b9366c384421'
      }
    ]
  },
  {
    id: 392710272,
    tag_name: 'v1.0.20260921051514',
    name: 'KaspaBrowser v1.0.20260921051514',
    published_at: '2026-09-21T05:15:19Z',
    html_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/tag/v1.0.20260921051514',
    prerelease: false,
    body: `**Full Changelog**: https://github.com/Curious-being99/Kaspa-browser-/compare/v1.0.20260921043834...v1.0.20260921051514\n\nfeat: implement pull-to-refresh for browser UI\n- Add vertical drag gesture for page reload\n- Enhance network connectivity handling`,
    tarball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/tarball/v1.0.20260921051514',
    zipball_url: 'https://api.github.com/repos/Curious-being99/Kaspa-browser-/zipball/v1.0.20260921051514',
    assets: [
      {
        id: 576829104,
        name: 'KaspaBrowser-release-signed.apk',
        size: 21183635,
        download_count: 9,
        content_type: 'application/vnd.android.package-archive',
        created_at: '2026-09-21T05:15:18Z',
        browser_download_url: 'https://github.com/Curious-being99/Kaspa-browser-/releases/download/v1.0.20260921051514/KaspaBrowser-release-signed.apk',
        digest: 'sha256:29042be8d2cfb127d6e4116b48574131f5a85019c11514a8f2d87bd453a64f2e'
      }
    ]
  },
  {
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

