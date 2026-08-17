import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { getAllPosts, searchPosts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || '';
  const typeFilter = resolvedParams?.type || '';
  const deptFilter = resolvedParams?.dept || '';
  const qualFilter = resolvedParams?.qual || '';

  let posts = getAllPosts();

  if (query) {
    posts = searchPosts(query);
  } else {
    if (typeFilter) {
      posts = posts.filter(p => p.type === typeFilter);
    }
    if (deptFilter) {
      posts = posts.filter(p => p.dept.toLowerCase() === deptFilter.toLowerCase());
    }
    if (qualFilter) {
      posts = posts.filter(p => p.category?.some(c => c.toLowerCase().includes(qualFilter.toLowerCase())));
    }
  }

  // Get unique departments for filter dropdown
  const allDepts = Array.from(new Set(getAllPosts().map(p => p.dept)));
  const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'ITI/Diploma', 'Medical', 'Nursing'];

  return (
    <>
      <Header />

      <header className="hero" style={{ padding: "64px 0 32px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1>Browse All <span className="grad-text">Sarkari Updates</span></h1>
          <p style={{ color: "var(--text-2)", maxWidth: "540px", margin: "16px auto 0" }}>
            {query ? `Search results for "${query}"` : 'Jobs, Admit Cards, Results, Answer Keys & Syllabus — all in one place.'}
          </p>
          <form style={{ maxWidth: "500px", margin: "24px auto 0" }} action="/jobs" method="GET">
            <div className="search-box">
              <span className="ic">🔍</span>
              <input type="text" name="q" defaultValue={query} placeholder="Search... e.g. SSC, Railway, Police" aria-label="Search" />
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <a href="/jobs" className={`filter-btn ${!typeFilter && !query && !deptFilter && !qualFilter ? 'active' : ''}`}>All</a>
            <a href="/jobs?type=job" className={`filter-btn ${typeFilter === 'job' ? 'active' : ''}`}>💼 Jobs</a>
            <a href="/jobs?type=answer" className={`filter-btn ${typeFilter === 'answer' ? 'active' : ''}`}>🔑 Answer Keys</a>
            <a href="/jobs?type=syllabus" className={`filter-btn ${typeFilter === 'syllabus' ? 'active' : ''}`}>📚 Syllabus</a>
            
            {/* Advanced Filters */}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <form action="/jobs" method="GET" style={{ display: 'flex', gap: '10px' }}>
                <select name="dept" className="filter-btn" style={{ appearance: 'auto', background: 'var(--bg-2)' }} defaultValue={deptFilter} onChange="this.form.submit()">
                  <option value="">All Departments</option>
                  {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select name="qual" className="filter-btn" style={{ appearance: 'auto', background: 'var(--bg-2)' }} defaultValue={qualFilter} onChange="this.form.submit()">
                  <option value="">All Qualifications</option>
                  {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </form>
            </div>
          </div>

          <div style={{ marginBottom: '24px', color: 'var(--text-3)', fontSize: '14px' }}>
             Showing {posts.length} {posts.length === 1 ? 'result' : 'results'}
          </div>

          {posts.length > 0 ? (
            <div className="list-grid">
              {posts.map((post) => (
                <JobCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="ic">🔍</div>
              <p>Koi result nahi mila. Doosra keyword ya filter try karo.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
