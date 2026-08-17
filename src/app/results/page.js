import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { getAllPosts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Results — Sarkari Updates',
  description: 'Check latest government exam results, merit lists and cut-off marks for SSC, UPSC, Railway, Banking and more.',
};

export default function ResultsPage() {
  const results = getAllPosts('result');

  return (
    <>
      <Header />

      <header className="hero" style={{ padding: "64px 0 32px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1>🏆 <span className="grad-text">Results</span></h1>
          <p style={{ color: "var(--text-2)", maxWidth: "500px", margin: "16px auto 0" }}>
            Final results, merit lists and cut-off marks — check now!
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {results.length > 0 ? (
            <div className="list-grid">
              {results.map((post) => (
                <JobCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="ic">🏆</div>
              <p>Abhi koi result declared nahi hua. Jaldi aayega!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
