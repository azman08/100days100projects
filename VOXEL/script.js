/**
 * VOXEL — Poll & Voting App
 * 2026 · 100 Days 100 Projects · Azman Ali
 */

"use strict";

/* ════════════════════
   1. DATA — DEFAULT POLLS
   ════════════════════ */
const DEFAULT_POLLS = [
  {
    id: "poll-001",
    question:
      "What's the most important skill for a frontend developer in 2026?",
    type: "single",
    duration: 600,
    options: [
      { id: "a", text: "CSS & Animation mastery", votes: 0 },
      { id: "b", text: "JavaScript fundamentals", votes: 0 },
      { id: "c", text: "Performance optimisation", votes: 0 },
      { id: "d", text: "Accessibility & ARIA", votes: 0 },
    ],
  },
  {
    id: "poll-002",
    question: "Which JS framework do you prefer in 2026?",
    type: "single",
    duration: 600,
    options: [
      { id: "a", text: "React", votes: 0 },
      { id: "b", text: "Vue", votes: 0 },
      { id: "c", text: "Svelte", votes: 0 },
      { id: "d", text: "Vanilla JS (no framework)", votes: 0 },
    ],
  },
  {
    id: "poll-003",
    question: "How many projects should a dev ship per month?",
    type: "single",
    duration: 600,
    options: [
      { id: "a", text: "1–2 solid projects", votes: 0 },
      { id: "b", text: "3–5 small projects", votes: 0 },
      { id: "c", text: "10+ mini-projects", votes: 0 },
      { id: "d", text: "Quality > quantity", votes: 0 },
    ],
  },
  {
    id: "poll-004",
    question: "Pick your top dev tools (multi-choice)",
    type: "multi",
    duration: 600,
    options: [
      { id: "a", text: "VS Code", votes: 0 },
      { id: "b", text: "GitHub Copilot", votes: 0 },
      { id: "c", text: "Figma", votes: 0 },
      { id: "d", text: "Chrome DevTools", votes: 0 },
      { id: "e", text: "Terminal / CLI", votes: 0 },
    ],
  },
];

/* Option color palette */
const OPT_COLORS = {
  a: "#f5a623",
  b: "#38bdf8",
  c: "#a78bfa",
  d: "#34d399",
  e: "#f43f5e",
  f: "#fb923c",
};
const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* ════════════════════
   2. STATE
   ════════════════════ */
const state = {
  polls: [], // all polls loaded
  activePoll: null, // current poll object
  pollIndex: 0, // index of active poll
  voted: false, // has user voted on active poll
  selectedOpts: new Set(), // selected option ids (multi-choice)
  timerSecs: 0,
  timerMax: 0,
  timerIv: null,
  history: [], // closed polls
  theme: "dark",
};

/* ════════════════════
   3. DOM REFS
   ════════════════════ */
const $ = (id) => document.getElementById(id);

const dom = {
  pollNum: $("poll-num"),
  pollStatus: $("poll-status"),
  statusLabel: $("status-label"),
  statusDot: $("poll-status")?.querySelector(".status-dot"),
  pollQuestion: $("poll-question"),
  pollOptions: $("poll-options"),
  timerVal: $("timer-val"),
  timerFill: $("timer-bar-fill"),
  totalVotes: $("total-votes"),
  leadingOption: $("leading-option"),
  resultsChart: $("results-chart"),
  rsTotal: $("rs-total"),
  rsLeadPct: $("rs-leading-pct"),
  rsOptions: $("rs-options"),
  historyList: $("history-list"),
  historyEmpty: $("history-empty"),
  btnReset: $("btn-reset-poll"),
  btnClose: $("btn-close-poll"),
  btnShare: $("btn-share"),
  btnTheme: $("btn-theme"),
  themeIcon: $("theme-icon"),
  toast: $("toast"),
  toastMsg: $("toast-msg"),
  toastIcon: $("toast-icon"),

  // Create form
  newQuestion: $("new-question"),
  qChars: $("q-chars"),
  optionsInputs: $("options-inputs"),
  btnAddOption: $("btn-add-option"),
  pollDuration: $("poll-duration"),
  pollType: $("poll-type"),
  btnCreate: $("btn-create-poll"),
  btnCollapse: $("btn-collapse"),
  createBody: $("create-body"),
  collapseIcon: $("collapse-icon"),
  btnClearHist: $("btn-clear-history"),
};

