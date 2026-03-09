/**
 * CHRONO — Digital Clock
 *
 * Features thats gonna be inside:
 *   Real-time clock with flip animation
 *   12 / 24-hour toggle
 *   Seconds toggle
 *   Dark / Light theme
 *   Seconds SVG arc ring with orbiting dot
 *   Milliseconds live bar
 *   Unix timestamp display
 *   Week & Year progress rings
 *   Stopwatch with lap tracking & delta times
 *   World Clocks (7 cities, live)
 *   Accessible ARIA live region
 *  Smooth flip digit animation
 */

"use strict";

//1. STATE
const state = {
  is24h: true,
  showSeconds: true,
  theme: "dark",
  prevTime: { h: -1, m: -1, s: -1 },

  // Stopwatch
  sw: {
    running: false,
    startTs: 0,
    elapsed: 0,
    laps: [],
    lastLapTime: 0,
    rafId: null,
  },

  // Arc circumference = 2π × 152 ≈ 955.04
  ARC_C: 2 * Math.PI * 152,
};

//2. DOM REFERENCES
const $ = (id) => document.getElementById(id);
const el = {
  // Date
  dateDay: $("date-day"),
  dateFull: $("date-full"),
  dateTz: $("date-tz"),

  // Digit displays (current / next spans)
  htCur: $("ht-cur"),
  htNext: $("ht-next"),
  hCard: $("h-tens"),
  hoCur: $("ho-cur"),
  hoNext: $("ho-next"),
  hoCard: $("h-ones"),
  mtCur: $("mt-cur"),
  mtNext: $("mt-next"),
  mtCard: $("m-tens"),
  moCur: $("mo-cur"),
  moNext: $("mo-next"),
  moCard: $("m-ones"),
  stCur: $("st-cur"),
  stNext: $("st-next"),
  stCard: $("s-tens"),
  soCur: $("so-cur"),
  soNext: $("so-next"),
  soCard: $("s-ones"),

  // Colon 2 (seconds)
  colon2Wrap: $("colon2-wrap"),
  secGroup: $("group-seconds"),

  // AM/PM
  ampmBadge: $("ampm-badge"),
  ampmText: $("ampm-text"),

  // Controls
  btnFormat: $("btn-format"),
  formatLabel: $("format-label"),
  btnSeconds: $("btn-seconds"),
  secToggle: $("sec-toggle"),
  btnTheme: $("btn-theme"),
  themeIcon: $("theme-icon"),

  // Arc
  arcFill: $("arc-fill"),
  arcDot: $("arc-dot"),

  // Metrics
  msDisplay: $("ms-display"),
  msBar: $("ms-bar"),
  unixDisplay: $("unix-display"),
  weekDisplay: $("week-display"),
  weekRing: $("week-ring"),
  yearDisplay: $("year-display"),
  yearRing: $("year-ring"),

  // Stopwatch
  swDisplay: $("sw-display"),
  swStart: $("sw-start"),
  swLap: $("sw-lap"),
  swReset: $("sw-reset"),
  lapsList: $("laps-list"),

  // World
  worldList: $("world-list"),

  // Footer
  footerDay: $("footer-day"),

  // SR
  srTime: $("sr-time"),
};

//3. WORLD CLOCKS CONFIG
const WORLD_CITIES = [
  { city: "New York", flag: "🇺🇸", tz: "America/New_York", label: "EST/EDT" },
  { city: "London", flag: "🇬🇧", tz: "Europe/London", label: "GMT/BST" },
  { city: "Paris", flag: "🇫🇷", tz: "Europe/Paris", label: "CET/CEST" },
  { city: "Dubai", flag: "🇦🇪", tz: "Asia/Dubai", label: "GST" },
  { city: "Mumbai", flag: "🇮🇳", tz: "Asia/Kolkata", label: "IST" },
  { city: "Singapore", flag: "🇸🇬", tz: "Asia/Singapore", label: "SGT" },
  { city: "Tokyo", flag: "🇯🇵", tz: "Asia/Tokyo", label: "JST" },
];

//4. UTILITY FUNCTIONS

/**
 * Zero-pad number to length
 */
function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

/**
 * Day name lookup
 */
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Is a given year a leap year?
 */
function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/**
 * Days in a year
 */
function daysInYear(y) {
  return isLeapYear(y) ? 366 : 365;
}

/**
 * Day-of-year (1-indexed)
 */
function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff =
    d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  return Math.floor(diff / 86400000);
}

/**
 * Week progress: 0 = Mon 00:00, 1 = Sun 23:59:59
 */
function weekProgressPercent(d) {
  const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon … 6=Sun
  const secondsIntoWeek =
    dayOfWeek * 86400 +
    d.getHours() * 3600 +
    d.getMinutes() * 60 +
    d.getSeconds();
  return (secondsIntoWeek / (7 * 86400)) * 100;
}

