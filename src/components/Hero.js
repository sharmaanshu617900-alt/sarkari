"use client";
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

function Counter({ from, to, duration = 2.5 }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => {
    if (to > 1000) return Math.round(latest).toLocaleString('en-IN');
    return Math.round(latest);
  });

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Hero({ stats }) {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <header className="hero">
      <div className="hero-grid-bg"></div>
      <motion.div 
        className="container hero-inner"
        variants={containerVars}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={itemVars} className="eyebrow">🇮🇳 India's Trusted Government Job Portal</motion.span>
        <motion.h1 variants={itemVars}>Every <span className="grad-text">Sarkari Update</span><br />in One Place</motion.h1>
        <motion.p variants={itemVars}>Latest Sarkari Jobs, Admit Cards, Results, Answer Keys & Syllabus for SSC, UPSC, Railway, Banking, Police and Teaching — updated 24/7, powered by AI.</motion.p>

        <motion.form variants={itemVars} className="search-wrap" action="/jobs" method="GET">
          <div className="search-box">
            <span className="ic">🔍</span>
            <input type="text" name="q" placeholder="Search jobs, exams, admit cards… e.g. SSC CGL, UPSC" aria-label="Search jobs" />
            <button type="submit">Search</button>
          </div>
        </motion.form>
        
        <motion.div variants={itemVars} className="popular-tags">
          <span>Popular:</span>
          <a href="/jobs?q=SSC" className="tag-chip">SSC</a>
          <a href="/jobs?q=UPSC" className="tag-chip">UPSC</a>
          <a href="/jobs?q=Railway" className="tag-chip">Railway</a>
          <a href="/jobs?q=Police" className="tag-chip">Police</a>
          <a href="/jobs?q=Banking" className="tag-chip">Banking</a>
        </motion.div>

        <motion.div variants={itemVars} className="hero-stats">
          <div className="hstat">
            <div className="num"><Counter from={0} to={stats?.totalVacancies || 200000} /><em>+</em></div>
            <div className="lbl">Total Vacancies</div>
          </div>
          <div className="hstat">
            <div className="num"><Counter from={0} to={stats?.totalPosts || 20} /><em>+</em></div>
            <div className="lbl">Notifications</div>
          </div>
          <div className="hstat">
            <div className="num"><Counter from={0} to={stats?.totalDepts || 10} /></div>
            <div className="lbl">Govt Departments</div>
          </div>
          <div className="hstat">
            <div className="num">24<em>/7</em></div>
            <div className="lbl">AI Powered</div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}
