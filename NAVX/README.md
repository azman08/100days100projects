# ◈ NAVX — Sticky Navbar on Scroll

> **Day [X] of 100** · [100 Days 100 Projects Challenge](https://100days100projects-chi.vercel.app)

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)

---

## 🚀 Live Demo

**[→ 100days100projects-chi.vercel.app](https://100days100projects-chi.vercel.app/)**

---

## 📌 About

Everyone uses `position: sticky`. Almost nobody engineers it properly.

**NAVX** is a fully engineered sticky navbar system with 8 distinct scroll behaviors — built with zero frameworks, zero libraries, and zero dependencies. Just HTML, CSS, and JavaScript doing exactly what they were made for.

Scroll down and watch the navbar transform in real time.

---

## ✨ Features

### 🧲 8 Scroll Behaviors

| #   | Behavior                    | Implementation                                      |
| --- | --------------------------- | --------------------------------------------------- |
| 01  | **Sticky after scroll**     | Triggers after `SCROLL_THRESHOLD = 10px`            |
| 02  | **Hide on scroll down**     | Hides once past `HIDE_THRESHOLD = 80px`             |
| 03  | **Reveal on scroll up**     | Instantly slides back on scroll up                  |
| 04  | **Glassmorphism effect**    | `backdrop-filter: blur(18px)` + semi-transparent bg |
| 05  | **Active section tracking** | `IntersectionObserver` with `rootMargin` tuning     |
| 06  | **Scroll progress bar**     | Thin accent bar fills as you scroll                 |
| 07  | **Shrink on scroll**        | Height reduces from 72px → 56px via CSS transition  |
| 08  | **Mobile drawer**           | Fullscreen menu with staggered link animations      |

### 📱 Mobile Drawer

- Hamburger → X icon morphing with CSS transform
- Full-screen overlay menu
- Numbered staggered link entrance animations
- Tap overlay to close
- `Escape` key to close

### 🔍 Active Section Tracking

- `IntersectionObserver` watches all 6 page sections
- Correct nav link highlights in real time as you scroll
- Works on both desktop and mobile menu

### 📊 Live State Badge

- Shows real-time navbar state: Default / Scrolled / Hidden / Visible
- Animated dot + color-coded per state

### 🎨 UI & Design

- Dark / Light theme toggle
- Electric lime `#c8f135` accent palette
- Cabinet Grotesk + Chivo Mono typography
- Brutalist editorial dark aesthetic
- Animated dot-grid background
- Floating glow blobs + noise texture
- LinkedIn, GitHub, Linktree social links
- Back-to-top button with smooth scroll
- Section reveal animations on scroll

### ♿ Accessibility

- `role="banner"` on navbar, `role="navigation"` on nav
- `aria-expanded` on hamburger button
- `aria-hidden` on mobile menu and overlay
- `aria-current="page"` on active nav link
- `Escape` key closes mobile menu
- `focus-visible` styles throughout
- `prefers-reduced-motion` supported

---

## 🧠 Engineering Highlights

| Concept           | Implementation                                                |
| ----------------- | ------------------------------------------------------------- |
| Scroll detection  | `window.addEventListener('scroll', fn, { passive: true })`    |
| Performance       | `requestAnimationFrame` throttle — zero dropped frames        |
| Section tracking  | `IntersectionObserver` with `rootMargin: '-30% 0px -60% 0px'` |
| Reveal animations | Second `IntersectionObserver` instance for cards              |
| Hide/reveal logic | `scrollDelta > 4` (down) / `scrollDelta < -4` (up)            |
| Glass effect      | `backdrop-filter: blur(18px) saturate(1.4)`                   |
| Smooth scroll     | Custom `smoothScrollTo()` accounting for navbar height        |
| Mobile menu       | CSS `translateX(100%)` → `translateX(0)` with stagger delays  |
| Hamburger morph   | 3-line → X via `rotate` + `translateY` CSS transforms         |

---

## 🛠 Tech Stack

```
HTML5   — Semantic structure & ARIA accessibility
CSS3    — Custom properties, backdrop-filter, transitions, transforms
JS ES6+ — IntersectionObserver, requestAnimationFrame, scroll events
```

Zero npm. Zero build tools. Drop the files in a folder and open.

---

## 📁 File Structure

```
sticky-navbar/
├── index.html    # Markup, full page demo with 6 sections
├── style.css     # All styles, themes & responsive design
└── script.js     # All scroll logic & behaviors
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/azman08/100days100projects.git

# Navigate to this project
cd sticky-navbar

# Open in browser — that's it
open index.html
```

No installs. No config. No build step.

---

## 💡 What I Learned

- Why `requestAnimationFrame` is essential for scroll performance — never block the main thread
- How `IntersectionObserver` with `rootMargin` creates precise active section detection
- The difference between `scrollDelta > 4` vs `scrollDelta > 0` for smoother hide/reveal
- How `backdrop-filter` creates glassmorphism — and why it needs a semi-transparent background to work
- How staggered `transition-delay` creates the cascading menu animation
- How to morph a hamburger into an X using only CSS transforms on 3 `<span>` elements
- Why `passive: true` on scroll listeners matters for touch performance

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