/**
 * Year progress
 */
function yearProgressPercent(d) {
  const doy = dayOfYear(d);
  const total = daysInYear(d.getFullYear());
  return (doy / total) * 100;
}

/**
 * Format a duration (ms) as HH:MM:SS.mmm
 */
function fmtDuration(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = Math.floor(ms % 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(mil, 3)}`;
}

/**
 * Get UTC offset label for a timezone
 */
function getOffsetLabel(tz) {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "";
  } catch {
    return "";
  }
}

/**
 * Format time for a specific timezone
 */
function formatWorldTime(tz) {
  const now = new Date();
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
}

//5. FLIP DIGIT ANIMATION

/**
 * @param {HTMLElement} card
 * @param {HTMLElement} curEl
 * @param {HTMLElement} nxtEl
 * @param {string} newVal
 */
function updateDigit(card, curEl, nxtEl, newVal) {
  if (curEl.textContent === newVal) return; // no change

  // Set the incoming value in next slot
  nxtEl.textContent = newVal;

  // Trigger flip
  card.classList.remove("flipping");
  // Force reflow to restart animation
  void card.offsetWidth;
  card.classList.add("flipping");

  // After animation completes, swap values and clean up
  const onEnd = () => {
    curEl.textContent = newVal;
    nxtEl.textContent = newVal;
    card.classList.remove("flipping");
    card.removeEventListener("animationend", onEnd);
  };
  card.addEventListener("animationend", onEnd, { once: true });
}

//6. MAIN CLOCK TICK
function tick() {
  const now = new Date();
  const full = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const ms = now.getMilliseconds();

  let displayH = full;
  let ampm = "";
  if (!state.is24h) {
    ampm = full >= 12 ? "PM" : "AM";
    displayH = full % 12 || 12;
  }

  const hStr = pad(displayH);
  const mStr = pad(min);
  const sStr = pad(sec);

  const p = state.prevTime;

  // ── Hour digits
  if (p.h !== displayH) {
    updateDigit(el.hCard, el.htCur, el.htNext, hStr[0]);
    updateDigit(el.hoCard, el.hoCur, el.hoNext, hStr[1]);
    p.h = displayH;
  }

  // ── Minute digits
  if (p.m !== min) {
    updateDigit(el.mtCard, el.mtCur, el.mtNext, mStr[0]);
    updateDigit(el.moCard, el.moCur, el.moNext, mStr[1]);
    p.m = min;
  }

  // ── Second digits
  if (state.showSeconds && p.s !== sec) {
    updateDigit(el.stCard, el.stCur, el.stNext, sStr[0]);
    updateDigit(el.soCard, el.soCur, el.soNext, sStr[1]);
    p.s = sec;
  }

  // ── AM/PM
  if (!state.is24h) {
    el.ampmText.textContent = ampm;
  }

  // ── Seconds arc ring
  if (state.showSeconds) {
    const arcProgress = sec / 59;
    const dashOffset = state.ARC_C - arcProgress * state.ARC_C;
    el.arcFill.style.strokeDashoffset = dashOffset;

    const angle = (sec / 60) * 360;
    el.arcDot.style.transform = `rotate(${angle}deg)`;
  }

  // ── Milliseconds
  el.msDisplay.textContent = pad(ms, 3);
  el.msBar.style.width = `${(ms / 999) * 100}%`;

  // ── Unix timestamp
  el.unixDisplay.textContent = Math.floor(now.getTime() / 1000);

  // ── Week progress
  const wPct = weekProgressPercent(now);
  el.weekDisplay.textContent = `${wPct.toFixed(1)}%`;
  const wOffset = 150.796 - (wPct / 100) * 150.796;
  el.weekRing.style.strokeDashoffset = wOffset;

  // ── Year progress
  const yPct = yearProgressPercent(now);
  el.yearDisplay.textContent = `${yPct.toFixed(2)}%`;
  const yOffset = 150.796 - (yPct / 100) * 150.796;
  el.yearRing.style.strokeDashoffset = yOffset;

  // ── Date strip
  el.dateDay.textContent = DAY_NAMES[now.getDay()].toUpperCase();
  el.dateFull.textContent = `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  el.dateTz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // ── Footer
  el.footerDay.textContent = DAY_NAMES[now.getDay()];

  // ── Screen reader
  if (p.s !== sec) {
    el.srTime.textContent = `Current time: ${hStr}:${mStr}${state.showSeconds ? ":" + sStr : ""} ${ampm}`;
  }
}

//7. WORLD CLOCKS

