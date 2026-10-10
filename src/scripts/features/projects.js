export function initProjects() {
  const controls = document.querySelector('.filters');
  if (!controls) return;

  const filters = [...controls.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-type]')];
  const count = document.querySelector('.work-count');
  const pager = document.querySelector('.project-pager');
  const previous = document.querySelector('[data-page="prev"]');
  const next = document.querySelector('[data-page="next"]');
  const status = document.querySelector('.page-status');
  const pageSize = 3;
  let category = 'all';
  let page = 0;

  // Derive counts from the catalogue, not duplicated badge values.
  const matching = type => projects.filter(project => type === 'all' || project.dataset.type === type);
  for (const filter of filters) {
    const badge = filter.querySelector('span');
    if (badge) badge.textContent = matching(filter.dataset.filter).length;
  }

  function render() {
    const matches = matching(category);
    const pages = Math.ceil(matches.length / pageSize);
    const visible = new Set(matches.slice(page * pageSize, (page + 1) * pageSize));
    projects.forEach(project => { project.hidden = !visible.has(project); });
    count.textContent = `${matches.length} projects`;
    pager.hidden = pages <= 1;
    previous.disabled = page === 0;
    next.disabled = page >= pages - 1;
    status.textContent = pages ? `Page ${page + 1} of ${pages}` : 'No projects';
  }

  controls.hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    page = 0;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    render();
  }));
  previous.addEventListener('click', () => {
    if (page > 0) { page--; render(); }
  });
  next.addEventListener('click', () => {
    if (!next.disabled) { page++; render(); }
  });
  render();
}
