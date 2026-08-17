"use client";

export default function Hero({ stats }) {
  return (
    <header className="hero">
      <div className="hero-grid-bg"></div>
      <div className="container hero-inner">
        <span className="eyebrow fade-up">🇮🇳 India's Trusted Government Job Portal</span>
        <h1 className="fade-up d1">Every <span className="grad-text">Sarkari Update</span><br />in One Place</h1>
        <p className="fade-up d2">Latest Sarkari Jobs, Admit Cards, Results, Answer Keys & Syllabus for SSC, UPSC, Railway, Banking, Police and Teaching — updated 24/7, powered by AI.</p>

        <form className="search-wrap fade-up d3" action="/jobs" method="GET">
          <div className="search-box">
            <span className="ic">🔍</span>
            <input type="text" name="q" placeholder="Search jobs, exams, admit cards… e.g. SSC CGL, UPSC" aria-label="Search jobs" />
            <button type="submit">Search</button>
          </div>
        </form>
        <div className="popular-tags fade-up d3">
          <span>Popular:</span>
          <a href="/jobs?q=SSC" className="tag-chip">SSC</a>
          <a href="/jobs?q=UPSC" className="tag-chip">UPSC</a>
          <a href="/jobs?q=Railway" className="tag-chip">Railway</a>
          <a href="/jobs?q=Police" className="tag-chip">Police</a>
          <a href="/jobs?q=Banking" className="tag-chip">Banking</a>
        </div>

        <div className="hero-stats">
          <div className="hstat">
            <div className="num">{stats?.totalVacancies?.toLocaleString('en-IN') || '2,00,000'}<em>+</em></div>
            <div className="lbl">Total Vacancies</div>
          </div>
          <div className="hstat">
            <div className="num">{stats?.totalPosts || 20}<em>+</em></div>
            <div className="lbl">Notifications</div>
          </div>
          <div className="hstat">
            <div className="num">{stats?.totalDepts || 10}</div>
            <div className="lbl">Govt Departments</div>
          </div>
          <div className="hstat">
            <div className="num">24<em>/7</em></div>
            <div className="lbl">AI Powered</div>
          </div>
        </div>
      </div>
    </header>
  );
}