/** Build world clock list items once */
function buildWorldList() {
  el.worldList.innerHTML = "";
  WORLD_CITIES.forEach((c, i) => {
    const li = document.createElement("li");
    li.className = "world-item";
    li.dataset.index = i;
    const offset = getOffsetLabel(c.tz);
    li.innerHTML = `
      <span class="world-flag" aria-hidden="true">${c.flag}</span>
      <span class="world-city">${c.city}</span>
      <span class="world-offset">${offset}</span>
      <span class="world-time" id="wt-${i}">--:--:--</span>
    `;
    el.worldList.appendChild(li);
  });
}

/** Update world clock times */
function tickWorldClocks() {
  WORLD_CITIES.forEach((c, i) => {
    const el_time = document.getElementById(`wt-${i}`);
    if (el_time) el_time.textContent = formatWorldTime(c.tz);
  });
}

//8. STOPWATCH ENGINE
function swTick() {
  const sw = state.sw;
  if (!sw.running) return;

  const now = performance.now();
  sw.elapsed = now - sw.startTs;
  el.swDisplay.textContent = fmtDuration(sw.elapsed);
  sw.rafId = requestAnimationFrame(swTick);
}

function swStart() {
  const sw = state.sw;
  if (sw.running) {
    // Pause
    sw.running = false;
    cancelAnimationFrame(sw.rafId);
    el.swStart.textContent = "Resume";
    el.swStart.classList.remove("sw-primary");
    el.swLap.disabled = true;
  } else {
    // Start / resume
    sw.startTs = performance.now() - sw.elapsed;
    sw.running = true;
    sw.rafId = requestAnimationFrame(swTick);
    el.swStart.textContent = "Pause";
    el.swStart.classList.add("sw-primary");
    el.swLap.disabled = false;
  }
}

function swLap() {
  const sw = state.sw;
  if (!sw.running) return;

  const lapTime = sw.elapsed;
  const delta = lapTime - sw.lastLapTime;
  sw.lastLapTime = lapTime;
  sw.laps.unshift({ total: lapTime, delta });

  renderLaps();
}

function swReset() {
  const sw = state.sw;
  sw.running = false;
  cancelAnimationFrame(sw.rafId);
  sw.elapsed = 0;
  sw.startTs = 0;
  sw.laps = [];
  sw.lastLapTime = 0;

  el.swDisplay.textContent = "00:00:00.000";
  el.swStart.textContent = "Start";
  el.swStart.classList.add("sw-primary");
  el.swLap.disabled = true;
  el.lapsList.innerHTML = "";
}

function renderLaps() {
  el.lapsList.innerHTML = "";
  state.sw.laps.forEach((lap, i) => {
    const li = document.createElement("li");
    li.className = "lap-item";
    li.innerHTML = `
      <span class="lap-num">LAP ${state.sw.laps.length - i}</span>
      <span class="lap-time">${fmtDuration(lap.total)}</span>
      <span class="lap-delta">+${fmtDuration(lap.delta)}</span>
    `;
    el.lapsList.appendChild(li);
  });
}

//9. CONTROLS

/** Toggle 12 / 24 hour */
el.btnFormat.addEventListener("click", () => {
  state.is24h = !state.is24h;
  el.formatLabel.textContent = state.is24h ? "24H" : "12H";

  if (!state.is24h) {
    el.ampmBadge.classList.add("visible");
  } else {
    el.ampmBadge.classList.remove("visible");
  }

  // Reset previous time to force redraw
  state.prevTime.h = -1;
  tick();
});

/** Toggle seconds */
el.btnSeconds.addEventListener("click", () => {
  state.showSeconds = !state.showSeconds;
  el.secToggle.classList.toggle("active", state.showSeconds);

  el.colon2Wrap.style.display = state.showSeconds ? "" : "none";
  el.secGroup.style.display = state.showSeconds ? "" : "none";
  el.arcFill.parentElement.parentElement.style.opacity = state.showSeconds
    ? ".35"
    : "0";
});

/** Toggle dark / light theme */
el.btnTheme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  el.themeIcon.textContent = state.theme === "dark" ? "☽" : "☀";
});

el.swStart.addEventListener("click", swStart);
el.swLap.addEventListener("click", swLap);
el.swReset.addEventListener("click", swReset);

//10. SCHEDULER — precise 1-second tick aligned to wall clock
function scheduleNextTick() {
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  setTimeout(() => {
    tick();
    scheduleNextTick();
  }, delay);
}

let lastWorldUpdate = 0;
function rafLoop(ts) {
  tick();
  if (ts - lastWorldUpdate > 1000) {
    tickWorldClocks();
    lastWorldUpdate = ts;
  }
  requestAnimationFrame(rafLoop);
}

//11. INIT

function init() {
  buildWorldList();
  tickWorldClocks();

  // Initial render before first RAF
  tick();

  // Kick off high-frequency loop
  requestAnimationFrame(rafLoop);
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
