import { preferredThemeId, preferredTheme } from './preferred-theme';
export class ConfigurationComponent {
  public readonly element: HTMLFormElement;
  private readonly script: HTMLDivElement;
  private readonly repo: HTMLInputElement;
  private readonly branch: HTMLInputElement;
  private readonly label: HTMLInputElement;
  private readonly theme: HTMLSelectElement;

  constructor() {
    this.element = document.createElement('form');
    this.element.innerHTML = `
      <h3 id="heading-repository">仓库</h3>
      <p>
        选择 Beaudar 将要连接的仓库。
      </p>
      <ol>
        <li>确保仓库是公开的，否则您的读者将无法查看 Issue(评论)。</li>
        <li>确保 <a href="https://github.com/apps/beaudar" target="_blank">Beaudar app</a>
          已在仓库中安装，否则用户将无法发表评论。
        </li>
        <li>如果你的仓库是一个分叉，请到设置中，确保 Issues 功能已打开。</li>
      </ol>
      <fieldset>
        <div>
          <label for="repo">仓库:</label><br/>
          <input id="repo" class="form-control" type="text" placeholder="例：beaudar/beaudar">
          <p class="note">
            一个 <strong>public</strong> 的 GitHub 仓库。这是将发布博客文章 Issue 和 Issue 评论的地方。
          </p>
        </div>
        <div>
          <label for="branch">分支 (可选):</label><br/>
          <input id="branch" class="form-control" type="text" placeholder="默认：master">
          <p class="note">
            仓库的分支名，用于校验仓库 beaudar.json 配置，以保证评论不会随意添加到目标仓库中。
          </p>
        </div>
      </fieldset>

      <h3 id="heading-mapping">博客文章 ↔️ Issue 映射</h3>
      <p>选择博客文章和 GitHub Issue 之间的映射。</p>
      <fieldset>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="pathname" name="mapping" checked="checked">
              Issue 标题包含页面路径名。
            <p class="note">
              Beaudar 将搜索标题包含博客文章 URL <strong>路径</strong>的 Issue。如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
            </p>
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="url" name="mapping">
              Issue 标题包含页面 URL。
            <p class="note">
              Beaudar 将搜索标题包含博客文章 URL 的 Issue。 如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
            </p>
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="title" name="mapping">
              Issue 标题包含页面标题
            <p class="note">
              Beaudar 将搜索标题包含博客文章标题的 Issue。 如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
            </p>
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="og:title" name="mapping">
            Issue 标题包含页面 meta 的 og:title
            <p class="note">
              Beaudar 将搜索标题包含博客文章页面 meta 元素 <a href="http://ogp.me/" target="_blank">og:title</a> 的 Issue。 如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
            </p>
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="issue-number" name="mapping">
              特定问题编号
            <p class="note">
              您可以配置 Beaudar 以按编号加载特定的 Issue。 问题不会自动创建。
            </p>
          </label>
        </div>
        <div class="form-checkbox">
          <label>
            <input type="radio" value="specific-term" name="mapping">
              问题标题包含特定名称
            <p class="note">
              将 Beaudar 配置为搜索标题包含您选择的特定名称的问题。如果未找到匹配问题，Beaudar 将自动创建第一次有人评论您的帖子时。Issue 的标题将是您选择的名称。
            </p>
          </label>
        </div>
      </fieldset>

      <h3 id="heading-Issue-label">Issue 标签</h3>
      <p>
        选择将分配给 Beaudar 创建的问题的标签。
      </p>
      <fieldset>
        <div>
          <label for="label">标签 (可选):</label><br/>
          <input id="label" class="form-control" type="text" placeholder="标签名">
          <p class="note">
          标签名称区分大小写。该标签必须存在于您的仓库中，无法附加不存在的标签。标签名称支持添加表情符号。✨💬✨
          </p>
        </div>
      </fieldset>

      <h3 id="heading-theme">选择主题 🌈</h3>
      <p>
        选择与您的博客匹配的 Beaudar 主题。找不到你喜欢的主题？
        <a href="https://github.com/beaudar/beaudar/blob/master/CONTRIBUTING.md" target="_blank">贡献</a> 一个自定义主题。
      </p>

      <select id="theme" class="form-select" value="github-light" aria-label="Theme">
        <option value="github-light">GitHub Light</option>
        <option value="github-dark">GitHub Dark</option>
        <option value="preferred-color-scheme">Preferred Color Scheme</option>
        <option value="github-dark-orange">GitHub Dark Orange</option>
        <option value="icy-dark">Icy Dark</option>
        <option value="dark-blue">Dark Blue</option>
        <option value="photon-dark">Photon Dark</option>
      </select>
      <h3 id="heading-enable">使用 Beaudar 🎊</h3>
      <p>
      &emsp;&emsp;将以下脚本标记添加到博客的模板中。 将其放置在要显示注释的位置。 使用<code> .beaudar </code>和<code> .beaudar-frame </code>选择器自定义布局。
      </p>
      <div class="config-field" id="script" class="highlight highlight-text-html-basic"></div>
      <button id="copy-button" type="button" class="btn btn-blue code-action">复制</button>`;

    this.element.addEventListener('submit', (event) => event.preventDefault());
    this.element.action = 'javascript:';

    this.script = this.element.querySelector('#script') as HTMLDivElement;

    this.repo = this.element.querySelector('#repo') as HTMLInputElement;

    this.branch = this.element.querySelector('#branch') as HTMLInputElement;

    this.label = this.element.querySelector('#label') as HTMLInputElement;

    this.theme = this.element.querySelector('#theme') as HTMLSelectElement;

    const themeStylesheet = document.getElementById(
      'theme-stylesheet',
    ) as HTMLLinkElement;
    // 如果 sessionStorage 中存在主题，使用 sessionStorage 的值
    if (sessionStorage.getItem('beaudar-set-theme')) {
      // @ts-ignore
      this.theme.value = sessionStorage.getItem('beaudar-set-theme');
      themeStylesheet.href = `/stylesheets/themes/${this.theme.value}/index.css`;
    }
    this.theme.addEventListener('change', () => {
      let theme = this.theme.value;
      if (theme === preferredThemeId) {
        theme = preferredTheme;
      }
      themeStylesheet.href = `/stylesheets/themes/${theme}/index.css`;
      const message = {
        type: 'set-theme',
        theme,
      };
      const beaudar = document.querySelector('iframe')!;
      beaudar.contentWindow!.postMessage(message, location.origin);
    });

    const copyButton = this.element.querySelector(
      '#copy-button',
    ) as HTMLButtonElement;
    copyButton.addEventListener('click', () =>
      this.copyTextToClipboard(this.script.textContent as string),
    );

    this.element.addEventListener('change', () => this.outputConfig());
    this.element.addEventListener('input', () => this.outputConfig());
    this.outputConfig();
  }

