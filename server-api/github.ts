import type { VercelRequest, VercelResponse } from '@vercel/node';

const REPO_API_BASE = 'https://api.github.com/repos/Curious-being99/Kaspa-browser-';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const rawPath = req.query?.path;
  if (Array.isArray(rawPath)) return res.status(400).json({ error: 'Invalid GitHub API path' });
  const subPath = typeof rawPath === 'string' ? rawPath : 'releases/latest';

  if (!['', 'releases/latest', 'commits'].includes(subPath)) {
    return res.status(400).json({ error: 'Unsupported GitHub API path' });
  }

  const params = new URLSearchParams();
  if (subPath === 'commits') {
    const rawPerPage = req.query?.per_page;
    const perPage = typeof rawPerPage === 'string' ? Number(rawPerPage) : 5;
    if (!Number.isInteger(perPage) || perPage < 1 || perPage > 5) {
      return res.status(400).json({ error: 'Invalid per_page value' });
    }
    params.set('per_page', String(perPage));
  } else if (req.query?.per_page !== undefined) {
    return res.status(400).json({ error: 'Query parameters are not supported for this path' });
  }

  const queryString = params.toString();
  const url = `${REPO_API_BASE}${subPath ? `/${subPath}` : ''}${queryString ? `?${queryString}` : ''}`;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'KaspaBrowser-Website'
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(url, { headers });
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Content-Type', 'application/json');

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'GitHub API request failed',
        status: response.status
      });
    }

    return res.status(200).json(await response.json());
  } catch (error) {
    console.error('GitHub Proxy Error:', error);
    return res.status(502).json({ error: 'GitHub API is temporarily unavailable' });
  }
}
