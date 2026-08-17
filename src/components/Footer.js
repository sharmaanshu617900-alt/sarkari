export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo" style={{ color: "var(--text)" }}>
              <div className="logo-badge" style={{ transform: "scale(0.8)", transformOrigin: "left center" }}>🇮🇳</div>
              <span>Sarkari Updates</span>
            </div>
            <p>India's fastest growing portal for government job updates, admit cards, and results.</p>
          </div>
          <div className="foot-col">
            <h4>Quick Links</h4>
            <a href="/jobs">Latest Jobs</a>
            <a href="/admit-cards">Admit Cards</a>
            <a href="/results">Results</a>
            <a href="#">Syllabus</a>
          </div>
          <div className="foot-col">
            <h4>Popular</h4>
            <a href="#">SSC CGL 2026</a>
            <a href="#">UPSC Civil Services</a>
            <a href="#">Railway NTPC</a>
            <a href="#">UP Police Constable</a>
          </div>
          <div className="foot-col">
            <h4>Legal</h4>
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2026 Sarkari Updates. All rights reserved.</p>
          <p>Not affiliated with the Government of India.</p>
        </div>
      </div>
    </footer>
  );
}
