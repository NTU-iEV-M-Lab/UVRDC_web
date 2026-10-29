import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';
const {base}=JSON.parse(readFileSync('.local/generated/build-info.json','utf8'));
const origin=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
export default defineConfig({
 testDir:'tests/browser',fullyParallel:false,workers:1,reporter:'list',
 use:{baseURL:origin,headless:true,trace:'retain-on-failure'},
 webServer:{command:'npm run preview',url:origin+base,reuseExistingServer:false,timeout:30000},
});
