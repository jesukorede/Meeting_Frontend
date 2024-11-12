// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/Meeting_Frontend/', // Set to your GitHub repo name
  plugins: [react()],
});