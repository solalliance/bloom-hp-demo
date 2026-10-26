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
