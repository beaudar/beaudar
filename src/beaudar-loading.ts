import { BeaudarAvatarUrl } from './constant-data';
import { scheduleMeasure } from './measure';

export const addLoadingStatus = (page: { loading: string }) => {
  // 添加加载状态
  if (JSON.parse(page.loading)) {
    const beaudarBox = document.createElement('div');
    beaudarBox.style.cssText = `
      display: flex;
      justify-content: center;
      padding: 40px 0px 60px
      `;
    beaudarBox.id = 'beaudar-box';

    beaudarBox.innerHTML = `
      <a href="https://beaudar.lipk.org" target="_blank">
        <div style="
          position: relative;
          margin: auto;
          background-color: rgb(225, 228, 233);
          border-radius: 50px;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <img
            width="40px"
            height="40px"
            style="z-index: 2;"
            src="${BeaudarAvatarUrl}"
            alt="Beaudar(表达)"
            title="Beaudar(表达)"
          />
          <div style="
            position: absolute;
            right: 23px;
            width: 0px;
            top: 31px;
            height: 0px;
            border-top: 39px solid rgb(225, 228, 233);
            border-right: 23px solid transparent;
            border-left: 12px solid transparent;
            transform: rotate(47deg);
          "></div>
        </div>
      </a>
      `;

    document.body.appendChild(beaudarBox);
    scheduleMeasure();
  }
};

export const removeLoadingElement = () => {
  const loadingElement = document.querySelector('#beaudar-box');
  loadingElement?.remove();
};
