import { renderMarkdown } from '../github';
import { User } from '../type-declare';
import { scheduleMeasure } from '../measure';
import { processRenderedMarkdown } from './comment-component';
import { getLoginUrl } from '../oauth';
import { pageAttrs } from '../beaudar';

const beaudarAvatarUrl = `data:image/png;base64,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 MDowMKZDaTcAAAAASUVORK5CYII=`;

const nothingToPreview = '没有可预览的内容';

export class NewCommentComponent {
  public readonly element: HTMLElement;

  private avatarAnchor: HTMLAnchorElement;
  private avatar: HTMLImageElement;
  private form: HTMLFormElement;
  private textarea: HTMLTextAreaElement;
  private preview: HTMLDivElement;
  private submitButton: HTMLButtonElement;
  private signInAnchor: HTMLAnchorElement;

  private submitting = false;
  private renderTimeout = setTimeout(() => undefined);

  constructor(
    private user: User | null,
    private readonly submit: (markdown: string) => Promise<void>,
  ) {
    this.element = document.createElement('article');
    this.element.classList.add('timeline-comment');

    this.element.innerHTML = `
      <a class="avatar" target="_blank">
        <img height="40" width="40">
      </a>
      <form class="comment" accept-charset="UTF-8" action="javascript:">
        <header class="new-comment-header tabnav">
          <nav class="tabnav-tabs" role="tablist">
            <button type="button" class="tabnav-tab tab-write"
                    role="tab" aria-selected="true">
              编辑
            </button>
            <button type="button" class="tabnav-tab tab-preview"
                    role="tab">
              预览
            </button>
          </nav>
        </header>
        <div class="comment-body">
          <textarea class="form-control" placeholder="Leave a comment" aria-label="comment"></textarea>
          <div class="markdown-body" style="display: none">
            ${nothingToPreview}
          </div>
        </div>
        <footer class="new-comment-footer">
          <a class="text-link markdown-info" target="_blank"
             href="https://guides.github.com/features/mastering-markdown/">
            <svg class="octicon v-align-bottom" viewBox="0 0 16 16" version="1.1"
              width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15
                13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4
                8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z">
              </path>
            </svg>
            支持 Markdown
          </a>
          <button class="btn btn-primary" type="submit" title="发表评论（Ctrl+Enter）">发表评论</button>
          <a class="btn btn-primary" href="${getLoginUrl(
            pageAttrs.url,
          )}" target="_top"><svg class="octicon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          <span class="useGithub">使用 </span>Github 登录</a>
        </footer>
      </form>`;

    this.avatarAnchor = this.element.firstElementChild as HTMLAnchorElement;
    this.avatar = this.avatarAnchor.firstElementChild as HTMLImageElement;
    this.form = this.avatarAnchor.nextElementSibling as HTMLFormElement;
    this.textarea = this.form!.firstElementChild!.nextElementSibling!
      .firstElementChild as HTMLTextAreaElement;
    this.preview = this.form!.firstElementChild!.nextElementSibling!
      .lastElementChild as HTMLDivElement;
    this.signInAnchor = this.form!.lastElementChild!
      .lastElementChild! as HTMLAnchorElement;
    this.submitButton = this.signInAnchor
      .previousElementSibling! as HTMLButtonElement;

    this.setUser(user);
    this.submitButton.disabled = true;

    this.textarea.addEventListener('input', this.handleInput);
    this.form.addEventListener('submit', this.handleSubmit);
    this.form.addEventListener('click', this.handleClick);
    this.form.addEventListener('keydown', this.handleKeyDown);
    handleTextAreaResize(this.textarea);
  }

  public setUser(user: User | null) {
    this.user = user;
    this.submitButton.hidden = !user;
    this.signInAnchor.hidden = !!user;
    if (user) {
      this.avatarAnchor.href = user.html_url;
      this.avatar.alt = '@' + user.login;
      this.avatar.src = user.avatar_url + '?v=3&s=88';
      this.textarea.disabled = false;
      this.textarea.placeholder = '写下您的评论';
    } else {
      this.avatarAnchor.removeAttribute('href');
      this.avatar.alt = '@beaudar';
      this.avatar.src = beaudarAvatarUrl;
      this.textarea.disabled = true;
      this.textarea.placeholder = '登录后评论';
    }
  }

  public clear() {
    this.textarea.value = '';
  }

  private handleInput = () => {
    const text = this.textarea.value;
    const isWhitespace = /^\s*$/.test(text);
    this.submitButton.disabled = isWhitespace;
    if (
      this.textarea.scrollHeight < 450 &&
      this.textarea.offsetHeight < this.textarea.scrollHeight
    ) {
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      scheduleMeasure();
    }

    clearTimeout(this.renderTimeout);
    if (isWhitespace) {
      this.preview.textContent = nothingToPreview;
    } else {
      this.preview.textContent = '加载预览中…';
      this.renderTimeout = setTimeout(
        () =>
          renderMarkdown(text)
            .then((html) => (this.preview.innerHTML = html))
            .then(() => processRenderedMarkdown(this.preview))
            .then(scheduleMeasure),
        500,
      );
    }
  };

  private handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.textarea.disabled = true;
    this.submitButton.disabled = true;
    await this.submit(this.textarea.value).catch(() => 0);
    this.submitting = false;
    this.textarea.disabled = !this.user;
    this.textarea.value = '';
    this.submitButton.disabled = false;
    this.handleClick({
      ...event,
      target: this.form.querySelector('.tabnav-tab.tab-write'),
    });
    this.preview.textContent = nothingToPreview;
  };

  private handleClick = ({ target }: Event) => {
    if (
      !(target instanceof HTMLButtonElement) ||
      !target.classList.contains('tabnav-tab')
    ) {
      return;
    }
    if (target.getAttribute('aria-selected') === 'true') {
      return;
    }
    this.form
      .querySelector('.tabnav-tab[aria-selected="true"]')!
      .setAttribute('aria-selected', 'false');
    target.setAttribute('aria-selected', 'true');
    const isPreview = target.classList.contains('tab-preview');
    this.textarea.style.display = isPreview ? 'none' : '';
    this.preview.style.display = isPreview ? '' : 'none';
    scheduleMeasure();
  };

  private handleKeyDown = ({ key, ctrlKey }: KeyboardEvent) => {
    if (key === 'Enter' && ctrlKey && !this.submitButton.disabled) {
      this.form.dispatchEvent(new CustomEvent('submit'));
    }
  };
}

function handleTextAreaResize(textarea: HTMLTextAreaElement) {
  const stopTracking = () => {
    removeEventListener('mousemove', scheduleMeasure);
    removeEventListener('mouseup', stopTracking);
  };
  const track = () => {
    addEventListener('mousemove', scheduleMeasure);
    addEventListener('mouseup', stopTracking);
  };
  textarea.addEventListener('mousedown', track);
}
