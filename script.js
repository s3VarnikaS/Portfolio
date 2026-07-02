const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const progress = document.querySelector('[data-scroll-progress]');
const railDot = document.querySelector('[data-rail-dot]');
const revealItems = document.querySelectorAll('[data-reveal]');
const navLinks = document.querySelectorAll('.site-nav a, .side-index a');
const sections = [...document.querySelectorAll('main section[id]')];
const floatItems = document.querySelectorAll('[data-float]');
const marquee = document.querySelector('.marquee');
const showcaseTabs = document.querySelectorAll('[data-showcase-tab]');
const showcasePanels = document.querySelectorAll('[data-showcase-panel]');

if (marquee) {
  marquee.innerHTML += marquee.innerHTML;
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

showcaseTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.showcaseTab;

    showcaseTabs.forEach((item) => {
      item.classList.toggle('is-active', item === tab);
    });

    showcasePanels.forEach((panel) => {
      panel.classList.toggle('is-hidden', panel.dataset.showcasePanel !== target);
    });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

function updateScrollUi() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;

  if (progress) progress.style.width = `${ratio * 100}%`;
  if (railDot) railDot.style.top = `${ratio * 100}%`;

  let activeId = sections[0]?.id;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.36 && rect.bottom >= window.innerHeight * 0.36) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
  });

  floatItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    item.style.transform = `translateY(${distance * -18}px)`;
  });
}

let ticking = false;
function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollUi();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', updateScrollUi);
updateScrollUi();
