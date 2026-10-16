const PRIORS = "0xedbf91223639800bcd5756815caf908df3b890be";

const AGENTS = [
  { id: 1842, name: "cedar", repaid: 22, loans: 24, defaults: 0, line: 50, score: 712, backer: "Seat vault", leaves: 22 },
  { id: 1904, name: "inkwell", repaid: 11, loans: 12, defaults: 0, line: 25, score: 486, backer: "Treasury", leaves: 11 },
  { id: 1760, name: "harbor", repaid: 31, loans: 33, defaults: 0, line: 100, score: 840, backer: "Root · north", leaves: 31 },
  { id: 2011, name: "quill", repaid: 4, loans: 5, defaults: 0, line: 5, score: 168, backer: "Treasury", leaves: 4 },
  { id: 1688, name: "kiln", repaid: 9, loans: 14, defaults: 1, line: 0, score: 0, backer: "Root · kiln", leaves: 0 },
  { id: 2106, name: "marlowe", repaid: 7, loans: 7, defaults: 0, line: 50, score: 390, backer: "Owner · $PRIORS", leaves: 7 },
  { id: 1550, name: "ledger", repaid: 40, loans: 41, defaults: 0, line: 175, score: 910, backer: "Seat vault", leaves: 40 },
  { id: 2220, name: "sprout", repaid: 1, loans: 2, defaults: 0, line: 5, score: 42, backer: "Treasury", leaves: 1 }
];

const LOANS = [
  { block: "86,481,220", kind: "repaid", cls: "repaid", agent: "cedar", detail: "repaid 25.00 USDG + 0.06 fee", amt: "25.06" },
  { block: "86,481,104", kind: "borrowed", cls: "", agent: "inkwell", detail: "borrowed 10.00 USDG · 7 days", amt: "10.00" },
  { block: "86,480,882", kind: "vouched", cls: "vouched", agent: "marlowe", detail: "owner backed a $50 line", amt: "50.00" },
  { block: "86,480,640", kind: "repaid", cls: "repaid", agent: "harbor", detail: "repaid 100.00 USDG + 0.47 fee", amt: "100.47" },
  { block: "86,479,901", kind: "borrowed", cls: "", agent: "ledger", detail: "borrowed 150.00 USDG · 14 days", amt: "150.00" },
  { block: "86,479,220", kind: "repaid", cls: "repaid", agent: "quill", detail: "repaid 5.00 USDG + 0.01 fee", amt: "5.01" },
  { block: "86,470,014", kind: "defaulted", cls: "defaulted", agent: "kiln", detail: "backer paid 20.00 USDG in full", amt: "20.00" },
  { block: "86,468,552", kind: "repaid", cls: "repaid", agent: "sprout", detail: "repaid 5.00 USDG + 0.02 fee", amt: "5.02" }
];

const STOCKS = [
  { sym: "AAPL", name: "Apple", value: 228.4, ltv: 50, open: true },
  { sym: "MSFT", name: "Microsoft", value: 418.2, ltv: 50, open: true },
  { sym: "NVDA", name: "NVIDIA", value: 132.7, ltv: 40, open: true },
  { sym: "AMZN", name: "Amazon", value: 186.1, ltv: 45, open: true },
  { sym: "GOOGL", name: "Alphabet", value: 164.8, ltv: 45, open: true },
  { sym: "TSLA", name: "Tesla", value: 248.5, ltv: 25, open: true },
  { sym: "META", name: "Meta", value: 572.3, ltv: 40, open: false }
];

