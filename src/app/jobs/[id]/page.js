import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostById, getAllPosts } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EligibilityChecker from '@/components/EligibilityChecker';
import SaveJobBtn from '@/components/SaveJobBtn';

export const dynamic = 'force-dynamic';

const TYPE_LABELS = {
  job: '💼 Sarkari Job',
  admit: '🎫 Admit Card',
  result: '🏆 Result',
  answer: '🔑 Answer Key',
  syllabus: '📚 Syllabus',
};

export default async function JobDetail({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const post = getPostById(id);

  if (!post) return notFound();

  // Related posts (same dept, different id)
  const related = getAllPosts()
    .filter(p => p.dept === post.dept && p.id !== post.id)
    .slice(0, 4);

  const daysLeft = Math.ceil((new Date(post.lastDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Header />

      <div className="container" style={{ padding: "40px 20px" }}>
        <div className="crumbs">
          <Link href="/">Home</Link> › <Link href="/jobs">Updates</Link> › <span>{post.title}</span>
        </div>

        <div style={{ marginTop: "12px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`type-pill type-${post.type}`}>{TYPE_LABELS[post.type]}</span>
        </div>

        <h1 className="detail-title">{post.title}</h1>
        <p className="detail-short">{post.description}</p>

        <div className="info-grid">
          <div className="info-card">
            <div className="ic">🏢</div>
            <div className="k">Organization</div>
            <div className="v">{post.org}</div>
          </div>
          <div className="info-card">
            <div className="ic">🏛️</div>
            <div className="k">Department</div>
            <div className="v">{post.dept}</div>
          </div>
          {post.vacancies > 0 && (
            <div className="info-card">
              <div className="ic">👥</div>
              <div className="k">Vacancies</div>
              <div className="v">{post.vacancies.toLocaleString('en-IN')}</div>
            </div>
          )}
          {post.salary && (
            <div className="info-card">
              <div className="ic">💰</div>
              <div className="k">Salary</div>
              <div className="v">{post.salary}</div>
            </div>
          )}
          <div className="info-card">
            <div className="ic">📅</div>
            <div className="k">Posted Date</div>
            <div className="v">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="info-card">
            <div className="ic">⏰</div>
            <div className="k">Last Date</div>
            <div className="v" style={{ color: daysLeft <= 7 && daysLeft >= 0 ? 'var(--red)' : 'inherit' }}>
              {new Date(post.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              {daysLeft >= 0 && <small style={{ display: 'block', marginTop: '4px' }}>{daysLeft} days remaining</small>}
              {daysLeft < 0 && <small style={{ display: 'block', marginTop: '4px', color: 'var(--red)' }}>Expired</small>}
            </div>
          </div>
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            {post.type === 'job' && <EligibilityChecker post={post} />}

            <div className="detail-section">
              <h3><span className="ic">📝</span> Description</h3>
              <p>{post.description}</p>
            </div>

            <div className="detail-section" style={{ background: 'var(--bg-2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <h3><span className="ic">📚</span> Study Room</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '16px' }}>Prepare for this exam with official materials.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <a href="#" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: '24px' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Official Syllabus</div>
                    <div style={{ fontSize: '12px', color: 'var(--brand)' }}>Download PDF</div>
                  </div>
                </a>
                <a href="#" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: '24px' }}>📝</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Previous Year Papers</div>
                    <div style={{ fontSize: '12px', color: 'var(--brand)' }}>View PYQs</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="detail-section">
              <h3><span className="ic">🏷️</span> Tags</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <Link key={tag} href={`/jobs?q=${encodeURIComponent(tag)}`} className="tag-chip">{tag}</Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="sidebar">
            <div className="apply-box">
              <h4>{post.type === 'job' ? 'Apply for this Job' : post.type === 'admit' ? 'Download Admit Card' : 'Check Result'}</h4>
              <p>Read the official notification carefully before proceeding.</p>
              <a href={post.applyUrl} className="btn btn-green btn-block" target="_blank" rel="noopener noreferrer">
                {post.type === 'job' ? '✅ Apply Online' : post.type === 'admit' ? '📥 Download' : '📋 Check Now'}
              </a>
              <a href={post.officialUrl} className="btn btn-block" style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', marginTop: '8px' }} target="_blank" rel="noopener noreferrer">
                🌐 Official Website
              </a>
              <SaveJobBtn post={post} />
            </div>

            {related.length > 0 && (
              <div className="card" style={{ padding: '0' }}>
                <h4 style={{ padding: '18px 18px 8px', fontSize: '15px', fontWeight: 700 }}>Related Updates</h4>
                <div className="mini-list">
                  {related.map(r => (
                    <Link key={r.id} href={`/jobs/${r.id}`} className="mini-item">
                      <div className="t">{r.title}</div>
                      <div className="d">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {r.dept}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
