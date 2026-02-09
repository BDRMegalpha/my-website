const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeBtn.textContent = theme === "light" ? "🌞" : "🌙";
}

const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);
else {
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  setTheme(prefersLight ? "light" : "dark");
}

themeBtn.addEventListener("click", () => {
  setTheme(root.dataset.theme === "light" ? "dark" : "light");
});

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = (data.get("name") || "").toString().trim();
    const msg = (data.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`Website message from ${name || "Someone"}`);
    const body = encodeURIComponent(msg);
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  });
}

// Background particles
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d", { alpha: true });

let w, h, dpr;
function resize() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const dots = [];
const DOTS = 70;
function rand(min, max){ return Math.random() * (max - min) + min; }

function resetDot(dot) {
  dot.x = rand(0, w);
  dot.y = rand(0, h);
  dot.r = rand(1.2, 2.8) * dpr;
  dot.vx = rand(-0.25, 0.25) * dpr;
  dot.vy = rand(-0.2, 0.3) * dpr;
  dot.a = rand(0.12, 0.35);
}

for (let i = 0; i < DOTS; i++) {
  const dot = {};
  resetDot(dot);
  dots.push(dot);
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  const isLight = root.dataset.theme === "light";
  ctx.globalCompositeOperation = "lighter";

  for (const d of dots) {
    d.x += d.vx;
    d.y += d.vy;

    if (d.x < -20*dpr || d.x > w + 20*dpr || d.y < -20*dpr || d.y > h + 20*dpr) {
      resetDot(d);
      if (Math.random() < 0.5) d.x = rand(0, w), d.y = -10*dpr;
      else d.x = -10*dpr, d.y = rand(0, h);
    }

    const c1 = isLight ? `rgba(0, 140, 255, ${d.a})` : `rgba(110, 231, 255, ${d.a})`;
    const c2 = isLight ? `rgba(140, 90, 255, ${d.a})` : `rgba(167, 139, 250, ${d.a})`;

    const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 8);
    g.addColorStop(0, c1);
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(draw);
}
draw();
