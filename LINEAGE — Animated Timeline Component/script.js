/**
 * LINEAGE — Animated Timeline Component · script.js
 * 2026 · 100 Days 100 Projects · Azman Ali
 *
 * Features:
 *  • 4 layout variants: Left / Center / Right / Horizontal
 *  • Category filter: All / Milestone / Project / Learning / Launch
 *  • IntersectionObserver scroll-triggered item reveals
 *  • Staggered entrance animations per item
 *  • Live line draw that follows scroll progress
 *  • Expandable / collapsible card bodies
 *  • Dot hover pulse + ring effect
 *  • Year dividers auto-inserted between year groups
 *  • Stats counter animation on load
 *  • Replay all — resets and re-triggers all animations
 *  • Expand all / Collapse all
 *  • Dark / Light theme toggle
 *  • Full keyboard accessibility
 */

"use strict";

/* ══════════════════════
   1. TIMELINE DATA
   ══════════════════════ */
const TIMELINE_DATA = [
  {
    id: "t1",
    date: "Jan 2023",
    year: 2023,
    cat: "milestone",
    title: "Started the Developer Journey",
    sub: "Wrote my first line of HTML. A simple `<h1>Hello World</h1>`. The rest is history.",
    detail:
      "The beginning of everything. I committed to learning web development from scratch — no bootcamp, no shortcuts. Just curiosity, consistency, and a laptop. The first week was spent understanding how the browser even works.",
    tags: ["HTML", "Beginning", "Self-taught"],
    link: null,
  },
  {
    id: "t2",
    date: "Mar 2023",
    year: 2023,
    cat: "learning",
    title: "Mastered CSS Fundamentals",
    sub: "Flexbox, Grid, custom properties, animations. CSS stopped being scary.",
    detail:
      "Spent 3 weeks doing nothing but CSS. Built 20 UI components from scratch. The moment flexbox clicked was genuinely euphoric. Started appreciating the craft of visual engineering.",
    tags: ["CSS", "Flexbox", "Grid", "Animations"],
    link: null,
  },
  {
    id: "t3",
    date: "Jun 2023",
    year: 2023,
    cat: "project",
    title: "First Real Project — Portfolio v1",
    sub: "Built and deployed my first portfolio site. No template. No copy-paste.",
    detail:
      "Took everything I had learned and put it into a real project. Spent two weeks on it — responsive layout, smooth scroll, dark mode. Deployed on GitHub Pages. Shared on LinkedIn and got 200+ reactions.",
    tags: ["Portfolio", "Responsive", "GitHub Pages"],
    link: "https://github.com/azman08",
  },
  {
    id: "t4",
    date: "Sep 2023",
    year: 2023,
    cat: "learning",
    title: "JavaScript Deep Dive",
    sub: "Closures, prototypes, async/await, the event loop. JS finally made sense.",
    detail:
      "Read You Don't Know JS (twice). Built 15 mini projects that used only vanilla JavaScript with no frameworks. Understanding the call stack and microtask queue changed how I write code forever.",
    tags: ["JavaScript", "Async", "Event Loop", "ES6+"],
    link: null,
  },
  {
    id: "t5",
    date: "Nov 2023",
    year: 2023,
    cat: "launch",
    title: "First Freelance Client",
    sub: "Got paid to build a website. A real client. Real money. Real pressure.",
    detail:
      "A local bakery needed a website. Charged ₹8,000. Delivered in 5 days. The stress of a real deadline taught me more than 3 months of studying. Client was thrilled.",
    tags: ["Freelance", "Client work", "Delivery"],
    link: null,
  },
  {
    id: "t6",
    date: "Jan 2024",
    year: 2024,
    cat: "milestone",
    title: "100 Days of Code — Streak Started",
    sub: "Committed to writing code every single day. No exceptions.",
    detail:
      "The most transformative habit I have ever built. Day 1 felt small. Day 30 felt like momentum. Day 100 felt like identity. Coding every day stopped being a challenge and became who I am.",
    tags: ["100DaysOfCode", "Consistency", "Habit"],
    link: "https://www.linkedin.com/in/azman08/",
  },
  {
    id: "t7",
    date: "Mar 2024",
    year: 2024,
    cat: "learning",
    title: "React & Component Architecture",
    sub: "Understood the why of React, not just the how.",
    detail:
      "Built 8 projects with React. Focused on understanding component lifecycle, state management, and when NOT to use React. The biggest lesson: vanilla JS first, then reach for frameworks.",
    tags: ["React", "Components", "State"],
    link: null,
  },
  {
    id: "t8",
    date: "Jun 2024",
    year: 2024,
    cat: "project",
    title: "Built a SaaS Landing Page System",
    sub: "Reusable, modular landing page components. Used by 3 clients.",
    detail:
      "Created a design system with 40+ reusable components. Documented everything. Open-sourced the component library on GitHub. Got 300+ stars in the first month.",
    tags: ["Design System", "SaaS", "Open Source"],
    link: "https://github.com/azman08",
  },
  {
    id: "t9",
    date: "Sep 2024",
    year: 2024,
    cat: "milestone",
    title: "1,000 LinkedIn Followers",
    sub: "A year of building in public. The audience came to the consistency.",
    detail:
      "Never posted for followers. Posted to document the journey. The day I hit 1,000 felt validation that sharing your process matters more than perfecting it. Every post taught me something about writing and communication.",
    tags: ["LinkedIn", "Build in Public", "Community"],
    link: "https://www.linkedin.com/in/azman08/",
  },
  {
    id: "t10",
    date: "Nov 2024",
    year: 2024,
    cat: "launch",
    title: "Launched First npm Package",
    sub: "Published a utility library. Someone else used it. That feeling is unreal.",
    detail:
      "A simple date formatting utility I kept copy-pasting between projects. Finally packaged it properly. 200+ weekly downloads within 2 months. First time something I built lived inside someone else's project.",
    tags: ["npm", "Open Source", "Utility"],
    link: null,
  },
  {
    id: "t11",
    date: "Jan 2025",
    year: 2025,
    cat: "milestone",
    title: "100 Days 100 Projects — Challenge Begins",
    sub: "One project. Every day. No skipped days. No excuses.",
    detail:
      "The most ambitious thing I have ever attempted. Build and ship one complete web project daily for 100 consecutive days. Each project must be polished, accessible, and shareable. This timeline is project [X].",
    tags: ["Challenge", "100 Projects", "Commitment"],
    link: "https://100days100projects-chi.vercel.app",
  },
  {
    id: "t12",
    date: "Mar 2025",
    year: 2025,
    cat: "project",
    title: "CHRONO — Digital Clock",
    sub: "A neo-brutalist real-time clock with world timezones and stopwatch.",
    detail:
      "Day 1 of the challenge. Built a full-featured digital clock: 12/24h toggle, world clocks for 7 cities, stopwatch with lap times, seconds ring, milliseconds counter, Unix timestamp. requestAnimationFrame driven.",
    tags: ["Clock", "Time", "Animation"],
    link: "https://100days100projects-chi.vercel.app",
  },
  {
    id: "t13",
    date: "Mar 2025",
    year: 2025,
    cat: "launch",
    title: "NAVX — Sticky Navbar on Scroll",
    sub: "8 scroll behaviors. Zero libraries. IntersectionObserver driven.",
    detail:
      "Hide-on-scroll-down, reveal-on-scroll-up, glassmorphism, active section tracking, scroll progress bar, shrink-on-scroll, mobile drawer with staggered animations. The scrollDelta > 4 threshold insight was the key.",
    tags: ["Navbar", "Scroll", "Animation"],
    link: "https://100days100projects-chi.vercel.app",
  },
  {
    id: "t14",
    date: "Mar 2026",
    year: 2026,
    cat: "milestone",
    title: "You Are Here — Day [X]",
    sub: "Building LINEAGE, the animated timeline component. Still going.",
    detail:
      "Every entry in this timeline was real. Every project was shipped. Every day was code. This is what consistent effort looks like mapped onto a timeline. The line keeps drawing forward.",
    tags: ["Present", "Building", "Timeline"],
    link: "https://www.linkedin.com/in/azman08/",
  },
];

