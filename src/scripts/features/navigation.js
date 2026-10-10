export function initNavigation() {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  if (!button || !navigation) return;

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  button.hidden = false;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      close();
      button.focus();
    }
  });
  window.matchMedia('(min-width: 992px)').addEventListener('change', close);
}
