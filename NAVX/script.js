/**
 * NAVX — Sticky Navbar on Scroll · script.js
 * 2026 · 100 Days 100 Projects · Azman Ali
 *
 * 8 Scroll Behaviors:
 *  1. Sticky after scroll past hero
 *  2. Hide on scroll down
 *  3. Reveal on scroll up
 *  4. Glassmorphism effect
 *  5. Active section tracking (IntersectionObserver)
 *  6. Scroll progress bar
 *  7. Shrink height on scroll
 *  8. Back-to-top button visibility
 *
 * Bonus:
 *  • Mobile drawer with staggered animations
 *  • Hamburger ↔ X morphing
 *  • Smooth scroll to sections
 *  • Live state badge
 *  • Dark / Light app theme toggle
 */

"use strict";

/* ════════════════════════
   1. CONSTANTS & STATE
   ════════════════════════ */
const SCROLL_THRESHOLD = 10; // px before sticky kicks in
const HIDE_THRESHOLD = 80; // px scrolled before navbar hides on down
const BACK_TOP_THRESHOLD = 400; // px before back-to-top appears

const state = {
  lastScrollY: 0,
  currentScrollY: 0,
  isScrolled: false,
  isHidden: false,
  isMobileOpen: false,
  theme: "dark",
  ticking: false, // RAF throttle flag
  activeSection: "home",
};

/* ════════════════════════
   2. DOM REFS
   ════════════════════════ */
const navbar = document.getElementById("navbar");
const progressFill = document.getElementById("scroll-progress-fill");
const stateBadge = document.getElementById("nav-state-badge");
const stateText = document.getElementById("state-text");
const stateDot = document.getElementById("state-dot");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");
const backToTop = document.getElementById("back-to-top");
const btnTheme = document.getElementById("btn-theme");
const themeIcon = document.getElementById("theme-icon");
const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
const sections = document.querySelectorAll(".section[id]");

/* ════════════════════════
   3. SCROLL HANDLER
   Uses requestAnimationFrame for 60fps performance
   ════════════════════════ */
function onScroll() {
  state.currentScrollY = window.scrollY;
  if (!state.ticking) {
    requestAnimationFrame(updateNavbar);
    state.ticking = true;
  }
}

function updateNavbar() {
  const scrollY = state.currentScrollY;
  const scrollDelta = scrollY - state.lastScrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // ── Behavior 1 & 4 & 7: Sticky + glass + shrink ──
  if (scrollY > SCROLL_THRESHOLD) {
    if (!state.isScrolled) {
      navbar.classList.add("is-scrolled");
      state.isScrolled = true;
    }
  } else {
    if (state.isScrolled) {
      navbar.classList.remove("is-scrolled");
      // When back at top always show
      navbar.classList.remove("is-hidden");
      navbar.classList.add("is-visible");
      state.isScrolled = false;
      state.isHidden = false;
    }
  }

  // ── Behavior 2 & 3: Hide on scroll down / reveal on scroll up ──
  if (scrollY > HIDE_THRESHOLD) {
    if (scrollDelta > 4 && !state.isHidden) {
      // Scrolling DOWN — hide navbar
      navbar.classList.add("is-hidden");
      navbar.classList.remove("is-visible");
      state.isHidden = true;
      updateStateBadge("Hidden", "#f43f5e");
    } else if (scrollDelta < -4 && state.isHidden) {
      // Scrolling UP — reveal navbar
      navbar.classList.remove("is-hidden");
      navbar.classList.add("is-visible");
      state.isHidden = false;
      updateStateBadge("Visible", "#34d399");
    }
  }

  // ── Behavior 6: Scroll progress bar ──
  if (docHeight > 0) {
    const pct = Math.min((scrollY / docHeight) * 100, 100);
    progressFill.style.width = pct + "%";
  }

  // ── Back to Top button ──
  if (scrollY > BACK_TOP_THRESHOLD) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  // ── Update state badge ──
  if (!state.isHidden) {
    if (scrollY <= SCROLL_THRESHOLD) {
      updateStateBadge("Default", "var(--accent)");
    } else {
      updateStateBadge("Scrolled", "var(--accent)");
    }
  }

  state.lastScrollY = scrollY;
  state.ticking = false;
}

/* ════════════════════════
   4. STATE BADGE
   ════════════════════════ */
function updateStateBadge(text, color) {
  if (stateText) stateText.textContent = text;
  if (stateDot) stateDot.style.background = color;
}

/* ════════════════════════
   5. BEHAVIOR 5: ACTIVE SECTION TRACKING
   IntersectionObserver watches all sections
   ════════════════════════ */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        setActiveLink(id);
        state.activeSection = id;
      }
    });
  },
  {
    root: null,
    rootMargin: "-30% 0px -60% 0px", // activates when section is in middle 10%
    threshold: 0,
  },
);

sections.forEach((section) => sectionObserver.observe(section));

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
  mobileNavLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });
}

/* ════════════════════════
   6. BEHAVIOR 8: MOBILE DRAWER
   ════════════════════════ */
function openMobileMenu() {
  state.isMobileOpen = true;
  hamburger.classList.add("is-open");
  hamburger.setAttribute("aria-expanded", "true");
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileOverlay.classList.add("is-open");
  mobileOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  state.isMobileOpen = false;
  hamburger.classList.remove("is-open");
  hamburger.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileOverlay.classList.remove("is-open");
  mobileOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  state.isMobileOpen ? closeMobileMenu() : openMobileMenu();
});

mobileOverlay.addEventListener("click", closeMobileMenu);

// Close mobile menu when a link is clicked
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

/* ════════════════════════
   7. SMOOTH SCROLL
   ════════════════════════ */
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const navHeight = navbar.offsetHeight;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const scrollTarget = targetTop - navHeight - 16;

  window.scrollTo({ top: scrollTarget, behavior: "smooth" });
}

// Desktop nav links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const section = link.dataset.section;
    if (section) {
      e.preventDefault();
      smoothScrollTo(section);
    }
  });
});

// Hero buttons and any anchor
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href").slice(1);
    if (targetId && document.getElementById(targetId)) {
      e.preventDefault();
      smoothScrollTo(targetId);
    }
  });
});

/* ════════════════════════
   8. BACK TO TOP
   ════════════════════════ */
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ════════════════════════
   9. THEME TOGGLE
   ════════════════════════ */
btnTheme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  themeIcon.textContent = state.theme === "dark" ? "☽" : "☀";
});

/* ════════════════════════
   10. KEYBOARD NAVIGATION
   ════════════════════════ */
document.addEventListener("keydown", (e) => {
  // Escape closes mobile menu
  if (e.key === "Escape" && state.isMobileOpen) {
    closeMobileMenu();
    hamburger.focus();
  }
});

/* ════════════════════════
   11. SCROLL LISTENER
   ════════════════════════ */
window.addEventListener("scroll", onScroll, { passive: true });

/* ════════════════════════
   12. SECTION REVEAL
   Animate sections on scroll into view
   ════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

// Reveal stat cards, feature cards, tech items on scroll
document
  .querySelectorAll(
    ".stat-card, .feature-card, .showcase-card, .tech-item, .concept-tag",
  )
  .forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s cubic-bezier(.16,1,.3,1) ${i * 0.04}s`;
    revealObserver.observe(el);
  });

/* ════════════════════════
   13. INIT
   ════════════════════════ */
function init() {
  // Run once on load to set correct initial state
  updateNavbar();
  updateStateBadge("Default", "var(--accent)");

  // Set first link as active
  setActiveLink("home");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
