import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // The third parameter '' ensures we load variables like API_KEY even without VITE_ prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './', // Ensures assets load correctly when opening index.html locally
    define: {
      // Expose the API key safely to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});