import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5245',
        changeOrigin: true,
        secure: false, // Crucial: ignores .NET's potential HTTP-to-HTTPS redirect
      }
    }
  }
});