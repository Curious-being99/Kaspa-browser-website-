import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const query = req.query || {};
  const { path: githubPath, ...otherQueries } = query as any;
  const subPath = Array.isArray(githubPath) 
    ? githubPath.join('/') 
    : (typeof githubPath === 'string' ? githubPath : 'releases/latest');
  
  // Reconstruct query string
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(otherQueries)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else {
        queryParams.append(key, value as string);
      }
    }
  }

  const queryString = queryParams.toString();
  const repoBase = 'https://api.github.com/repos/Curious-being99/Kaspa-browser-';
  const url = `${repoBase}${subPath ? `/${subPath}` : ''}${queryString ? `?${queryString}` : ''}`;

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'KaspaBrowser-Website',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'GitHub API error',
        status: response.status,
        message: await response.text()
      });
    }

    const data = await response.json();
    
    // Disable caching entirely so latest release is always immediate and fresh
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('GitHub Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
