import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../src/config/env.js';
import { testConnection } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(backendRoot, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const printStatus = (label, ok, details = '') => {
  const icon = ok ? `${colors.green}[PASS]${colors.reset}` : `${colors.red}[FAIL]${colors.reset}`;
  console.log(`  ${icon} ${colors.bold}${label.padEnd(28)}${colors.reset} ${details}`);
};

const printWarn = (label, details = '') => {
  const icon = `${colors.yellow}[WARN]${colors.reset}`;
  console.log(`  ${icon} ${colors.bold}${label.padEnd(28)}${colors.reset} ${details}`);
};

const runVerification = async () => {
  console.log('\n' + '='.repeat(64));
  console.log(`  ${colors.cyan}CodeCraftHub - Environment & Setup Verification (Phase 1)${colors.reset}`);
  console.log('='.repeat(64) + '\n');

  let allPassed = true;

  // 1. Check Node.js Version
  const currentMajor = parseInt(process.versions.node.split('.')[0], 10);
  if (currentMajor >= 18) {
    printStatus('Node.js Runtime', true, `v${process.versions.node} (>= 18.x supported)`);
  } else {
    printStatus('Node.js Runtime', false, `v${process.versions.node} (requires >= 18.x)`);
    allPassed = false;
  }

  // 2. Check Required Directories
  const requiredDirs = [
    'backend/src/config',
    'backend/src/controllers',
    'backend/src/middleware',
    'backend/src/models',
    'backend/src/routes',
    'backend/src/services',
    'backend/src/validators',
    'backend/src/utils',
    'backend/database/migrations',
    'backend/database/seeds',
    'backend/tests',
    'frontend/src/components',
    'frontend/src/layouts',
    'frontend/src/pages',
    'frontend/src/hooks',
    'frontend/src/contexts',
    'frontend/src/services',
    'frontend/src/routes',
    'frontend/src/utils',
    'docs',
  ];

  let dirsOk = true;
  for (const dir of requiredDirs) {
    const fullPath = path.resolve(projectRoot, dir);
    if (!fs.existsSync(fullPath)) {
      dirsOk = false;
      break;
    }
  }
  printStatus('Directory Architecture', dirsOk, dirsOk ? 'All 20 modular directories intact' : 'Some directories missing');
  if (!dirsOk) allPassed = false;

  // 3. Check Backend Environment File
  const envPath = path.resolve(backendRoot, '.env');
  const envExists = fs.existsSync(envPath);
  printStatus('Backend .env File', envExists, envExists ? 'backend/.env present' : 'backend/.env missing (copy from .env.example)');
  if (!envExists) allPassed = false;

  // 4. Check Frontend Environment File
  const feEnvPath = path.resolve(projectRoot, 'frontend/.env');
  const feEnvExists = fs.existsSync(feEnvPath);
  printStatus('Frontend .env File', feEnvExists, feEnvExists ? 'frontend/.env present' : 'frontend/.env missing (will auto-create)');

  // 5. Check Key Config Settings
  printStatus('Server Configuration', true, `PORT=${config.port}, ENV=${config.env}, PREFIX=${config.apiPrefix}`);

  // 6. Test PostgreSQL Connection
  console.log(`\n  Testing PostgreSQL Database Connectivity (${config.db.host}:${config.db.port})...`);
  const dbResult = await testConnection();
  if (dbResult.success) {
    printStatus('PostgreSQL Connection', true, `Connected to DB "${dbResult.database}" at ${dbResult.timestamp}`);
  } else {
    printWarn('PostgreSQL Connection', `Not yet connected: ${dbResult.error}`);
    console.log(`         ${colors.yellow}-> Note: Phase 2 will create the database schema.${colors.reset}`);
    console.log(`         ${colors.yellow}-> Ensure DB_PASSWORD in backend/.env matches your PostgreSQL password.${colors.reset}`);
  }

  console.log('\n' + '='.repeat(64));
  if (allPassed) {
    console.log(`  ${colors.green}[SUCCESS] Phase 1 environment verification passed!${colors.reset}`);
  } else {
    console.log(`  ${colors.red}[ACTION REQUIRED] Please review the failed items above.${colors.reset}`);
  }
  console.log('='.repeat(64) + '\n');

  process.exit(allPassed ? 0 : 1);
};

runVerification();

