import { PreferredThemeId, PreferredTheme } from '../constant-data';
export class ConfigurationComponent {
  public readonly element: HTMLFormElement;
  private readonly script: HTMLDivElement;
  private readonly repo: HTMLInputElement;
  private readonly branch: HTMLInputElement;
  private readonly issueLabel: HTMLInputElement;
  private readonly label: HTMLInputElement;
  private readonly theme: HTMLSelectElement;
  private readonly keepTheme: HTMLInputElement;
  private readonly loading: HTMLInputElement;
  private readonly commentOrder: HTMLSelectElement;
  private readonly inputPosition: HTMLSelectElement;

  constructor() {
    this.element = document.createElement('form');
    this.element.innerHTML = `
      <details>
        <summary><h3 id="heading-repository">仓库</h3></summary>
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
              一个 <strong>public</strong> 的 GitHub 仓库。这是将发布博客文章 Issue（评论）的地方。
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
      </details>

      <details>
        <summary><h3 id="heading-mapping">博客文章 ↔️ Issue 映射</h3></summary>
        <p>选择博客文章和 GitHub Issue 之间的映射。</p>
        <fieldset>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="pathname" name="mapping" checked="checked">
                Issue 标题包含页面路径名
              <p class="note">
                Beaudar 将搜索标题包含博客文章 URL <strong>路径</strong>的 Issue。
                <br />
                如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
              </p>
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="url" name="mapping">
                Issue 标题包含页面 URL
              <p class="note">
                Beaudar 将搜索标题包含博客文章 URL 的 Issue。
                <br />
                如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
              </p>
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="title" name="mapping">
                Issue 标题包含页面标题
              <p class="note">
                Beaudar 将搜索标题包含博客文章标题的 Issue。
                <br />
                如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
              </p>
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="og:title" name="mapping">
              Issue 标题包含页面 meta 的 og:title
              <p class="note">
                Beaudar 将搜索标题包含博客文章页面 meta 元素 <a href="http://ogp.me/" target="_blank">og:title</a> 的 Issue。
                <br />
                如果未找到匹配的 Issue，则当有人首次对您的信息发表评论时，Beaudar 会自动创建一个 Issue。
              </p>
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="specific-term" name="mapping">
                问题标题包含自定义的名称
              <p class="note">
                将 Beaudar 配置为搜索标题包含您选择的自定义的名称的问题。
                <br />
                如果未找到匹配问题，Beaudar 将自动创建第一次有人评论您的帖子时。Issue 的标题将是您自定义的名称。
              </p>
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="issue-number" name="mapping">
                特定问题编号
              <p class="note">
                您可以配置 Beaudar 以按编号加载特定的 Issue。
                <br />
                问题不会自动创建。
              </p>
            </label>
          </div>
        </fieldset>
      </details>

      <details id="issue-match-details">
        <summary><h3 id="heading-issue-match-label">Issue 精确匹配标签</h3></summary>
        <p>
          选择后 Beaudar 将在创建 Issue 时设置标签。
          <br />
          此标签仅在使用<code> issue-term </code>作为“博客文章 ↔️ Issue 映射”时，用于精确匹配 Issue，<a href="https://github.com/beaudar/beaudar/issues/107" target="_blank">更多详情</a>。
        </p>
        <fieldset>
          <div>
            <label for="issue-label">
              <input type="checkbox" id="issue-label" />
              配置 Issue 精确匹配标签
            </label>
          </div>
        </fieldset>
        <fieldset id="match-label-box">
          <div class="form-checkbox">
            <label>
              <input type="radio" value="pathname" name="match-label" checked="checked">
              页面的路径
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="url" name="match-label">
              页面 URL
            </label>
          </div>
          <div class="form-checkbox">
            <label>
              <input type="radio" value="specific-label" name="match-label">
              自定义的名称
            </label>
          </div>
        </fieldset>
      </details>

      <details>
        <summary><h3 id="heading-Issue-label">Issue 标签</h3></summary>
        <p>
          选择后 Beaudar 将在创建 Issue 时设置标签。
          <br />
          不用于匹配，仅用于在 Github 进行 Issue 分类。
        </p>
        <fieldset>
          <div>
            <label for="label">标签（可选）：</label>
            <br />
            <input id="label" class="form-control" type="text" placeholder="标签名">
            <p class="note">
            标签名称区分大小写，最多 50 字符。标签名称支持添加表情符号。✨💬✨
            </p>
          </div>
        </fieldset>
      </details>

      <details>
        <summary><h3 id="heading-theme">选择主题 <span class="g-emoji">🌈</span></h3></summary>
        <p>
          选择与您的博客匹配的 Beaudar 主题。找不到你喜欢的主题？
          <a href="https://github.com/beaudar/beaudar/blob/master/CONTRIBUTING.md" target="_blank">贡献</a> 一个自定义主题。
        </p>
        <select id="theme" class="form-select" value="github-light" aria-label="Theme">
          <option value="github-light">GitHub Light</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="preferred-color-scheme">Preferred Color Scheme</option>
          <option value="github-dark-orange">GitHub Dark Orange</option>
          <option value="hugo-terminal-orange">Hugo Terminal Orange</option>
          <option value="icy-dark">Icy Dark</option>
          <option value="dark-blue">Dark Blue</option>
          <option value="photon-dark">Photon Dark</option>
          <option value="classic-dark">Classic Dark</option>
        </select>
      </details>

      <details>
        <summary><h3 id="heading-keep-theme">主题保持</h3></summary>
        <p>
          将主题设置保存到页面的 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage" target="_blank">sessionStorage</a>，修改主题后刷新，主题设置不会丢失。
          <br />
          例：页面有深色模式和浅色模式，使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage" target="_blank">postMessage</a> 修改 Beaudar 主题后，刷新页面，Beaudar 主题不会被重置。
        </p>
        <fieldset>
          <div>
            <label for="keep-theme">
              <input type="checkbox" id="keep-theme" />
              不保持主题（默认保持）
            </label>
          </div>
        </fieldset>
      </details>

      <details>
        <summary><h3 id="heading-loading">Loading 图标</h3></summary>
        <p>
          点击加载图标可跳转至本页。
        </p>
        <fieldset>
          <div>
            <label for="loading">
              <input type="checkbox" id="loading" />
              不显示 Loading 图标（默认显示）
            </label>
          </div>
        </fieldset>
      </details>

      <details>
        <summary><h3 id="heading-order">选择评论顺序</h3></summary>
          <p>
          评论呈现顺序按评论的发表时间排序。
          <br />
          升序：从早到晚，晚发表的评论在后面；降序：从晚到早，晚发表的评论在前面。
        </p>
        <fieldset>
          <div>
            <label for="comment-order">
              按时间：
            </label>
            <br />
            <select id="comment-order" class="form-select" value="asc" aria-label="Comment order">
              <option value="asc">升序（默认）</option>
              <option value="desc">降序</option>
            </select>
          </div>
        </fieldset>
      </details>

      <details>
        <summary><h3 id="heading-input-position">选择评论框位置</h3></summary>
        <p>
          当选择将评论顺序设置为“降序”时，建议将评论框放置在“顶部”。因为当评论数量很多时候，发表评论后可以第一时间看到评论发表成功。
        </p>
        <fieldset>
          <div>
            <label for="input-position">
              评论框放置在：
            </label>
            <br />
            <select id="input-position" class="form-select" value="asc" aria-label="Comment order">
              <option value="bottom">底部（默认）</option>
              <option value="top">顶部</option>
            </select>
          </div>
        </fieldset>
      </details>

      <h3 id="heading-enable"<span class="g-emoji">🥳</span>使用 Beaudar <span class="g-emoji">🥂</span></h3>
      <p>
        &emsp;&emsp;将以下脚本标记添加到博客的模板中。 将其放置在要显示评论的位置。 使用<code> .beaudar </code>和<code> .beaudar-frame </code>选择器自定义布局。
      </p>
      <div class="config-field" id="script" class="highlight highlight-text-html-basic"></div>
      <button id="copy-button" type="button" class="btn btn-blue code-action">复制</button>`;

    this.element.addEventListener('submit', (event) => event.preventDefault());
    this.element.action = 'javascript:';

    this.script = this.element.querySelector('#script') as HTMLDivElement;

    this.repo = this.element.querySelector('#repo') as HTMLInputElement;

    this.branch = this.element.querySelector('#branch') as HTMLInputElement;

    this.issueLabel = this.element.querySelector(
      '#issue-label',
    ) as HTMLInputElement;

    this.label = this.element.querySelector('#label') as HTMLInputElement;

    this.theme = this.element.querySelector('#theme') as HTMLSelectElement;

    this.keepTheme = this.element.querySelector(
      '#keep-theme',
    ) as HTMLInputElement;

    this.loading = this.element.querySelector('#loading') as HTMLInputElement;

    this.commentOrder = this.element.querySelector(
      '#comment-order',
    ) as HTMLSelectElement;

    this.inputPosition = this.element.querySelector(
      '#input-position',
    ) as HTMLSelectElement;

    // 如果 sessionStorage 中存在主题，使用 sessionStorage 的值
    if (sessionStorage.getItem('beaudar-set-theme')) {
      // @ts-ignore
      this.theme.value = sessionStorage.getItem('beaudar-set-theme');
      document.documentElement.setAttribute('theme', this.theme.value);
    }
    this.theme.addEventListener('change', () => {
      let theme = this.theme.value;
      if (theme === PreferredThemeId) {
        theme = PreferredTheme;
      }
      document.documentElement.setAttribute('theme', theme);
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
    let matchLabelAttr: string = '';
    const matchLabel = this.element.querySelector(
      'input[name="match-label"]:checked',
    ) as HTMLInputElement;
    const issueMatchDetails = this.element.querySelector(
      '#issue-match-details',
    ) as HTMLDetailsElement;
    const matchLabelBox = this.element.querySelector(
      '#match-label-box',
    ) as HTMLDivElement;
    const issueTermValueList = [
      'specific-term',
      'og:title',
      'title',
      'url',
      'pathname',
    ];

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

    if (issueTermValueList.includes(mapping.value)) {
      issueMatchDetails.style.display = 'block';
    } else {
      issueMatchDetails.style.display = 'none';
    }

    if (this.issueLabel.checked) {
      matchLabelBox.style.display = 'block';
      if (matchLabel.value === 'specific-label') {
        matchLabelAttr = this.makeConfigScriptAttribute(
          'issue-label',
          '在此输入精确匹配标签',
        );
      } else {
        matchLabelAttr = this.makeConfigScriptAttribute(
          'issue-label',
          matchLabel.value,
        );
      }
    } else {
      matchLabelBox.style.display = 'none';
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
        (matchLabelAttr ? matchLabelAttr + '\n' : '') +
        (this.label.value
          ? this.makeConfigScriptAttribute('label', this.label.value) + '\n'
          : '') +
        this.makeConfigScriptAttribute('theme', this.theme.value) +
        '\n' +
        (this.keepTheme.checked
          ? this.makeConfigScriptAttribute('keep-theme', 'false') + '\n'
          : '') +
        (this.loading.checked
          ? this.makeConfigScriptAttribute('loading', 'false') + '\n'
          : '') +
        (this.commentOrder.value === 'desc'
          ? this.makeConfigScriptAttribute(
              'comment-order',
              this.commentOrder.value,
            ) + '\n'
          : '') +
        (this.inputPosition.value === 'top'
          ? this.makeConfigScriptAttribute('input-position', 'top') + '\n'
          : '') +
        this.makeConfigScriptAttribute('crossorigin', 'anonymous'),
    );
  }

  private makeConfigScriptAttribute(name: string, value: string) {
    return `<span class="pl-s1">        <span class="pl-e">${name}</span>=<span class="pl-s"><span class="pl-pds">"</span>${value}<span class="pl-pds">"</span></span></span>`;
  }

  private makeConfigScript(attrs: string) {
    return `<pre><span class="pl-s1">&lt;<span class="pl-ent">script</span> <span class="pl-e">src</span>=<span class="pl-s"><span class="pl-pds">"</span>https://beaudar.lipk.org/client.js<span class="pl-pds">"</span></span></span>\n${attrs}\n<span class="pl-s1">        <span class="pl-e">async</span>&gt;</span>\n<span class="pl-s1">&lt;/<span class="pl-ent">script</span>&gt;</span></pre>`;
  }

  private copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.style.cssText = `position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent`;
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
  }
}