const UPDATES = [
  { date: "2026-10-14", tags: ["app", "score"], title: "Share an agent's record as a card or a video", body: "Each agent's page has a Share panel. It shows the card, then plays the record: loans repaid climb day by day while the tree turns once. Share on X, download the video, or download the card." },
  { date: "2026-10-14", tags: ["app", "stocks", "contracts"], title: "The protocol pages say what the contracts do today", body: "Protocol, stocks, and participate were checked against the chain. Stock lines back 25% to 70% of a token. A default keeps what is owed plus 20% and returns the rest. Backing your own agent runs from $25 to $50, up to $500." },
  { date: "2026-10-13", tags: ["stocks", "contracts"], title: "A stock default keeps what is owed plus 20%", body: "The stock vault keeps tokens worth the defaulted principal and fees plus a 20% buffer, valued at the last usable quote, and sends the rest back. If the token cannot be valued that day, it keeps the deposit." },
  { date: "2026-10-12", tags: ["app"], title: "Go mode is open to everyone", body: "Any Google account can sign in. There is nothing to write down, and the app pays the gas. The closed list it opened with is over." },
  { date: "2026-10-12", tags: ["contracts", "security"], title: "A 5 USDG bond stays until the line is closed", body: "A treasury bond comes back once the agent has no line, no open loan, and no default, and at least 4 days have passed. A default still sends the bond to the Safe." },
  { date: "2026-10-11", tags: ["contracts"], title: "Part of protocol revenue buys $PRIORS", body: "Engine 2 buys $PRIORS in small clips. Placing that stake behind agents that repay is the next step. It is not sold, and it does not raise a line by itself." }
];

function logo() {
  return `<svg viewBox="0 0 64 64" aria-hidden="true" shape-rendering="crispEdges"><rect x="28" y="6" width="8" height="4" fill="#2f6b4f"/><rect x="18" y="10" width="28" height="5" fill="#2f6b4f"/><rect x="12" y="15" width="40" height="5" fill="#2f6b4f"/><rect x="18" y="20" width="20" height="4" fill="#2f6b4f"/><rect x="42" y="20" width="10" height="4" fill="#2f6b4f"/><rect x="28" y="24" width="8" height="5" fill="#a9432c"/><rect x="36" y="27" width="8" height="4" fill="#a9432c"/><rect x="28" y="29" width="8" height="13" fill="#a9432c"/><rect x="18" y="42" width="28" height="5" fill="#1b1a16"/><rect x="22" y="47" width="20" height="5" fill="#1b1a16"/></svg>`;
}

function nav() {
  const page = document.body.dataset.page || "";
  const on = (id) => (page === id ? " on" : "");
  const cur = (id) => (page === id ? ' aria-current="page"' : "");
  return `<nav class="nav" id="nav" aria-label="Main navigation"><div class="wrap">
    <a class="brand" href="index.html">${logo()}<span>Priors</span></a>
    <div class="links">
      <a class="${on("live")}"${cur("live")} href="live.html">Agents</a>
      <a class="${on("invite")}"${cur("invite")} href="invite.html">First line</a>
      <a class="${on("participate")}"${cur("participate")} href="participate.html">Participate</a>
      <span class="dd">
        <a class="dd-top${on("borrow")}${on("stocks")}" href="borrow.html">Stocks<i class="dd-caret" aria-hidden="true"></i></a>
        <span class="dd-menu">
          <a href="borrow.html"${cur("borrow")}><b>Borrow on stocks</b><span>keep your tokens, borrow USDG against them</span></a>
          <a href="stocks.html"${cur("stocks")}><b>Open a stock line</b><span>deposit your tokens, draw USDG</span></a>
        </span>
      </span>
      <span class="dd">
        <a class="dd-top${on("protocol")}${on("use")}${on("updates")}" href="protocol.html">Protocol<i class="dd-caret" aria-hidden="true"></i></a>
        <span class="dd-menu">
          <a href="protocol.html"${cur("protocol")}><b>Protocol</b><span>how the pool works, read live</span></a>
          <a href="use.html"${cur("use")}><b>Use a line</b><span>what an agent does with it, step by step</span></a>
          <a href="updates.html"${cur("updates")}><b>Dev log</b><span>every release, with the details</span></a>
        </span>
      </span>
      <a href="https://github.com/priors-agents/priors" target="_blank" rel="noopener">GitHub</a>
    </div>
    <div class="right">
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
      <div class="status live" id="status"><span class="dot"></span><span id="status-text">block 86,481,220</span></div>
      <button class="theme-btn" type="button" id="theme-btn">Night</button>
      <a class="btn sm x402btn" href="x402.html">x402<span class="mk">new</span></a>
      <a class="btn sm agentbtn" href="start.html">Start</a>
      <a class="btn sm gobtn" href="account.html">Go mode</a>
    </div>
  </div></nav>`;
}

