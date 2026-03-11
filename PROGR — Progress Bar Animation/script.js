/**
 * PROGR — Progress Bar Animation · script.js
 * 2026 Advanced Edition · 100 Days 100 Projects
 *
 * Features:
 *  • 10 distinct progress bar animation styles
 *  • Individual play / reset per bar
 *  • Global run all / reset all / pause all
 *  • Global speed, height, radius controls
 *  • Segmented bar (10 segments, lit one by one)
 *  • Step progress (5 nodes with connectors)
 *  • Stacked multi-color bar
 *  • Indeterminate infinite loader
 *  • Custom builder — value, style, color, height, radius
 *  • Live CSS code generation
 *  • Copy CSS code to clipboard
 *  • Dark / Light theme toggle
 *  • IntersectionObserver auto-play on scroll into view
 *  • requestAnimationFrame smooth counter for % labels
 */

"use strict";

/* ═══════════════════════
   1. STATE
   ═══════════════════════ */
const state = {
  theme: "dark",
  speed: 2, // seconds
  height: 14, // px
  radius: 6, // px
  globalPaused: false,

  bars: {
    1: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    2: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    3: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    4: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    5: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      step: 0,
      maxStep: 10,
    },
    6: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    7: { running: false, active: false },
    8: { running: false, paused: false, step: 0, maxStep: 5, rafId: null },
    9: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
    10: {
      running: false,
      paused: false,
      pct: 0,
      rafId: null,
      startTs: null,
      target: 100,
      duration: 2000,
    },
  },

  builder: {
    value: 65,
    style: "linear",
    color: "#a78bfa",
    height: 18,
    radius: 8,
  },
};

const STEP_LABELS = ["Init", "Build", "Test", "Review", "Deploy"];

/* ═══════════════════════
   2. DOM REFS
   ═══════════════════════ */
const $ = (id) => document.getElementById(id);

/* ═══════════════════════
   3. EASING FUNCTIONS
   ═══════════════════════ */
const ease = {
  inOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  out: (t) => 1 - Math.pow(1 - t, 3),
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

/* ═══════════════════════
   4. APPLY GLOBAL STYLES
   ═══════════════════════ */
function applyGlobalStyles() {
  document.querySelectorAll(".bar-track").forEach((track) => {
    track.style.height = state.height + "px";
    track.style.borderRadius = state.radius + "px";
  });
  document
    .querySelectorAll(".bar-fill, .stacked-fill, .segment")
    .forEach((fill) => {
      fill.style.borderRadius = state.radius + "px";
    });
  // Update all running durations
  Object.keys(state.bars).forEach((id) => {
    if (state.bars[id].duration !== undefined) {
      state.bars[id].duration = state.speed * 1000;
    }
  });
}

/* ═══════════════════════
   5. STANDARD BAR RUNNER
   Animates width from 0 → target%
   ═══════════════════════ */
function runBar(id, easeFn = ease.inOut) {
  const bar = state.bars[id];
  const fill = $(`fill-${id}`);
  const pctEl = $(`pct-${id}`);
  const glowEl = $(`glow-${id}`);
  const track = $(`track-${id}`);
  if (!fill || bar.running) return;

  bar.running = true;
  bar.pct = 0;
  bar.startTs = null;
  const duration = state.speed * 1000;

  if (glowEl) glowEl.style.opacity = "0.8";

  function step(ts) {
    if (state.globalPaused) {
      bar.rafId = requestAnimationFrame(step);
      return;
    }
    if (!bar.startTs) bar.startTs = ts;
    const elapsed = ts - bar.startTs;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeFn(progress);
    const pct = Math.round(eased * 100);

    fill.style.width = eased * 100 + "%";
    if (pctEl) pctEl.textContent = pct + "%";
    if (track) track.setAttribute("aria-valuenow", pct);

    // Move glow dot
    if (glowEl) {
      glowEl.style.left = eased * 100 + "%";
      glowEl.style.right = "auto";
      glowEl.style.transform = "translate(-50%, -50%)";
    }

    if (progress < 1) {
      bar.rafId = requestAnimationFrame(step);
    } else {
      bar.running = false;
      if (glowEl)
        setTimeout(() => {
          glowEl.style.opacity = "0";
        }, 400);
    }
  }

  bar.rafId = requestAnimationFrame(step);
}

function resetBar(id) {
  const bar = state.bars[id];
  cancelAnimationFrame(bar.rafId);
  bar.running = false;
  bar.pct = 0;
  bar.startTs = null;

  const fill = $(`fill-${id}`);
  const pctEl = $(`pct-${id}`);
  const glowEl = $(`glow-${id}`);
  const track = $(`track-${id}`);

  if (fill) fill.style.width = "0%";
  if (pctEl && id !== 7) pctEl.textContent = "0%";
  if (glowEl) glowEl.style.opacity = "0";
  if (track) track.setAttribute("aria-valuenow", 0);
}

/* ═══════════════════════
   6. SEGMENTED BAR (id=5)
   ═══════════════════════ */
function buildSegments() {
  const track = $("track-5");
  if (!track) return;
  track.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const seg = document.createElement("div");
    seg.className = "segment";
    seg.id = `seg-5-${i}`;
    seg.style.height = "100%";
    track.appendChild(seg);
  }
}