/* ════════════════════
   4. TOAST
   ════════════════════ */
let toastTimer;
function showToast(msg, isError = false) {
  dom.toastMsg.textContent = msg;
  dom.toastIcon.textContent = isError ? "✕" : "✓";
  dom.toastIcon.style.background = isError ? "#f43f5e" : "var(--accent)";
  dom.toastIcon.style.color = "#000";
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 2400);
}

/* ════════════════════
   5. TIMER ENGINE
   ════════════════════ */
function startTimer(seconds) {
  clearInterval(state.timerIv);
  if (!seconds || seconds <= 0) {
    dom.timerVal.textContent = "∞";
    dom.timerFill.style.width = "100%";
    return;
  }
  state.timerSecs = seconds;
  state.timerMax = seconds;

  function tick() {
    if (state.timerSecs <= 0) {
      clearInterval(state.timerIv);
      closePoll(true);
      return;
    }
    state.timerSecs--;
    const m = Math.floor(state.timerSecs / 60)
      .toString()
      .padStart(2, "0");
    const s = (state.timerSecs % 60).toString().padStart(2, "0");
    dom.timerVal.textContent = `${m}:${s}`;
    const pct = (state.timerSecs / state.timerMax) * 100;
    dom.timerFill.style.width = pct + "%";
    if (state.timerSecs <= 30) dom.timerFill.classList.add("warning");
    else dom.timerFill.classList.remove("warning");
  }

  tick();
  state.timerIv = setInterval(tick, 1000);
}

function stopTimer() {
  clearInterval(state.timerIv);
}

/* ════════════════════
   6. RENDER POLL OPTIONS
   ════════════════════ */
function renderOptions() {
  const poll = state.activePoll;
  if (!poll) return;

  const hasVoted = getVoted(poll.id);
  state.voted = hasVoted;
  state.selectedOpts.clear();

  dom.pollOptions.innerHTML = "";
  if (hasVoted) dom.pollOptions.classList.add("voted-state");
  else dom.pollOptions.classList.remove("voted-state");

  poll.options.forEach((opt, i) => {
    const total = getTotalVotes(poll);
    const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
    const color = OPT_COLORS[opt.id] || OPT_COLORS.a;
    const letter = LETTERS[i] || String.fromCharCode(65 + i);

    const div = document.createElement("div");
    div.className = "poll-option" + (hasVoted ? " voted" : "");
    div.dataset.optId = opt.id;
    div.style.setProperty("--opt-color", color);
    div.setAttribute("role", poll.type === "multi" ? "checkbox" : "radio");
    div.setAttribute("aria-checked", "false");
    div.setAttribute("tabindex", hasVoted ? "-1" : "0");
    div.setAttribute("aria-label", opt.text);

    div.innerHTML = `
      <div class="opt-fill" id="fill-${opt.id}"></div>
      <div class="opt-content">
        <div class="opt-bullet">${letter}</div>
        <span class="opt-text">${escHtml(opt.text)}</span>
        <span class="opt-pct" id="pct-${opt.id}">${pct}%</span>
        <span class="opt-count" id="count-${opt.id}">${opt.votes}</span>
      </div>
    `;

    if (!hasVoted) {
      div.addEventListener("click", () => onOptionClick(opt.id));
      div.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOptionClick(opt.id);
        }
      });
    }

    dom.pollOptions.appendChild(div);

    // Animate fills if already voted
    if (hasVoted) {
      requestAnimationFrame(() => {
        const fill = document.getElementById(`fill-${opt.id}`);
        if (fill) fill.style.width = pct + "%";
      });
    }
  });
}

/* ════════════════════
   7. VOTE HANDLER
   ════════════════════ */