function footer() {
  return `<footer class="foot"><div class="wrap">
    <div><a class="brand" href="index.html"><span>Priors</span></a>
      <p>USDG credit for ERC-8004 agents on Robinhood Chain. Every line is backed by someone's own money. An experimental protocol, so read the contracts before you trust them.</p>
      <span>Robinhood Chain · chain id 4663 · local preview</span>
    </div>
    <div><h4>Priors</h4>
      <a href="live.html">Agents</a><a href="invite.html">First line</a><a href="participate.html">Participate</a>
      <a href="stocks.html">Stocks</a><a href="borrow.html">Borrow on stocks</a><a href="protocol.html">The protocol</a><a href="updates.html">Dev log</a>
    </div>
    <div><h4>Elsewhere</h4>
      <a class="xlink" href="https://x.com/priors_trade" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>@priors_trade</a>
      <a href="https://github.com/priors-agents/priors" target="_blank" rel="noopener">GitHub</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="privacy.html#choices">Privacy choices</a>
    </div>
  </div></footer><div class="toast" role="status"></div>`;
}

function toast(msg) {
  const el = document.querySelector(".toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

function money(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function countUp(el, target, prefix = "", suffix = "") {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { el.textContent = prefix + target.toLocaleString("en-US") + suffix; return; }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 900);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US") + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderLog(rows) {
  const log = document.getElementById("log");
  if (!log) return;
  log.innerHTML = rows.map((r) => `<div class="ln ${r.cls}"><span class="blk">${r.block}</span><span class="kind">${r.kind}</span><span class="who">${r.agent}</span><span class="detail">${r.detail}</span><span class="amt">${r.amt}</span></div>`).join("");
  const c = document.getElementById("log-count");
  if (c) c.textContent = rows.length + " shown";
}

function renderAgents(list) {
  const body = document.getElementById("agent-rows");
  if (!body) return;
  body.innerHTML = list.map((a) => `<tr class="${a.defaults ? "dead" : ""}">
    <td class="num">${a.id}</td>
    <td><a class="link" href="agent.html?id=${a.id}">${a.name}</a></td>
    <td class="num">${a.score}</td>
    <td class="num">$${a.line}</td>
    <td class="num">${a.repaid}</td>
    <td class="num">${a.defaults ? '<span class="pill stop">1</span>' : "0"}</td>
    <td>${a.backer}</td>
  </tr>`).join("") || `<tr><td colspan="7">No agent matches.</td></tr>`;
  const n = document.getElementById("agent-count");
  if (n) n.textContent = list.length + " agents";
}

function renderGrove() {
  const g = document.getElementById("grove");
  if (!g) return;
  g.innerHTML = AGENTS.map((a) => `<a class="sapling${a.defaults ? " bad" : ""}" href="agent.html?id=${a.id}"><div class="mark" aria-hidden="true"></div><b>${a.name}</b><span>${a.defaults ? "defaulted" : a.leaves + (a.leaves === 1 ? " leaf" : " leaves")} · $${a.line} line</span></a>`).join("");
}

function renderStocks() {
  const body = document.getElementById("bw-rows");
  if (!body) return;
  body.innerHTML = STOCKS.map((s) => {
    const borrow = Math.min(500, s.value * s.ltv / 100);
    return `<tr><td>${s.sym}</td><td>${s.name}</td><td class="num">$${money(s.value)}</td><td class="num">${s.ltv}% · up to $${money(borrow)}</td><td>${s.open ? '<span class="pill">open</span>' : '<span class="pill stop">paused</span>'}</td></tr>`;
  }).join("");
  const open = STOCKS.filter((s) => s.open).length;
  const el = document.getElementById("bw-open");
  if (el) el.textContent = open + " / " + STOCKS.length;
  const cap = document.getElementById("bw-art-count");
  if (cap) cap.textContent = STOCKS.length + " tokens";
  const tiles = document.getElementById("bw-tiles");
  if (tiles) {
    tiles.innerHTML = STOCKS.map((s) => `<span class="bw-tile${s.open ? "" : " empty"}" title="${s.sym}"></span>`).join("")
      + Array.from({ length: Math.max(0, 14 - STOCKS.length) }, () => `<span class="bw-tile empty"></span>`).join("");
  }
}

function renderUpdates(tag) {
  const root = document.getElementById("devlog");
  if (!root) return;
  const items = UPDATES.filter((u) => tag === "all" || u.tags.includes(tag));
  const byDate = new Map();
  items.forEach((u) => {
    if (!byDate.has(u.date)) byDate.set(u.date, []);
    byDate.get(u.date).push(u);
  });
  root.innerHTML = [...byDate.entries()].map(([date, list]) => `<article class="dl-day"><time datetime="${date}">${date}</time><div>${list.map((u) => `<div class="entry"><div class="chips">${u.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div><h3>${u.title}</h3><p>${u.body}</p></div>`).join("")}</div></article>`).join("") || `<p class="help">Nothing under that filter.</p>`;
}

function wallet() {
  return sessionStorage.getItem("priors-wallet");
}

function paintWallet() {
  const addr = wallet();
  document.querySelectorAll("[data-wallet]").forEach((el) => {
    el.hidden = !addr;
  });
  document.querySelectorAll("[data-nowallet]").forEach((el) => {
    el.hidden = !!addr;
  });
  document.querySelectorAll("[data-addr]").forEach((el) => {
    el.textContent = addr || "—";
  });
}

function drawBonsai(canvas) {
  const ctx = canvas.getContext("2d");
  let rot = 0.7;
  let drag = null;
  const cubes = [];
  const seen = new Set();
  const push = (x, y, z, color) => {
    const key = x + "," + y + "," + z;
    if (seen.has(key)) return;
    seen.add(key);
    cubes.push({ x, y, z, color });
  };
  const box = (x0, x1, y0, y1, z0, z1, color) => {
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) push(x, y, z, color);
  };
  const ball = (cx, cy, cz, r, color) => {
    const R = Math.ceil(r);
    for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) for (let z = -R; z <= R; z++) {
      const d = Math.hypot(x * 1.05, y * 0.92, z);
      if (d <= r) push(cx + x, cy + y, cz + z, color);
    }
  };
  box(-4, 4, 0, 0, -3, 3, "#1b1a16");
  box(-3, 3, 1, 2, -2, 2, "#24221e");
  box(-4, 4, 3, 3, -3, 3, "#1b1a16");
  box(0, 0, 4, 9, 0, 0, "#a9432c");
  box(1, 2, 7, 7, 0, 0, "#8d3824");
  box(-2, -1, 8, 8, 0, 0, "#a9432c");
  box(0, 0, 8, 8, 1, 2, "#8d3824");
  ball(0, 12, 0, 4.1, "#2f6b4f");
  ball(-2, 13, 1, 2.6, "#276246");
  ball(2, 11, -1, 2.4, "#3f8a67");
  ball(1, 14, 0, 1.8, "#347a58");
  ball(-1, 10, 1, 1.7, "#2f6b4f");
  [[3, 14, 0], [-3, 13, 1], [0, 16, 0], [2, 15, 1], [-2, 15, -1], [4, 12, 0], [-4, 12, 0], [1, 12, 3], [0, 11, -3], [-1, 14, 2]].forEach(([x, y, z]) => push(x, y, z, "#84c49f"));

  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = (s) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  };

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, r.width * dpr);
    canvas.height = Math.max(1, r.height * dpr);
  }
  resize();
  addEventListener("resize", resize);

  function project(x, y, z) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const rx = x * c - z * s;
    const rz = x * s + z * c;
    return { sx: (rx - rz), sy: (rx + rz) * 0.52 - y, depth: rx + rz + y * 0.01 };
  }

  function frame() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const scale = Math.min(w, h) / 22;
    const ox = w * 0.56, oy = h * 0.78;
    const order = cubes.map((cube, i) => ({ i, d: project(cube.x, cube.y, cube.z).depth })).sort((a, b) => a.d - b.d);
    order.forEach(({ i }) => {
      const cube = cubes[i];
      const s = 0.92;
      const corners = [
        [0, 0, 0], [s, 0, 0], [s, 0, s], [0, 0, s],
        [0, s, 0], [s, s, 0], [s, s, s], [0, s, s]
      ].map(([dx, dy, dz]) => {
        const p = project(cube.x + dx - 0.46, cube.y + dy, cube.z + dz - 0.46);
        return [ox + p.sx * scale, oy + p.sy * scale];
      });
      const face = (ids, f) => {
        ctx.beginPath();
        ids.forEach((id, n) => n ? ctx.lineTo(corners[id][0], corners[id][1]) : ctx.moveTo(corners[id][0], corners[id][1]));
        ctx.closePath();
        ctx.fillStyle = shade(cube.color, f);
        ctx.fill();
      };
      face([0, 1, 2, 3], 0.72);
      face([4, 5, 6, 7], 1);
      face([0, 1, 5, 4], 0.84);
      face([1, 2, 6, 5], 0.62);
    });
    if (!drag) rot += 0.003;
    requestAnimationFrame(frame);
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(frame);
  else { rot = 0.7; requestAnimationFrame(frame); }

  canvas.addEventListener("pointerdown", (e) => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("pointermove", (e) => { if (drag == null) return; rot += (e.clientX - drag) * 0.01; drag = e.clientX; });
}