function runSegmented() {
  const bar = state.bars[5];
  if (bar.running) return;
  bar.running = true;
  bar.step = 0;

  const interval = (state.speed * 1000) / 10;

  function lightNext() {
    if (state.globalPaused) {
      setTimeout(lightNext, 100);
      return;
    }
    if (bar.step >= 10) {
      bar.running = false;
      return;
    }
    const seg = $(`seg-5-${bar.step}`);
    if (seg) seg.classList.add("active");
    const pct = Math.round(((bar.step + 1) / 10) * 100);
    const pctEl = $("pct-5");
    if (pctEl) pctEl.textContent = pct + "%";
    bar.step++;
    if (bar.step < 10) setTimeout(lightNext, interval);
    else bar.running = false;
  }
  setTimeout(lightNext, 100);
}

function resetSegmented() {
  state.bars[5].running = false;
  state.bars[5].step = 0;
  document
    .querySelectorAll('[id^="seg-5-"]')
    .forEach((s) => s.classList.remove("active"));
  const pctEl = $("pct-5");
  if (pctEl) pctEl.textContent = "0%";
}

/* ═══════════════════════
   7. STEP PROGRESS (id=8)
   ═══════════════════════ */
function buildSteps() {
  const track = $("track-8");
  if (!track) return;
  track.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    // Connector before node (except first)
    if (i > 0) {
      const conn = document.createElement("div");
      conn.className = "step-connector";
      conn.id = `conn-8-${i}`;
      track.appendChild(conn);
    }
    const node = document.createElement("div");
    node.className = "step-node";
    node.innerHTML = `
      <div class="step-circle" id="step-circle-${i}">${i + 1}</div>
      <span class="step-label">${STEP_LABELS[i]}</span>
    `;
    track.appendChild(node);
  }
}

function runSteps() {
  const bar = state.bars[8];
  if (bar.running) return;
  bar.running = true;
  bar.step = 0;

  // Reset visuals
  for (let i = 0; i < 5; i++) {
    const circle = $(`step-circle-${i}`);
    if (circle) {
      circle.classList.remove("done", "active");
    }
    const conn = $(`conn-8-${i + 1}`);
    if (conn) conn.classList.remove("done");
  }

  const interval = (state.speed * 1000) / 5;

  function nextStep() {
    if (state.globalPaused) {
      setTimeout(nextStep, 100);
      return;
    }
    if (bar.step >= 5) {
      bar.running = false;
      return;
    }

    // Mark previous as done
    if (bar.step > 0) {
      const prev = $(`step-circle-${bar.step - 1}`);
      if (prev) {
        prev.classList.remove("active");
        prev.classList.add("done");
        prev.textContent = "✓";
      }
      const conn = $(`conn-8-${bar.step}`);
      if (conn) conn.classList.add("done");
    }

    // Mark current as active
    const curr = $(`step-circle-${bar.step}`);
    if (curr) curr.classList.add("active");

    const pctEl = $("pct-8");
    if (pctEl) pctEl.textContent = `${bar.step + 1}/5`;

    bar.step++;

    if (bar.step < 5) {
      setTimeout(nextStep, interval);
    } else {
      // Complete final
      setTimeout(() => {
        const last = $(`step-circle-4`);
        if (last) {
          last.classList.remove("active");
          last.classList.add("done");
          last.textContent = "✓";
        }
        const pctEl = $("pct-8");
        if (pctEl) pctEl.textContent = "5/5";
        bar.running = false;
      }, interval);
    }
  }
  setTimeout(nextStep, 100);
}

