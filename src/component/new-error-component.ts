import { scheduleMeasure } from '../measure';
import { readPageAttributes } from '../utils';
import { CreateMsgElement } from '../type-declare';

const pageAttrs = readPageAttributes(location);

export class NewErrorComponent {
  public readonly element: Element;
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
    const timeline = document.querySelector('.timeline');
    if (timeline === null) {
      this.isTimelineNull = true;
      this.element = document.createElement('main');
      this.element.classList.add('timeline');
      this.element.innerHTML = this.beaudarArticle;
    } else {
      this.isTimelineNull = false;
      this.element = timeline;

      if (document.querySelector('#beaudarMsg') === null) {
        if (pageAttrs.inputPosition === 'top') {
          this.element!.firstElementChild!.insertAdjacentHTML(
            'afterend',
            this.beaudarArticle,
          );
        }
        if (pageAttrs.inputPosition === 'bottom') {
          this.element!.lastElementChild!.insertAdjacentHTML(
            'beforebegin',
            this.beaudarArticle,
          );
        }
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
  public createMsgElement(args: CreateMsgElement) {
    const { header, body, helpHash, reload } = args;

    let reloadButtonStr = '';
    let qaLink = '';
    if (reload) {
      reloadButtonStr =
        '<button id="reload-button" type="button" class="btn btn-primary" >刷新</button>';
    }
    if (!!helpHash) {
      qaLink = `<p><a href="https://lipk.org/blog/2020/06/08/beauder-qa/${helpHash}" target="_blank">获取此问题的帮助信息</a></p>`;
    }
    this.element.querySelector('#beaudarMsg')!.insertAdjacentHTML(
      'beforeend',
      `
    <h3>${header}</h3>
    ${body}
    ${qaLink}
    ${reloadButtonStr}`,
    );
    if (this.isTimelineNull) {
      document.body.appendChild(this.element);
    }
    const reloadButton = this.element.querySelector(
      '#reload-button',
    ) as HTMLButtonElement;
    if (reloadButton) {
      reloadButton.onclick = () => {
        window.location.reload();
      };
    }
    scheduleMeasure();
  }
}
