/**
 * CLIPX — Copy to Clipboard · script.js
 * 2026 Advanced Edition · 100 Days 100 Projects
 *
 * Features:
 *  • Snippet cards with category filter
 *  • Custom text copy with char counter
 *  • Clipboard API with fallback
 *  • Ripple animation on copy
 *  • Toast notification system
 *  • Copy history (session, max 20 items)
 *  • Re-copy from history
 *  • Clear history
 *  • Dark / Light theme toggle
 *  • Keyboard shortcut: Ctrl/Cmd + Shift + C → copy custom
 */

"use strict";

/* ═══════════════════════════
   1. SNIPPET DATA
   ═══════════════════════════ */
const SNIPPETS = [
  // Dev
  {
    id: 1,
    category: "dev",
    title: "Git Init",
    text: 'git init && git add . && git commit -m "initial commit"',
  },
  {
    id: 2,
    category: "dev",
    title: "npm Install & Run",
    text: "npm install && npm run dev",
  },
  {
    id: 3,
    category: "dev",
    title: "Console Log",
    text: "console.log('🔍 Debug:', );",
  },
  {
    id: 4,
    category: "dev",
    title: "Async Function",
    text: "const fetchData = async () => {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n};",
  },
  {
    id: 5,
    category: "dev",
    title: "CSS Flexbox Center",
    text: "display: flex;\nalign-items: center;\njustify-content: center;",
  },
  {
    id: 6,
    category: "dev",
    title: "Vercel Deploy",
    text: "npx vercel --prod",
  },

  // Social
  {
    id: 7,
    category: "social",
    title: "LinkedIn Bio",
    text: "Frontend Developer | Building 100 Projects in 100 Days | HTML · CSS · JavaScript | Open Source Enthusiast 🚀",
  },
  {
    id: 8,
    category: "social",
    title: "Twitter/X CTA",
    text: "🔥 Day [X]/100 — Just shipped a new project!\n\nBuilding in public every day. Follow the journey 👇\n100days100projects-chi.vercel.app",
  },
  {
    id: 9,
    category: "social",
    title: "GitHub Bio",
    text: "🚀 100 Days · 100 Projects | HTML CSS JS | Building in public | @codewithazman",
  },

  // Email
  {
    id: 10,
    category: "email",
    title: "Quick Follow Up",
    text: "Hi [Name],\n\nJust following up on my previous message. Would love to connect and explore opportunities to collaborate.\n\nBest,\nAzman Ali",
  },
  {
    id: 11,
    category: "email",
    title: "Project Intro",
    text: "Hi there,\n\nI'm Azman, a frontend developer currently on a 100 Days 100 Projects challenge. I'd love to share my work and discuss potential opportunities.\n\nPortfolio: 100days100projects-chi.vercel.app\n\nThanks for your time!",
  },

  // Design
  {
    id: 12,
    category: "design",
    title: "Color — Electric Mint",
    text: "#00f5a0",
  },
  {
    id: 13,
    category: "design",
    title: "Color — Vercel Yellow",
    text: "#e8ff57",
  },
  {
    id: 14,
    category: "design",
    title: "CSS Shadow — Card",
    text: "box-shadow: 0 4px 12px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.1);",
  },
  {
    id: 15,
    category: "design",
    title: "CSS — Glassmorphism",
    text: "background: rgba(255,255,255,0.05);\nbackdrop-filter: blur(20px);\nborder: 1px solid rgba(255,255,255,0.1);",
  },
];

/* ═══════════════════════════
   2. STATE
   ═══════════════════════════ */
const state = {
  filter: "all",
  history: [],
  theme: "dark",
  toastTimer: null,
};

/* ═══════════════════════════
   3. DOM REFS
   ═══════════════════════════ */
const $ = (id) => document.getElementById(id);

const el = {
  grid: $("snippets-grid"),
  tabs: document.querySelectorAll(".tab"),
  customInput: $("custom-input"),
  copyCustom: $("copy-custom"),
  customIcon: $("custom-icon"),
  charCount: $("char-count"),
  historyList: $("history-list"),
  historyEmpty: $("history-empty"),
  clearHistory: $("clear-history"),
  toast: $("toast"),
  toastMsg: $("toast-msg"),
  toastIcon: $("toast-icon"),
  btnTheme: $("btn-theme"),
  themeIcon: $("theme-icon"),
};

/* ═══════════════════════════
   4. COPY ENGINE
   ═══════════════════════════ */

/**
 * Core copy function — Clipboard API with execCommand fallback
 */
async function copyText(text) {
  if (!text || !text.trim()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-HTTPS
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    document.body.removeChild(ta);
    return ok;
  }
}

/* ═══════════════════════════
   5. TOAST SYSTEM
   ═══════════════════════════ */
function showToast(msg = "Copied!", isError = false) {
  el.toastMsg.textContent = msg;
  el.toastIcon.textContent = isError ? "✕" : "✓";
  el.toastIcon.style.background = isError ? "var(--red)" : "var(--accent)";

  el.toast.classList.add("show");

  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    el.toast.classList.remove("show");
  }, 2200);
}

/* ═══════════════════════════
   6. HISTORY
   ═══════════════════════════ */
