const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
if (copyButton && copyStatus) {
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('info@treeops.net');
    copyStatus.textContent = 'Copied: info@treeops.net';
  } catch {
    copyStatus.textContent = 'Select and copy: info@treeops.net';
  }
});

}

if (document.querySelector('.filters')) {
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

}

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

if (location.pathname.endsWith('/') || /\/(index|tree)\.html$/.test(location.pathname)) {
  const destinations = {models: 'services.html', capabilities: 'services.html', start: 'services.html#start', why: 'services.html#why', team: 'team.html', work: 'work.html', faq: 'faq.html', contact: 'contact.html'};
  const destination = destinations[location.hash.slice(1)];
  if (destination) location.replace(destination);
}
