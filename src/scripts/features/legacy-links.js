// Resolve only known legacy routes; inner-page fragments must stay in place.
export function legacyDestination(pathname, search = '', hash = '') {
  const home = ['/', '/index.html', '/tree.html'].includes(pathname);
  const fragments = {models: '/services/', capabilities: '/services/', start: '/services/#start', why: '/services/#why', team: '/team/', work: '/work/', faq: '/faq/', contact: '/contact/'};
  if (home && fragments[hash.slice(1)]) {
    const [path, anchor = ''] = fragments[hash.slice(1)].split('#');
    return path + search + (anchor ? '#' + anchor : '');
  }
  if (pathname === '/index.html' || pathname === '/tree.html') return '/' + search + hash;
  const match = pathname.match(/^\/(services|team|work|faq|contact)(?:\.html|\/index\.html)$/);
  return match ? '/' + match[1] + '/' + search + hash : null;
}

export function redirectLegacyLinks() {
  const destination = legacyDestination(location.pathname, location.search, location.hash);
  if (destination) location.replace(destination);
}
