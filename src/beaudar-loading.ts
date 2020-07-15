import { scheduleMeasure } from './measure';
import { loadTheme } from './theme';

export async function beaudarLoadingStatus(page: any): Promise<LoadingParam> {
  const loadingElement = document.createElement('div');
  // tslint:disable-next-line: one-variable-per-declaration
  let setTheme = loadTheme(page.theme, page.origin), IS_IE = false;

  if (sessionStorage.getItem('beaudar-set-theme')) {
    // @ts-ignore
    setTheme = loadTheme(sessionStorage.getItem('beaudar-set-theme'), page.origin);
  }
  // 放弃 IE
  if (window.navigator.userAgent.indexOf('MSIE') !== -1 || 'ActiveXObject' in window) {
    const ieContainer = document.createElement('div');
    IS_IE = true;
    ieContainer.classList.add('ie-container', 'markdown-body');
    ieContainer.innerHTML = `
    <h3>我身处 IE 的花海中......</h3>
    <p>&emsp;&emsp;从前，有片花田。
    <br/>&emsp;&emsp;那里很空旷，很寂静。
    <br/>&emsp;&emsp;微风吹过脸颊，
    <br/>&emsp;&emsp;有一丝丝甘甜的气息。
    <br/>&emsp;&emsp;眺望远处，
    <br/>&emsp;&emsp;绵延的花海仿佛在指引着我们，
    <br/>&emsp;&emsp;透过它，
    <br/>&emsp;&emsp;我们理解了这五彩斑斓的世界。
    </p>
    <a href='https://browsehappy.com' target='_blank'>
    下载新一代浏览器后再次访问本页面。
    </a>`;
    loadingElement.appendChild(ieContainer);
  }

  // 添加加载状态
  if (JSON.parse(page.loading)) {
    const beaudarLoading = document.createElement('div');
    beaudarLoading.classList.add('beaudarLoading');
    beaudarLoading.innerHTML = `
      <a href="https://beaudar.lipk.org" target="_blank">
        <img width="50px" height="50px" src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-240.png" alt="Beaudar(表达)" title="Beaudar(表达)">
      </a>`;
    loadingElement.appendChild(beaudarLoading);
  }

  setTheme.then(() => {
    document.body.appendChild(loadingElement);
    scheduleMeasure();
  });

  return { loadingElement, IS_IE };
}

export interface LoadingParam {
  loadingElement: HTMLDivElement;
  IS_IE: boolean;
}
