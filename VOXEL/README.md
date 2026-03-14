
# ⬡ VOXEL — Poll & Voting App

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)

---

## 🚀 Live Demo

https://100days100projects-tnjg.vercel.app/
---

## 📌 About

Every social platform has a poll feature. Nobody ever builds one from scratch.

**VOXEL** is a fully-featured poll and voting app — create polls, cast votes, watch animated live results, track history, and share results — all built with zero frameworks, zero libraries, and zero dependencies. Just HTML, CSS, and JavaScript doing exactly what they were made for.

Inspired by Vercel and shadcn/ui design systems. Built to 2026 UI standards.

---

## ✨ Features

### 🗳️ Core Voting Engine
- **4 default polls** preloaded — ready to vote immediately
- **Single-choice** voting — auto-submits on option click
- **Multi-choice** voting — select multiple options, then submit
- **Vote once per poll** — stored in `localStorage` to persist across refreshes
- **Animated fill bars** per option — fills in real time after voting
- **Per-option color coding** — Amber, Sky, Violet, Emerald, Rose, Orange

### ⏱ Countdown Timer
- Configurable timer: 5 min, 10 min, 30 min, 1 hour, or no limit
- Live countdown display — `MM:SS` format
- Animated timer progress bar — turns red in final 30 seconds
- Auto-closes poll when timer expires
- Shows `∞` for unlimited polls

### 📊 Live Results Chart
- Animated horizontal bar chart in the results panel
- Staggered bar entrance animations on render
- Leading option highlighted with 👑 crown
- Shows: option text, percentage, vote count
- Updates live stats: total votes, leader %, option count

### 🏗️ Create Custom Polls
- Question input with 120-character counter
- Minimum 2 options, maximum 6 options
- Add / remove option rows dynamically
- Option letter labels (A → F) auto-relabeled on removal
- Settings: timer duration, single/multi-choice, anonymous toggle
- Collapsible panel to save screen space
- Launches instantly and loads as the active poll

### 📋 Poll History
- Every closed poll auto-saves to history
- Shows question, vote count, option count, type and winner
- Click any history item to reopen that poll
- Clear All button
- Persisted in `localStorage` across sessions

### 🔔 Smart UX
- **Winner banner** — appears after voting showing the current leader
- **Toast notifications** — vote cast, poll reset, launched, copied
- **Share results** — Web Share API with clipboard fallback
- **Reset poll** — clears all votes and restarts timer
- **Close poll** — manually ends a poll and archives it
- **Dark / Light theme toggle**

### 🎨 UI & Design
- Warm editorial aesthetic — deep ink + amber `#f5a623` accent
- Fraunces serif display font + Outfit + Geist Mono
- Glassmorphism card surfaces
- Animated dot-grid background
- Floating glow blobs + noise texture overlay
- LinkedIn, GitHub, Linktree social links
- Fully responsive — 280px foldable to 1280px+ desktop

### ♿ Accessibility
- `role="radio"` / `role="checkbox"` on poll options
- `aria-checked` updated on selection
- `aria-live="assertive"` on toast region
- Full keyboard navigation (Enter / Space to vote)
- `focus-visible` styles throughout
- `prefers-reduced-motion` supported
- Semantic HTML structure

---

## 🧠 Engineering Highlights

| Concept | Implementation |
|---------|---------------|
| Vote persistence | `localStorage` keyed by poll ID |
| Timer engine | `setInterval` with `clearInterval` on unmount / close |
| Results animation | `requestAnimationFrame` + CSS `transition` on width |
| Option colors | CSS `--opt-color` custom property set via `style.setProperty` |
| Multi-choice | `Set` of selected option IDs, submit button appears dynamically |
| History | In-memory array + `localStorage` serialisation |
| XSS safety | `escHtml()` on all user-generated content before DOM insertion |
| Share | `navigator.share` → `navigator.clipboard` fallback |
| Dynamic options | DOM manipulation with auto-relabeling on removal |
| Stagger animations | CSS `transition-delay` calculated per option index |

---

## 🛠 Tech Stack

```
HTML5   — Semantic structure & ARIA accessibility
CSS3    — Custom properties, animations, glassmorphism
JS ES6+ — Set, localStorage, requestAnimationFrame, Web Share API
```

Zero npm. Zero build tools. Drop the files in a folder and open.

---

## 📁 File Structure

```
poll-app/
├── index.html    # Markup & structure
├── style.css     # All styles & animations
└── script.js     # Full voting engine & logic
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/azman08/100days100projects.git

# Navigate to this project
cd poll-app

# Open in browser — that's it
open index.html
```

No installs. No config. No build step.

---

## 💡 What I Learned

- How to build a full vote-once system using `localStorage` keyed by poll ID
- Why `requestAnimationFrame` + CSS transitions produce smoother animations than direct `style` changes
- How CSS `--opt-color` custom properties enable per-component color theming from JavaScript
- How to use a JavaScript `Set` to manage multi-choice selections cleanly
- Why `escHtml()` is non-negotiable even in small projects — XSS is always a risk
- How the Web Share API works and why a clipboard fallback is essential
- How `setInterval` timers need to be carefully cleared on state changes to avoid memory leaks

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
