"use client";
import Link from 'next/link';
import SaveJobBtn from '@/components/SaveJobBtn';
import { motion } from 'framer-motion';

const TYPE_STYLES = {
  job: { pill: 'type-job', label: '💼 JOB', badgeColor: 'linear-gradient(135deg, #f26b1d, #e0520f)' },
  admit: { pill: 'type-admit', label: '🎫 ADMIT CARD', badgeColor: 'linear-gradient(135deg, #1c4a8c, #12325f)' },
  result: { pill: 'type-result', label: '🏆 RESULT', badgeColor: 'linear-gradient(135deg, #1f9d55, #16a34a)' },
  answer: { pill: 'type-answer', label: '🔑 ANSWER KEY', badgeColor: 'linear-gradient(135deg, #b8860b, #d4a017)' },
  syllabus: { pill: 'type-syllabus', label: '📚 SYLLABUS', badgeColor: 'linear-gradient(135deg, #6f42c1, #a78bfa)' },
};

export default function JobCard({ post }) {
  const style = TYPE_STYLES[post.type] || TYPE_STYLES.job;
  
  const daysLeft = Math.ceil((new Date(post.lastDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft >= 0 && daysLeft <= 7;
  const isExpired = daysLeft < 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Link href={`/jobs/${post.id}`} className="card job-card" style={{ height: '100%' }}>
        <div className="org-badge" style={{ background: style.badgeColor }}>
          {post.dept.substring(0, 3).toUpperCase()}
        </div>
        <div className="job-body">
          <div className="job-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className={`type-pill ${style.pill}`}>{style.label}</span>
              <span className="job-org">{post.org}</span>
            </div>
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
              <SaveJobBtn post={post} minimal={true} />
            </div>
          </div>
          <h3 className="job-title" style={{ paddingRight: '40px' }}>{post.title}</h3>
          <p className="job-desc">{post.description}</p>
          <div className="job-meta">
            {post.vacancies > 0 && (
              <span className="m"><span className="ic">👥</span> <strong>{post.vacancies.toLocaleString('en-IN')}</strong> Vacancies</span>
            )}
            {post.salary && (
              <span className="m"><span className="ic">💰</span> {post.salary}</span>
            )}
            <span className="m">
              <span className="ic">📅</span>
              {isExpired ? (
                <span style={{ color: 'var(--red)', fontWeight: 700 }}>Expired</span>
              ) : isUrgent ? (
                <span className="date-fresh">⚠️ {daysLeft} days left!</span>
              ) : (
                <>Last: {new Date(post.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
              )}
            </span>
          </div>
        </div>
        <div className="chev">›</div>
      </Link>
    </motion.div>
  );
}
