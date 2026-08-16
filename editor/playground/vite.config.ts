import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point @imksh/editor to the local source so no build step is needed
      '@imksh/editor': path.resolve(__dirname, '../src/editor/index.ts'),
    },
  },
});
