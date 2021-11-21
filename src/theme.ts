import { pageAttributes as page } from './page-attributes';

export const loadTheme = (theme: string, origin: string) => {
  document.documentElement.setAttribute('theme', theme);

  addEventListener('message', (event) => {
    if (JSON.parse(page.keepTheme)) {
      sessionStorage.setItem('beaudar-set-theme', event.data.theme);
    }
    if (event.origin === origin && event.data.type === 'set-theme') {
      document.documentElement.setAttribute('theme', event.data.theme);
    }
  });
};
