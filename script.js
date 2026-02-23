/* ── CURSOR ── */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
document.body.appendChild(dot); document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animC() {
  rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animC);
})();
document.querySelectorAll('a, button, .card, .project-card, .stat-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── BACKGROUND LAYER ── */
const bgLayer = document.createElement('div');
bgLayer.className = 'bg-layer';
bgLayer.innerHTML = `
  <div class="bg-grid"></div>
  <div class="bg-scan"></div>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
`;
document.body.insertBefore(bgLayer, document.body.firstChild);

/* ── PARALLAX ORBS ── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const o1 = bgLayer.querySelector('.orb-1');
  const o2 = bgLayer.querySelector('.orb-2');
  if (o1) o1.style.transform = `translate(${sy*0.03}px, ${sy*0.04}px) scale(1)`;
  if (o2) o2.style.transform = `translate(${-sy*0.02}px, ${-sy*0.03}px) scale(1)`;
});

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
reveals.forEach(el => revObs.observe(el));

/* ── STAT COUNTER ── */
function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = !Number.isInteger(target);
  const dur = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = target * ease;
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const numEl = e.target.querySelector('.stat-n[data-target]');
    if (numEl) { countUp(numEl); e.target.classList.add('counted'); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-item').forEach(el => statObs.observe(el));

/* ── SKILL BARS ── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill[data-w]').forEach(bar => {
      if (!bar.dataset.done) { bar.dataset.done = '1'; bar.style.width = bar.dataset.w + '%'; }
    });
    e.target.querySelectorAll('.diff-bar[data-w]').forEach(bar => {
      if (!bar.dataset.done) { bar.dataset.done = '1'; bar.style.width = bar.dataset.w + '%'; }
    });
  });
}, { threshold: 0.25 });
document.querySelectorAll('.skill-card, .dsa-main-card').forEach(el => skillObs.observe(el));

/* ── ACTIVE NAV ── */
const path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('index.html')))) {
    a.classList.add('active');
  }
});