function onOptionClick(optId) {
  if (state.voted) return;
  const poll = state.activePoll;
  if (!poll) return;

  if (poll.type === "single") {
    // Clear all selections
    state.selectedOpts.clear();
    dom.pollOptions.querySelectorAll(".poll-option").forEach((el) => {
      el.classList.remove("selected");
      el.setAttribute("aria-checked", "false");
    });
    state.selectedOpts.add(optId);
    const optEl = dom.pollOptions.querySelector(`[data-opt-id="${optId}"]`);
    if (optEl) {
      optEl.classList.add("selected");
      optEl.setAttribute("aria-checked", "true");
    }

    // Auto-submit for single choice
    submitVote();
  } else {
    // Multi-choice toggle
    const optEl = dom.pollOptions.querySelector(`[data-opt-id="${optId}"]`);
    if (state.selectedOpts.has(optId)) {
      state.selectedOpts.delete(optId);
      if (optEl) {
        optEl.classList.remove("selected");
        optEl.setAttribute("aria-checked", "false");
      }
    } else {
      state.selectedOpts.add(optId);
      if (optEl) {
        optEl.classList.add("selected");
        optEl.setAttribute("aria-checked", "true");
      }
    }
    // For multi, add a submit button if 1+ selected
    updateMultiSubmit();
  }
}

function updateMultiSubmit() {
  let submitBtn = document.getElementById("multi-submit");
  if (state.selectedOpts.size > 0) {
    if (!submitBtn) {
      submitBtn = document.createElement("button");
      submitBtn.id = "multi-submit";
      submitBtn.className = "create-btn";
      submitBtn.style.marginTop = "8px";
      submitBtn.innerHTML = `<span aria-hidden="true">✓</span> Submit Vote (${state.selectedOpts.size} selected)`;
      submitBtn.addEventListener("click", submitVote);
      dom.pollOptions.after(submitBtn);
    } else {
      submitBtn.innerHTML = `<span aria-hidden="true">✓</span> Submit Vote (${state.selectedOpts.size} selected)`;
    }
  } else {
    if (submitBtn) submitBtn.remove();
  }
}

function submitVote() {
  if (state.voted || state.selectedOpts.size === 0) return;
  const poll = state.activePoll;

  // Tally votes
  state.selectedOpts.forEach((optId) => {
    const opt = poll.options.find((o) => o.id === optId);
    if (opt) opt.votes++;
  });

  // Mark as voted
  setVoted(poll.id);
  state.voted = true;

  // Remove multi submit btn
  const submitBtn = document.getElementById("multi-submit");
  if (submitBtn) submitBtn.remove();

  // Re-render with results
  renderOptions();
  animateResults();
  updateStats();
  showToast("Vote cast! 🎉");
}

/* ════════════════════
   8. ANIMATE RESULTS
   ════════════════════ */
function animateResults() {
  const poll = state.activePoll;
  if (!poll) return;
  const total = getTotalVotes(poll);

  poll.options.forEach((opt) => {
    const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
    const fill = document.getElementById(`fill-${opt.id}`);
    const pctEl = document.getElementById(`pct-${opt.id}`);
    const cntEl = document.getElementById(`count-${opt.id}`);

    requestAnimationFrame(() => {
      if (fill) fill.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct + "%";
      if (cntEl) cntEl.textContent = opt.votes;
    });
  });

  renderResultsChart();
}

/* ════════════════════
   9. RESULTS CHART
   ════════════════════ */
function renderResultsChart() {
  const poll = state.activePoll;
  if (!poll) return;
  const total = getTotalVotes(poll);
  const max = Math.max(...poll.options.map((o) => o.votes), 1);

  dom.resultsChart.innerHTML = "";

  poll.options.forEach((opt, i) => {
    const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
    const color = OPT_COLORS[opt.id] || OPT_COLORS.a;
    const isLeading = opt.votes === max && total > 0;

    const row = document.createElement("div");
    row.className = "result-row" + (isLeading ? " leading" : "");

    row.innerHTML = `
      <div class="result-row-top">
        <span class="result-label" style="color:${total > 0 && isLeading ? color : "var(--t1)"}">${escHtml(opt.text)}</span>
        <span class="result-pct" style="color:${color}">${pct}%</span>
        <span class="result-count">${opt.votes}v</span>
      </div>
      <div class="result-bar-track">
        <div class="result-bar-fill" id="rbar-${opt.id}" style="background:${color};width:0%"></div>
      </div>
    `;

    dom.resultsChart.appendChild(row);

    requestAnimationFrame(() => {
      setTimeout(() => {
        const bar = document.getElementById(`rbar-${opt.id}`);
        if (bar) bar.style.width = pct + "%";
      }, i * 80);
    });
  });
}

/* ════════════════════
   10. UPDATE STATS
   ════════════════════ */
