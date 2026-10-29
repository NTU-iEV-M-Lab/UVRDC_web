import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { normalizeBase } from './src/lib/paths.ts';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: normalizeBase(process.env.BASE_PATH || '/'),
  resolve: { alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@public-content': fileURLToPath(new URL('./.local/generated/public-content.json', import.meta.url)),
  } },
  build: { sourcemap: false },
});
