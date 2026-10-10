export function redirectLegacyLinks() {
  if (location.pathname.endsWith('/') || /\/(index|tree)\.html$/.test(location.pathname)) {
    const destinations = {models: 'services.html', capabilities: 'services.html', start: 'services.html#start', why: 'services.html#why', team: 'team.html', work: 'work.html', faq: 'faq.html', contact: 'contact.html'};
    const destination = destinations[location.hash.slice(1)];
    if (destination) location.replace(destination);
  }
}