function bootStats() {
  const repaid = AGENTS.reduce((s, a) => s + a.repaid, 0);
  const loans = AGENTS.reduce((s, a) => s + a.loans, 0);
  const map = {
    "s-repaid": [48620, "$"],
    "s-loans": [loans, ""],
    "s-agents": [AGENTS.length, ""],
    "s-bad": [0, "$"]
  };
  Object.entries(map).forEach(([id, [n, pre]]) => {
    const el = document.getElementById(id);
    if (el) countUp(el, n, pre);
  });
  const sub = {
    "s-repaid-sub": repaid + " repayments",
    "s-loans-sub": "written in the preview",
    "s-agents-sub": "with a public record",
    "s-bad-sub": "defaults are paid by the backer"
  };
  Object.entries(sub).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
  const leaf = document.getElementById("leafcount");
  if (leaf) leaf.textContent = repaid.toLocaleString("en-US") + " repayments";
}

function bootAgent() {
  const root = document.getElementById("agent-view");
  if (!root) return;
  const id = Number(new URLSearchParams(location.search).get("id")) || 1842;
  const a = AGENTS.find((x) => x.id === id) || AGENTS[0];
  root.innerHTML = `
    <div class="board-heading"><div>
      <div class="eyebrow">Agent record · <i class="ek">ERC-8004 #${a.id}</i></div>
      <h1>${a.name}</h1>
      <p>${a.defaults ? "This agent defaulted. Its score is 0 and it cannot take a new line." : "A public record of what it has borrowed and paid back. The line is backed by " + a.backer + "."}</p>
    </div><div class="aside">Preview record. On the live site this is read from the pool.</div></div>
    <div class="account" style="border-left:0"><div class="wrap" style="padding-inline:0;max-width:none">
      <div class="cell"><div class="k">Score</div><div class="v${a.defaults ? "" : " good"}">${a.score}</div><div class="s">0 to 1000</div></div>
      <div class="cell"><div class="k">Line</div><div class="v">$${a.line}</div><div class="s">${a.backer}</div></div>
      <div class="cell"><div class="k">Repaid</div><div class="v">${a.repaid}</div><div class="s">of ${a.loans} loans</div></div>
      <div class="cell"><div class="k">Defaults</div><div class="v${a.defaults ? "" : " good"}">${a.defaults}</div><div class="s">${a.defaults ? "backer paid the pool" : "none on record"}</div></div>
    </div></div>
    <section class="panel"><header><h2>Loans</h2></header><div class="body tblwrap"><table><thead><tr><th>Block</th><th>Entry</th><th>Detail</th><th class="num">USDG</th></tr></thead><tbody>
      ${LOANS.filter((l) => l.agent === a.name).map((l) => `<tr><td>${l.block}</td><td>${l.kind}</td><td>${l.detail}</td><td class="num">${l.amt}</td></tr>`).join("") || `<tr><td colspan="4">No loans in this preview for ${a.name}.</td></tr>`}
    </tbody></table></div></section>`;
}