function resetSteps() {
  state.bars[8].running = false;
  state.bars[8].step = 0;
  for (let i = 0; i < 5; i++) {
    const circle = $(`step-circle-${i}`);
    if (circle) {
      circle.classList.remove("done", "active");
      circle.textContent = i + 1;
    }
    const conn = $(`conn-8-${i + 1}`);
    if (conn) conn.classList.remove("done");
  }
  const pctEl = $("pct-8");
  if (pctEl) pctEl.textContent = "0/5";
}

/* ═══════════════════════
   8. INDETERMINATE (id=7)
   ═══════════════════════ */
function toggleIndeterminate() {
  const bar = state.bars[7];
  const fill = $("fill-7");
  if (!fill) return;

  if (bar.active) {
    bar.active = false;
    fill.style.animationPlayState = "paused";
  } else {
    bar.active = true;
    fill.style.animationPlayState = "running";
  }
}

function resetIndeterminate() {
  state.bars[7].active = false;
  const fill = $("fill-7");
  if (fill) fill.style.animationPlayState = "paused";
}

/* ═══════════════════════
   9. STACKED BAR (id=10)
   ═══════════════════════ */
function runStacked() {
  const bar = state.bars[10];
  if (bar.running) return;
  bar.running = true;

  const fillA = $("fill-10a"); // 50%
  const fillB = $("fill-10b"); // 30%
  const fillC = $("fill-10c"); // 20%
  const pctEl = $("pct-10");

  if (!fillA) return;

  const duration = state.speed * 1000;
  let startTs = null;

  function step(ts) {
    if (state.globalPaused) {
      requestAnimationFrame(step);
      return;
    }
    if (!startTs) startTs = ts;
    const t = Math.min((ts - startTs) / duration, 1);
    const e = ease.out(t);

    fillA.style.width = e * 50 + "%";
    fillB.style.width = e * 30 + "%";
    fillC.style.width = e * 20 + "%";

    const total = Math.round(e * 100);
    if (pctEl) pctEl.textContent = total + "%";

    if (t < 1) requestAnimationFrame(step);
    else bar.running = false;
  }
  requestAnimationFrame(step);
}

function resetStacked() {
  state.bars[10].running = false;
  ["fill-10a", "fill-10b", "fill-10c"].forEach((id) => {
    const el = $(id);
    if (el) el.style.width = "0%";
  });
  const pctEl = $("pct-10");
  if (pctEl) pctEl.textContent = "0%";
}

/* ═══════════════════════
   10. DISPATCH PLAY/RESET
   ═══════════════════════ */
function playBar(id) {
  id = parseInt(id);
  switch (id) {
    case 1:
      runBar(1, ease.inOut);
      break;
    case 2:
      runBar(2, ease.inOut);
      break;
    case 3:
      runBar(3, ease.inOut);
      break;
    case 4:
      runBar(4, ease.inOut);
      break;
    case 5:
      runSegmented();
      break;
    case 6:
      runBar(6, ease.spring);
      break;
    case 7:
      toggleIndeterminate();
      break;
    case 8:
      runSteps();
      break;
    case 9:
      runBar(9, ease.inOut);
      break;
    case 10:
      runStacked();
      break;
  }
}

function doReset(id) {
  id = parseInt(id);
  switch (id) {
    case 5:
      resetSegmented();
      break;
    case 7:
      resetIndeterminate();
      break;
    case 8:
      resetSteps();
      break;
    case 10:
      resetStacked();
      break;
    default:
      resetBar(id);
  }
}

