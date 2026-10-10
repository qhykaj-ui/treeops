const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('info@treeops.net');
    copyStatus.textContent = 'Copied: info@treeops.net';
  } catch {
    copyStatus.textContent = 'Select and copy: info@treeops.net';
  }
});

// All sections remain readable when JavaScript is unavailable.
const tabList = document.querySelector('.explore-tabs');
const tabs = [...tabList.querySelectorAll('a')];
const panels = [...document.querySelectorAll('.explore-panel')];
const aliases = { capabilities: 'models', start: 'models', why: 'models' };
tabList.setAttribute('role', 'tablist');
tabs.forEach(tab => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', tab.hash.slice(1));
});
panels.forEach(panel => {
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
});
function activate(id) {
  id = aliases[id] || id;
  if (!panels.some(panel => panel.id === id)) return false;
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
  tabs.forEach(tab => {
    const selected = tab.hash === '#' + id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  markNavigation(id);
  return true;
}
function markNavigation(id) {
  document.querySelectorAll('#main-navigation a').forEach(link => {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function fromHash() {
  const id = location.hash.slice(1) || 'top';
  if (!activate(id)) {
    activate('models');
    markNavigation(id);
  }
}
fromHash();
window.addEventListener('hashchange', fromHash);
window.addEventListener('popstate', fromHash);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const id = link.hash.slice(1);
  if (!activate(id)) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  if (!tabList.contains(link)) {
    document.querySelector('.explore').scrollIntoView({ block: 'start' });
    tabs.find(tab => tab.getAttribute('aria-selected') === 'true').focus({ preventScroll: true });
  }
});
tabList.addEventListener('keydown', event => {
  const current = tabs.indexOf(document.activeElement);
  if (current < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
    (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
});

const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-type]')];
const count = document.querySelector('.work-count');
const pager = document.querySelector('.project-pager');
const previous = document.querySelector('[data-page="prev"]');
const next = document.querySelector('[data-page="next"]');
let category = 'all';
let page = 0;
const pageSize = 3;
document.querySelector('.filters').hidden = false;
function renderProjects() {
  const matches = projects.filter(project => category === 'all' || project.dataset.type === category);
  const pages = Math.ceil(matches.length / pageSize);
  const shown = matches.slice(page * pageSize, (page + 1) * pageSize);
  projects.forEach(project => {
    project.hidden = !shown.includes(project);
    project.querySelectorAll('details').forEach(detail => { detail.open = false; });
  });
  count.textContent = `${matches.length} projects`;
  pager.hidden = pages <= 1;
  previous.disabled = page === 0;
  next.disabled = page >= pages - 1;
  document.querySelector('.page-status').textContent = `Page ${page + 1} of ${pages}`;
}
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  page = 0;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  renderProjects();
}));
previous.addEventListener('click', () => { if (page > 0) { page--; renderProjects(); } });
next.addEventListener('click', () => { if (!next.disabled) { page++; renderProjects(); } });
renderProjects();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
window.matchMedia('(min-width: 992px)').addEventListener('change', closeMenu);
