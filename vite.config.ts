import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Use relative paths for assets
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'firebase/firestore'] // Add dependencies here if they should not be bundled
    }
  }
});
