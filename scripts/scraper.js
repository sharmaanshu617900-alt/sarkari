/**
 * Sarkari Updates — Government Website Scraper
 * Yeh script government websites se latest notifications uthata hai
 * Phir NVIDIA AI se parse karke data/posts.json mein save karta hai
 * 
 * Usage: node scripts/scraper.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseWithAI } from '../src/lib/nvidia-ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'posts.json');
const ENV_FILE = path.join(__dirname, '..', '.env.local');

// .env.local se API key padhte hain
function loadApiKey() {
  try {
    const env = fs.readFileSync(ENV_FILE, 'utf-8');
    const match = env.match(/NVIDIA_API_KEY=(.+)/);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

// Existing posts load karo
function loadExistingPosts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

// Posts save karo
function savePosts(posts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

// Target government websites / RSS feeds
const SOURCES = [
  // --- National Aggregators (Crucial for small towns/panchayats) ---
  {
    name: 'FreeJobAlert',
    url: 'https://www.freejobalert.com/',
    description: 'Aggregates all small state and district level jobs across India'
  },
  {
    name: 'Jagran Josh',
    url: 'https://www.jagranjosh.com/sarkari-naukri',
    description: 'Sarkari Naukri updates from Jagran, covers local news'
  },
  {
    name: 'Sarkari Result',
    url: 'https://www.sarkariresult.com',
    description: 'Aggregated sarkari job portal'
  },

  // --- Central Govt ---
  {
    name: 'SSC Official',
    url: 'https://ssc.gov.in',
    description: 'Staff Selection Commission - SSC CGL, CHSL, MTS, GD, CPO updates'
  },
  {
    name: 'UPSC Official',
    url: 'https://upsc.gov.in',
    description: 'Union Public Service Commission - CSE, NDA, CDS, CAPF updates'
  },
  {
    name: 'Railway RRB',
    url: 'https://indianrailways.gov.in',
    description: 'Railway Recruitment Board - NTPC, ALP, Group D, RPF updates'
  },
  {
    name: 'IBPS Banking',
    url: 'https://ibps.in',
    description: 'Institute of Banking Personnel Selection - PO, Clerk, SO updates'
  },

  // --- Armed Forces ---
  {
    name: 'Join Indian Army',
    url: 'https://joinindianarmy.nic.in/',
    description: 'Indian Army Recruitment'
  },

  // --- State Boards (Hindi Belt & Majors) ---
  // UP
  {
    name: 'UPPSC',
    url: 'https://uppsc.up.nic.in/',
    description: 'Uttar Pradesh Public Service Commission'
  },
  {
    name: 'UPSSSC',
    url: 'https://upsssc.gov.in/',
    description: 'UP Subordinate Services Selection Commission'
  },
  // Bihar
  {
    name: 'BPSC',
    url: 'https://bpsc.bih.nic.in/',
    description: 'Bihar Public Service Commission'
  },
  {
    name: 'CSBC Bihar Police',
    url: 'https://csbc.bih.nic.in/',
    description: 'Central Selection Board of Constable (Bihar)'
  },
  // MP
  {
    name: 'MPPSC',
    url: 'https://mppsc.mp.gov.in/',
    description: 'Madhya Pradesh Public Service Commission'
  },
  {
    name: 'MP ESB',
    url: 'https://esb.mp.gov.in/',
    description: 'Madhya Pradesh Employees Selection Board (Vyapam)'
  },
  // Rajasthan
  {
    name: 'RPSC',
    url: 'https://rpsc.rajasthan.gov.in/',
    description: 'Rajasthan Public Service Commission'
  },
  {
    name: 'RSMSSB',
    url: 'https://rsmssb.rajasthan.gov.in/',
    description: 'Rajasthan Subordinate and Ministerial Services Selection Board'
  },
  // Delhi & Haryana
  {
    name: 'DSSSB',
    url: 'https://dsssb.delhi.gov.in/',
    description: 'Delhi Subordinate Services Selection Board'
  },
  {
    name: 'HSSC',
    url: 'https://hssc.gov.in/',
    description: 'Haryana Staff Selection Commission'
  }
];

// Website se text content fetch karo
async function fetchWebContent(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 sec timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
      },
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      console.log(`  ⚠️ ${url} returned ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // Basic HTML cleanup — tags hatao, sirf text rakho
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    return text.substring(0, 15000); // AI ke liye 15K chars kaafi hain
  } catch (error) {
    console.log(`  ❌ Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

// Main scraper function
async function runScraper() {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════');
  console.log('   SARKARI UPDATES — AI SCRAPER');
  console.log('═══════════════════════════════════════════');
  console.log(`📅 ${new Date().toLocaleString('en-IN')}`);
  console.log('');

  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ NVIDIA API key nahi mili! .env.local mein NVIDIA_API_KEY set karo.');
    process.exit(1);
  }
  console.log('✅ NVIDIA API key loaded');

  const existingPosts = loadExistingPosts();
  console.log(`📦 Existing posts: ${existingPosts.length}`);
  console.log('');

  let newPostsCount = 0;

  for (const source of SOURCES) {
    console.log(`🔍 Scraping: ${source.name} (${source.url})`);
    
    const content = await fetchWebContent(source.url);
    
    if (!content) {
      console.log(`  ⏭️ Skipped — no content\n`);
      continue;
    }

    console.log(`  📄 Got ${content.length} chars of text`);
    console.log(`  🤖 Sending to NVIDIA AI for parsing...`);

    const parsedPosts = await parseWithAI(content, apiKey);
    
    if (parsedPosts.length === 0) {
      console.log(`  ⚠️ AI ne koi post extract nahi kiya\n`);
      continue;
    }

    console.log(`  ✨ AI extracted ${parsedPosts.length} posts`);

    // Naye posts add karo (duplicate check)
    for (const post of parsedPosts) {
      if (!post.id || !post.title) continue;
      
      const exists = existingPosts.find(p => p.id === post.id);
      if (!exists) {
        existingPosts.unshift({
          ...post,
          createdAt: new Date().toISOString().split('T')[0],
          source: source.name,
        });
        newPostsCount++;
        console.log(`  ✅ NEW: ${post.title}`);
      }
    }
    
    console.log('');
  }

  // Save updated posts
  savePosts(existingPosts);
  
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Done! ${newPostsCount} new posts added.`);
  console.log(`📦 Total posts now: ${existingPosts.length}`);
  console.log('═══════════════════════════════════════════');
  console.log('');
}

// Run!
runScraper().catch(console.error);
