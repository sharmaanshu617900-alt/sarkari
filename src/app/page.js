import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import JobCard from '@/components/JobCard';
import { getAllPosts, getStats } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const allPosts = getAllPosts();
  const stats = getStats();
  const latestJobs = getAllPosts('job').slice(0, 6);
  const latestAdmit = getAllPosts('admit').slice(0, 3);
  const latestResults = getAllPosts('result').slice(0, 3);

  return (
    <>
      <Header />
      <Hero stats={stats} />
      <CategoryGrid stats={stats} />

      {/* ======= LATEST JOBS ======= */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <span className="eyebrow">💼 Fresh from the Source</span>
              <h2>Latest Sarkari Jobs</h2>
              <p>Government job notifications — verified against official websites.</p>
            </div>
            <Link className="link-more" href="/jobs">All jobs →</Link>
          </div>
          <div className="list-grid">
            {latestJobs.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ======= ADMIT CARDS ======= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <span className="eyebrow">🎫 Download Now</span>
              <h2>Latest Admit Cards</h2>
              <p>Download your hall ticket before the exam date passes.</p>
            </div>
            <Link className="link-more" href="/admit-cards">All admit cards →</Link>
          </div>
          <div className="list-grid">
            {latestAdmit.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ======= RESULTS ======= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <span className="eyebrow">🏆 Check Now</span>
              <h2>Latest Results</h2>
              <p>Final results, merit lists and cut-off marks.</p>
            </div>
            <Link className="link-more" href="/results">All results →</Link>
          </div>
          <div className="list-grid">
            {latestResults.map((post) => (
              <JobCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA BAND ======= */}
      <section className="section" style={{ paddingTop: 0 }} id="subscribe">
        <div className="container">
          <div className="cta-band reveal in">
            <h2>Never Miss a Sarkari Deadline Again</h2>
            <p>Get instant WhatsApp & Telegram alerts the moment a new notification is published.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#">✈️ Join Telegram</a>
              <a className="btn btn-ghost" href="#" style={{ background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.35)", color: "#fff" }}>💬 Join WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
