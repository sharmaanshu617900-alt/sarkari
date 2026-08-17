import Link from 'next/link';

export default function CategoryGrid({ stats }) {
  const categories = [
    { id: "job", label: "Sarkari Jobs", icon: "💼", count: stats?.types?.job || 0, href: "/jobs" },
    { id: "admit", label: "Admit Cards", icon: "🎫", count: stats?.types?.admit || 0, href: "/admit-cards" },
    { id: "result", label: "Results", icon: "🏆", count: stats?.types?.result || 0, href: "/results" },
    { id: "answer", label: "Answer Keys", icon: "🔑", count: stats?.types?.answer || 0, href: "/jobs?type=answer" },
    { id: "syllabus", label: "Syllabus", icon: "📚", count: stats?.types?.syllabus || 0, href: "/jobs?type=syllabus" },
  ];

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section-head reveal in">
          <div>
            <span className="eyebrow">Browse by Type</span>
            <h2>Find Your Update Fast</h2>
            <p>From fresh notifications to final results — jump straight to what you need.</p>
          </div>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <Link key={cat.id} href={cat.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="cat-card reveal in">
                <div className="cat-icon">{cat.icon}</div>
                <h3>{cat.label}</h3>
                <p><strong>{cat.count}</strong> updates</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