/* ═══════════════════════
   11. GLOBAL CONTROLS
   ═══════════════════════ */
$("btn-run-all").addEventListener("click", () => {
  state.globalPaused = false;
  for (let i = 1; i <= 10; i++) {
    setTimeout(() => playBar(i), (i - 1) * 80);
  }
});

$("btn-reset-all").addEventListener("click", () => {
  state.globalPaused = false;
  for (let i = 1; i <= 10; i++) doReset(i);
});

$("btn-pause-all").addEventListener("click", () => {
  state.globalPaused = !state.globalPaused;
  $("btn-pause-all").textContent = state.globalPaused ? "▶ Resume" : "⏸ Pause";
  // Pause/resume CSS animations
  document
    .querySelectorAll(
      ".striped-fill, .gradient-fill, .shimmer-fill, .pulse-fill, .indeterminate-fill",
    )
    .forEach((el) => {
      el.style.animationPlayState = state.globalPaused ? "paused" : "running";
    });
});

// Speed control
$("global-speed").addEventListener("input", function () {
  state.speed = parseFloat(this.value);
  $("speed-val").textContent = state.speed + "s";
  Object.keys(state.bars).forEach((id) => {
    if (state.bars[id].duration !== undefined)
      state.bars[id].duration = state.speed * 1000;
  });
});

// Height control
$("global-height").addEventListener("input", function () {
  state.height = parseInt(this.value);
  $("height-val").textContent = state.height + "px";
  applyGlobalStyles();
});

// Radius control
$("global-radius").addEventListener("input", function () {
  state.radius = parseInt(this.value);
  $("radius-val").textContent = state.radius + "px";
  applyGlobalStyles();
});

/* ═══════════════════════
   12. MINI BUTTONS
   ═══════════════════════ */
document.querySelectorAll("[data-bar]").forEach((btn) => {
  btn.addEventListener("click", () => playBar(btn.dataset.bar));
});
document.querySelectorAll("[data-reset]").forEach((btn) => {
  btn.addEventListener("click", () => doReset(btn.dataset.reset));
});

/* ═══════════════════════
   13. CUSTOM BUILDER
   ═══════════════════════ */
function updateBuilder() {
  const { value, style, color, height, radius } = state.builder;

  const track = $("builder-track");
  const fill = $("builder-fill");
  const pct = $("builder-pct");

  if (!track || !fill) return;

  track.style.height = height + "px";
  track.style.borderRadius = radius + "px";
  fill.style.borderRadius = radius + "px";
  fill.style.width = value + "%";

  // Remove all style classes
  fill.className = "builder-fill";

  // Apply style
  fill.style.background = "";
  fill.style.animation = "";
  fill.style.boxShadow = "";

  switch (style) {
    case "linear":
      fill.style.background = `linear-gradient(90deg, ${color}99, ${color})`;
      break;
    case "striped":
      fill.style.background = `repeating-linear-gradient(-45deg, ${color}, ${color} 10px, ${color}66 10px, ${color}66 20px)`;
      fill.style.backgroundSize = "28px 28px";
      fill.style.animation = "stripeScroll 1s linear infinite";
      break;
    case "gradient":
      fill.style.background = `linear-gradient(90deg, #f43f5e, #f59e0b, #34d399, #38bdf8, ${color})`;
      fill.style.backgroundSize = "300% 100%";
      fill.style.animation = "gradientShift 3s linear infinite";
      break;
    case "pulse":
      fill.style.background = color;
      fill.style.boxShadow = `0 0 12px ${color}99`;
      fill.style.animation = "pulseGlow 1.2s ease-in-out infinite";
      break;
    case "shimmer":
      fill.style.background = `linear-gradient(90deg, ${color} 0%, ${color}66 40%, white 50%, ${color}66 60%, ${color} 100%)`;
      fill.style.backgroundSize = "200% 100%";
      fill.style.animation = "shimmerSlide 1.5s linear infinite";
      break;
  }

  if (pct) pct.textContent = value + "%";
  generateCode();
}

