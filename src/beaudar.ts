import { pageAttributes as page } from './page-attributes';
import {
  Issue,
  setRepoContext,
  loadIssueByTerm,
  loadIssueByNumber,
  loadCommentsPage,
  loadUser,
  postComment,
  createIssue,
  PAGE_SIZE,
  IssueComment,
} from './github';
import { TimelineComponent } from './component/timeline-component';
import { NewCommentComponent } from './component/new-comment-component';
import { startMeasuring, scheduleMeasure } from './measure';
import { getRepoConfig } from './repo-config';
import { loadToken } from './oauth';
import { enableReactions } from './reactions';
import { NewErrorComponent } from './component/new-error-component';
import { addLoadingStatus, removeLoadingElement } from './beaudar-loading';
import { loadTheme } from './theme';

setRepoContext(page);

function loadIssue(): Promise<Issue | null> {
  if (page.issueNumber !== null) {
    return loadIssueByNumber(page.issueNumber);
  }
  return loadIssueByTerm(page.issueTerm as string);
}

async function bootstrap() {
  startMeasuring(page.origin);

  addLoadingStatus(page);

  if (
    JSON.parse(page.keepTheme) &&
    sessionStorage.getItem('beaudar-set-theme')
  ) {
    loadTheme(
      sessionStorage.getItem('beaudar-set-theme') as string,
      page.origin,
    );
  } else {
    loadTheme(page.theme, page.origin);
  }

  // tslint:disable-next-line
  let issue: any, user: any;
  await loadToken();

  try {
    [issue, user] = await Promise.all([loadIssue(), loadUser()]);

    removeLoadingElement();
  } catch (error) {
    removeLoadingElement();
    const errorElement = new NewErrorComponent();
    errorElement.createMsgElement(
      `无法从 GitHub 获取数据`,
      `<ol>
        <li>点击<code>刷新</code>按钮，尝试解决此问题。</li>
        <li>点击
          <a href="https://github.com/${page.owner}/${page.repo}/issues" target="_blank">这里</a>
          浏览或提交 Issue。
        </li>
      </ol>`,
      '#q无法从-github-获取数据',
      true,
    );
    throw new Error(`api.github.com 请求失败。${error}`);
  }

  const timeline = new TimelineComponent(user, issue);

  document.body.appendChild(timeline.element);

  if (issue && issue.comments > 0) {
    renderComments(issue, timeline);
  }

  scheduleMeasure();

  if (issue && issue.locked) {
    return;
  }

  enableReactions(!!user);

  const submit = async (markdown: string) => {
    const { origins } = await getRepoConfig();
    const { origin, owner, repo } = page;
    if (origins.indexOf(origin) !== -1) {
      if (!issue) {
        issue = await createIssue(
          page.issueTerm as string,
          page.url,
          page.title,
          page.description || '',
          page.label,
        );
        timeline.setIssue(issue);
      }
      const comment = await postComment(issue.number, markdown);
      timeline.insertComment(comment, true);
      newCommentComponent.clear();
    } else {
      const errorElement = new NewErrorComponent();
      errorElement.createMsgElement(
        `错误: <code>${origin}</code> 评论不允许发布到仓库 <code>${owner}/${repo}</code>`,
        `
      <p>&emsp;&emsp;请确认 <code>${owner}/${repo}</code> 是本站点评论的正确仓库。如果您拥有此仓库，
      <a href="https://github.com/${owner}/${repo}/edit/master/beaudar.json" target="_blank">
        <strong>添加或更新 beaudar.json</strong>
      </a>
      添加 <code>${origin}</code> 到来源列表。</p>
      <p>需要配置：</p>
      <pre><code>${JSON.stringify({ origins: [origin] }, null, 2)}</code></pre>
      `,
        '#q缺少-beaudarjson-配置-或-不允许-xxx-发布到-xxxxxx',
      );
      throw new Error(
        `评论发布被禁止，<code>${origin}</code> 评论不允许发布到仓库 <code>${owner}/${repo}</code>。`,
      );
    }
  };

  const newCommentComponent = new NewCommentComponent(user, submit);
  if (page.inputPosition === 'top') {
    timeline.element.insertAdjacentElement(
      'afterbegin',
      newCommentComponent.element,
    );
  } else {
    timeline.element.appendChild(newCommentComponent.element);
  }
}

