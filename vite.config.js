import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // When 5173 is already taken (e.g. another `npm run dev`), use the next free port.
    strictPort: false,
    hmr: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
