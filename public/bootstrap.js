if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('.skip-link');
  if (!link) return;
  link.addEventListener('click', () => {
    const root = document.getElementById('root');
    if (!root) return;
    root.setAttribute('tabindex', '-1');
    root.focus();
  });
});