document.getElementById("nav-root").innerHTML = nav();
document.getElementById("foot-root").innerHTML = footer();

const saved = localStorage.getItem("priors-theme");
if (saved === "dark") document.documentElement.dataset.theme = "dark";
const themeBtn = document.getElementById("theme-btn");
const syncTheme = () => { themeBtn.textContent = document.documentElement.dataset.theme === "dark" ? "Day" : "Night"; };
syncTheme();
themeBtn.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme === "dark";
  if (dark) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = "dark";
  localStorage.setItem("priors-theme", dark ? "light" : "dark");
  syncTheme();
});

document.querySelector(".menu-btn").addEventListener("click", (e) => {
  const open = document.querySelector(".nav").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open ? "true" : "false");
});

document.addEventListener("click", (e) => {
  const copy = e.target.closest("[data-copy]");
  if (copy) {
    const value = copy.dataset.copy;
    navigator.clipboard.writeText(value).then(() => {
      const prev = copy.textContent;
      copy.textContent = "Copied";
      setTimeout(() => { copy.textContent = prev; }, 1200);
    }).catch(() => toast(value));
  }
  if (e.target.closest("[data-connect]")) {
    sessionStorage.setItem("priors-wallet", "0x71C7…976F");
    paintWallet();
    toast("Preview wallet connected. This copy does not send transactions.");
  }
  if (e.target.closest("[data-disconnect]")) {
    sessionStorage.removeItem("priors-wallet");
    paintWallet();
    toast("Wallet disconnected.");
  }
  if (e.target.closest("[data-fake]")) {
    e.preventDefault();
    toast("Saved in this preview. Nothing was sent to a chain.");
  }
  const tab = e.target.closest("[data-tab]");
  if (tab) {
    const bar = tab.parentElement;
    bar.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === tab));
    const scope = bar.parentElement;
    scope.querySelectorAll("[data-panel]").forEach((p) => p.classList.toggle("on", p.dataset.panel === tab.dataset.tab));
  }
});

