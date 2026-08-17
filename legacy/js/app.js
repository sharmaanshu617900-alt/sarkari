/* ============================================================
   SARKARI UPDATES — Shared App Logic
   Header/footer injection, ticker, theme, search, render helpers
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Theme ---------- */
  const THEME_KEY = "sarkari-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
    document.querySelectorAll("[data-theme-btn]").forEach((b) => {
      b.textContent = t === "dark" ? "☀️" : "🌙";
      b.setAttribute("aria-label", t === "dark" ? "Light mode" : "Dark mode");
    });
  }

  /* ---------- Header / Footer ---------- */
  const NAV_LINKS = [
    { href: "index.html", label: "Home", icon: "🏠", match: "index.html" },
    { href: "jobs.html", label: "Sarkari Jobs", icon: "💼", match: "jobs.html" },
    { href: "admit-cards.html", label: "Admit Cards", icon: "🎫", match: "admit-cards.html" },
    { href: "results.html", label: "Results", icon: "🏆", match: "results.html" },
  ];

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  function daysLeft(iso) {
    const diff = Math.ceil((new Date(iso + "T00:00:00") - new Date()) / 86400000);
    return diff;
  }

  function relativeDate(iso) {
    const diff = daysLeft(iso);
    if (diff > 0) return `<span class="date-fresh">${diff} day${diff === 1 ? "" : "s"} left</span>`;
    if (diff === 0) return `<span class="date-fresh">Last date today</span>`;
    return `<span style="opacity:.85">${fmtDate(iso)}</span>`;
  }

  const TYPE_LABEL = {
    job: { text: "Sarkari Job", cls: "type-job", icon: "💼" },
    admit: { text: "Admit Card", cls: "type-admit", icon: "🎫" },
    result: { text: "Result", cls: "type-result", icon: "🏆" },
    answer: { text: "Answer Key", cls: "type-answer", icon: "🔑" },
    syllabus: { text: "Syllabus", cls: "type-syllabus", icon: "📘" },
  };

  const BADGE_COLORS = [
    "#f26b1d", "#1c4a8c", "#1f9d55", "#6f42c1", "#b8860b", "#d6336c", "#0d9488",
  ];
  function badgeFor(org) {
    let h = 0;
    for (const c of org) h = (h * 31 + c.charCodeAt(0)) % 997;
    return BADGE_COLORS[h % BADGE_COLORS.length];
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  /* Render a single job card (list row) */
  function jobCardHTML(p) {
    const t = TYPE_LABEL[p.type];
    return `
      <article class="card job-card reveal" data-id="${p.id}" tabindex="0" role="link"
        aria-label="Open details for ${escapeHtml(p.title)}">
        <div class="org-badge" style="background:${badgeFor(p.org)}">${initials(p.org)}</div>
        <div class="job-body">
          <div class="job-top">
            <span class="type-pill ${t.cls}">${t.icon} ${t.text}</span>
            <span class="job-org">${escapeHtml(p.org)}</span>
          </div>
          <h3 class="job-title">${escapeHtml(p.title)}</h3>
          <p class="job-desc">${escapeHtml(p.short)}</p>
          <div class="job-meta">
            <span class="m"><span class="ic">🗓️</span> Posted: <strong>${fmtDate(p.date)}</strong></span>
            <span class="m"><span class="ic">⏰</span> ${relativeDate(p.lastDate)}</span>
            <span class="m"><span class="ic">👥</span> <strong>${Number(p.vacancies).toLocaleString("en-IN")}</strong> posts</span>
          </div>
        </div>
        <span class="chev">→</span>
      </article>`;
  }

  /* Render a compact mini item for sidebars */
  function miniItemHTML(p) {
    const t = TYPE_LABEL[p.type];
    return `
      <div class="mini-item" data-id="${p.id}" tabindex="0" role="link" aria-label="${escapeHtml(p.title)}">
        <div class="t">${escapeHtml(p.title)}</div>
        <div class="d">${t.text} • ${fmtDate(p.date)}</div>
      </div>`;
  }

  function categoryCardHTML(c) {
    return `
      <a class="cat-card reveal" href="jobs.html?cat=${c.id}">
        <div class="cat-icon">${c.icon}</div>
        <h3>${c.label}</h3>
        <p>${countFor(c.id)} updates</p>
      </a>`;
  }

  function countFor(catId) {
    if (catId === "all") return POSTS.length;
    return POSTS.filter((p) => p.type === catId).length;
  }

  /* ---------- Header injection ---------- */
  function buildHeader() {
    const path = (location.pathname.split("/").pop() || "index.html");
    const isActive = (m) => path === m || (m === "index.html" && path === "");

    const links = NAV_LINKS
      .map(
        (l) =>
          `<li><a href="${l.href}" class="${isActive(l.match) ? "active" : ""}"><span class="ic">${l.icon}</span>${l.label}</a></li>`
      )
      .join("");

    const drawerLinks = NAV_LINKS
      .map(
        (l) =>
          `<a href="${l.href}" ${isActive(l.match) ? 'style="background:rgba(242,107,29,.12)"' : ""}><span>${l.icon}</span>${l.label}</a>`
      )
      .join("");

    const el = document.createElement("div");
    el.innerHTML = `
      <div class="ticker" aria-hidden="true"><div class="ticker-track">${TICKER.map(
        (t) => `<span class="ticker-item">${t}</span>`
      ).join("")}${TICKER.map((t) => `<span class="ticker-item">${t}</span>`).join("")}</div></div>
      <div class="nav-wrap" id="navWrap">
        <nav class="nav container" aria-label="Main navigation">
          <a href="index.html" class="logo" aria-label="Sarkari Updates home">
            <span class="logo-badge">🇮🇳</span>
            <span>Sarkari<span>Updates</span>
              <small>Results • Jobs • Admit Cards</small>
            </span>
          </a>
          <ul class="nav-links">${links}</ul>
          <div class="nav-actions">
            <button class="icon-btn" data-theme-btn title="Toggle theme" aria-label="Toggle dark mode">🌙</button>
            <button class="menu-btn icon-btn" id="menuBtn" aria-label="Open menu">☰</button>
            <a href="index.html#subscribe" class="btn btn-primary">🔔 Get Alerts</a>
          </div>
        </nav>
      </div>
      <div class="drawer" id="drawer">
        <div class="drawer-panel">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <span class="logo" style="font-size:16px"><span class="logo-badge" style="width:30px;height:30px">🇮🇳</span>Sarkari Updates</span>
            <button class="icon-btn" id="closeDrawer" aria-label="Close menu">✕</button>
          </div>
          ${drawerLinks}
          <div style="margin-top:auto;padding-top:16px">
            <a href="index.html#subscribe" class="btn btn-primary btn-block">🔔 Get Alerts</a>
          </div>
        </div>
      </div>`;
    document.body.prepend(el);

    /* wire nav behaviours */
    const wrap = document.getElementById("navWrap");
    const drawer = document.getElementById("drawer");
    document.getElementById("menuBtn").addEventListener("click", () => drawer.classList.add("open"));
    document.getElementById("closeDrawer").addEventListener("click", () => drawer.classList.remove("open"));
    drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.classList.remove("open"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") drawer.classList.remove("open"); });

    window.addEventListener("scroll", () => wrap.classList.toggle("scrolled", scrollY > 8), { passive: true });

    const saved = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(saved);
    document.querySelectorAll("[data-theme-btn]").forEach((b) =>
      b.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      })
    );
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    const el = document.createElement("div");
    el.innerHTML = `
      <footer>
        <div class="container">
          <div class="foot-grid">
            <div class="foot-brand">
              <a href="index.html" class="logo"><span class="logo-badge">🇮🇳</span>
                <span>Sarkari<span>Updates</span></span>
              </a>
              <p>India's fastest growing portal for Sarkari Jobs, Admit Cards, Results, Answer Keys and Syllabus — updated around the clock.</p>
              <div class="socials" style="margin-top:18px">
                <a class="icon-btn" href="#" aria-label="Telegram">✈️</a>
                <a class="icon-btn" href="#" aria-label="WhatsApp">💬</a>
                <a class="icon-btn" href="#" aria-label="YouTube">▶️</a>
                <a class="icon-btn" href="#" aria-label="Instagram">📷</a>
              </div>
            </div>
            <div class="foot-col">
              <h4>Quick Links</h4>
              <a href="jobs.html">Latest Sarkari Jobs</a>
              <a href="admit-cards.html">Admit Cards</a>
              <a href="results.html">Results</a>
              <a href="jobs.html?cat=answer">Answer Keys</a>
              <a href="jobs.html?cat=syllabus">Syllabus</a>
            </div>
            <div class="foot-col">
              <h4>Top Exams</h4>
              <a href="job-detail.html?id=1">SSC CGL 2026</a>
              <a href="job-detail.html?id=2">UPSC CSE 2027</a>
              <a href="job-detail.html?id=6">IBPS PO 2026</a>
              <a href="job-detail.html?id=10">RRB ALP 2026</a>
              <a href="job-detail.html?id=12">SBI Clerk 2026</a>
            </div>
            <div class="foot-col">
              <h4>Resources</h4>
              <a href="index.html#faq">FAQs</a>
              <a href="index.html#subscribe">Subscribe Alerts</a>
              <a href="index.html#ads">Advertise Here</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div class="foot-bottom">
            <span>© 2026 Sarkari Updates. Sample demo site — data is placeholder.</span>
            <span>Made with ❤️ in India 🇮🇳</span>
          </div>
        </div>
      </footer>`;
    document.body.appendChild(el);
  }

  /* ---------- Toast + Back-to-top ---------- */
  function showToast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.innerHTML = `🔔 ${escapeHtml(msg)}`;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  function buildToTop() {
    const b = document.createElement("button");
    b.className = "to-top";
    b.innerHTML = "↑";
    b.setAttribute("aria-label", "Back to top");
    b.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(b);
    window.addEventListener("scroll", () => b.classList.toggle("show", scrollY > 600), { passive: true });
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.innerHTML = Math.round(target * eased).toLocaleString("en-IN") + `<em>${suffix}</em>`;
        if (p < 1) requestAnimationFrame(tick);
      };
      const o = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { requestAnimationFrame(tick); o.disconnect(); }
      }, { threshold: 0.4 });
      o.observe(el);
    });
  }

  /* ---------- Global behaviours ---------- */
  function initGlobal() {
    buildHeader();
    buildFooter();
    buildToTop();

    document.addEventListener("click", (e) => {
      const card = e.target.closest("[data-id]");
      if (card && !e.target.closest("a,button")) {
        location.href = `job-detail.html?id=${card.dataset.id}`;
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches("[data-id]")) {
        location.href = `job-detail.html?id=${e.target.dataset.id}`;
      }
    });

    /* scroll reveal */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

    wireFaqs(document);
    initCounters();
  }

  /* Shared FAQ accordion wiring (scope = document or a container element) */
  function wireFaqs(scope) {
    scope.querySelectorAll(".faq-q").forEach((q) =>
      q.addEventListener("click", () => {
        const item = q.parentElement;
        const a = item.querySelector(".faq-a");
        const open = item.classList.contains("open");
        item.closest(".faq-list")?.querySelectorAll(".faq-item.open").forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        item.classList.toggle("open", !open);
        a.style.maxHeight = open ? null : a.scrollHeight + "px";
        q.setAttribute("aria-expanded", String(!open));
      })
    );
  }

  /* ---------- Page-specific renderers ---------- */

  /* Home: latest updates (mixed) + category cards */
  window.renderHome = function () {
    const latest = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    const grid = document.getElementById("latestGrid");
    if (grid) grid.innerHTML = latest.map((p) => jobCardHTML(p)).join("");

    const cats = document.getElementById("catGrid");
    if (cats) cats.innerHTML = CATEGORIES.filter((c) => c.id !== "all").map(categoryCardHTML).join("");

    const stats = document.getElementById("heroStats");
    if (stats) {
      stats.innerHTML = STATS.map(
        (s) =>
          `<div class="hstat reveal"><div class="num"><span data-count="${s.value}" data-suffix="${s.suffix}">0</span></div><div class="lbl">${s.label}</div></div>`
      ).join("");
      initCounters();
      const io = new IntersectionObserver(
        (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))),
        { threshold: 0.08 }
      );
      document.querySelectorAll(".hero-stats .reveal").forEach((n) => io.observe(n));
    }

    /* popular chips */
    document.querySelectorAll("[data-chip]").forEach((c) =>
      c.addEventListener("click", () => (location.href = "jobs.html?q=" + encodeURIComponent(c.dataset.chip)))
    );

    /* hero search (native form submit already handles Enter key) */
    const hs = document.getElementById("heroSearch");
    if (hs) {
      hs.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = hs.querySelector("input").value.trim();
        location.href = "jobs.html?q=" + encodeURIComponent(q);
      });
    }
  };

  /* Listing page */
  window.renderJobs = function () {
    const params = new URLSearchParams(location.search);
    const q = (params.get("q") || "").toLowerCase().trim();
    const pin = window.__pinCat || null;
    const cat = params.get("cat") || pin || "all";
    const allowedCats = pin ? ["all", pin] : CATEGORIES.map((c) => c.id);

    /* build filter bar */
    const bar = document.getElementById("filterBar");
    if (bar) {
      const counts = {};
      POSTS.forEach((p) => (counts[p.type] = (counts[p.type] || 0) + 1));
      counts.all = POSTS.length;
      bar.innerHTML = CATEGORIES.filter((c) => allowedCats.includes(c.id)).map((c) => {
        const n = counts[c.id] || 0;
        return `<button class="filter-btn ${c.id === cat ? "active" : ""}" data-cat="${c.id}">
          ${c.icon} ${c.label} <span class="cnt">${n}</span>
        </button>`;
      }).join("");
      bar.querySelectorAll(".filter-btn").forEach((b) =>
        b.addEventListener("click", () => {
          const u = new URLSearchParams(location.search);
          u.set("cat", b.dataset.cat);
          u.delete("q");
          location.search = u.toString();
        })
      );
    }

    /* page search */
    const sb = document.getElementById("listSearch");
    if (sb) {
      sb.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = sb.querySelector("input").value.trim();
        const u = new URLSearchParams(location.search);
        if (val) u.set("q", val); else u.delete("q");
        location.search = u.toString();
      });
    }
    if (sb && q) sb.querySelector("input").value = q;

    /* title + result count */
    const title = document.getElementById("listTitle");
    const sub = document.getElementById("listSub");

    let filtered = POSTS.filter((p) => cat === "all" || p.type === cat);
    if (q) {
      filtered = filtered.filter((p) =>
        [p.title, p.org, p.dept, p.tags.join(" ")].join(" ").toLowerCase().includes(q)
      );
    }
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    const catLabel = CATEGORIES.find((c) => c.id === cat)?.label || "Updates";
    if (title) title.textContent = q ? `Results for “${params.get("q")}”` : catLabel;
    if (sub) sub.textContent = `${filtered.length} update${filtered.length === 1 ? "" : "s"} found — sorted by latest first.`;

    const grid = document.getElementById("jobsGrid");
    if (grid) {
      grid.innerHTML = filtered.length
        ? filtered.map((p) => jobCardHTML(p)).join("")
        : `<div class="empty-state"><div class="ic">🔍</div>No updates found. Try a different keyword or category.</div>`;
    }

    /* observe reveals */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
  };

  /* Detail page */
  window.renderDetail = function () {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const p = POSTS.find((x) => x.id === id);
    if (!p) {
      document.querySelector(".detail-hero .container").innerHTML =
        `<div class="empty-state"><div class="ic">😕</div>Update not found. <a href="index.html" style="color:var(--brand);font-weight:600">Go home</a></div>`;
      return;
    }
    const t = TYPE_LABEL[p.type];

    document.title = `${p.title} | Sarkari Updates`;

    /* JobPosting structured data (SEO rich results) */
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: p.title,
      description: p.short,
      datePosted: p.date,
      validThrough: p.lastDate,
      employmentType: "FULL_TIME",
      hiringOrganization: { "@type": "Organization", name: p.org, sameAs: p.officialUrl },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "IN" } },
      baseSalary: p.salary
        ? { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", minValue: 25000, maxValue: 150000, unitText: "MONTH" } }
        : undefined,
      directApply: true,
    });
    document.head.appendChild(ld);

    /* hero */
    const hero = document.getElementById("detailHero");
    hero.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a> <span>/</span>
        <a href="jobs.html?cat=${p.type}">${t.text}</a> <span>/</span>
        <span>${escapeHtml(p.org)}</span>
      </nav>
      <div class="job-top" style="margin-bottom:0">
        <span class="type-pill ${t.cls}">${t.icon} ${t.text}</span>
        <span class="job-org">${escapeHtml(p.org)} • ${escapeHtml(p.dept)}</span>
      </div>
      <h1 class="detail-title">${escapeHtml(p.title)}</h1>
      <p class="detail-short">${escapeHtml(p.short)}</p>

      <div class="info-grid">
        ${infoCard("🗓️", "Important Dates", `${fmtDate(p.date)} — ${fmtDate(p.lastDate)}`, "Application window")}
        ${infoCard("👥", "Total Vacancies", Number(p.vacancies).toLocaleString("en-IN"), p.vacancies > 0 ? "Posts to be filled" : "Certificate / information")}
        ${infoCard("🏦", "Organization", p.org, p.dept)}
        ${infoCard("💰", "Salary / Pay Scale", p.salary || "As per rules", "CTC includes allowances")}
      </div>
    `;

    /* sidebar */
    const side = document.getElementById("sidebar");
    side.innerHTML = `
      <div class="card apply-box">
        <h4>🔗 Apply Online</h4>
        <p>${p.lastDate ? "Last date to apply: " + fmtDate(p.lastDate) : "No application required"}</p>
        <a class="btn btn-primary" href="${p.applyUrl}" target="_blank" rel="noopener">Apply Now →</a>
        <a class="btn btn-outline-light" href="${p.officialUrl}" target="_blank" rel="noopener">Official Website ↗</a>
      </div>
      <div class="card" style="padding:6px 18px">
        <h4 style="font-size:15px;font-weight:700;padding:14px 0;border-bottom:1px solid var(--line)">📢 More Updates</h4>
        <div class="mini-list">
          ${[...POSTS].filter((x) => x.id !== p.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map(miniItemHTML).join("")}
        </div>
      </div>
    `;

    /* main sections */
    const main = document.getElementById("detailMain");
    main.innerHTML = `
      <section class="detail-section">
        <h3><span class="ic">📅</span> Important Dates</h3>
        <div class="table-wrap">
          <table class="dates-table">
            <thead><tr><th>Event</th><th>Date</th></tr></thead>
            <tbody>
              <tr><td>Notification release</td><td>${fmtDate(p.date)}</td></tr>
              <tr><td>Online application start</td><td>${fmtDate(p.date)}</td></tr>
              <tr><td>Last date to apply</td><td class="${daysLeft(p.lastDate) >= 0 ? "hl" : "alert"}">${fmtDate(p.lastDate)}${daysLeft(p.lastDate) < 0 ? " (closed)" : ""}</td></tr>
              <tr><td>Admit card release</td><td>To be announced</td></tr>
              <tr><td>Exam date</td><td>To be announced</td></tr>
              <tr><td>Result declaration</td><td>To be announced</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="detail-section">
        <h3><span class="ic">💵</span> Application Fees</h3>
        <ul>
          <li><span class="k">General / OBC / EWS</span><span class="v">₹100 – ₹500</span></li>
          <li><span class="k">SC / ST / PwD</span><span class="v hl">₹0 (Exempted)</span></li>
          <li><span class="k">Female candidates</span><span class="v hl">₹0 (Many states)</span></li>
          <li><span class="k">Payment mode</span><span class="v">Online — UPI, Net Banking, Cards</span></li>
        </ul>
      </section>

      <section class="detail-section">
        <h3><span class="ic">🎂</span> Age Limit</h3>
        <ul>
          <li><span class="k">Minimum age</span><span class="v">18 years (as on 01.01.2026)</span></li>
          <li><span class="k">Maximum age</span><span class="v">32 years (as on 01.01.2026)</span></li>
          <li><span class="k">Age relaxation</span><span class="v">SC/ST +5 yrs • OBC +3 yrs • PwD +10 yrs (as per rules)</span></li>
        </ul>
      </section>

      <section class="detail-section">
        <h3><span class="ic">🎓</span> Qualification & Vacancy Details</h3>
        <p><strong>Educational qualification:</strong> ${escapeHtml(p.category.join(", "))} pass from a recognised board / university. Exact eligibility per post — see the official notification PDF.</p>
        <p><strong>Selection process:</strong> Written exam (Tier 1 & Tier 2) → Document verification → Medical test (where applicable).</p>
      </section>

      <section class="detail-section">
        <h3><span class="ic">✅</span> How to Apply</h3>
        <p><strong>Step 1:</strong> Click the <strong>Apply Online</strong> button and register on the official portal.</p>
        <p><strong>Step 2:</strong> Fill in personal, educational and category details carefully.</p>
        <p><strong>Step 3:</strong> Upload scanned photo, signature and required documents (size as per notification).</p>
        <p><strong>Step 4:</strong> Pay the application fee online and take a printout of the final form.</p>
      </section>

      <section class="detail-section">
        <h3><span class="ic">❓</span> Frequently Asked Questions</h3>
        <div class="faq-list">
          ${faqItem("Is this a government job?", `Yes — ${p.org} is a government recruitment body. All jobs listed here are verified against the official notification.`)}
          ${faqItem("Where is the official notification?", `The complete PDF notification is available on the official website: <a href="${p.officialUrl}" style="color:var(--brand);font-weight:600" target="_blank" rel="noopener">${p.officialUrl}</a>. Always read it before applying.`)}
          ${faqItem("What if the last date is missed?", `Unfortunately, applications are accepted only until the last date. Subscribe to our alerts to never miss a deadline.`)}
        </div>
      </section>
    `;

    /* re-wire accordion + reveals */
    wireFaqs(main);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
  };

  function infoCard(icon, k, v, sub) {
    return `
      <div class="info-card reveal">
        <div class="ic">${icon}</div>
        <div class="k">${k}</div>
        <div class="v">${v}<small>${sub}</small></div>
      </div>`;
  }

  function faqItem(q, a) {
    return `
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">${q}<span class="faq-ic">+</span></button>
        <div class="faq-a"><p>${a}</p></div>
      </div>`;
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initGlobal();
    const bodyId = document.body.dataset.page;
    if (bodyId === "home" && typeof window.renderHome === "function") window.renderHome();
    if (bodyId === "list" && typeof window.renderJobs === "function") window.renderJobs();
    if (bodyId === "detail" && typeof window.renderDetail === "function") window.renderDetail();
  });

  /* expose helpers for inline usage */
  window.Sarkari = { POSTS, CATEGORIES, TICKER, STATS, showToast, escapeHtml, fmtDate, daysLeft };
})();
