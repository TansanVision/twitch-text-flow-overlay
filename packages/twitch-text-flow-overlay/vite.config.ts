import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }), 
    viteSingleFile()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
