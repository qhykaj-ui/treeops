export function initClipboard() {
  const button = document.querySelector('.copy-email');
  const status = document.querySelector('.copy-status');
  if (!button || !status) return;

  button.hidden = false;
  button.addEventListener('click', async () => {
    const email = button.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = `Copied: ${email}`;
    } catch {
      status.textContent = `Select and copy: ${email}`;
    }
  });
}
