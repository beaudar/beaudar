import { scheduleMeasure } from './measure';

export interface LoadingParam {
  loadingElement: HTMLDivElement;
  IS_IE: boolean;
}

export const beaudarLoadingStatus = (page: {
  loading: string;
}): LoadingParam => {
  const loadingElement = document.createElement('div');
  let IS_IE = false;
  // 放弃 IE
  if (
    window.navigator.userAgent.indexOf('MSIE') !== -1 ||
    'ActiveXObject' in window
  ) {
    const ieContainer = document.createElement('div');
    IS_IE = true;
    ieContainer.style.cssText = `
    width: 360px;
    padding: 40px;
    margin: auto;
    `;
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
  if (JSON.parse(page.loading) && !IS_IE) {
    const beaudarLoading = document.createElement('div');
    const beaudarLoadingPseudoBefore = document.createElement('div');
    beaudarLoading.style.cssText = `
    position: relative;
    margin: 40px auto 60px auto;
    background-color: #e1e4e9;
    border-radius: 50px;
    width: 100px;
    height: 100px;
    `;
    beaudarLoadingPseudoBefore.style.cssText = `
    position: absolute;
    right: 46px;
    width: 0px;
    top: 62px;
    height: 0;
    border-top: 49px solid #e1e4e9;
    border-right: 33px solid transparent;
    border-left: 22px solid transparent;
    transform: rotate(47deg);
    `;
    beaudarLoading.innerHTML = `
      <a href="https://beaudar.lipk.org" target="_blank">
        <img width="50px" height="50px"
        style="position: absolute; top: 25px; left: 25px; z-index: 2;"
        src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-240.png"
        alt="Beaudar(表达)" title="Beaudar(表达)">
      </a>`;
    beaudarLoading.appendChild(beaudarLoadingPseudoBefore);
    loadingElement.appendChild(beaudarLoading);
    document.body.appendChild(loadingElement);
    scheduleMeasure();
  }

  return { loadingElement, IS_IE };
};
