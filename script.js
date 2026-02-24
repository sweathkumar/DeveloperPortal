/* ═══════════════════════════════════════════════════════════════
   SWEATHKUMAR — SCRIPT.JS  (Enhanced with Parallax System)
   Original purple NFT theme + multi-layer scroll parallax
   ═══════════════════════════════════════════════════════════════ */

/* ── 1. CURSOR ──────────────────────────────────────────────── */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .card, .project-card, .stat-item, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── 2. BACKGROUND LAYER (original) ────────────────────────── */
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

/* ── 3. FLOATING PARTICLES injected into bg ─────────────────── */
const particleWrap = document.createElement('div');
particleWrap.className = 'px-particles';
bgLayer.appendChild(particleWrap);
(function spawnParticles() {
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    p.className = 'px-dot';
    const size  = 1 + Math.random() * 2.5;
    const left  = Math.random() * 100;
    const top   = Math.random() * 200; /* spread over 2 screens worth */
    const dur   = 6 + Math.random() * 14;
    const delay = Math.random() * -20;
    const opacity = 0.15 + Math.random() * 0.45;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;top:${top}vh;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:${opacity};
    `;
    /* randomly tint some cyan */
    if (Math.random() > 0.7) p.style.background = 'var(--cyan)';
    particleWrap.appendChild(p);
  }
})();

/* ── 4. PARALLAX ENGINE ──────────────────────────────────────── */
/*
  Layers and their speeds (positive = moves down with scroll, negative = moves up):
    orb-1:    slow drift up-left          speed -0.18
    orb-2:    slow drift down-right       speed  0.12
    orb-3:    very slow up               speed -0.08
    hero-visual (code card): subtle lift  speed -0.10
    hero-content: breathe in             speed -0.05
    section headers: very gentle up      speed -0.06
    particles:                           speed -0.04 (different per particle)
    bg-grid:  micro drift                speed  0.02
*/

// Cache parallax targets after DOM ready
const pxTargets = [];

function registerParallaxTargets() {
  /* Background orbs — always registered */
  const o1 = bgLayer.querySelector('.orb-1');
  const o2 = bgLayer.querySelector('.orb-2');
  const o3 = bgLayer.querySelector('.orb-3');
  const grid = bgLayer.querySelector('.bg-grid');

  if (o1) pxTargets.push({ el: o1, speed: -0.18, axis: 'y', base: 0 });
  if (o2) pxTargets.push({ el: o2, speed:  0.12, axis: 'y', base: 0 });
  if (o3) pxTargets.push({ el: o3, speed: -0.08, axis: 'y', base: 0 });
  if (grid) pxTargets.push({ el: grid, speed: 0.018, axis: 'y', base: 0 });

  /* Hero elements */
  const heroVisual = document.querySelector('.hero-visual');
  const heroContent = document.querySelector('.hero-content');
  if (heroVisual)  pxTargets.push({ el: heroVisual,  speed: -0.12, axis: 'y', base: 0 });
  if (heroContent) pxTargets.push({ el: heroContent, speed: -0.05, axis: 'y', base: 0 });

  /* Section titles — gentle float */
  document.querySelectorAll('.sec-title').forEach(el => {
    pxTargets.push({ el, speed: -0.04, axis: 'y', base: 0 });
  });

  /* Cards — stagger horizontal micro drift depending on column */
  document.querySelectorAll('.card, .skill-card, .project-card').forEach((el, i) => {
    const xSpeed = (i % 2 === 0) ? 0.015 : -0.015;
    pxTargets.push({ el, speed: -0.03, axis: 'y', base: 0, xSpeed });
  });

  /* Stat strip — rise slightly on scroll */
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((el, i) => {
    pxTargets.push({ el, speed: -0.05 - i * 0.01, axis: 'y', base: 0 });
  });

  /* DSA big number — prominent lift */
  const dsaBig = document.querySelector('.dsa-big-num');
  if (dsaBig) pxTargets.push({ el: dsaBig, speed: -0.09, axis: 'y', base: 0 });

  /* Particles — store their starting tops for per-particle offset */
  particleWrap.querySelectorAll('.px-dot').forEach(p => {
    const spd = -0.02 - Math.random() * 0.06;
    pxTargets.push({ el: p, speed: spd, axis: 'y', base: 0, isParticle: true });
  });
}

/* RAF loop — smooth parallax using transform */
let lastSY = 0;
let ticking = false;

function applyParallax(sy) {
  pxTargets.forEach(t => {
    if (t.isParticle) {
      /* particles: don't apply full-page offset, just a gentle drift from their natural top */
      const drift = sy * t.speed;
      t.el.style.transform = `translateY(${drift}px)`;
      return;
    }
    const dy = sy * t.speed;
    const dx = t.xSpeed ? sy * t.xSpeed : 0;
    t.el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}

window.addEventListener('scroll', () => {
  lastSY = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(() => {
      applyParallax(lastSY);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── 5. MOUSE-MOVE PARALLAX (Hero only) ─────────────────────── */
/*  On index page, the orbs and hero card react subtly to mouse position */
let mouseParallaxEnabled = true;
let baseMX = window.innerWidth  / 2;
let baseMY = window.innerHeight / 2;
let pmx = baseMX, pmy = baseMY;
let pmxSmooth = baseMX, pmySmooth = baseMY;

document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });

(function mouseParallaxLoop() {
  if (mouseParallaxEnabled && window.scrollY < window.innerHeight) {
    pmxSmooth += (pmx - pmxSmooth) * 0.05;
    pmySmooth += (pmy - pmySmooth) * 0.05;

    const dx = (pmxSmooth - baseMX) / baseMX; /* -1 to 1 */
    const dy = (pmySmooth - baseMY) / baseMY;

    const o1 = bgLayer.querySelector('.orb-1');
    const o2 = bgLayer.querySelector('.orb-2');
    const hv = document.querySelector('.hero-visual');

    if (o1) {
      const sy = window.scrollY;
      const baseY = sy * -0.18;
      o1.style.transform = `translate(${dx * 30}px, ${baseY + dy * 20}px)`;
    }
    if (o2) {
      const sy = window.scrollY;
      const baseY = sy * 0.12;
      o2.style.transform = `translate(${-dx * 20}px, ${baseY + dy * 15}px)`;
    }
    if (hv) {
      const sy = window.scrollY;
      const baseY = sy * -0.12;
      hv.style.transform = `translate(${dx * 8}px, ${baseY + dy * 5}px)`;
    }
  }
  requestAnimationFrame(mouseParallaxLoop);
})();

/* Disable mouse parallax once user scrolls past hero */
window.addEventListener('scroll', () => {
  mouseParallaxEnabled = window.scrollY < window.innerHeight * 0.6;
}, { passive: true });

/* ── 6. SCROLL REVEAL ────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target); /* fire once */
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revObs.observe(el));

/* ── 7. STAT COUNTER ─────────────────────────────────────────── */
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

/* ── 8. SKILL BARS ───────────────────────────────────────────── */
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

/* ── 9. SECTION ENTRANCE — stagger children on scroll-in ─────── */
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    /* Animate direct children with a stagger */
    const children = e.target.querySelectorAll('.card, .project-card, .skill-card, .stat-item');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${0.06 * i}s`;
    });
    sectionObs.unobserve(e.target);
  });
}, { threshold: 0.05 });
document.querySelectorAll('section').forEach(s => sectionObs.observe(s));

