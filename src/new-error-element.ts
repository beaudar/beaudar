
import { scheduleMeasure } from './measure';

export class NewErrorElement {
  public readonly element: HTMLElement;
  isTimelineNull: boolean;
  beaudarArticle = `
  <article class="timeline-comment">
    <a class="avatar" href="https://github.com/beaudar" target="_blank">
      <img alt="@beaudar" height="44" width="44" src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-240.png">
    </a>
    <div class="comment">
      <header class="comment-header">
        <span class="comment-meta">
          <strong class="comment-author">Beaudar</strong> 系统消息
        </span>
      </header>
      <article id="beaudarMsg" class="markdown-body">
      </article>
    </div>
  </article>
`
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
        this.element!.lastElementChild!.insertAdjacentHTML('beforebegin', this.beaudarArticle)
      }
    }
  }

  /**
   * 创建错误消息
   * @param header 错误标题
   * @param body 错误内容
   * @param reload 是否显示刷新按钮
   */
  public createMsgElement(header: string, body: any, reload?: boolean) {
    const beaudarLoading = document.querySelector('.beaudarLoading') as HTMLDivElement;
    let reloadButtonStr = '';
    if (beaudarLoading) beaudarLoading.remove();
    if (reload) {
      reloadButtonStr = '<button id="reload-button" type="button" class="btn btn-primary" >刷新</button>';
    }
    this.element.querySelector('#beaudarMsg')!.insertAdjacentHTML('beforeend', `
    <h3>${header}</h3>
    ${body}
    <p> 获取帮助：<a href="https://lipk.org/blog/2020/06/08/beauder-qa/" target="_blank">关于 Beaudar 的 Q&amp;A</a></p>
    ${reloadButtonStr}`);
    if (this.isTimelineNull) {
      document.body.appendChild(this.element);
    } else {
      // @ts-ignore 已经获取了 issue 内容时，屏蔽评论功能
      this.element.lastElementChild.remove();
    }
    const reloadButton = this.element.querySelector('#reload-button') as HTMLButtonElement;
    if (reloadButton) {
      reloadButton.onclick = () => {
        window.location.reload(true);
      };
    }
    scheduleMeasure();
  }
}
