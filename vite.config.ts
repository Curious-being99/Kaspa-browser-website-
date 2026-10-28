import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-handler',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/')) {
              const urlObj = new URL(req.url, 'http://localhost:3000');
              const pathWithoutApi = urlObj.pathname.replace(/^\/api\/?/, '');
              const pathParts = pathWithoutApi.split('/').filter(Boolean);
              const baseRoute = pathParts[0] || '';
              const extraPath = pathParts.slice(1).join('/');
              const apiPath = path.join(__dirname, 'server-api', `${baseRoute}.ts`);
              
              if (fs.existsSync(apiPath)) {
                try {
                  const module = await server.ssrLoadModule(`/server-api/${baseRoute}.ts`);
                  const handler = module.default;
                  
                  if (typeof handler === 'function') {
                    // Populate query params on req object for Vercel/Express handler compatibility
                    const query: Record<string, string> = {};
                    urlObj.searchParams.forEach((v, k) => { query[k] = v; });
                    if (extraPath && !query.path) {
                      query.path = extraPath;
                    }
                    (req as any).query = query;

                    // Inject Vercel/Express-like methods into res
                    (res as any).status = function(code: number) {
                      this.statusCode = code;
                      return this;
                    };
                    (res as any).json = function(data: any) {
                      this.setHeader('Content-Type', 'application/json');
                      this.end(JSON.stringify(data));
                      return this;
                    };
                    
                    await handler(req, res);
                    // Crucially, DO NOT call next() after handler execution
                    return;
                  }
                } catch (e: any) {
                  console.error('API execution error:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                  return;
                }
              }
            }
            next();
          });
        }
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo-square.png', 'kaspa-logo.svg'],
        manifest: {
          id: '/',
          name: 'Kaspa Browser',
          short_name: 'KaspaBrowser',
          description: 'A privacy-first, decentralized Android web browser and Web3 gateway for the Kaspa ecosystem.',
          theme_color: '#0C0D10',
          background_color: '#0C0D10',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/logo-square.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/logo-square.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/logo-square.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.coingecko\.com\/api\/v3\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 5, // 5 mins
                },
              },
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