function updateStats() {
  const poll = state.activePoll;
  if (!poll) return;
  const total = getTotalVotes(poll);
  const max = Math.max(...poll.options.map((o) => o.votes));
  const leader = poll.options.find((o) => o.votes === max && total > 0);
  const leadPct = total > 0 ? Math.round((max / total) * 100) : 0;

  dom.totalVotes.textContent = total;
  dom.leadingOption.textContent = leader
    ? leader.text.slice(0, 14) + (leader.text.length > 14 ? "…" : "")
    : "—";
  dom.rsTotal.textContent = total;
  dom.rsLeadPct.textContent = total > 0 ? leadPct + "%" : "—";
  dom.rsOptions.textContent = poll.options.length;
}

/* ════════════════════
   11. LOAD POLL
   ════════════════════ */
function loadPoll(poll, index) {
  stopTimer();
  state.activePoll = poll;
  state.pollIndex = index;
  state.voted = getVoted(poll.id);
  state.selectedOpts = new Set();

  // Update header
  const num = String(index + 1).padStart(2, "0");
  dom.pollNum.textContent = num;
  dom.pollQuestion.textContent = poll.question;

  // Status
  const isClosed = state.history.some((h) => h.id === poll.id);
  setStatus(isClosed ? "closed" : "live");

  // Render options & chart
  renderOptions();
  renderResultsChart();
  updateStats();

  // Start timer if not voted and not closed
  if (!state.voted && !isClosed && poll.duration > 0) {
    startTimer(poll.duration);
  } else if (!poll.duration || poll.duration === 0) {
    dom.timerVal.textContent = "∞";
    dom.timerFill.style.width = "100%";
  }

  // Show winner if already voted
  if (state.voted) showWinnerBanner();
}

function setStatus(status) {
  const dot = dom.pollStatus?.querySelector(".status-dot");
  if (!dom.statusLabel || !dot) return;
  if (status === "live") {
    dom.statusLabel.textContent = "Live";
    dot.className = "status-dot live";
  } else {
    dom.statusLabel.textContent = "Closed";
    dot.className = "status-dot closed";
  }
}

/* ════════════════════
   12. CLOSE POLL
   ════════════════════ */
function closePoll(timerExpired = false) {
  stopTimer();
  setStatus("closed");
  const poll = state.activePoll;
  if (!poll) return;

  // Add to history if not already there
  if (!state.history.some((h) => h.id === poll.id)) {
    state.history.unshift({ ...poll, closedAt: new Date() });
    saveHistory();
    renderHistory();
  }

  dom.timerVal.textContent = timerExpired ? "Time's up!" : "Closed";
  dom.timerFill.style.width = "0%";

  showWinnerBanner();
  if (timerExpired) showToast("Poll time expired!");
}

function showWinnerBanner() {
  const poll = state.activePoll;
  if (!poll) return;
  const total = getTotalVotes(poll);
  if (total === 0) return;

  const max = Math.max(...poll.options.map((o) => o.votes));
  const leader = poll.options.find((o) => o.votes === max);
  if (!leader) return;

  // Remove old banner if exists
  const old = document.getElementById("winner-banner");
  if (old) old.remove();

  const banner = document.createElement("div");
  banner.id = "winner-banner";
  banner.className = "winner-banner show";
  banner.innerHTML = `<span class="winner-crown">👑</span><span>Leading: <strong>${escHtml(leader.text)}</strong></span>`;

  dom.pollQuestion.after(banner);
}

/* ════════════════════
   13. RESET POLL
   ════════════════════ */
function resetPoll() {
  const poll = state.activePoll;
  if (!poll) return;
  poll.options.forEach((o) => (o.votes = 0));
  clearVoted(poll.id);
  state.voted = false;
  state.selectedOpts.clear();

  const banner = document.getElementById("winner-banner");
  if (banner) banner.remove();

  setStatus("live");
  renderOptions();
  renderResultsChart();
  updateStats();
  startTimer(poll.duration);
  showToast("Poll reset!");
}

/* ════════════════════
   14. CREATE POLL
   ════════════════════ */
