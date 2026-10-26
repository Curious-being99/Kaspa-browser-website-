import express from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  // GitHub API Proxy
  app.get('/api/github/*', async (req, res) => {
    const targetUrl = `https://api.github.com/${req.params[0]}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
    try {
      const response = await fetch(targetUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'GitHub API fetch failed' });
    }
  });

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

startServer();
