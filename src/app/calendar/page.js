import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Exam Calendar — Sarkari Updates',
  description: 'Upcoming government exam dates, last dates to apply, and admit card release dates.',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarPage() {
  const allPosts = getAllPosts();
  
  // Future dates wale posts (last date abhi nahi guzri)
  const upcoming = allPosts
    .filter(p => new Date(p.lastDate) >= new Date())
    .sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));

  // Month wise group karo
  const byMonth = {};
  upcoming.forEach(p => {
    const d = new Date(p.lastDate);
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(p);
  });

  const TYPE_COLORS = {
    job: 'var(--brand)',
    admit: 'var(--navy-2)',
    result: 'var(--green)',
    answer: 'var(--gold)',
    syllabus: '#6f42c1',
  };

  return (
    <>
      <Header />

      <header className="hero" style={{ padding: "64px 0 32px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1>📅 <span className="grad-text">Exam Calendar</span></h1>
          <p style={{ color: "var(--text-2)", maxWidth: "500px", margin: "16px auto 0" }}>
            Upcoming deadlines — never miss an important date!
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          {Object.keys(byMonth).length > 0 ? (
            Object.entries(byMonth).map(([month, posts]) => (
              <div key={month} style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'var(--brand-grad)', color: '#fff', padding: '4px 14px', borderRadius: '999px', fontSize: '14px' }}>
                    {month}
                  </span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {posts.map(p => {
                    const d = new Date(p.lastDate);
                    const daysLeft = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <Link key={p.id} href={`/jobs/${p.id}`} className="card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                          minWidth: '52px', textAlign: 'center', padding: '8px 0',
                          borderRadius: '12px', background: 'rgba(242,107,29,0.08)',
                        }}>
                          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand)' }}>{d.getDate()}</div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>{MONTHS[d.getMonth()]}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                              width: '8px', height: '8px', borderRadius: '50%',
                              background: TYPE_COLORS[p.type] || 'var(--brand)',
                              flexShrink: 0
                            }}></span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>
                              {p.type === 'job' ? 'Last Date to Apply' : p.type === 'admit' ? 'Exam Date' : 'Check Before'}
                            </span>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3 }}>{p.title}</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-3)', marginTop: '2px' }}>{p.org}</div>
                        </div>
                        <div style={{
                          padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                          background: daysLeft <= 3 ? 'rgba(224,49,49,0.12)' : daysLeft <= 7 ? 'rgba(242,107,29,0.12)' : 'rgba(31,157,85,0.1)',
                          color: daysLeft <= 3 ? 'var(--red)' : daysLeft <= 7 ? 'var(--brand)' : 'var(--green)',
                          whiteSpace: 'nowrap',
                        }}>
                          {daysLeft} days
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="ic">📅</div>
              <p>Koi upcoming deadline nahi hai abhi.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
