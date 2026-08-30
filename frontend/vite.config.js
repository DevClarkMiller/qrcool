import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from .env file
export default defineConfig(({ mode }) => {
  // Load env variables based on the mode (development or production)
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env': env.APP_ENV, // Expose environment variables to your app
    },
  };
});