function createPoll() {
  const question = dom.newQuestion.value.trim();
  if (!question) {
    showToast("Please enter a question.", true);
    dom.newQuestion.focus();
    return;
  }

  const optInputs = [...dom.optionsInputs.querySelectorAll(".option-input")]
    .map((i) => i.value.trim())
    .filter(Boolean);

  if (optInputs.length < 2) {
    showToast("Add at least 2 options.", true);
    return;
  }

  const id = "poll-" + Date.now();
  const newPoll = {
    id,
    question,
    type: dom.pollType.value,
    duration: parseInt(dom.pollDuration.value) || 0,
    options: optInputs.map((text, i) => ({
      id: ["a", "b", "c", "d", "e", "f"][i],
      text,
      votes: 0,
    })),
  };

  state.polls.unshift(newPoll);
  loadPoll(newPoll, 0);

  // Clear form
  dom.newQuestion.value = "";
  dom.qChars.textContent = "0";
  dom.optionsInputs
    .querySelectorAll(".option-input")
    .forEach((i) => (i.value = ""));
  // Reset to 2 option rows
  rebuildOptionInputs(2);

  showToast("Poll launched! 🚀");
  collapseCreate();
}

/* ════════════════════
   15. OPTION INPUT MANAGEMENT
   ════════════════════ */
function rebuildOptionInputs(count = 2) {
  dom.optionsInputs.innerHTML = "";
  const MAX = 6;
  for (let i = 0; i < count; i++) addOptionRow(i, count);
  dom.btnAddOption.style.display = count >= MAX ? "none" : "";
}

function addOptionRow(index, currentCount) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const row = document.createElement("div");
  row.className = "option-input-row";

  const canRemove = currentCount > 2;
  row.innerHTML = `
    <span class="option-letter" aria-hidden="true">${letters[index]}</span>
    <input type="text" class="text-input option-input" placeholder="Option ${letters[index]}" maxlength="60" />
    <button class="remove-option-btn" aria-label="Remove option" style="visibility:${canRemove ? "visible" : "hidden"}">✕</button>
  `;

  row.querySelector(".remove-option-btn").addEventListener("click", () => {
    row.remove();
    relabelOptionRows();
    const rows = dom.optionsInputs.querySelectorAll(".option-input-row");
    if (rows.length <= 2) {
      rows.forEach((r) => {
        const btn = r.querySelector(".remove-option-btn");
        if (btn) btn.style.visibility = "hidden";
      });
    }
    dom.btnAddOption.style.display = "";
  });

  dom.optionsInputs.appendChild(row);
}

function relabelOptionRows() {
  const letters = ["A", "B", "C", "D", "E", "F"];
  dom.optionsInputs.querySelectorAll(".option-input-row").forEach((row, i) => {
    const letter = row.querySelector(".option-letter");
    const input = row.querySelector(".option-input");
    if (letter) letter.textContent = letters[i];
    if (input) input.placeholder = `Option ${letters[i]}`;
  });
}

dom.btnAddOption.addEventListener("click", () => {
  const rows = dom.optionsInputs.querySelectorAll(".option-input-row");
  if (rows.length >= 6) return;
  addOptionRow(rows.length, rows.length + 1);
  // Enable remove on all rows once > 2
  dom.optionsInputs
    .querySelectorAll(".remove-option-btn")
    .forEach((btn) => (btn.style.visibility = "visible"));
  if (dom.optionsInputs.querySelectorAll(".option-input-row").length >= 6) {
    dom.btnAddOption.style.display = "none";
  }
});

/* ════════════════════
   16. POLL HISTORY
   ════════════════════ */
function renderHistory() {
  dom.historyList.innerHTML = "";

  if (state.history.length === 0) {
    dom.historyList.appendChild(dom.historyEmpty);
    return;
  }

  state.history.forEach((poll) => {
    const total = getTotalVotes(poll);
    const max = Math.max(...poll.options.map((o) => o.votes));
    const leader = poll.options.find((o) => o.votes === max);

    const item = document.createElement("div");
    item.className = "history-item";
    item.setAttribute("role", "listitem");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", `Reopen poll: ${poll.question}`);
    item.innerHTML = `
      <div class="hi-question">${escHtml(poll.question.slice(0, 60))}${poll.question.length > 60 ? "…" : ""}</div>
      <div class="hi-meta">
        <span>${total} vote${total !== 1 ? "s" : ""}</span>
        <span>·</span>
        <span>${poll.options.length} options</span>
        <span>·</span>
        <span>${poll.type}</span>
      </div>
      ${leader && total > 0 ? `<div class="hi-winner">👑 ${escHtml(leader.text)}</div>` : ""}
    `;

    item.addEventListener("click", () => reopenPoll(poll));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reopenPoll(poll);
      }
    });

    dom.historyList.appendChild(item);
  });
}

