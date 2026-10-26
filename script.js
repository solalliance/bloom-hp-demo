const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const recruitCta = document.querySelector('.fixed-recruit-cta');
const hero = document.querySelector('.hero');
let ctaFramePending = false;

function updateRecruitCta() {
  const visible = hero.getBoundingClientRect().bottom <= 0;
  recruitCta.classList.toggle('is-visible', visible);
  recruitCta.inert = !visible;
  recruitCta.setAttribute('aria-hidden', String(!visible));
  ctaFramePending = false;
}

function scheduleCtaUpdate() {
  if (ctaFramePending) return;
  ctaFramePending = true;
  requestAnimationFrame(updateRecruitCta);
}

window.addEventListener('scroll', scheduleCtaUpdate, { passive: true });
window.addEventListener('resize', scheduleCtaUpdate);
window.addEventListener('pageshow', scheduleCtaUpdate);
updateRecruitCta();

// Reveal content once as it enters the viewport; keep no-JS content visible.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets = document.querySelectorAll(
  '.section-heading, .about-copy, .about-gallery figure, .service-list details, ' +
  '.staff-card, .recruit-guide-grid > a, .work-image, .welfare-grid article, ' +
  '.job-list > a, .recruit-faq-list details, .contact-cards > a'
);

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  revealTargets.forEach(element => {
    const siblings = [...element.parentElement.children];
    const index = siblings.indexOf(element);
    element.style.setProperty('--reveal-delay', `${Math.min(index, 2) * 70}ms`);
    element.classList.add('scroll-reveal');
    revealObserver.observe(element);
  });

  reduceMotion.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealTargets.forEach(element => element.classList.add('is-revealed'));
  });
}
