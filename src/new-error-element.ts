import { scheduleMeasure } from './measure';

export class NewErrorElement {
  public readonly element: HTMLElement;
  isTimelineNull: boolean;
  beaudarArticle = `
  <article class="timeline-comment">
    <a class="avatar" href="https://github.com/beaudar" target="_blank">
      <img alt="@beaudar" height="40" width="40" src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-340.png">
    </a>
    <div class="comment">
      <header class="comment-header">
        <span class="comment-meta">
          <a class="smallAvatar" href="https://github.com/beaudar" target="_blank">
            <img alt="@beaudar" height="20" width="20" src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-340.png">
          </a>
          <strong class="comment-author">Beaudar</strong> 系统消息
        </span>
      </header>
      <article id="beaudarMsg" class="markdown-body">
      </article>
    </div>
  </article>
`;
  constructor() {
    if (document.querySelector('.timeline') === null) {
      this.isTimelineNull = true;
      this.element = document.createElement('main');
      this.element.classList.add('timeline');
      this.element.innerHTML = this.beaudarArticle;
    } else {
      this.isTimelineNull = false;
      // @ts-ignore
      this.element = document.querySelector('.timeline');
      if (document.querySelector('#beaudarMsg') === null) {
        this.element!.lastElementChild!.insertAdjacentHTML(
          'beforebegin',
          this.beaudarArticle,
        );
      }
    }
  }

  /**
   * 创建错误消息
   * @param header 错误标题
   * @param body 错误内容
   * @param helpHash 错误信息锚点
   * @param reload 是否显示刷新按钮
   */
  public createMsgElement(
    header: string,
    body: string,
    helpHash: string,
    reload?: boolean,
  ) {
    let reloadButtonStr = '';
    if (reload) {
      reloadButtonStr =
        '<button id="reload-button" type="button" class="btn btn-primary" >刷新</button>';
    }
    this.element.querySelector('#beaudarMsg')!.insertAdjacentHTML(
      'beforeend',
      `
    <h3>${header}</h3>
    ${body}
    <p><a href="https://lipk.org/blog/2020/06/08/beauder-qa/${helpHash}" target="_blank">获取此问题的帮助信息</a></p>
    ${reloadButtonStr}`,
    );
    if (this.isTimelineNull) {
      document.body.appendChild(this.element);
    } else {
      // @ts-ignore 已经获取了 issue 内容时，屏蔽评论功能
      this.element.lastElementChild.remove();
    }
    const reloadButton = this.element.querySelector(
      '#reload-button',
    ) as HTMLButtonElement;
    if (reloadButton) {
      reloadButton.onclick = () => {
        window.location.reload(true);
      };
    }
    scheduleMeasure();
  }
}
