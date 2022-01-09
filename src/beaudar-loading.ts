import { scheduleMeasure } from './measure';

export const addLoadingStatus = (page: { loading: string }) => {
  // 添加加载状态
  if (JSON.parse(page.loading)) {
    const beaudarLoading = document.createElement('div');
    const beaudarLoadingPseudoBefore = document.createElement('div');
    beaudarLoading.id = 'beaudar-loading';
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
    document.body.appendChild(beaudarLoading);
    scheduleMeasure();
  }
};

export const removeLoadingElement = () => {
  const loadingElement = document.querySelector('#beaudar-loading');
  loadingElement?.remove();
};
