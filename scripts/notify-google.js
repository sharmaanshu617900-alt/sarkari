import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account key file
const KEY_FILE = path.join(process.cwd(), 'service-account.json');
const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

async function notifyGoogle() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error(`\n❌ Error: Service account file not found at ${KEY_FILE}`);
    console.error('Please download your JSON key from Google Cloud Console and save it as "service-account.json" in the main folder.\n');
    process.exit(1);
  }

  console.log('🔄 Authenticating with Google...');
  let jwtClient;
  try {
    const keys = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'));
    jwtClient = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );
    await jwtClient.authorize();
    console.log('✅ Authenticated successfully!\n');
  } catch (error) {
    console.error('❌ Authentication failed. Check your service-account.json file.');
    console.error(error);
    process.exit(1);
  }

  // Read posts
  const postsData = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  
  // Sort posts by date, newest first
  postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Take latest 5 posts to avoid quota limits
  const latestPosts = postsData.slice(0, 5);

  console.log('🚀 Submitting latest 5 jobs to Google Indexing API...\n');

  for (const post of latestPosts) {
    const url = `https://www.sarkariupdates.in/jobs/${post.id}`;
    
    try {
      const response = await jwtClient.request({
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          url: url,
          type: 'URL_UPDATED',
        },
      });

      console.log(`✅ Success: ${url}`);
      console.log(`   Time: ${response.data.urlNotificationMetadata.latestUpdate.notifyTime}\n`);
    } catch (error) {
      console.error(`❌ Error submitting ${url}`);
      console.error(error.response ? error.response.data : error.message);
      console.log();
    }
  }
}

notifyGoogle().catch(console.error);
