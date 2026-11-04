(() => {
  const routes = new Set(['/', '/about', '/treatments', '/concerns', '/privacy-policy', '/terms-of-use', '/book']);
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href, location.href);
    if (target.origin === location.origin && routes.has(target.pathname) && target.pathname !== location.pathname) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.assign(target.pathname + target.search + target.hash);
    } else if (target.origin !== location.origin && /^https?:$/.test(target.protocol)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }, true);
})();
