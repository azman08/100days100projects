# ◎ LINEAGE — Animated Timeline Component

> **Day [X] of 100** · [100 Days 100 Projects Challenge](https://100days100projects-chi.vercel.app)

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)

---

## 🚀 Live Demo


---

## 📌 About

Timelines are everywhere — resumes, roadmaps, changelogs, portfolios. Most of them are boring.

**LINEAGE** is a fully animated timeline component with 4 layout variants, scroll-triggered reveals, a live-drawing vertical line, expandable cards, category filtering, and rich interaction — built with zero frameworks, zero libraries, and zero dependencies. Just HTML, CSS, and JavaScript.

Inspired by Vercel and shadcn/ui design systems. Built to 2026 UI standards.

---

## ✨ Features

### 🏗️ 4 Layout Variants

| Variant | Description |
|---------|-------------|
| **Left** | Classic left-aligned line, cards flow right |
| **Center** | Alternating cards left & right of centre line |
| **Right** | Mirror of left — line on right, cards flow left |
| **Horizontal** | Horizontal scrolling timeline, cards drop below |

Switch layouts live — the timeline re-renders instantly with the correct geometry.

### 🎬 Scroll-Triggered Animations
- `IntersectionObserver` watches every `.tl-item`
- Items fade up + translate into view as they enter the viewport
- Staggered `transition-delay` (60ms per item) creates cascading entrance
- Dot inner fill scales in with spring easing on reveal
- Left accent bar on each card scales in from bottom on reveal
- Connector line from dot to card scales in with a delay

### 📏 Live Line Draw
- The vertical (or horizontal) line draws itself as you scroll
- Calculated from `getBoundingClientRect()` on the wrapper vs viewport
- A glowing dot travels at the leading edge of the line
- Resets and redraws on Replay

### 🗂️ Category Filter
- **All** — shows all 14 timeline events
- **Milestone** — major life/career moments
- **Project** — shipped projects
- **Learning** — study and skill milestones
- **Launch** — public releases and firsts

Each category has its own color — teal, violet, amber, rose. Applied to dot, card accent bar, and category badge.

### 📋 Expandable Cards
- Click any card to expand a detailed description + tags + optional link
- Smooth `max-height` transition for open/close
- Expand All / Collapse All global controls
- Keyboard accessible — Enter/Space to toggle

### 🔢 Stats Counter
- Total events, milestones, projects, year span
- Animated count-up on page load using `requestAnimationFrame`
- Cubic ease-out for natural deceleration

### 📅 Year Dividers
- Auto-inserted between groups of events from different years
- Hidden in horizontal variant to save space

### 🎨 UI & Design
- Cosmic editorial dark aesthetic
- Deep space `#080a0e` + electric teal `#00e5c3` accent
- Playfair Display (italic serif) + Sora + JetBrains Mono
- Animated dot-grid background
- Floating glow blobs + noise texture overlay
- LinkedIn, GitHub, Linktree social links
- Dark / Light theme toggle
- Fully responsive — 280px foldable to 1280px+ desktop

### ♿ Accessibility
- `role="list"` / `role="listitem"` on timeline
- `role="button"` + `aria-expanded` on cards
- Full keyboard navigation (Tab, Enter, Space)
- `focus-visible` styles throughout
- `prefers-reduced-motion` — all animations instantly resolved
- Semantic heading hierarchy

---

## 🧠 Engineering Highlights

| Concept | Implementation |
|---------|---------------|
| Scroll reveals | `IntersectionObserver` with `rootMargin: '0px 0px -40px 0px'` |
| Staggered delay | `style.transitionDelay = i * 60 + 'ms'` per item |
| Line draw | `getBoundingClientRect()` vs viewport height, updates on scroll |
| Layout switching | CSS class on wrapper + CSS custom properties for geometry |
| Center variant | CSS `nth-child(odd)` flex-direction reverse |
| Stats counter | `requestAnimationFrame` count-up with cubic ease-out |
| Card expand | `max-height: 0` → `max-height: 400px` CSS transition |
| Category color | CSS variables `--cat-milestone`, `--cat-project` etc. |
| Year dividers | JS groups data by year, inserts divider elements |
| XSS safety | `escHtml()` on all data before DOM insertion |

---

## 🛠 Tech Stack

```
HTML5   — Semantic structure & ARIA accessibility
CSS3    — Custom properties, transforms, transitions, pseudo-elements
JS ES6+ — IntersectionObserver, requestAnimationFrame, Set, scroll events
```

Zero npm. Zero build tools. Drop the files in a folder and open.

---

## 📁 File Structure

```
animated-timeline/
├── index.html    # Markup & structure
├── style.css     # All styles, variants & responsive design
└── script.js     # Timeline engine, animations & interactions
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/azman08/100days100projects.git
cd animated-timeline
open index.html
```

No installs. No config. No build step.

---

## 💡 What I Learned

- How `IntersectionObserver` with `rootMargin` controls exactly when items enter the "visible" zone
- Why `transition-delay` staggering (not JS `setTimeout`) is the right tool for cascading animations
- How `getBoundingClientRect()` + scroll position gives pixel-perfect scroll progress
- How `max-height` transitions are the only clean CSS approach for expand/collapse (and why height transitions can't work)
- How CSS custom properties on the wrapper element (`--tl-line-x`, `--tl-card-ml`) make layout variants trivially switchable
- Why `nth-child(odd/even)` combined with `flex-direction: row-reverse` creates the alternating centre layout in pure CSS
- How `requestAnimationFrame` count-up with a cubic easing function creates natural-feeling number animations

---

## 📅 The Challenge

**100 Days · 100 Projects**

- Build 1 project every day
- Ship it publicly
- No skipped days
- No perfection paralysis


---

## 👨‍💻 Author

**Azman Ali**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-azman08-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/azman08/)
[![GitHub](https://img.shields.io/badge/GitHub-azman08-black?style=flat&logo=github)](https://github.com/azman08)
[![Linktree](https://img.shields.io/badge/Linktree-codewithazman-43e55e?style=flat&logo=linktree&logoColor=white)](https://linktr.ee/codewithazman)

---

## ⭐ Support

If this helped you or inspired your own build, drop a star — it keeps the challenge going!

[![Star this repo](https://img.shields.io/github/stars/azman08/100days100projects?style=social)](https://github.com/azman08/100days100projects)

---

<div align="center">
  <sub>Built with ❤️ and consistency · Part of the 100 Days 100 Projects series</sub>
</div>
