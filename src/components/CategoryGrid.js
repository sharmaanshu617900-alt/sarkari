"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoryGrid({ stats }) {
  const categories = [
    { id: "job", label: "Sarkari Jobs", icon: "💼", count: stats?.types?.job || 0, href: "/jobs" },
    { id: "admit", label: "Admit Cards", icon: "🎫", count: stats?.types?.admit || 0, href: "/admit-cards" },
    { id: "result", label: "Results", icon: "🏆", count: stats?.types?.result || 0, href: "/results" },
    { id: "answer", label: "Answer Keys", icon: "🔑", count: stats?.types?.answer || 0, href: "/jobs?type=answer" },
    { id: "syllabus", label: "Syllabus", icon: "📚", count: stats?.types?.syllabus || 0, href: "/jobs?type=syllabus" },
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="section-head"
        >
          <div>
            <span className="eyebrow">Browse by Type</span>
            <h2>Find Your Update Fast</h2>
            <p>From fresh notifications to final results — jump straight to what you need.</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="cat-grid"
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVars}>
              <Link href={cat.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className="cat-card" style={{ height: '100%' }}>
                  <div className="cat-icon">{cat.icon}</div>
                  <h3>{cat.label}</h3>
                  <p><strong>{cat.count}</strong> updates</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
