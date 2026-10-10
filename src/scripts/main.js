import { initClipboard } from './features/clipboard.js';
import { initProjects } from './features/projects.js';
import { initNavigation } from './features/navigation.js';
import { redirectLegacyLinks } from './features/legacy-links.js';

redirectLegacyLinks();
initNavigation();
initClipboard();
initProjects();
