"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrackerPage() {
  const [jobs, setJobs] = useState([]);
  const [mounted, setMounted] = useState(false);

  const loadJobs = () => {
    const saved = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    setJobs(saved);
  };

  useEffect(() => {
    loadJobs();
    setMounted(true);
    window.addEventListener('storage', loadJobs);
    return () => window.removeEventListener('storage', loadJobs);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = jobs.map(j => j.id === id ? { ...j, status: newStatus } : j);
    setJobs(updated);
    localStorage.setItem('saved_jobs', JSON.stringify(updated));
  };

  const removeJob = (id) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem('saved_jobs', JSON.stringify(updated));
  };

  const columns = [
    { id: 'saved', label: '📌 Saved to Apply', color: 'var(--text-3)' },
    { id: 'applied', label: '📝 Applied', color: 'var(--brand)' },
    { id: 'admit_out', label: '🎫 Admit Card Out', color: 'var(--navy-2)' },
    { id: 'result_out', label: '🏆 Result Declared', color: 'var(--green)' }
  ];

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      <Header />

      <header className="hero" style={{ padding: "64px 0 32px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1>Application <span className="grad-text">Tracker</span></h1>
          <p style={{ color: "var(--text-2)", maxWidth: "500px", margin: "16px auto 0" }}>
            Track the jobs you've applied for. Never miss an admit card or result update!
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
        <div className="container">
          
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="ic">📌</div>
              <h3>No Jobs Saved Yet</h3>
              <p>Browse jobs and click the "Save to Tracker" button to add them here.</p>
              <Link href="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div className="kanban-board" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'start'
            }}>
              {columns.map(col => {
                const colJobs = jobs.filter(j => j.status === col.id);
                return (
                  <div key={col.id} className="kanban-col" style={{ 
                    background: 'var(--bg-2)', 
                    borderRadius: '16px', 
                    padding: '20px',
                    borderTop: `4px solid ${col.color}`
                  }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      {col.label}
                      <span style={{ background: 'var(--line)', padding: '2px 8px', borderRadius: '99px', fontSize: '12px' }}>
                        {colJobs.length}
                      </span>
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {colJobs.length === 0 ? (
                        <div style={{ color: 'var(--text-3)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No jobs here</div>
                      ) : (
                        colJobs.map(job => (
                          <div key={job.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                              <Link href={`/jobs/${job.id}`} style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'none', color: 'var(--text)' }}>
                                {job.title}
                              </Link>
                              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{job.org}</div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <select 
                                value={job.status} 
                                onChange={(e) => updateStatus(job.id, e.target.value)}
                                style={{ 
                                  flex: 1, padding: '6px', fontSize: '12px', 
                                  borderRadius: '6px', border: '1px solid var(--line)',
                                  background: 'var(--bg)'
                                }}
                              >
                                {columns.map(c => <option key={c.id} value={c.id}>{c.label.split(' ')[1]}</option>)}
                              </select>
                              <button 
                                onClick={() => removeJob(job.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '16px' }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
