import { defineConfig, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'


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
// DISABLED — Flowise cloud endpoint is unreachable from this environment.
// Will be re-enabled once the external Flowise host becomes available again.
// See flowiseProxyPlugin definition below this config for the full implementation.
const flowiseProxyPlugin = () => ({
  name: 'flowise-proxy',
  configureServer(_server: ViteDevServer) {
    // Plugin disabled to prevent dev server crashes (socket hang up / ERR_HTTP_HEADERS_SENT)
    console.warn('[flowise-proxy] Disabled — AI Tutor proxying is unavailable.');
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