// Enhance server-rendered content; without JS, native details and all models remain available.
export function initChoices() {
  for (const group of document.querySelectorAll('[data-choice-group]')) {
    const controls = group.querySelector('.choice-controls');
    const buttons = [...group.querySelectorAll('[data-choice]')];
    const panels = [...group.querySelectorAll('[data-choice-panel]')];
    if (!controls || !buttons.length || buttons.some(button => !panels.some(panel => panel.id === button.dataset.choice))) continue;

    function select(id) {
      for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.choice === id));
      for (const panel of panels) {
        panel.hidden = panel.id !== id;
        if (panel.tagName === 'DETAILS') panel.open = panel.id === id;
      }
    }

    for (const panel of panels) {
      if (panel.tagName !== 'DETAILS') continue;
      const summary = panel.querySelector('summary');
      const heading = document.createElement('div');
      heading.className = 'service-heading';
      heading.append(...summary.childNodes);
      // Convert disclosures into non-collapsible panels after enhancement.
      const section = document.createElement('section');
      for (const attribute of panel.attributes) section.setAttribute(attribute.name, attribute.value);
      section.append(heading, ...[...panel.children].filter(child => child !== summary));
      panel.replaceWith(section);
      panels[panels.indexOf(panel)] = section;
    }
    group.classList.add('choices-ready');
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.choice)));
    const followAnchor = () => {
      const target = panels.find(panel => panel.id === location.hash.slice(1));
      if (target) select(target.id);
    };
    select(buttons[0].dataset.choice);
    followAnchor();
    window.addEventListener('hashchange', followAnchor);
  }
}
