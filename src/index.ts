import { ConfigurationComponent } from './component/configuration-component';

document
  .querySelector('h2#configuration')!
  .insertAdjacentElement('afterend', new ConfigurationComponent().element);

const links = document.getElementsByTagName('a');
for (let i = 0; i < links.length; i++) {
  if (/^(https?:)?\/\//.test(links[i].getAttribute('href') as string)) {
    links[i].target = '_blank';
  }
}
