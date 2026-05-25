import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables from .env file
config();


export default defineConfig({
  testDir: './tests',
  timeout: 6000000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: process.env.API_BASE_URL || 'https://api.p-stageenv.xyz',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
    testIgnore: [
    '**/utils/**',
    '**/payloads/**',
    '**/setup/**'
  ],
  
projects: [
  {
    name: 'setup',
    testMatch: '**/*.setup.js',
  },
  {
    name: 'ride-flow',
    dependencies: ['setup'],
    testMatch: '**/!(*.setup).js',  // All .js files except .setup.js
  },
],
});