function addToHistory(text) {
  // Avoid duplicates at the top
  if (state.history[0]?.text === text) return;

  const entry = {
    text,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  state.history.unshift(entry);
  if (state.history.length > 20) state.history.pop();

  renderHistory();
}

function renderHistory() {
  if (state.history.length === 0) {
    el.historyList.innerHTML = "";
    el.historyList.appendChild(el.historyEmpty);
    return;
  }

  el.historyList.innerHTML = "";

  state.history.forEach((entry, i) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.style.animationDelay = `${i * 30}ms`;

    const preview =
      entry.text.length > 60 ? entry.text.slice(0, 60) + "…" : entry.text;

    item.innerHTML = `
      <span class="history-text" title="${escapeHtml(entry.text)}">${escapeHtml(preview)}</span>
      <span class="history-time">${entry.time}</span>
      <button class="history-copy-btn" title="Copy again" aria-label="Copy this item again">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
    `;

    // Re-copy from history
    item
      .querySelector(".history-copy-btn")
      .addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await copyText(entry.text);
        if (ok) showToast("Copied again!");
      });

    el.historyList.appendChild(item);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ═══════════════════════════
   7. SNIPPET CARDS
   ═══════════════════════════ */

/**
 * SVG icons
 */
const ICON_COPY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const ICON_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function renderSnippets() {
  const filtered =
    state.filter === "all"
      ? SNIPPETS
      : SNIPPETS.filter((s) => s.category === state.filter);

  el.grid.innerHTML = "";

  filtered.forEach((snippet, i) => {
    const card = document.createElement("div");
    card.className = "snippet-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Copy ${snippet.title}`);
    card.style.animationDelay = `${i * 40}ms`;

    card.innerHTML = `
      <div class="card-top">
        <div class="card-meta">
          <span class="card-category">${snippet.category}</span>
          <span class="card-title">${snippet.title}</span>
        </div>
        <div class="card-copy-icon">${ICON_COPY}</div>
      </div>
      <div class="card-content">${escapeHtml(snippet.text)}</div>
      <div class="card-footer">
        <span class="card-chars">${snippet.text.length} chars</span>
        <span class="card-copied-label">✓ Copied</span>
      </div>
    `;

    // Click handler
    card.addEventListener("click", async (e) => {
      triggerRipple(card, e);
      const ok = await copyText(snippet.text);
      if (ok) {
        flashCard(card);
        addToHistory(snippet.text);
        showToast(`"${snippet.title}" copied!`);
      } else {
        showToast("Copy failed — try again", true);
      }
    });

    // Keyboard
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });

    el.grid.appendChild(card);
  });
}

function triggerRipple(card, e) {
  const rect = card.getBoundingClientRect();
  const rx = ((e.clientX - rect.left) / rect.width) * 100;
  const ry = ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty("--rx", `${rx}%`);
  card.style.setProperty("--ry", `${ry}%`);
  card.classList.add("ripple");
  setTimeout(() => card.classList.remove("ripple"), 500);
}

function flashCard(card) {
  card.classList.add("just-copied");
  const iconEl = card.querySelector(".card-copy-icon");
  iconEl.innerHTML = ICON_CHECK;

  setTimeout(() => {
    card.classList.remove("just-copied");
    iconEl.innerHTML = ICON_COPY;
  }, 1800);
}

/* ═══════════════════════════
   8. FILTER TABS
   ═══════════════════════════ */
el.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    el.tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    state.filter = tab.dataset.filter;
    renderSnippets();
  });
});

/* ═══════════════════════════
   9. CUSTOM TEXT COPY
   ═══════════════════════════ */

// Char counter
el.customInput.addEventListener("input", () => {
  const len = el.customInput.value.length;
  el.charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? "s" : ""}`;
});

// Copy button
el.copyCustom.addEventListener("click", async () => {
  const text = el.customInput.value.trim();
  if (!text) {
    showToast("Nothing to copy!", true);
    el.customInput.focus();
    return;
  }

  const ok = await copyText(text);
  if (ok) {
    // Flash button
    el.copyCustom.classList.add("copied");
    el.customIcon.innerHTML = ICON_CHECK.replace("14", "18").replace(
      "14",
      "18",
    );
    addToHistory(text);
    showToast("Custom text copied!");

    setTimeout(() => {
      el.copyCustom.classList.remove("copied");
      el.customIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    }, 1800);
  } else {
    showToast("Copy failed!", true);
  }
});

/* ═══════════════════════════
   10. HISTORY CONTROLS
   ═══════════════════════════ */
el.clearHistory.addEventListener("click", () => {
  state.history = [];
  renderHistory();
  showToast("History cleared");
});

/* ═══════════════════════════
   11. THEME TOGGLE
   ═══════════════════════════ */
el.btnTheme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  el.themeIcon.textContent = state.theme === "dark" ? "☽" : "☀";
});

/* ═══════════════════════════
   12. KEYBOARD SHORTCUT
   ═══════════════════════════ */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Shift + C → copy custom text
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
    e.preventDefault();
    el.copyCustom.click();
    el.customInput.focus();
  }
});

/* ═══════════════════════════
   13. INIT
   ═══════════════════════════ */
function init() {
  renderSnippets();
  renderHistory();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