function reopenPoll(poll) {
  // Find or add to state.polls
  const existing = state.polls.find((p) => p.id === poll.id);
  if (!existing) state.polls.unshift(poll);
  const idx = state.polls.findIndex((p) => p.id === poll.id);
  loadPoll(state.polls[idx], idx);
  showToast("Poll reopened!");
}

function saveHistory() {
  try {
    localStorage.setItem("voxel_history", JSON.stringify(state.history));
  } catch {}
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("voxel_history");
    if (raw) state.history = JSON.parse(raw);
  } catch {}
}

/* ════════════════════
   17. VOTED STATE (localStorage)
   ════════════════════ */
function getVoted(pollId) {
  try {
    return !!localStorage.getItem(`voxel_voted_${pollId}`);
  } catch {
    return false;
  }
}
function setVoted(pollId) {
  try {
    localStorage.setItem(`voxel_voted_${pollId}`, "1");
  } catch {}
}
function clearVoted(pollId) {
  try {
    localStorage.removeItem(`voxel_voted_${pollId}`);
  } catch {}
}

/* ════════════════════
   18. HELPERS
   ════════════════════ */
function getTotalVotes(poll) {
  return poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ════════════════════
   19. SHARE RESULTS
   ════════════════════ */
dom.btnShare.addEventListener("click", async () => {
  const poll = state.activePoll;
  if (!poll) return;
  const total = getTotalVotes(poll);
  const text =
    `📊 ${poll.question}\n\n` +
    poll.options
      .map((o) => {
        const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
        return `${o.text}: ${pct}% (${o.votes} votes)`;
      })
      .join("\n") +
    `\n\nTotal: ${total} votes\nMade with VOXEL — 100 Days 100 Projects by Azman Ali\nhttps://linkedin.com/in/azman08`;

  try {
    if (navigator.share) {
      await navigator.share({ title: "Poll Results", text });
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Results copied to clipboard!");
    }
  } catch {
    showToast("Could not share.", true);
  }
});

/* ════════════════════
   20. COLLAPSE CREATE FORM
   ════════════════════ */
function collapseCreate() {
  dom.createBody.classList.add("collapsed");
  dom.btnCollapse.setAttribute("aria-expanded", "false");
  dom.collapseIcon.textContent = "+";
}
function expandCreate() {
  dom.createBody.classList.remove("collapsed");
  dom.btnCollapse.setAttribute("aria-expanded", "true");
  dom.collapseIcon.textContent = "−";
}

dom.btnCollapse.addEventListener("click", () => {
  const isCollapsed = dom.createBody.classList.contains("collapsed");
  isCollapsed ? expandCreate() : collapseCreate();
});

/* ════════════════════
   21. BUTTON LISTENERS
   ════════════════════ */
dom.btnReset.addEventListener("click", resetPoll);
dom.btnClose.addEventListener("click", () => closePoll());
dom.btnCreate.addEventListener("click", createPoll);
dom.btnClearHist.addEventListener("click", () => {
  state.history = [];
  saveHistory();
  renderHistory();
  showToast("History cleared");
});

// Character counter for question input
dom.newQuestion.addEventListener("input", () => {
  dom.qChars.textContent = dom.newQuestion.value.length;
});

// Theme toggle
dom.btnTheme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  dom.themeIcon.textContent = state.theme === "dark" ? "☽" : "☀";
});

/* ════════════════════
   22. KEYBOARD NAV
   ════════════════════ */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.id === "new-question") createPoll();
});

/* ════════════════════
   23. INIT
   ════════════════════ */
function init() {
  // Load persisted history
  loadHistory();

  // Deep-clone default polls so votes don't persist across reloads unintentionally
  state.polls = DEFAULT_POLLS.map((p) => ({
    ...p,
    options: p.options.map((o) => ({ ...o })),
  }));

  // Build initial option inputs
  rebuildOptionInputs(2);

  // Load first poll
  loadPoll(state.polls[0], 0);

  // Render history
  renderHistory();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
