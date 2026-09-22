export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
  created_at: string;
  digest?: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  created_at?: string;
  body: string;
  html_url: string;
  prerelease: boolean;
  assets: GitHubAsset[];
  tarball_url: string;
  zipball_url: string;
}

export interface GitHubRepoMeta {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  license: {
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  html_url: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  badge: string;
  iconName: string;
  description: string;
  highlights: string[];
  techDetail: string;
  category: 'core' | 'privacy' | 'blockchain' | 'network';
}
