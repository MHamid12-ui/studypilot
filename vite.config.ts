import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import https from 'https'

// Custom plugin to handle ?import&react syntax (alias to ?react)
const svgImportPlugin = () => ({
  name: 'svg-import-alias',
  resolveId(id: string) {
    if (id.includes('?import&react')) {
      return id.replace('?import&react', '?react');
    }
    return null;
  },
});

// Plugin: proxy /api/flowise-proxy to Flowise Prediction API
const flowiseProxyPlugin = () => ({
  name: 'flowise-proxy',
  configureServer(server) {
    server.middlewares.use('/api/flowise-proxy', async (req, res) => {
      // Only accept POST
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }

      // Collect request body
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        const options = {
          hostname: 'cloud.flowiseai.com',
          port: 443,
          path: '/api/v1/prediction/a56eb5e1-dae2-4b14-896d-ed599739d64d',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
          timeout: 20000,
        };

        const proxyReq = https.request(options, (proxyRes) => {
          let data = '';
          proxyRes.on('data', (chunk) => { data += chunk; });
          proxyRes.on('end', () => {
            res.statusCode = proxyRes.statusCode || 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          });
        });

        proxyReq.on('error', (err) => {
          console.error('Flowise proxy error:', err.message);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'AI Tutor is temporarily unavailable. Please try again.' }));
        });

        proxyReq.on('timeout', () => {
          proxyReq.destroy();
          res.statusCode = 504;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'AI Tutor is temporarily unavailable. Please try again.' }));
        });

        proxyReq.write(body);
        proxyReq.end();
      });
    });
  },
});

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    svgImportPlugin(),
    flowiseProxyPlugin(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        ref: true,
        svgo: false,
      },
      include: '**/*.svg?react',
    }),
  ],
  server: {
    allowedHosts: true as const,
    hmr: false,
  },
}))