function generateCode() {
  const { value, style, color, height, radius } = state.builder;
  let fillCSS = "";

  switch (style) {
    case "linear":
      fillCSS = `background: linear-gradient(90deg, ${color}99, ${color});`;
      break;
    case "striped":
      fillCSS = `background: repeating-linear-gradient(\n  -45deg,\n  ${color}, ${color} 10px,\n  ${color}66 10px, ${color}66 20px\n);\nbackground-size: 28px 28px;\nanimation: stripeScroll 1s linear infinite;`;
      break;
    case "gradient":
      fillCSS = `background: linear-gradient(90deg, #f43f5e, #f59e0b, #34d399, #38bdf8, ${color});\nbackground-size: 300% 100%;\nanimation: gradientShift 3s linear infinite;`;
      break;
    case "pulse":
      fillCSS = `background: ${color};\nbox-shadow: 0 0 12px ${color}99;\nanimation: pulseGlow 1.2s ease-in-out infinite;`;
      break;
    case "shimmer":
      fillCSS = `background: linear-gradient(\n  90deg,\n  ${color} 0%,\n  ${color}66 40%,\n  white 50%,\n  ${color}66 60%,\n  ${color} 100%\n);\nbackground-size: 200% 100%;\nanimation: shimmerSlide 1.5s linear infinite;`;
      break;
  }

  const code = `.bar-track {\n  height: ${height}px;\n  border-radius: ${radius}px;\n  background: #1a1a2e;\n  overflow: hidden;\n  position: relative;\n}\n\n.bar-fill {\n  height: 100%;\n  width: ${value}%;\n  border-radius: ${radius}px;\n  ${fillCSS}\n}`;

  const codeBlock = $("code-block");
  if (codeBlock) codeBlock.textContent = code;
}

// Builder event listeners
$("custom-value").addEventListener("input", function () {
  state.builder.value = parseInt(this.value);
  $("custom-val-display").textContent = this.value + "%";
  updateBuilder();
});

$("custom-height-b").addEventListener("input", function () {
  state.builder.height = parseInt(this.value);
  $("custom-height-display").textContent = this.value + "px";
  updateBuilder();
});

$("custom-radius-b").addEventListener("input", function () {
  state.builder.radius = parseInt(this.value);
  $("custom-radius-display").textContent = this.value + "px";
  updateBuilder();
});

$("custom-color").addEventListener("input", function () {
  state.builder.color = this.value;
  updateBuilder();
});

document.querySelectorAll(".color-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    state.builder.color = dot.dataset.color;
    $("custom-color").value = dot.dataset.color;
    updateBuilder();
  });
});

document.querySelectorAll(".style-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document
      .querySelectorAll(".style-pill")
      .forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    state.builder.style = pill.dataset.style;
    updateBuilder();
  });
});

// Copy CSS code
$("copy-code-btn").addEventListener("click", async () => {
  const code = $("code-block").textContent;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = code;
    ta.style.cssText = "position:fixed;opacity:0;";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const btn = $("copy-code-btn");
  const orig = btn.innerHTML;
  btn.innerHTML = "✓ Copied!";
  btn.style.color = "var(--accent)";
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.color = "";
  }, 1800);
});

/* ═══════════════════════
   14. THEME
   ═══════════════════════ */
$("btn-theme").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  $("theme-icon").textContent = state.theme === "dark" ? "☽" : "☀";
});

/* ═══════════════════════
   15. INTERSECTION OBSERVER
   Auto-play bars when scrolled into view
   ═══════════════════════ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const id = card.querySelector("[data-bar]")?.dataset.bar;
        if (id) {
          setTimeout(() => playBar(id), 200);
          observer.unobserve(card);
        }
      }
    });
  },
  { threshold: 0.4 },
);

document
  .querySelectorAll(".bar-card")
  .forEach((card) => observer.observe(card));

/* ═══════════════════════
   16. INIT
   ═══════════════════════ */
function init() {
  buildSegments();
  buildSteps();
  applyGlobalStyles();
  updateBuilder();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
