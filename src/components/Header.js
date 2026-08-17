"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TICKER_ITEMS = [
  "SSC CGL 2026 — Apply for 17,727 posts before 10 Sep",
  "RRB NTPC Admit Card Released — Download Now",
  "UP Police Constable Final Result Declared",
  "IBPS PO 2026 Applications Open till 31 Aug",
  "UPSC CSE 2027 Notification Released",
  "Bihar Police Constable — 19,343 Vacancies",
  "MP Police 14,000 Vacancies — Apply Now",
  "SBI Clerk 2026 — 13,735 Posts Open",
];

export default function Header() {
  const [dark, setDark] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/jobs', label: 'All Jobs', icon: '💼' },
    { href: '/admit-cards', label: 'Admit Cards', icon: '🎫' },
    { href: '/results', label: 'Results', icon: '🏆' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/tracker', label: 'Tracker', icon: '📌' },
  ];

  return (
    <>
      {/* ======= TICKER ======= */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* ======= NAVBAR ======= */}
      <div className="nav-wrap">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo">
              <div className="logo-badge">🇮🇳</div>
              <span>
                Sarkari Updates
                <small>Govt Job Portal</small>
              </span>
            </Link>

            <ul className="nav-links">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={pathname === link.href ? 'active' : ''}
                  >
                    <span className="ic">{link.icon}</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <button className="icon-btn" title="Toggle Theme" onClick={toggleTheme}>
                {dark ? '☀️' : '🌙'}
              </button>
              <button className="btn btn-navy menu-btn" onClick={() => setDrawerOpen(true)}>
                ☰ Menu
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* ======= MOBILE DRAWER ======= */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}>
        <div className="drawer-panel" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="logo" style={{ fontSize: '16px' }}>
              <div className="logo-badge" style={{ width: '28px', height: '28px', fontSize: '14px' }}>🇮🇳</div>
              <span>Sarkari Updates</span>
            </div>
            <button className="icon-btn" onClick={() => setDrawerOpen(false)} style={{ width: '32px', height: '32px', fontSize: '14px' }}>✕</button>
          </div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              style={pathname === link.href ? { background: 'rgba(242,107,29,0.1)', color: 'var(--brand)' } : {}}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '8px 0' }} />
          <button onClick={() => { toggleTheme(); setDrawerOpen(false); }} style={{
            padding: '14px 16px', borderRadius: '10px', fontSize: '15.5px', fontWeight: 600,
            color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px',
            background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'
          }}>
            <span>{dark ? '☀️' : '🌙'}</span> {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </>
  );
}