/* ── 10. ACTIVE NAV ──────────────────────────────────────────── */
const path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('index.html')))) {
    a.classList.add('active');
  }
});

/* ── 11. NAV SCROLL TINT ─────────────────────────────────────── */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!navEl) return;
  navEl.style.background = window.scrollY > 60
    ? 'rgba(7,4,15,0.96)'
    : 'rgba(7,4,15,0.8)';
}, { passive: true });

/* ── 12. CARD TILT on mouse-enter (3D micro-tilt) ────────────── */
document.querySelectorAll('.card, .project-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / (r.width  / 2); /* -1 to 1 */
    const dy = (e.clientY - cy) / (r.height / 2);
    /* max tilt ±4° */
    card.style.transform = `perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-5px)`;
    card.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s, border-color 0.3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s';
  });
});

/* ── 13. HORIZONTAL SCROLL SECTION LABELS (subtle x parallax) ── */
document.querySelectorAll('.sec-label').forEach((lbl, i) => {
  pxTargets.push({ el: lbl, speed: -0.03, axis: 'y', base: 0 });
});

/* ── 14. INIT PARALLAX (register after DOM parsed) ───────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerParallaxTargets);
} else {
  registerParallaxTargets();
}

/* ── 15. HERO BADGE TYPING EFFECT ───────────────────────────── */
const badge = document.querySelector('.hero-badge');
if (badge) {
  const text = badge.textContent.trim();
  badge.textContent = '';
  badge.style.minWidth = '220px';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      badge.textContent += text[i++];
      setTimeout(typeChar, 38 + Math.random() * 30);
    }
  }
  setTimeout(typeChar, 600);
}

/* ── 16. SMOOTH SCROLL for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
