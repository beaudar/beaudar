export function loadTheme(theme: string, origin: string) {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('crossorigin', 'anonymous');
    link.onload = resolve;
    link.href = `/stylesheets/themes/${theme}/beaudar.css`;
    document.head.appendChild(link);

    addEventListener('message', (event) => {
      sessionStorage.setItem('beaudar-set-theme', event.data.theme);
      if (event.origin === origin && event.data.type === 'set-theme') {
        link.href = `/stylesheets/themes/${event.data.theme}/beaudar.css`;
      }
    });
  });
}
