/**
 * Sarkari Updates — Cron Job / Automation Script
 * Yeh script har X ghante mein scraper chalata hai
 * 
 * Usage:
 *   node scripts/cron.js              → Ek baar chala ke band
 *   node scripts/cron.js --loop 2     → Har 2 ghante repeat karo
 *   node scripts/cron.js --loop 0.5   → Har 30 min repeat karo
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runScraper() {
  console.log(`\n⏰ [${new Date().toLocaleString('en-IN')}] Running scraper...\n`);
  try {
    execSync(`node ${path.join(__dirname, 'scraper.js')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Scraper failed:', error.message);
  }
}

// Check for --loop flag
const loopArg = process.argv.indexOf('--loop');
if (loopArg !== -1) {
  const hours = parseFloat(process.argv[loopArg + 1]) || 2;
  const ms = hours * 60 * 60 * 1000;
  
  console.log(`🔄 Cron mode: Scraper har ${hours} ghante chalega`);
  console.log(`   Rokne ke liye Ctrl+C dabao\n`);
  
  // Pehle ek baar chala do
  runScraper();
  
  // Phir loop karo
  setInterval(runScraper, ms);
} else {
  // Ek baar chala ke band karo
  runScraper();
}
