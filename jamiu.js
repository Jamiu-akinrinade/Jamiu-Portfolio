/* =============================================
   JAMIU AKINRINADE — PORTFOLIO
   JS: jamiu.js
   ============================================= */

// ─── THEME SYSTEM ────────────────────────────
const THEME_KEY = 'jamiu-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  applyTheme(getPreferredTheme());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ─── BUILD NAV & HEADER ──────────────────────
function buildHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = `<span></span><span></span><span></span>`;

  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Toggle theme');
  toggle.innerHTML = `<span class="toggle-icon toggle-sun">☀️</span><span class="toggle-icon toggle-moon">🌙</span>`;

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  const nav = header.querySelector('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
  // Hire Me button
const hireBtn = document.createElement('a');
hireBtn.href = 'https://wa.me/+2349134709435'; 
hireBtn.target = '_blank';
hireBtn.rel = 'noopener noreferrer';
hireBtn.className = 'hire-btn';
hireBtn.textContent = 'Hire Me';
header.appendChild(hireBtn);

  header.appendChild(hamburger);
  header.appendChild(toggle);
}

// ─── SKILLS DATA ─────────────────────────────
// JS updated to 80%, React added at 80%
const SKILLS_DATA = [
  { name: 'HTML',       img: 'images copy/html-logo.webp',       alt: 'HTML logo',       level: 90 },
  { name: 'CSS',        img: 'images copy/css-logo.webp',        alt: 'CSS logo',        level: 80 },
  { name: 'JavaScript', img: 'images copy/javascript-logo.webp', alt: 'JavaScript logo', level: 80 },
  { name: 'React',      img: 'images copy/react-logo.webp',      alt: 'React logo',      level: 80 },
];

function buildSkills() {
  const section = document.querySelector('#skills');
  if (!section) return;

  const oldCell = section.querySelector('.cell');
  if (oldCell) oldCell.remove();

  const grid = document.createElement('div');
  grid.className = 'skills-grid';

  SKILLS_DATA.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';

    card.innerHTML = `
      <div class="skill-header">
        <img src="${skill.img}" alt="${skill.alt}" loading="lazy">
        <span>${skill.name}</span>
      </div>
      <div>
        <div class="skill-level-row">
          <span style="font-size:0.72rem;color:var(--text-muted);letter-spacing:0.06em;">PROFICIENCY</span>
          <span class="skill-percent">${skill.level}%</span>
        </div>
        <div class="skill-track">
          <div class="skill-bar" data-level="${skill.level}"></div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  section.appendChild(grid);
}

// ─── ANIMATE SKILL BARS ON SCROLL ────────────
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        setTimeout(() => {
          bar.style.width = level + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// ─── REBUILD CONTACT FORM ────────────────────
function buildForm() {
  const section = document.querySelector('#contact');
  if (!section) return;

  const oldForm = section.querySelector('form');
  if (!oldForm) return;

  const card = document.createElement('div');
  card.className = 'form-card';

  card.innerHTML = `
    <form id="contact-form" novalidate>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your full name" required autocomplete="name">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Tell me what's on your mind…" required></textarea>
      </div>
      <button type="submit" class="submit-btn">Send Message</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
  `;

  oldForm.replaceWith(card);

  const form = card.querySelector('#contact-form');
  const status = card.querySelector('.form-status');
  const submitBtn = card.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus(status, 'Please fill in all fields.', 'error');
      return;
    }

    // Disable button while sending
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch('https://formspree.io/f/xjgnwabb', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        setStatus(status, '✓ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        const data = await response.json();
        const errMsg = data?.errors?.map(err => err.message).join(', ') || 'Something went wrong.';
        setStatus(status, errMsg, 'error');
      }
    } catch {
      setStatus(status, 'Network error — please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'form-status ' + type;
  setTimeout(() => {
    el.textContent = '';
    el.className = 'form-status';
  }, 5000);
}

// ─── ADD FOOTER ──────────────────────────────
function buildFooter() {
  const container = document.querySelector('.container');
  if (!container || container.querySelector('footer')) return;

  const footer = document.createElement('footer');
  footer.innerHTML = `© ${new Date().getFullYear()} <span>Jamiu Akinrinade</span>`;
  container.appendChild(footer);
}

// ─── SCROLL REVEAL ───────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll('section, .project, .skill-card');

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

// ─── ACTIVE NAV HIGHLIGHT ────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ─── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  buildHeader();
  buildSkills();
  buildForm();
  buildFooter();

  requestAnimationFrame(() => {
    animateSkillBars();
    initScrollReveal();
    initActiveNav();
  });
});