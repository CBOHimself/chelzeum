import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite does not full-reload the browser when files under `public/` change (they are not
 * part of the module graph). This plugin fixes that so e.g. `public/data/artworks.json`
 * updates show up without a manual refresh.
 */
function publicDirFullReload() {
  return {
    name: 'public-dir-full-reload',
    configureServer(server) {
      const pub = server.config.publicDir;
      if (!pub) return;
      const prefix = normalizePath(pub);
      const isUnderPublic = (file) => {
        const n = normalizePath(file);
        return n === prefix || n.startsWith(`${prefix}/`);
      };
      const reload = (file) => {
        if (isUnderPublic(file)) {
          server.hot.send({ type: 'full-reload', path: '*' });
        }
      };
      server.watcher.on('change', reload);
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
    },
  };
}

// Use this dev server for live updates — not the VS Code "Live Server" extension, which
// cannot compile JSX/CSS or connect to Vite HMR (`npm run dev`).

export default defineConfig({
  plugins: [react(), publicDirFullReload()],
  server: {
    port: 5173,
    strictPort: false,
    hmr: true,
    watch: {
      usePolling: true,
      interval: 200,
      // Safer on macOS / cloud-synced folders; waits for save-then-rename writes
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
    },
  },
});