bootstrap();

addEventListener('not-installed', function handleNotInstalled() {
  removeEventListener('not-installed', handleNotInstalled);
  document.querySelector('.timeline')!.insertAdjacentHTML(
    'afterbegin',
    `
  <div class="flash flash-error">
    错误: Beaudar 没有安装在 <code>${page.owner}/${page.repo}</code>。
    如果你拥有这仓库，
    <a href="https://github.com/apps/beaudar" target="_blank"><strong>安装 app</strong></a>。
  </div>`,
  );
  scheduleMeasure();
});

// 判断最后一页数据是否小于 3 条
const isLessDataOnLastPage = (comments: number, pageSize: number) => {
  return comments % pageSize < 3 && comments % pageSize !== 0;
};

async function renderComments(issue: Issue, timeline: TimelineComponent) {
  const renderPage = (page: IssueComment[]) => {
    for (const comment of page) {
      timeline.insertComment(comment, false);
    }
  };

  const pageCount = Math.ceil(issue.comments / PAGE_SIZE);
  let nextHiddenPage = timeline.isDesc ? pageCount - 1 : 2;
  let pageLoads = [];
  if (timeline.isDesc) {
    // 倒叙，如果有多页，先加载最后一页
    if (pageCount > 1) {
      pageLoads.push(loadCommentsPage(issue.number, pageCount));
      // 最后一页小于 3 条数据，再加载一页
      if (pageCount > 2 && isLessDataOnLastPage(issue.comments, PAGE_SIZE)) {
        nextHiddenPage = pageCount - 2;
        pageLoads.push(loadCommentsPage(issue.number, pageCount - 1));
      }
      // 加载第一页
      pageLoads.push(loadCommentsPage(issue.number, 1));
    } else {
      // 没有多页，仅加载一页
      pageLoads.push(loadCommentsPage(issue.number, 1));
    }
  } else {
    // 顺序，加载第一页
    pageLoads = [loadCommentsPage(issue.number, 1)];
    if (pageCount > 1) {
      // 如果有多页，加载最后一页
      pageLoads.push(loadCommentsPage(issue.number, pageCount));
    }
    // 最后一页小于 3 条数据，再加载一页
    if (pageCount > 2 && isLessDataOnLastPage(issue.comments, PAGE_SIZE)) {
      nextHiddenPage = 2;
      pageLoads.push(loadCommentsPage(issue.number, pageCount - 1));
    }
  }
  // await all loads to reduce
  const pages = await Promise.all(pageLoads);
  for (const page of pages) {
    renderPage(page);
  }
  // enable loading hidden pages.
  let hiddenPageCount = pageCount - pageLoads.length;
  const renderLoader = (afterPage: IssueComment[]) => {
    if (hiddenPageCount === 0) {
      return;
    }
    const load = async () => {
      loader.setBusy();
      const page = await loadCommentsPage(issue.number, nextHiddenPage);
      loader.remove();
      renderPage(page);
      hiddenPageCount--;
      nextHiddenPage = timeline.isDesc ? --nextHiddenPage : ++nextHiddenPage;
      renderLoader(page);
    };
    const afterComment = timeline.isDesc
      ? afterPage.shift()!
      : afterPage.pop()!;
    const loader = timeline.insertPageLoader(
      afterComment,
      hiddenPageCount * PAGE_SIZE,
      load,
    );
  };
  // 倒序时最后一页数据过少，需要多加载一页
  // 将 Loader 加载在“第二页”
  if (timeline.isDesc && isLessDataOnLastPage(issue.comments, PAGE_SIZE)) {
    renderLoader(pages[1]);
  } else {
    renderLoader(pages[0]);
  }
}
