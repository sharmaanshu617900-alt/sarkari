"use client";
import { useState, useEffect } from 'react';

export default function SaveJobBtn({ post, minimal = false }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    if (savedJobs.some(j => j.id === post.id)) {
      setSaved(true);
    }
  }, [post.id]);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents link clicks if inside a JobCard
    
    let savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    
    if (saved) {
      savedJobs = savedJobs.filter(j => j.id !== post.id);
      setSaved(false);
    } else {
      // Store basic post info + default status 'saved'
      savedJobs.push({ 
        id: post.id, 
        title: post.title,
        org: post.org,
        type: post.type,
        status: 'saved', // can be: saved, applied, admit_out, result_out
        savedAt: new Date().toISOString()
      });
      setSaved(true);
    }
    
    localStorage.setItem('saved_jobs', JSON.stringify(savedJobs));
    // Dispatch event so Tracker page can update in real-time if open
    window.dispatchEvent(new Event('storage'));
  };

  if (minimal) {
    return (
      <button 
        onClick={toggleSave}
        className={`icon-btn ${saved ? 'active' : ''}`}
        style={{ 
          background: saved ? 'var(--brand)' : 'var(--bg-2)', 
          color: saved ? '#fff' : 'var(--text)',
          border: '1px solid var(--line)',
          width: '36px', height: '36px',
          borderRadius: '50%'
        }}
        title={saved ? "Remove from Tracker" : "Save to Tracker"}
      >
        {saved ? '★' : '☆'}
      </button>
    );
  }

  return (
    <button 
      onClick={toggleSave}
      className="btn btn-block"
      style={{ 
        background: saved ? 'var(--brand)' : 'transparent',
        color: saved ? '#fff' : 'var(--brand)',
        border: '1.5px solid var(--brand)',
        marginTop: '8px'
      }}
    >
      {saved ? '★ Saved to Tracker' : '☆ Save to Tracker'}
    </button>
  );
}
