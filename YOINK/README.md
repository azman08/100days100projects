# 🪄 YOINK — Copy to Clipboard

## 🚀 Live Demo

**[→ 100days100projects-chi.vercel.app](100days100projects-yoink.vercel.app)**

---

## 📌 About

Everyone uses copy-paste. Nobody thinks twice about it.

**YOINK** turns that everyday action into a sharp, fully-featured clipboard utility — built with zero frameworks, zero libraries, and zero dependencies. Just HTML, CSS, and JavaScript doing exactly what they were made for.

Inspired by Vercel and shadcn/ui design systems. Built to 2026 UI standards.

---

## ✨ Features

### 📋 Core Copy Engine
- One-click copy on any snippet card
- Native **Clipboard API** with `execCommand` fallback for older browsers
- Ripple animation positioned exactly where you click
- Copy icon swaps to ✓ checkmark on success
- "Copied" label slides in per card

### ✍️ Custom Text Copy
- Textarea for typing or pasting any custom content
- Live **character counter** updating as you type
- Dedicated copy button with flash feedback
- Keyboard shortcut: `Ctrl / Cmd + Shift + C`

### 🗂 Snippet Library (15 Preloaded)
Ready-to-copy snippets across 4 categories:

| Category | Examples |
|----------|---------|
| **Dev** | Git init, npm install, async fetch, CSS flexbox, Vercel deploy |
| **Social** | LinkedIn bio, Twitter/X CTA, GitHub bio |
| **Email** | Follow-up template, project intro |
| **Design** | Hex colors, CSS shadow, glassmorphism snippet |

### 🔔 Toast Notification System
- Slides in from top-right on every copy action
- Green for success, red for error
- Auto-dismisses after 2.2 seconds
- Timer resets on rapid copies

### 🕐 Copy History
- Stores last **20 copied items** (session-based)
- Shows preview text + timestamp per entry
- Re-copy any item instantly from history
- Clear all history with one click
- Skips duplicate entries at the top

### 🎨 UI & Design
- Dark / Light theme toggle
- Electric mint `#00f5a0` accent palette
- JetBrains Mono + Outfit typography
- Glassmorphism card surfaces
- Animated dot-grid background
- Floating glow blobs + noise texture overlay
- LinkedIn, GitHub, Linktree social links in header
- Fully responsive — mobile to desktop

### ♿ Accessibility
- `aria-live` region for copy feedback
- `role="button"` + `tabindex` on all cards
- Full keyboard navigation (Enter / Space to copy)
- `focus-visible` styles throughout
- Semantic HTML structure

---

## 🧠 Engineering Highlights

| Concept | Implementation |
|---------|---------------|
| Clipboard | Native API + `execCommand` fallback |
| Ripple | CSS `radial-gradient` via `--rx` / `--ry` custom properties |
| History | In-memory array, max 20, dedup at head |
| Keyboard | `keydown` global listener for shortcut |
| Feedback | CSS class toggle + `setTimeout` cleanup |
| Escaping | `escapeHtml()` to prevent XSS in rendered history |

---

## 🛠 Tech Stack

```
HTML5   — Semantic structure & accessibility
CSS3    — Custom properties, animations, glassmorphism
JS ES6+ — Clipboard API, DOM manipulation, event delegation
```

Zero npm. Zero build tools. Drop the files in a folder and open.

---

## 📁 File Structure

```
yoink/
├── index.html    # Markup & structure    
├── style.css     # All styles          
└── script.js     # All logic             
```

---



## 💡 What I Learned

- How the **Clipboard API** works and why a fallback still matters
- Positioning ripple effects using CSS custom properties set via JavaScript
- Building a **toast notification system** from scratch with auto-dismiss and timer reset
- Managing **session history** in memory with deduplication logic
- Why `escapeHtml()` matters even in small projects
- How keyboard shortcuts feel natural when built into existing UI patterns

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

Built with ❤️ and consistency · Part of the 100 Days 100 Projects series</sub>

</div>