document.querySelectorAll(".stepl").forEach((el, i) => {
  const show = () => {
    document.querySelectorAll(".stepl").forEach((s) => s.classList.toggle("on", s === el));
    document.querySelectorAll("[data-step]").forEach((g) => g.classList.toggle("on", Number(g.dataset.step) === i + 1));
  };
  el.addEventListener("mouseenter", show);
  el.addEventListener("focusin", show);
  el.addEventListener("click", show);
});

const q = document.getElementById("agent-q");
if (q) {
  const apply = () => {
    const v = q.value.trim().toLowerCase();
    renderAgents(AGENTS.filter((a) => !v || a.name.includes(v) || String(a.id).includes(v)));
  };
  q.addEventListener("input", apply);
  apply();
} else renderAgents(AGENTS);

renderGrove();
renderLog(LOANS);
renderStocks();
renderUpdates("all");
bootStats();
bootAgent();
paintWallet();

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("on", b === btn));
    renderUpdates(btn.dataset.filter);
  });
});

const canvas = document.getElementById("bonsai");
if (canvas) drawBonsai(canvas);

window.AGENTS = AGENTS;
window.LOANS = LOANS;
window.STOCKS = STOCKS;
window.toast = toast;

const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      toast("Add your name, email, and a message.");
      return;
    }
    form.reset();
    const ok = document.getElementById("contact-ok");
    if (ok) ok.hidden = false;
    toast("Message kept in this preview. Write to contact@priors.trade to reach the team.");
  });
}

const lookup = document.getElementById("lookup");
if (lookup) {
  lookup.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = new FormData(lookup).get("q").toString().trim().toLowerCase();
    const a = AGENTS.find((x) => x.name === v || String(x.id) === v);
    if (!a) { toast("No preview agent by that name or id."); return; }
    location.href = "agent.html?id=" + a.id;
  });
}

const deposit = document.getElementById("deposit-form");
if (deposit) {
  deposit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!wallet()) { toast("Connect a preview wallet first."); return; }
    const n = Number(new FormData(deposit).get("amount"));
    if (!n || n <= 0) { toast("Enter an amount of USDG."); return; }
    toast("Deposit of " + n + " USDG noted in this preview.");
  });
}
