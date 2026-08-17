import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

function loadPosts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading posts.json:', err);
    return [];
  }
}

// Sabhi posts lao, optional type filter ke saath
export function getAllPosts(type = null) {
  const posts = loadPosts();
  const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (type) return sorted.filter(p => p.type === type);
  return sorted;
}

// Ek post by ID
export function getPostById(id) {
  const posts = loadPosts();
  return posts.find(p => p.id === id) || null;
}

// Search karo title/org/tags mein
export function searchPosts(query) {
  const posts = loadPosts();
  const q = query.toLowerCase();
  return posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.org.toLowerCase().includes(q) ||
    p.dept.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

// Department wise filter
export function getPostsByDept(dept) {
  const posts = loadPosts();
  return posts.filter(p => p.dept.toLowerCase() === dept.toLowerCase())
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Stats — homepage ke liye
export function getStats() {
  const posts = loadPosts();
  const totalVacancies = posts.reduce((sum, p) => sum + (p.vacancies || 0), 0);
  const depts = new Set(posts.map(p => p.dept));
  return {
    totalPosts: posts.length,
    totalVacancies,
    totalDepts: depts.size,
    types: {
      job: posts.filter(p => p.type === 'job').length,
      admit: posts.filter(p => p.type === 'admit').length,
      result: posts.filter(p => p.type === 'result').length,
      answer: posts.filter(p => p.type === 'answer').length,
      syllabus: posts.filter(p => p.type === 'syllabus').length,
    }
  };
}

// Naya post add karo (scraper/AI use karega)
export function addPost(post) {
  const posts = loadPosts();
  // Duplicate check by id
  const exists = posts.find(p => p.id === post.id);
  if (exists) return false;
  
  posts.unshift({ ...post, createdAt: new Date().toISOString().split('T')[0] });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  return true;
}