  private outputConfig() {
    const mapping = this.element.querySelector(
      'input[name="mapping"]:checked',
    ) as HTMLInputElement;
    let mappingAttr: string;
    // tslint:disable-next-line:prefer-conditional-expression
    if (mapping.value === 'issue-number') {
      mappingAttr = this.makeConfigScriptAttribute(
        'issue-number',
        '在此处输入 Issue 编号',
      );
    } else if (mapping.value === 'specific-term') {
      mappingAttr = this.makeConfigScriptAttribute(
        'issue-term',
        '在此输入名称',
      );
    } else {
      mappingAttr = this.makeConfigScriptAttribute('issue-term', mapping.value);
    }
    this.script.innerHTML = this.makeConfigScript(
      this.makeConfigScriptAttribute(
        'repo',
        this.repo.value === '' ? '在此处输入仓库' : this.repo.value,
      ) +
        '\n' +
        (this.branch.value
          ? this.makeConfigScriptAttribute('branch', this.branch.value) + '\n'
          : '') +
        mappingAttr +
        '\n' +
        (this.label.value
          ? this.makeConfigScriptAttribute('label', this.label.value) + '\n'
          : '') +
        this.makeConfigScriptAttribute('theme', this.theme.value) +
        '\n' +
        this.makeConfigScriptAttribute('crossorigin', 'anonymous'),
    );
  }

  private makeConfigScriptAttribute(name: string, value: string) {
    // tslint:disable-next-line:max-line-length
    return `<span class="pl-s1">        <span class="pl-e">${name}</span>=<span class="pl-s"><span class="pl-pds">"</span>${value}<span class="pl-pds">"</span></span></span>`;
  }

  private makeConfigScript(attrs: string) {
    // tslint:disable-next-line:max-line-length
    return `<pre><span class="pl-s1">&lt;<span class="pl-ent">script</span> <span class="pl-e">src</span>=<span class="pl-s"><span class="pl-pds">"</span>https://beaudar.lipk.org/client.js<span class="pl-pds">"</span></span></span>\n${attrs}\n<span class="pl-s1">        <span class="pl-e">async</span>&gt;</span>\n<span class="pl-s1">&lt;/<span class="pl-ent">script</span>&gt;</span></pre>`;
  }

  private copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    // tslint:disable-next-line:max-line-length
    textArea.style.cssText = `position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent`;
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      // tslint:disable-next-line:no-empty
    } catch (err) {}
    document.body.removeChild(textArea);
  }
}