/* ══════════════════════
   2. STATE
   ══════════════════════ */
const state = {
  variant: "left", // left | center | right | horizontal
  activeFilter: "all",
  theme: "dark",
  allExpanded: false,
};

/* ══════════════════════
   3. DOM REFS
   ══════════════════════ */
const $ = (id) => document.getElementById(id);

const dom = {
  wrapper: $("tl-wrapper"),
  items: $("tl-items"),
  lineFill: $("tl-line-fill"),
  stTotal: $("st-total"),
  stMs: $("st-ms"),
  stProj: $("st-proj"),
  stSpan: $("st-span"),
  btnTheme: $("btn-theme"),
  themeIcon: $("theme-icon"),
  btnReplay: $("btn-replay"),
  btnExpand: $("btn-expand"),
  btnCollapse: $("btn-collapse"),
};

/* ══════════════════════
   4. RENDER TIMELINE
   ══════════════════════ */
function renderTimeline(data) {
  dom.items.innerHTML = "";

  // Group by year for dividers
  let lastYear = null;

  data.forEach((item, i) => {
    // Year divider
    if (item.year !== lastYear && state.variant !== "horizontal") {
      const divider = document.createElement("div");
      divider.className = "tl-year-divider";
      divider.innerHTML = `
        <span class="year-label">${item.year}</span>
        <span class="year-line"></span>
      `;
      dom.items.appendChild(divider);
      lastYear = item.year;
    }

    const el = document.createElement("div");
    el.className = "tl-item";
    el.dataset.cat = item.cat;
    el.dataset.id = item.id;
    el.setAttribute("role", "listitem");
    el.style.transitionDelay = `${i * 60}ms`;

    el.innerHTML = `
      <div class="tl-dot" aria-hidden="true" title="${item.cat}"></div>
      <div class="tl-connector" aria-hidden="true"></div>
      <div class="tl-card" tabindex="0" role="button"
           aria-expanded="false"
           aria-label="${escHtml(item.title)} — ${item.date}">
        <div class="card-top">
          <div class="card-meta">
            <span class="card-date mono">${item.date}</span>
            <span class="card-cat">${item.cat}</span>
          </div>
          <button class="card-expand-btn" aria-label="Toggle details" title="Toggle">
            ↓
          </button>
        </div>
        <h3 class="card-title">${escHtml(item.title)}</h3>
        <p class="card-sub">${escHtml(item.sub)}</p>
        <div class="card-body">
          <div class="card-body-inner">
            <p class="card-detail">${escHtml(item.detail)}</p>
            <div class="card-tags">
              ${item.tags.map((t) => `<span class="card-tag">${escHtml(t)}</span>`).join("")}
            </div>
            ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-link">View →</a>` : ""}
          </div>
        </div>
      </div>
    `;

    // Card click / keyboard expand
    const card = el.querySelector(".tl-card");
    const expBtn = el.querySelector(".card-expand-btn");

    function toggleCard() {
      const isExp = card.classList.toggle("expanded");
      card.setAttribute("aria-expanded", isExp);
      expBtn.textContent = isExp ? "↑" : "↓";
    }

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard();
      }
    });
    expBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCard();
    });

    dom.items.appendChild(el);
  });

  // (Re-)observe all items
  observeItems();
  updateLinePosition();
}

/* ══════════════════════
   5. INTERSECTION OBSERVER
   Scroll-triggered reveals
   ══════════════════════ */
let observer;

function observeItems() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".tl-item").forEach((el) => observer.observe(el));
}

/* ══════════════════════
   6. LINE DRAW ON SCROLL
   ══════════════════════ */
function updateLineDraw() {
  const wrapper = dom.wrapper;
  const fill = dom.lineFill;
  if (!wrapper || !fill) return;

  const rect = wrapper.getBoundingClientRect();
  const winH = window.innerHeight;
  const total = rect.height;
  const visible = Math.max(0, Math.min(winH - rect.top, total));
  const pct = Math.min(100, (visible / total) * 100);

  if (state.variant === "horizontal") {
    fill.style.width = pct + "%";
    fill.style.height = "100%";
  } else {
    fill.style.height = pct + "%";
    fill.style.width = "100%";
  }
}

window.addEventListener("scroll", updateLineDraw, { passive: true });

/* ══════════════════════
   7. LINE POSITION
   Update line CSS var on variant change
   ══════════════════════ */
function updateLinePosition() {
  dom.wrapper.className = "tl-wrapper " + state.variant;
  updateLineDraw();
}

/* ══════════════════════
   8. LAYOUT VARIANT
   ══════════════════════ */
document.querySelectorAll(".vpill").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".vpill").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    state.variant = btn.dataset.variant;
    updateLinePosition();

    // Reset line fill
    dom.lineFill.style.height = "0%";
    dom.lineFill.style.width = "0%";

    // Re-render (so year dividers show/hide correctly for horizontal)
    const filtered = getFilteredData();
    renderTimeline(filtered);

    setTimeout(updateLineDraw, 100);
  });
});

/* ══════════════════════
   9. CATEGORY FILTER
   ══════════════════════ */
document.querySelectorAll(".fpill").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".fpill").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    state.activeFilter = btn.dataset.cat;
    const filtered = getFilteredData();
    renderTimeline(filtered);
    setTimeout(updateLineDraw, 100);
  });
});

function getFilteredData() {
  if (state.activeFilter === "all") return TIMELINE_DATA;
  return TIMELINE_DATA.filter((d) => d.cat === state.activeFilter);
}

/* ══════════════════════
   10. REPLAY
   Reset all reveals and re-trigger
   ══════════════════════ */
dom.btnReplay.addEventListener("click", () => {
  // Remove all revealed classes
  document.querySelectorAll(".tl-item.revealed").forEach((el) => {
    el.classList.remove("revealed");
  });

  // Reset line
  dom.lineFill.style.height = "0%";
  dom.lineFill.style.width = "0%";

  // Collapse all cards
  document.querySelectorAll(".tl-card.expanded").forEach((c) => {
    c.classList.remove("expanded");
    c.setAttribute("aria-expanded", "false");
    const btn = c.querySelector(".card-expand-btn");
    if (btn) btn.textContent = "↓";
  });

  // Re-observe
  setTimeout(() => {
    observeItems();
    updateLineDraw();
  }, 100);
});

/* ══════════════════════
   11. EXPAND / COLLAPSE ALL
   ══════════════════════ */
dom.btnExpand.addEventListener("click", () => {
  document.querySelectorAll(".tl-card").forEach((card) => {
    card.classList.add("expanded");
    card.setAttribute("aria-expanded", "true");
    const btn = card.querySelector(".card-expand-btn");
    if (btn) btn.textContent = "↑";
  });
});

dom.btnCollapse.addEventListener("click", () => {
  document.querySelectorAll(".tl-card").forEach((card) => {
    card.classList.remove("expanded");
    card.setAttribute("aria-expanded", "false");
    const btn = card.querySelector(".card-expand-btn");
    if (btn) btn.textContent = "↓";
  });
});

/* ══════════════════════
   12. STATS COUNTER
   Animated count-up on load
   ══════════════════════ */
function animateCount(el, target, duration = 1000) {
  if (!el) return;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function updateStats() {
  const total = TIMELINE_DATA.length;
  const ms = TIMELINE_DATA.filter((d) => d.cat === "milestone").length;
  const proj = TIMELINE_DATA.filter((d) => d.cat === "project").length;
  const years = new Set(TIMELINE_DATA.map((d) => d.year));
  const span = Math.max(...years) - Math.min(...years) + 1;

  setTimeout(() => {
    animateCount(dom.stTotal, total, 1000);
    animateCount(dom.stMs, ms, 1200);
    animateCount(dom.stProj, proj, 1100);
    animateCount(dom.stSpan, span, 900);
  }, 400);
}

/* ══════════════════════
   13. THEME TOGGLE
   ══════════════════════ */
dom.btnTheme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  dom.themeIcon.textContent = state.theme === "dark" ? "☽" : "☀";
});

/* ══════════════════════
   14. HELPER
   ══════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ══════════════════════
   15. INIT
   ══════════════════════ */
function init() {
  renderTimeline(TIMELINE_DATA);
  updateStats();
  // Initial line draw after layout paint
  setTimeout(updateLineDraw, 300);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
