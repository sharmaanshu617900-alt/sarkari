import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { getAllPosts } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admit Cards — Sarkari Updates',
  description: 'Download latest admit cards for SSC, UPSC, Railway, Banking, Police and other government exams.',
};

export default function AdmitCardsPage() {
  const admitCards = getAllPosts('admit');

  return (
    <>
      <Header />

      <header className="hero" style={{ padding: "64px 0 32px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1>🎫 <span className="grad-text">Admit Cards</span></h1>
          <p style={{ color: "var(--text-2)", maxWidth: "500px", margin: "16px auto 0" }}>
            Download your hall ticket / admit card. Don't miss your exam!
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {admitCards.length > 0 ? (
            <div className="list-grid">
              {admitCards.map((post) => (
                <JobCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="ic">🎫</div>
              <p>Abhi koi admit card available nahi hai. Jaldi aayega!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
