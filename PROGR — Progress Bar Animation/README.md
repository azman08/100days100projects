# ▣ PROGR — Progress Bar Animation


![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)

---

## 🚀 Live Demo

https://100days100projects-progr.vercel.app/
---

## 📌 About

Everyone has seen a progress bar. Nobody thinks about how it actually works.


**PROGR** turns that boring UI element into a full interactive showcase — 10 distinct animation styles, a live custom builder, global controls, and auto-play on scroll. Built with zero frameworks, zero libraries, and zero dependencies. Just HTML, CSS, and JavaScript doing exactly what they were made for.

Inspired by Vercel and shadcn/ui design systems. Built to 2026 UI standards.

---

## ✨ Features

### 📊 10 Progress Bar Animation Styles

| #   | Style              | Technique                                     |
| --- | ------------------ | --------------------------------------------- |
| 01  | **Linear Smooth**  | `ease-in-out` RAF animation                   |
| 02  | **Striped**        | Animated diagonal CSS repeating-gradient      |
| 03  | **Pulse Glow**     | `box-shadow` neon pulse keyframe              |
| 04  | **Gradient Shift** | Moving 5-color gradient background            |
| 05  | **Segmented**      | 10 discrete segments lit one-by-one           |
| 06  | **Bouncy Spring**  | Custom `cubic-bezier(.34,1.56,.64,1)` easing  |
| 07  | **Indeterminate**  | Infinite sliding CSS animation loop           |
| 08  | **Step Progress**  | 5 nodes + connectors with done/active states  |
| 09  | **Shimmer**        | Skeleton shimmer light sweep                  |
| 10  | **Stacked**        | 3-section multi-color bar (Design/Dev/Review) |

### 🎛 Global Controls

- **Speed** slider — 0.5s to 5s animation duration
- **Height** slider — 4px to 40px bar thickness
- **Radius** slider — 0px to 20px border radius
- **Run All** — plays every bar with staggered delay
- **Pause All / Resume** — freezes all active animations
- **Reset All** — resets every bar to zero instantly

### 🛠 Custom Builder

- Live **value slider** — 0% to 100%
- **5 style options** — Linear, Striped, Gradient, Pulse, Shimmer
- **Color picker** + 5 quick-select color presets
- Custom **height** and **radius** sliders
- **Live preview** updates in real time
- **Generated CSS code** output — copy-ready

### 👁 Smart Auto-play

- `IntersectionObserver` triggers each bar automatically as it scrolls into view
- No manual interaction needed — just scroll and watch

### 🎨 UI & Design

- Dark / Light theme toggle
- Violet `#a78bfa` accent palette
- Space Mono + Space Grotesk typography
- Glassmorphism card surfaces
- Animated dot-grid background
- Floating glow blobs + noise texture overlay
- LinkedIn, GitHub, Linktree social links in header
- Fully responsive — 280px foldable to 1280px desktop

### ♿ Accessibility

- `role="progressbar"` with `aria-valuenow` on all bars
- `aria-label` on every interactive control
- Full keyboard navigation
- `focus-visible` styles throughout
- `prefers-reduced-motion` support — all animations disabled gracefully
- High contrast mode support
- Semantic HTML structure

---

## 🧠 Engineering Highlights

| Concept       | Implementation                                         |
| ------------- | ------------------------------------------------------ |
| Animation     | `requestAnimationFrame` with custom easing functions   |
| Easing        | Custom `ease.inOut`, `ease.out`, `ease.spring` in JS   |
| Segmented     | `setTimeout` chain, interval = speed ÷ 10              |
| Steps         | Sequential node activation with connector fill         |
| Indeterminate | Pure CSS `@keyframes` with `animationPlayState` toggle |
| Stacked       | RAF loop splitting width across 3 fills simultaneously |
| Auto-play     | `IntersectionObserver` at 40% threshold per card       |
| Builder       | Live DOM mutation + CSS string generation              |
| Copy CSS      | Clipboard API with `execCommand` fallback              |

---

## 🛠 Tech Stack

```
HTML5   — Semantic structure & accessibility
CSS3    — Custom properties, keyframes, glassmorphism
JS ES6+ — requestAnimationFrame, IntersectionObserver, Clipboard API
```

Zero npm. Zero build tools. Drop the files in a folder and open.

---

## 📁 File Structure

```
progress-bar/
├── index.html    # Markup & structure
├── style.css     # All styles & animations
└── script.js     # All logic & interactivity
```

## 💡 What I Learned

- How `requestAnimationFrame` enables buttery-smooth, drift-free animations
- Writing custom easing functions in JavaScript from scratch
- How `cubic-bezier` spring physics create bouncy, organic motion
- Using `IntersectionObserver` to trigger animations only when visible
- Why `animationPlayState` is the cleanest way to pause CSS animations
- How to generate valid CSS strings dynamically from UI state
- The difference between determinate and indeterminate progress patterns

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

