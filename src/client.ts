import { param, deparam } from './utils';
import { ResizeMessage } from './type-declare';
import { preferredThemeId, preferredTheme } from './constant-data';

// slice session from query string
const params = deparam(location.search.substring(1));
const session = params.beaudar;
if (session) {
  localStorage.setItem('beaudar-session', session);
  delete params.beaudar;
  let search = param(params);
  if (search.length) {
    search = '?' + search;
  }
  history.replaceState(
    undefined,
    document.title,
    location.pathname + search + location.hash,
  );
}

let script = document.currentScript as HTMLScriptElement;
if (!script) {
  // Internet Explorer :(
  script = document.querySelector(
    'script[src^="https://beaudar.lipk.org/client.js"],script[src^="http://localhost:3000/client.ts"]',
  ) as HTMLScriptElement;
}

// gather script element's attributes
const attrs: Record<string, string> = {};

for (let i = 0; i < script.attributes.length; i++) {
  const attribute = script.attributes.item(i)!;
  attrs[attribute.name.replace(/^data-/, '')] = attribute.value; // permit using data-theme instead of theme.
}

// 如果是根据浏览器模式选择
if (attrs.theme === preferredThemeId) {
  attrs.theme = preferredTheme;
}

// gather page attributes
const canonicalLink = document.querySelector(
  `link[rel='canonical']`,
) as HTMLLinkElement;
attrs.url = canonicalLink
  ? canonicalLink.href
  : location.origin + location.pathname + location.search;
attrs.origin = location.origin;
attrs.pathname =
  location.pathname.length < 2
    ? 'index'
    : location.pathname.substring(1).replace(/\.\w+$/, '');
attrs.title = document.title;
const descriptionMeta = document.querySelector(
  `meta[name='description']`,
) as HTMLMetaElement;
attrs.description = descriptionMeta ? descriptionMeta.content : '';
const ogtitleMeta = document.querySelector(
  `meta[property='og:title'],meta[name='og:title']`,
) as HTMLMetaElement;
attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : '';
attrs.session = session || localStorage.getItem('beaudar-session') || '';

// create the standard beaudar styles and insert them at the beginning of the
// <head> for easy overriding.
// NOTE: the craziness with "width" is for mobile safari :(
document.head.insertAdjacentHTML(
  'afterbegin',
  `<style>
    .beaudar {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 760px;
      margin-left: auto;
      margin-right: auto;
    }
    .beaudar-frame {
      color-scheme: light;
      position: absolute;
      left: 0;
      right: 0;
      width: 1px;
      min-width: 100%;
      max-width: 100%;
      height: 100%;
      border: 0;
    }
  </style>`,
);

// create the comments iframe and it's responsive container
const beaudarOrigin = script.src.match(
  /^https:\/\/beaudar.lipk\.org|http:\/\/localhost:\d+/,
)![0];
const url = `${beaudarOrigin}/beaudar.html`;
script.insertAdjacentHTML(
  'afterend',
  `<div class="beaudar">
    <iframe class="beaudar-frame" title="Comments" scrolling="no" src="${url}?${param(
    attrs,
  )}" loading="lazy"></iframe>
  </div>`,
);
const container = script.nextElementSibling as HTMLDivElement;
script.parentElement!.removeChild(script);
// adjust the iframe's height when the height of it's content changes
addEventListener('message', (event) => {
  if (event.origin !== beaudarOrigin) {
    return;
  }
  const data = event.data as ResizeMessage;
  if (data && data.type === 'resize' && data.height) {
    container.style.height = `${data.height}px`;
  }
});
