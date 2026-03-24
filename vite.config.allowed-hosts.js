import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Add allowed hosts for development
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://192.168.1.9:3000',
        'http://192.168.1.9:3001',
        'http://qattah.fhidan.com',
        'https://qattah.fhidan.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    // Add allowed hosts for HMR
    hmr: {
      host: 'qattah.fhidan.com',
      protocol: 'ws',
    },
  },
  preview: {
    host: 'qattah.fhidan.com',
    port: 3000,
    // Add allowed hosts for preview
    allowedHosts: [
      'localhost',
      '192.168.1.9',
      'qattah.fhidan.com',
      '*.fhidan.com',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['@tanstack/react-query'],
        },
      },
    },
  },
  // Add base path for domain deployment
  base: '/',
  // Define global constants
  define: {
    'import.meta.env.VITE_ALLOWED_HOSTS': JSON.stringify([
      'localhost',
      '192.168.1.9',
      'qattah.fhidan.com',
      '*.fhidan.com',
    ]),
  },
});