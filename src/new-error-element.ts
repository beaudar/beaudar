
import { scheduleMeasure } from './measure';

export class NewErrorElement {
  public readonly element: HTMLElement;
  constructor(
  ) {
    this.element = document.createElement('main');
    this.element.classList.add('timeline');
    this.element.innerHTML = `
      <article class="timeline-comment">
        <a class="avatar" href="https://github.com/beaudar" target="_blank" tabindex="-1">
          <img alt="@beaudar" height="44" width="44" src="https://cdn.jsdelivr.net/gh/beaudar/beaudar/src/icons/Beaudar-240.png">
        </a>
        <div class="comment">
          <header class="comment-header">
            <span class="comment-meta">
              <strong>Beaudar 提示</strong>
            </span>
          </header>
          <article class="markdown-body">
            <h4>请求出错...</h4>
            <blockquote>更多详情，请于浏览器控制台查询。</blockquote>
            <ol id="msgList">
            </ol>
          </article>
        </div>
      </article>
    `
  }

  public createMsgElement(msg: string) {
    const msgList = this.element.querySelector('#msgList')!;
    msgList.insertAdjacentHTML('beforeend', `<li>${msg}</li>`);
    document.body.appendChild(this.element);
    scheduleMeasure();
  }
}
