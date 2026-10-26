import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path: githubPath, ...otherQueries } = req.query;
  const subPath = Array.isArray(githubPath) ? githubPath.join('/') : (githubPath || 'releases/latest');
  
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
  const url = `https://api.github.com/repos/Curious-being99/Kaspa-browser-/${subPath}${queryString ? `?${queryString}` : ''}`;

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
    
    // Add cache headers to help with rate limiting and performance
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('GitHub Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
