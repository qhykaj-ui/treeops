const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('info@treeops.net'); copyStatus.textContent = 'Copied: info@treeops.net'; }
  catch { copyStatus.textContent = 'Select and copy this address: info@treeops.net'; }
});

const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const projects = Array.from(document.querySelectorAll('[data-type]'));
const countEl = document.querySelector('.work-count');
document.querySelector('.filters').hidden = false;
filterButtons.forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.filter;
  filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let visible = 0;
  projects.forEach(card => { card.hidden = type !== 'all' && card.dataset.type !== type; if (!card.hidden) visible++; });
  countEl.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
}));

const navLinks = Array.from(document.querySelectorAll('nav a'));
const targets = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current','true') : a.removeAttribute('aria-current'));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  targets.forEach(t => io.observe(t));
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
menuButton.hidden = false;
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width: 992px)').addEventListener('change', closeMenu);
