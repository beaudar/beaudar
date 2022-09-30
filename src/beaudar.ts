import { Issue, IssueComment } from './type-declare';
import { PAGE_SIZE } from './constant-data';
import { readPageAttributes, loadTheme } from './utils';
import {
  loadIssueByTerm,
  loadIssueByNumber,
  loadCommentsPage,
  loadUser,
  postComment,
  createIssue,
  getRepoConfig,
} from './github';
import { TimelineComponent } from './component/timeline-component';
import { NewCommentComponent } from './component/new-comment-component';
import { startMeasuring, scheduleMeasure } from './measure';
import { loadToken } from './oauth';
import { enableReactions } from './reactions';
import { NewErrorComponent } from './component/new-error-component';
import { addLoadingStatus, removeLoadingElement } from './beaudar-loading';

const pageAttrs = readPageAttributes(location);

const loadIssue = (): Promise<Issue | null> => {
  if (pageAttrs.issueNumber !== null) {
    return loadIssueByNumber(pageAttrs.issueNumber);
  }
  return loadIssueByTerm(pageAttrs.issueTerm as string);
};

async function bootstrap() {
  startMeasuring(pageAttrs.origin);

  addLoadingStatus(pageAttrs);

  if (
    JSON.parse(pageAttrs.keepTheme) &&
    sessionStorage.getItem('beaudar-set-theme')
  ) {
    loadTheme(
      sessionStorage.getItem('beaudar-set-theme') as string,
      pageAttrs.origin,
      pageAttrs.keepTheme,
    );
  } else {
    loadTheme(pageAttrs.theme, pageAttrs.origin, pageAttrs.keepTheme);
  }

  let issue: any, user: any;
  await loadToken();

  try {
    [issue, user] = await Promise.all([loadIssue(), loadUser()]);

    removeLoadingElement();
  } catch (error) {
    removeLoadingElement();
    const errorElement = new NewErrorComponent();
    errorElement.createMsgElement({
      header: `无法从 GitHub 获取数据`,
      body: `<ol>
        <li>点击<code>刷新</code>按钮，尝试解决此问题。</li>
        <li>点击
          <a href="https://github.com/${pageAttrs.owner}/${pageAttrs.repo}/issues" target="_blank">这里</a>
          浏览或提交 Issue。
        </li>
      </ol>`,
      helpHash: '#q无法从-github-获取数据',
      reload: true,
    });
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
    await getRepoConfig();
    if (!issue) {
      issue = await createIssue({
        issueTerm: pageAttrs.issueTerm as string,
        documentUrl: pageAttrs.url,
        title: pageAttrs.title,
        description: pageAttrs.description || '',
        label: pageAttrs.label,
        issueLabel: pageAttrs.issueLabel,
      });

      timeline.setIssue(issue);
    }
    const comment = await postComment(issue.number, markdown);
    timeline.insertComment(comment, true);
    newCommentComponent.clear();
  };

  const newCommentComponent = new NewCommentComponent(user, submit);
  if (pageAttrs.inputPosition === 'top') {
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
    错误: Beaudar 没有安装在 <code>${pageAttrs.owner}/${pageAttrs.repo}</code>。
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
